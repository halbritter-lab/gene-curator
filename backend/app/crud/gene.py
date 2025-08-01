"""
CRUD operations for Gene model.
"""

import hashlib
import json
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import or_, text
from sqlalchemy.orm import Session

from app.models.database_models import Gene
from app.schemas.gene import GeneCreate, GeneSearchQuery, GeneUpdate


class GeneCRUD:
    """CRUD operations for Gene model."""

    def generate_record_hash(self, gene_data: dict, user_id: str) -> str:
        """Generate SHA-256 hash for record integrity."""
        content_string = (
            str(gene_data.get("hgnc_id", ""))
            + str(gene_data.get("approved_symbol", ""))
            + str(gene_data.get("chromosome", ""))
            + json.dumps(gene_data.get("details", {}), sort_keys=True)
            + str(user_id)
        )
        return hashlib.sha256(content_string.encode()).hexdigest()

    def get(self, db: Session, gene_id: str) -> Gene | None:
        """Get gene by ID."""
        return db.query(Gene).filter(Gene.id == gene_id).first()

    def get_by_hgnc_id(self, db: Session, hgnc_id: str) -> Gene | None:
        """Get gene by HGNC ID."""
        return db.query(Gene).filter(Gene.hgnc_id == hgnc_id).first()

    def get_by_symbol(self, db: Session, symbol: str) -> Gene | None:
        """Get gene by approved symbol."""
        return db.query(Gene).filter(Gene.approved_symbol.ilike(f"%{symbol}%")).first()

    def get_multi(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "approved_symbol",
        sort_order: str = "asc",
    ) -> tuple[list[Gene], int]:
        """Get multiple genes with pagination and sorting."""
        query = db.query(Gene)

        # Get total count
        total = query.count()

        # Apply sorting
        if hasattr(Gene, sort_by):
            order_column = getattr(Gene, sort_by)
            if sort_order.lower() == "desc":
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())

        # Apply pagination
        genes = query.offset(skip).limit(limit).all()

        return genes, total

    def search(
        self, db: Session, search_params: GeneSearchQuery
    ) -> tuple[list[Gene], int]:
        """Advanced gene search with multiple filters."""
        query = db.query(Gene)

        # Text search across multiple fields
        if search_params.query:
            search_term = f"%{search_params.query}%"
            query = query.filter(
                or_(
                    Gene.approved_symbol.ilike(search_term),
                    Gene.hgnc_id.ilike(search_term),
                    Gene.details.op("->>")("gene_description").ilike(search_term),
                    text(f"'{search_params.query}' = ANY(genes.previous_symbols)"),
                    text(f"'{search_params.query}' = ANY(genes.alias_symbols)"),
                )
            )

        # Filter by chromosome
        if search_params.chromosome:
            query = query.filter(Gene.chromosome == search_params.chromosome)


        # Filter by HGNC ID
        if search_params.hgnc_id:
            query = query.filter(Gene.hgnc_id == search_params.hgnc_id)

        # Filter by creator
        if search_params.created_by:
            query = query.filter(Gene.created_by == search_params.created_by)

        # Get total count before pagination
        total = query.count()

        # Apply sorting
        if hasattr(Gene, search_params.sort_by):
            order_column = getattr(Gene, search_params.sort_by)
            if search_params.sort_order.lower() == "desc":
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())

        # Apply pagination
        genes = query.offset(search_params.skip).limit(search_params.limit).all()

        return genes, total

    def create(self, db: Session, gene_create: GeneCreate, user_id: str) -> Gene:
        """Create a new gene."""
        # Check if gene with HGNC ID already exists
        existing_gene = self.get_by_hgnc_id(db, gene_create.hgnc_id)
        if existing_gene:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Gene with HGNC ID {gene_create.hgnc_id} already exists",
            )

        # Prepare gene data
        gene_data = gene_create.dict()
        record_hash = self.generate_record_hash(gene_data, user_id)

        # Create gene object
        db_gene = Gene(
            hgnc_id=gene_create.hgnc_id,
            approved_symbol=gene_create.approved_symbol,
            previous_symbols=gene_create.previous_symbols or [],
            alias_symbols=gene_create.alias_symbols or [],
            chromosome=gene_create.chromosome,
            location=gene_create.location,
            details=gene_create.details or {},
            record_hash=record_hash,
            created_by=user_id,
            updated_by=user_id,
        )

        db.add(db_gene)
        db.commit()
        db.refresh(db_gene)
        return db_gene

    def update(
        self, db: Session, gene_id: str, gene_update: GeneUpdate, user_id: str
    ) -> Gene | None:
        """Update gene information."""
        db_gene = self.get(db, gene_id)
        if not db_gene:
            return None

        # Store previous hash
        previous_hash = db_gene.record_hash

        # Update fields
        update_data = gene_update.dict(exclude_unset=True)

        # Check for HGNC ID conflicts if being updated
        if "hgnc_id" in update_data and update_data["hgnc_id"] != db_gene.hgnc_id:
            existing_gene = self.get_by_hgnc_id(db, update_data["hgnc_id"])
            if existing_gene and existing_gene.id != db_gene.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Gene with HGNC ID {update_data['hgnc_id']} already exists",
                )

        for field, value in update_data.items():
            setattr(db_gene, field, value)

        # Update metadata
        db_gene.updated_by = user_id
        db_gene.previous_hash = previous_hash

        # Generate new hash
        current_data = {
            "hgnc_id": db_gene.hgnc_id,
            "approved_symbol": db_gene.approved_symbol,
            "chromosome": db_gene.chromosome,
            "details": db_gene.details,
        }
        db_gene.record_hash = self.generate_record_hash(current_data, user_id)

        db.commit()
        db.refresh(db_gene)
        return db_gene

    def delete(self, db: Session, gene_id: str) -> Gene | None:
        """Delete gene."""
        db_gene = self.get(db, gene_id)
        if not db_gene:
            return None

        db.delete(db_gene)
        db.commit()
        return db_gene

    def get_statistics(self, db: Session) -> dict[str, Any]:
        """Get gene database statistics focused on curation-relevant metrics."""
        from datetime import datetime, timedelta

        # Total genes
        total_genes = db.query(Gene).count()

        # Recent additions (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_additions = (
            db.query(Gene).filter(Gene.created_at >= thirty_days_ago).count()
        )

        # Updated last week
        week_ago = datetime.utcnow() - timedelta(days=7)
        updated_last_week = db.query(Gene).filter(Gene.updated_at >= week_ago).count()

        # Genes with ClinGen dyadic names (indicates curation readiness)
        genes_with_dyadic_names = (
            db.query(Gene)
            .filter(
                Gene.details.isnot(None)
            )
            .count()
        )

        return {
            "total_genes": total_genes,
            "recent_additions": recent_additions,
            "updated_last_week": updated_last_week,
            "genes_with_dyadic_names": genes_with_dyadic_names,
            "genes_ready_for_curation": genes_with_dyadic_names,
        }

    def bulk_create(
        self,
        db: Session,
        genes_data: list[GeneCreate],
        user_id: str,
        skip_duplicates: bool = True,
    ) -> dict[str, Any]:
        """Bulk create multiple genes."""
        created_genes = []
        skipped_genes = []
        errors = []

        for gene_data in genes_data:
            try:
                # Check for existing gene
                existing_gene = self.get_by_hgnc_id(db, gene_data.hgnc_id)
                if existing_gene:
                    if skip_duplicates:
                        skipped_genes.append(
                            {
                                "hgnc_id": gene_data.hgnc_id,
                                "reason": "Gene with this HGNC ID already exists",
                            }
                        )
                        continue
                    else:
                        errors.append(
                            {
                                "hgnc_id": gene_data.hgnc_id,
                                "error": "Gene with this HGNC ID already exists",
                            }
                        )
                        continue

                # Create gene
                created_gene = self.create(db, gene_data, user_id)
                created_genes.append(created_gene)

            except Exception as e:
                errors.append({"hgnc_id": gene_data.hgnc_id, "error": str(e)})

        return {
            "created_genes": created_genes,
            "skipped_genes": skipped_genes,
            "errors": errors,
            "total_processed": len(genes_data),
            "total_created": len(created_genes),
            "total_skipped": len(skipped_genes),
            "total_errors": len(errors),
        }


# Create instance
gene_crud = GeneCRUD()
