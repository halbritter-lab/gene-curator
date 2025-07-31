"""
Gene management endpoints.
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import (
    get_current_active_user, 
    get_current_curator_or_admin,
    get_current_admin_user
)
from app.crud.gene import gene_crud
from app.schemas.gene import (
    GeneCreate, 
    GeneUpdate, 
    GeneResponse, 
    GeneListResponse,
    GeneSearchQuery,
    GeneSummary,
    GeneStatistics,
    GeneBulkCreate,
    GeneBulkCreateResponse
)
from app.models.database_models import User

router = APIRouter()

@router.get("/", response_model=GeneListResponse)
async def list_genes(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=500, description="Maximum number of records to return"),
    sort_by: str = Query("approved_symbol", description="Field to sort by"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get all genes with pagination and sorting.
    """
    genes, total = gene_crud.get_multi(
        db=db, 
        skip=skip, 
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return {
        "genes": genes,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_next": skip + limit < total,
        "has_prev": skip > 0
    }

@router.post("/search", response_model=GeneListResponse)
async def search_genes(
    search_params: GeneSearchQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Advanced gene search with multiple filters.
    """
    genes, total = gene_crud.search(db=db, search_params=search_params)
    
    return {
        "genes": genes,
        "total": total,
        "skip": search_params.skip,
        "limit": search_params.limit,
        "has_next": search_params.skip + search_params.limit < total,
        "has_prev": search_params.skip > 0
    }

@router.get("/statistics", response_model=GeneStatistics)
async def get_gene_statistics(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get gene database statistics.
    """
    return gene_crud.get_statistics(db=db)

@router.get("/summary", response_model=List[GeneSummary])
async def get_genes_summary(
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of genes to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get gene summary list for dropdowns and quick selection.
    """
    genes, _ = gene_crud.get_multi(db=db, skip=0, limit=limit)
    
    return [
        {
            "id": gene.id,
            "hgnc_id": gene.hgnc_id,
            "approved_symbol": gene.approved_symbol,
            "chromosome": gene.chromosome,
            "current_dyadic_name": gene.current_dyadic_name
        }
        for gene in genes
    ]

@router.get("/{gene_id}", response_model=GeneResponse)
async def get_gene(
    gene_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific gene by ID.
    """
    gene = gene_crud.get(db=db, gene_id=gene_id)
    if not gene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gene not found"
        )
    return gene

@router.get("/hgnc/{hgnc_id}", response_model=GeneResponse)
async def get_gene_by_hgnc_id(
    hgnc_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific gene by HGNC ID.
    """
    gene = gene_crud.get_by_hgnc_id(db=db, hgnc_id=hgnc_id)
    if not gene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gene with HGNC ID {hgnc_id} not found"
        )
    return gene

@router.post("/", response_model=GeneResponse, status_code=status.HTTP_201_CREATED)
async def create_gene(
    gene_data: GeneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin)
) -> Any:
    """
    Create a new gene.
    
    Requires curator or admin privileges.
    """
    return gene_crud.create(
        db=db, 
        gene_create=gene_data, 
        user_id=str(current_user.id)
    )

@router.post("/bulk", response_model=GeneBulkCreateResponse, status_code=status.HTTP_201_CREATED)
async def bulk_create_genes(
    bulk_data: GeneBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin)
) -> Any:
    """
    Bulk create multiple genes.
    
    Requires curator or admin privileges.
    """
    return gene_crud.bulk_create(
        db=db,
        genes_data=bulk_data.genes,
        user_id=str(current_user.id),
        skip_duplicates=bulk_data.skip_duplicates
    )

@router.put("/{gene_id}", response_model=GeneResponse)
async def update_gene(
    gene_id: str,
    gene_update: GeneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin)
) -> Any:
    """
    Update a gene.
    
    Requires curator or admin privileges.
    """
    gene = gene_crud.update(
        db=db, 
        gene_id=gene_id, 
        gene_update=gene_update, 
        user_id=str(current_user.id)
    )
    if not gene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gene not found"
        )
    return gene

@router.delete("/{gene_id}", response_model=GeneResponse)
async def delete_gene(
    gene_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Delete a gene.
    
    Requires admin privileges.
    """
    gene = gene_crud.delete(db=db, gene_id=gene_id)
    if not gene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gene not found"
        )
    return gene

@router.get("/{gene_id}/history")
async def get_gene_history(
    gene_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get gene change history.
    
    Returns the audit trail for a specific gene.
    """
    gene = gene_crud.get(db=db, gene_id=gene_id)
    if not gene:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gene not found"
        )
    
    # Query change log for this gene
    from app.models.database_models import ChangeLog
    
    history = db.query(ChangeLog).filter(
        ChangeLog.entity_type == "gene",
        ChangeLog.entity_id == gene_id
    ).order_by(ChangeLog.timestamp.desc()).all()
    
    return {
        "gene_id": gene_id,
        "approved_symbol": gene.approved_symbol,
        "hgnc_id": gene.hgnc_id,
        "history": [
            {
                "id": entry.id,
                "operation": entry.operation,
                "timestamp": entry.timestamp,
                "user_id": entry.user_id,
                "record_hash": entry.record_hash,
                "previous_hash": entry.previous_hash,
                "changes": entry.changes
            }
            for entry in history
        ]
    }