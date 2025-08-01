"""
CRUD operations for Precuration model.
"""

import hashlib
import json
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.database_models import Gene, Precuration
from app.schemas.precuration import (
    PrecurationCreate,
    PrecurationSearchQuery,
    PrecurationUpdate,
)


class PrecurationCRUD:
    """CRUD operations for Precuration model."""

    def generate_record_hash(self, precuration_data: dict, user_id: str) -> str:
        """Generate SHA-256 hash for record integrity."""
        content_string = (
            str(precuration_data.get("gene_id", ""))
            + str(precuration_data.get("mondo_id", ""))
            + str(precuration_data.get("mode_of_inheritance", ""))
            + json.dumps(precuration_data.get("details", {}), sort_keys=True)
            + str(user_id)
        )
        return hashlib.sha256(content_string.encode()).hexdigest()

    def get(self, db: Session, precuration_id: str) -> Precuration | None:
        """Get precuration by ID."""
        return db.query(Precuration).filter(Precuration.id == precuration_id).first()

    def get_by_gene_id(self, db: Session, gene_id: str) -> list[Precuration]:
        """Get all precurations for a specific gene."""
        return db.query(Precuration).filter(Precuration.gene_id == gene_id).all()

    def get_by_mondo_id(self, db: Session, mondo_id: str) -> list[Precuration]:
        """Get precurations by MONDO ID."""
        return db.query(Precuration).filter(Precuration.mondo_id == mondo_id).all()

    def get_multi(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[list[Precuration], int]:
        """Get multiple precurations with pagination and sorting."""
        # Simplified query without JOIN to avoid 500 error
        query = db.query(Precuration)

        # Get total count
        total = query.count()

        # Apply sorting (only on Precuration columns)
        if hasattr(Precuration, sort_by):
            order_column = getattr(Precuration, sort_by)
        else:
            order_column = Precuration.created_at

        if sort_order.lower() == "desc":
            query = query.order_by(order_column.desc())
        else:
            query = query.order_by(order_column.asc())

        # Apply pagination
        precurations = query.offset(skip).limit(limit).all()

        return precurations, total

    def search(
        self, db: Session, search_params: PrecurationSearchQuery
    ) -> tuple[list[Precuration], int]:
        """Advanced precuration search with multiple filters."""
        query = db.query(Precuration).join(Gene, Precuration.gene_id == Gene.id)

        # Text search across multiple fields
        if search_params.query:
            search_term = f"%{search_params.query}%"
            query = query.filter(
                or_(
                    Gene.approved_symbol.ilike(search_term),
                    Gene.hgnc_id.ilike(search_term),
                    Precuration.mondo_id.ilike(search_term),
                    Precuration.mode_of_inheritance.ilike(search_term),
                    Precuration.rationale.ilike(search_term),
                )
            )

        # Filter by gene ID
        if search_params.gene_id:
            query = query.filter(Precuration.gene_id == search_params.gene_id)

        # Filter by MONDO ID
        if search_params.mondo_id:
            query = query.filter(Precuration.mondo_id == search_params.mondo_id)

        # Filter by lumping/splitting decision
        if search_params.lumping_splitting_decision:
            query = query.filter(
                Precuration.lumping_splitting_decision
                == search_params.lumping_splitting_decision
            )

        # Filter by status
        if search_params.status:
            query = query.filter(Precuration.status == search_params.status)

        # Filter by creator
        if search_params.created_by:
            query = query.filter(Precuration.created_by == search_params.created_by)

        # Get total count before pagination
        total = query.count()

        # Apply sorting
        if hasattr(Precuration, search_params.sort_by):
            order_column = getattr(Precuration, search_params.sort_by)
        elif hasattr(Gene, search_params.sort_by):
            order_column = getattr(Gene, search_params.sort_by)
        else:
            order_column = Precuration.created_at

        if search_params.sort_order.lower() == "desc":
            query = query.order_by(order_column.desc())
        else:
            query = query.order_by(order_column.asc())

        # Apply pagination
        precurations = query.offset(search_params.skip).limit(search_params.limit).all()

        return precurations, total

    def create(
        self, db: Session, precuration_create: PrecurationCreate, user_id: str
    ) -> Precuration:
        """Create a new precuration."""
        # Verify gene exists
        gene = db.query(Gene).filter(Gene.id == precuration_create.gene_id).first()
        if not gene:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Gene with ID {precuration_create.gene_id} not found",
            )

        # Prepare precuration data
        precuration_data = precuration_create.dict()
        record_hash = self.generate_record_hash(precuration_data, user_id)

        # Create precuration object
        db_precuration = Precuration(
            gene_id=precuration_create.gene_id,
            mondo_id=precuration_create.mondo_id,
            mode_of_inheritance=precuration_create.mode_of_inheritance,
            lumping_splitting_decision=precuration_create.lumping_splitting_decision,
            rationale=precuration_create.rationale,
            details=precuration_create.details or {},
            record_hash=record_hash,
            created_by=user_id,
            updated_by=user_id,
        )

        db.add(db_precuration)
        db.commit()
        db.refresh(db_precuration)
        return db_precuration

    def update(
        self,
        db: Session,
        precuration_id: str,
        precuration_update: PrecurationUpdate,
        user_id: str,
    ) -> Precuration | None:
        """Update precuration information."""
        db_precuration = self.get(db, precuration_id)
        if not db_precuration:
            return None

        # Store previous hash
        previous_hash = db_precuration.record_hash

        # Update fields
        update_data = precuration_update.dict(exclude_unset=True)

        # Verify gene exists if gene_id is being updated
        if "gene_id" in update_data:
            gene = db.query(Gene).filter(Gene.id == update_data["gene_id"]).first()
            if not gene:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Gene with ID {update_data['gene_id']} not found",
                )

        for field, value in update_data.items():
            setattr(db_precuration, field, value)

        # Update metadata
        db_precuration.updated_by = user_id
        db_precuration.previous_hash = previous_hash

        # Generate new hash
        current_data = {
            "gene_id": str(db_precuration.gene_id),
            "mondo_id": db_precuration.mondo_id,
            "mode_of_inheritance": db_precuration.mode_of_inheritance,
            "details": db_precuration.details,
        }
        db_precuration.record_hash = self.generate_record_hash(current_data, user_id)

        db.commit()
        db.refresh(db_precuration)
        return db_precuration

    def delete(self, db: Session, precuration_id: str) -> Precuration | None:
        """Delete precuration."""
        db_precuration = self.get(db, precuration_id)
        if not db_precuration:
            return None

        db.delete(db_precuration)
        db.commit()
        return db_precuration

    def get_statistics(self, db: Session) -> dict[str, Any]:
        """Get precuration database statistics."""
        from datetime import datetime, timedelta

        # Total precurations
        total_precurations = db.query(Precuration).count()

        # By status
        status_counts = (
            db.query(Precuration.status, func.count(Precuration.id))
            .group_by(Precuration.status)
            .all()
        )
        precurations_by_status = {str(status): count for status, count in status_counts}

        # By lumping/splitting decision
        decision_counts = (
            db.query(Precuration.lumping_splitting_decision, func.count(Precuration.id))
            .group_by(Precuration.lumping_splitting_decision)
            .all()
        )
        precurations_by_decision = {
            str(decision): count for decision, count in decision_counts
        }

        # Recent additions (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_additions = (
            db.query(Precuration)
            .filter(Precuration.created_at >= thirty_days_ago)
            .count()
        )

        # Updated last week
        week_ago = datetime.utcnow() - timedelta(days=7)
        updated_last_week = (
            db.query(Precuration).filter(Precuration.updated_at >= week_ago).count()
        )

        # Pending review
        pending_review = (
            db.query(Precuration)
            .filter(Precuration.status.in_(["Draft", "In_Primary_Review"]))
            .count()
        )

        return {
            "total_precurations": total_precurations,
            "precurations_by_status": precurations_by_status,
            "precurations_by_decision": precurations_by_decision,
            "recent_additions": recent_additions,
            "updated_last_week": updated_last_week,
            "pending_review": pending_review,
        }

    def approve(
        self, db: Session, precuration_id: str, user_id: str
    ) -> Precuration | None:
        """Approve a precuration (move to Approved status)."""
        db_precuration = self.get(db, precuration_id)
        if not db_precuration:
            return None

        # Update status and approval metadata
        db_precuration.status = "Approved"
        db_precuration.updated_by = user_id

        db.commit()
        db.refresh(db_precuration)
        return db_precuration


# Create instance
precuration_crud = PrecurationCRUD()
