"""
CRUD operations for Curation model.
"""

import hashlib
import json
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.database_models import Curation, Gene, Precuration
from app.schemas.curation import CurationCreate, CurationSearchQuery, CurationUpdate


class CurationCRUD:
    """CRUD operations for Curation model."""

    def generate_record_hash(self, curation_data: dict, user_id: str) -> str:
        """Generate SHA-256 hash for record integrity."""
        content_string = (
            str(curation_data.get("gene_id", ""))
            + str(curation_data.get("mondo_id", ""))
            + str(curation_data.get("mode_of_inheritance", ""))
            + str(curation_data.get("disease_name", ""))
            + json.dumps(curation_data.get("details", {}), sort_keys=True)
            + str(user_id)
        )
        return hashlib.sha256(content_string.encode()).hexdigest()

    def get(self, db: Session, curation_id: str) -> Curation | None:
        """Get curation by ID."""
        return db.query(Curation).filter(Curation.id == curation_id).first()

    def get_by_gene_id(self, db: Session, gene_id: str) -> list[Curation]:
        """Get all curations for a specific gene."""
        return db.query(Curation).filter(Curation.gene_id == gene_id).all()

    def get_by_mondo_id(self, db: Session, mondo_id: str) -> list[Curation]:
        """Get curations by MONDO ID."""
        return db.query(Curation).filter(Curation.mondo_id == mondo_id).all()

    def get_by_verdict(self, db: Session, verdict: str) -> list[Curation]:
        """Get curations by verdict."""
        return db.query(Curation).filter(Curation.verdict == verdict).all()

    def get_multi(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[list[Curation], int]:
        """Get multiple curations with pagination and sorting."""
        query = db.query(Curation).join(Gene, Curation.gene_id == Gene.id)

        # Get total count
        total = query.count()

        # Apply sorting
        if hasattr(Curation, sort_by):
            order_column = getattr(Curation, sort_by)
        elif hasattr(Gene, sort_by):
            order_column = getattr(Gene, sort_by)
        else:
            order_column = Curation.created_at

        if sort_order.lower() == "desc":
            query = query.order_by(order_column.desc())
        else:
            query = query.order_by(order_column.asc())

        # Apply pagination
        curations = query.offset(skip).limit(limit).all()

        return curations, total

    def search(
        self, db: Session, search_params: CurationSearchQuery
    ) -> tuple[list[Curation], int]:
        """Advanced curation search with multiple filters."""
        query = db.query(Curation).join(Gene, Curation.gene_id == Gene.id)

        # Text search across multiple fields
        if search_params.query:
            search_term = f"%{search_params.query}%"
            query = query.filter(
                or_(
                    Gene.approved_symbol.ilike(search_term),
                    Gene.hgnc_id.ilike(search_term),
                    Curation.mondo_id.ilike(search_term),
                    Curation.disease_name.ilike(search_term),
                    Curation.mode_of_inheritance.ilike(search_term),
                    Curation.gcep_affiliation.ilike(search_term),
                )
            )

        # Filter by gene ID
        if search_params.gene_id:
            query = query.filter(Curation.gene_id == search_params.gene_id)

        # Filter by MONDO ID
        if search_params.mondo_id:
            query = query.filter(Curation.mondo_id == search_params.mondo_id)

        # Filter by verdict
        if search_params.verdict:
            query = query.filter(Curation.verdict == search_params.verdict)

        # Filter by status
        if search_params.status:
            query = query.filter(Curation.status == search_params.status)

        # Filter by GCEP affiliation
        if search_params.gcep_affiliation:
            query = query.filter(
                Curation.gcep_affiliation.ilike(f"%{search_params.gcep_affiliation}%")
            )

        # Filter by score range
        if search_params.min_total_score is not None:
            query = query.filter(Curation.total_score >= search_params.min_total_score)

        if search_params.max_total_score is not None:
            query = query.filter(Curation.total_score <= search_params.max_total_score)

        # Filter by contradictory evidence
        if search_params.has_contradictory_evidence is not None:
            query = query.filter(
                Curation.has_contradictory_evidence
                == search_params.has_contradictory_evidence
            )

        # Filter by creator
        if search_params.created_by:
            query = query.filter(Curation.created_by == search_params.created_by)

        # Get total count before pagination
        total = query.count()

        # Apply sorting
        if hasattr(Curation, search_params.sort_by):
            order_column = getattr(Curation, search_params.sort_by)
        elif hasattr(Gene, search_params.sort_by):
            order_column = getattr(Gene, search_params.sort_by)
        else:
            order_column = Curation.created_at

        if search_params.sort_order.lower() == "desc":
            query = query.order_by(order_column.desc())
        else:
            query = query.order_by(order_column.asc())

        # Apply pagination
        curations = query.offset(search_params.skip).limit(search_params.limit).all()

        return curations, total

    def create(
        self, db: Session, curation_create: CurationCreate, user_id: str
    ) -> Curation:
        """Create a new curation."""
        # Verify gene exists
        gene = db.query(Gene).filter(Gene.id == curation_create.gene_id).first()
        if not gene:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Gene with ID {curation_create.gene_id} not found",
            )

        # Verify precuration exists if provided
        if curation_create.precuration_id:
            precuration = (
                db.query(Precuration)
                .filter(Precuration.id == curation_create.precuration_id)
                .first()
            )
            if not precuration:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Precuration with ID {curation_create.precuration_id} not found",
                )

        # Prepare curation data
        curation_data = curation_create.dict()
        record_hash = self.generate_record_hash(curation_data, user_id)

        # Create curation object
        db_curation = Curation(
            gene_id=curation_create.gene_id,
            precuration_id=curation_create.precuration_id,
            mondo_id=curation_create.mondo_id,
            mode_of_inheritance=curation_create.mode_of_inheritance,
            disease_name=curation_create.disease_name,
            verdict=curation_create.verdict,
            gcep_affiliation=curation_create.gcep_affiliation,
            sop_version=curation_create.sop_version or "v11",
            details=curation_create.details or {},
            record_hash=record_hash,
            created_by=user_id,
            updated_by=user_id,
        )

        db.add(db_curation)
        db.commit()
        db.refresh(db_curation)
        return db_curation

    def update(
        self,
        db: Session,
        curation_id: str,
        curation_update: CurationUpdate,
        user_id: str,
    ) -> Curation | None:
        """Update curation information."""
        db_curation = self.get(db, curation_id)
        if not db_curation:
            return None

        # Store previous hash
        previous_hash = db_curation.record_hash

        # Update fields
        update_data = curation_update.dict(exclude_unset=True)

        # Verify gene exists if gene_id is being updated
        if "gene_id" in update_data:
            gene = db.query(Gene).filter(Gene.id == update_data["gene_id"]).first()
            if not gene:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Gene with ID {update_data['gene_id']} not found",
                )

        # Verify precuration exists if precuration_id is being updated
        if "precuration_id" in update_data and update_data["precuration_id"]:
            precuration = (
                db.query(Precuration)
                .filter(Precuration.id == update_data["precuration_id"])
                .first()
            )
            if not precuration:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Precuration with ID {update_data['precuration_id']} not found",
                )

        for field, value in update_data.items():
            setattr(db_curation, field, value)

        # Update metadata
        db_curation.updated_by = user_id
        db_curation.previous_hash = previous_hash

        # Generate new hash
        current_data = {
            "gene_id": str(db_curation.gene_id),
            "mondo_id": db_curation.mondo_id,
            "mode_of_inheritance": db_curation.mode_of_inheritance,
            "disease_name": db_curation.disease_name,
            "details": db_curation.details,
        }
        db_curation.record_hash = self.generate_record_hash(current_data, user_id)

        db.commit()
        db.refresh(db_curation)
        return db_curation

    def delete(self, db: Session, curation_id: str) -> Curation | None:
        """Delete curation."""
        db_curation = self.get(db, curation_id)
        if not db_curation:
            return None

        db.delete(db_curation)
        db.commit()
        return db_curation

    def get_statistics(self, db: Session) -> dict[str, Any]:
        """Get curation database statistics focused on ClinGen compliance."""
        from datetime import datetime, timedelta

        # Total curations
        total_curations = db.query(Curation).count()

        # By verdict
        verdict_counts = (
            db.query(Curation.verdict, func.count(Curation.id))
            .group_by(Curation.verdict)
            .all()
        )
        curations_by_verdict = {
            str(verdict): count for verdict, count in verdict_counts
        }

        # By status
        status_counts = (
            db.query(Curation.status, func.count(Curation.id))
            .group_by(Curation.status)
            .all()
        )
        curations_by_status = {str(status): count for status, count in status_counts}

        # Score distribution
        avg_genetic_score = (
            db.query(func.avg(Curation.genetic_evidence_score)).scalar() or 0
        )
        avg_experimental_score = (
            db.query(func.avg(Curation.experimental_evidence_score)).scalar() or 0
        )
        avg_total_score = db.query(func.avg(Curation.total_score)).scalar() or 0

        # Quality metrics
        high_confidence_count = (
            db.query(Curation)
            .filter(Curation.verdict.in_(["Definitive", "Strong"]))
            .count()
        )

        contradictory_evidence_count = (
            db.query(Curation)
            .filter(Curation.has_contradictory_evidence is True)
            .count()
        )

        # Recent activity
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_additions = (
            db.query(Curation).filter(Curation.created_at >= thirty_days_ago).count()
        )

        week_ago = datetime.utcnow() - timedelta(days=7)
        updated_last_week = (
            db.query(Curation).filter(Curation.updated_at >= week_ago).count()
        )

        # Workflow status
        pending_approval = (
            db.query(Curation)
            .filter(
                Curation.status.in_(
                    ["Draft", "In_Primary_Review", "In_Secondary_Review"]
                )
            )
            .count()
        )

        approved_count = (
            db.query(Curation).filter(Curation.status == "Approved").count()
        )

        published_count = (
            db.query(Curation).filter(Curation.status == "Published").count()
        )

        return {
            "total_curations": total_curations,
            "curations_by_verdict": curations_by_verdict,
            "curations_by_status": curations_by_status,
            "avg_genetic_score": round(float(avg_genetic_score), 2),
            "avg_experimental_score": round(float(avg_experimental_score), 2),
            "avg_total_score": round(float(avg_total_score), 2),
            "high_confidence_count": high_confidence_count,
            "contradictory_evidence_count": contradictory_evidence_count,
            "recent_additions": recent_additions,
            "updated_last_week": updated_last_week,
            "pending_approval": pending_approval,
            "approved_count": approved_count,
            "published_count": published_count,
        }

    def approve(self, db: Session, curation_id: str, user_id: str) -> Curation | None:
        """Approve a curation."""
        db_curation = self.get(db, curation_id)
        if not db_curation:
            return None

        from datetime import datetime

        # Update status and approval metadata
        db_curation.status = "Approved"
        db_curation.approved_by = user_id
        db_curation.approved_at = datetime.utcnow()
        db_curation.updated_by = user_id

        db.commit()
        db.refresh(db_curation)
        return db_curation

    def publish(self, db: Session, curation_id: str, user_id: str) -> Curation | None:
        """Publish a curation (must be approved first)."""
        db_curation = self.get(db, curation_id)
        if not db_curation:
            return None

        if db_curation.status != "Approved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Curation must be approved before publishing",
            )

        from datetime import datetime

        # Update status and publication metadata
        db_curation.status = "Published"
        db_curation.published_at = datetime.utcnow()
        db_curation.updated_by = user_id

        db.commit()
        db.refresh(db_curation)
        return db_curation

    def calculate_score_summary(self, curation: Curation) -> dict[str, Any]:
        """Calculate detailed score breakdown for a curation."""
        details = curation.details or {}

        # Extract evidence counts
        genetic_evidence = details.get("genetic_evidence", {})
        experimental_evidence = details.get("experimental_evidence", {})

        case_level_count = len(genetic_evidence.get("case_level_data", []))
        segregation_count = len(genetic_evidence.get("segregation_data", []))
        case_control_count = len(genetic_evidence.get("case_control_data", []))

        function_count = len(experimental_evidence.get("function", []))
        model_count = len(experimental_evidence.get("models", []))
        rescue_count = len(experimental_evidence.get("rescue", []))

        return {
            "genetic_evidence_score": float(curation.genetic_evidence_score),
            "experimental_evidence_score": float(curation.experimental_evidence_score),
            "total_score": float(curation.total_score),
            "verdict": curation.verdict,
            "has_contradictory_evidence": curation.has_contradictory_evidence,
            "evidence_breakdown": {
                "case_level_evidence": case_level_count,
                "segregation_evidence": segregation_count,
                "case_control_evidence": case_control_count,
                "functional_evidence": function_count,
                "model_evidence": model_count,
                "rescue_evidence": rescue_count,
            },
            "classification_rationale": self._get_classification_rationale(
                curation.total_score, curation.has_contradictory_evidence
            ),
        }

    def _get_classification_rationale(
        self, total_score: float, has_contradictory: bool
    ) -> str:
        """Get classification rationale based on ClinGen SOP v11."""
        if has_contradictory:
            return "Classification disputed due to contradictory evidence requiring expert review"

        if total_score >= 12.0:
            return "Strong or Definitive evidence (≥12 points). Definitive requires replication over time."
        elif total_score >= 7.0:
            return (
                "Moderate evidence (7-11 points) supporting gene-disease relationship"
            )
        elif total_score >= 1.0:
            return "Limited evidence (1-6 points) supporting gene-disease relationship"
        else:
            return "Insufficient evidence (<1 point) for gene-disease relationship"


# Create instance
curation_crud = CurationCRUD()
