"""
Precuration management endpoints.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import (
    get_current_active_user,
    get_current_admin_user,
    get_current_curator_or_admin,
)
from app.crud.precuration import precuration_crud
from app.models.database_models import User
from app.schemas.precuration import (
    PrecurationCreate,
    PrecurationListResponse,
    PrecurationResponse,
    PrecurationSearchQuery,
    PrecurationStatistics,
    PrecurationSummary,
    PrecurationUpdate,
    PrecurationWorkflowAction,
)

router = APIRouter()


@router.get("/")
async def list_precurations(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        50, ge=1, le=500, description="Maximum number of records to return"
    ),
    sort_by: str = Query("created_at", description="Field to sort by"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all precurations with pagination and sorting.
    """
    precurations, total = precuration_crud.get_multi(
        db=db, skip=skip, limit=limit, sort_by=sort_by, sort_order=sort_order
    )

    # Convert precurations to dict format, excluding gene relationship
    precuration_dicts = []
    for p in precurations:
        precuration_dict = {
            "id": str(p.id),
            "gene_id": str(p.gene_id),
            "mondo_id": p.mondo_id,
            "mode_of_inheritance": p.mode_of_inheritance,
            "lumping_splitting_decision": p.lumping_splitting_decision,
            "rationale": p.rationale,
            "status": p.status,
            "details": p.details,
            "record_hash": p.record_hash,
            "previous_hash": p.previous_hash,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            "created_by": str(p.created_by) if p.created_by else None,
            "updated_by": str(p.updated_by) if p.updated_by else None,
            "gene": None  # Exclude gene info for now
        }
        precuration_dicts.append(precuration_dict)

    return {
        "precurations": precuration_dicts,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_next": skip + limit < total,
        "has_prev": skip > 0,
    }


@router.post("/search", response_model=PrecurationListResponse)
async def search_precurations(
    search_params: PrecurationSearchQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Advanced precuration search with multiple filters.
    """
    precurations, total = precuration_crud.search(db=db, search_params=search_params)

    return {
        "precurations": precurations,
        "total": total,
        "skip": search_params.skip,
        "limit": search_params.limit,
        "has_next": search_params.skip + search_params.limit < total,
        "has_prev": search_params.skip > 0,
    }


@router.get("/statistics", response_model=PrecurationStatistics)
async def get_precuration_statistics(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get precuration database statistics.
    """
    return precuration_crud.get_statistics(db=db)


@router.get("/summary", response_model=list[PrecurationSummary])
async def get_precurations_summary(
    limit: int = Query(
        100, ge=1, le=1000, description="Maximum number of precurations to return"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get precuration summary list for dropdowns and quick selection.
    """
    precurations, _ = precuration_crud.get_multi(db=db, skip=0, limit=limit)

    return [
        {
            "id": precuration.id,
            "gene_id": precuration.gene_id,
            "mondo_id": precuration.mondo_id,
            "mode_of_inheritance": precuration.mode_of_inheritance,
            "lumping_splitting_decision": precuration.lumping_splitting_decision,
            "status": precuration.status,
            "created_at": precuration.created_at,
            "gene_symbol": precuration.gene.approved_symbol
            if precuration.gene
            else None,
            "gene_hgnc_id": precuration.gene.hgnc_id if precuration.gene else None,
        }
        for precuration in precurations
    ]


@router.get("/gene/{gene_id}", response_model=list[PrecurationResponse])
async def get_precurations_by_gene(
    gene_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all precurations for a specific gene.
    """
    precurations = precuration_crud.get_by_gene_id(db=db, gene_id=gene_id)
    return precurations


@router.get("/{precuration_id}", response_model=PrecurationResponse)
async def get_precuration(
    precuration_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific precuration by ID.
    """
    precuration = precuration_crud.get(db=db, precuration_id=precuration_id)
    if not precuration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Precuration not found"
        )
    return precuration


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_precuration(
    precuration_data: PrecurationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin),
) -> Any:
    """
    Create a new precuration.

    Requires curator or admin privileges.
    """
    precuration = precuration_crud.create(
        db=db, precuration_create=precuration_data, user_id=str(current_user.id)
    )

    # Manual serialization to avoid Gene object validation issues
    return {
        "id": str(precuration.id),
        "gene_id": str(precuration.gene_id),
        "mondo_id": precuration.mondo_id,
        "mode_of_inheritance": precuration.mode_of_inheritance,
        "lumping_splitting_decision": precuration.lumping_splitting_decision,
        "rationale": precuration.rationale,
        "status": precuration.status,
        "details": precuration.details,
        "record_hash": precuration.record_hash,
        "previous_hash": precuration.previous_hash,
        "created_at": precuration.created_at.isoformat() if precuration.created_at else None,
        "updated_at": precuration.updated_at.isoformat() if precuration.updated_at else None,
        "created_by": str(precuration.created_by) if precuration.created_by else None,
        "updated_by": str(precuration.updated_by) if precuration.updated_by else None,
        "gene": None  # Exclude gene info for now
    }


@router.put("/{precuration_id}", response_model=PrecurationResponse)
async def update_precuration(
    precuration_id: str,
    precuration_update: PrecurationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin),
) -> Any:
    """
    Update a precuration.

    Requires curator or admin privileges.
    """
    precuration = precuration_crud.update(
        db=db,
        precuration_id=precuration_id,
        precuration_update=precuration_update,
        user_id=str(current_user.id),
    )
    if not precuration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Precuration not found"
        )
    return precuration


@router.delete("/{precuration_id}", response_model=PrecurationResponse)
async def delete_precuration(
    precuration_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Delete a precuration.

    Requires admin privileges.
    """
    precuration = precuration_crud.delete(db=db, precuration_id=precuration_id)
    if not precuration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Precuration not found"
        )
    return precuration


@router.post("/{precuration_id}/workflow", response_model=PrecurationResponse)
async def precuration_workflow_action(
    precuration_id: str,
    action: PrecurationWorkflowAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin),
) -> Any:
    """
    Perform workflow action on a precuration.

    Supported actions: approve, reject, request_changes, submit_for_review
    """
    precuration = precuration_crud.get(db=db, precuration_id=precuration_id)
    if not precuration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Precuration not found"
        )

    # Handle different workflow actions
    if action.action == "approve":
        # Only admin can approve
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can approve precurations",
            )
        return precuration_crud.approve(
            db=db, precuration_id=precuration_id, user_id=str(current_user.id)
        )

    elif action.action == "submit_for_review":
        # Update status to In_Primary_Review
        update_data = PrecurationUpdate(status="In_Primary_Review")
        return precuration_crud.update(
            db=db,
            precuration_id=precuration_id,
            precuration_update=update_data,
            user_id=str(current_user.id),
        )

    elif action.action == "request_changes":
        # Update status back to Draft
        update_data = PrecurationUpdate(status="Draft")
        return precuration_crud.update(
            db=db,
            precuration_id=precuration_id,
            precuration_update=update_data,
            user_id=str(current_user.id),
        )

    elif action.action == "reject":
        # Only admin can reject
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can reject precurations",
            )
        update_data = PrecurationUpdate(status="Rejected")
        return precuration_crud.update(
            db=db,
            precuration_id=precuration_id,
            precuration_update=update_data,
            user_id=str(current_user.id),
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported workflow action: {action.action}",
        )


@router.get("/{precuration_id}/history")
async def get_precuration_history(
    precuration_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get precuration change history.

    Returns the audit trail for a specific precuration.
    """
    precuration = precuration_crud.get(db=db, precuration_id=precuration_id)
    if not precuration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Precuration not found"
        )

    # Query change log for this precuration
    from app.models.database_models import ChangeLog

    history = (
        db.query(ChangeLog)
        .filter(
            ChangeLog.entity_type == "precurations",
            ChangeLog.entity_id == precuration_id,
        )
        .order_by(ChangeLog.timestamp.desc())
        .all()
    )

    return {
        "precuration_id": precuration_id,
        "gene_id": str(precuration.gene_id),
        "mondo_id": precuration.mondo_id,
        "history": [
            {
                "id": entry.id,
                "operation": entry.operation,
                "timestamp": entry.timestamp,
                "user_id": entry.user_id,
                "record_hash": entry.record_hash,
                "previous_hash": entry.previous_hash,
                "changes": entry.changes,
            }
            for entry in history
        ],
    }
