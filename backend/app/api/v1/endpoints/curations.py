"""
Curation management endpoints with full ClinGen SOP v11 compliance.
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
from app.crud.curation import curation_crud
from app.models.database_models import User
from app.schemas.curation import (
    CurationCreate,
    CurationListResponse,
    CurationResponse,
    CurationScoreSummary,
    CurationSearchQuery,
    CurationStatistics,
    CurationSummary,
    CurationUpdate,
    CurationWorkflowAction,
)

router = APIRouter()


@router.get("/", response_model=CurationListResponse)
async def list_curations(
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
    Get all curations with pagination and sorting.
    """
    curations, total = curation_crud.get_multi(
        db=db, skip=skip, limit=limit, sort_by=sort_by, sort_order=sort_order
    )

    return {
        "curations": curations,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_next": skip + limit < total,
        "has_prev": skip > 0,
    }


@router.post("/search", response_model=CurationListResponse)
async def search_curations(
    search_params: CurationSearchQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Advanced curation search with multiple filters including ClinGen-specific criteria.
    """
    curations, total = curation_crud.search(db=db, search_params=search_params)

    return {
        "curations": curations,
        "total": total,
        "skip": search_params.skip,
        "limit": search_params.limit,
        "has_next": search_params.skip + search_params.limit < total,
        "has_prev": search_params.skip > 0,
    }


@router.get("/statistics", response_model=CurationStatistics)
async def get_curation_statistics(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get curation database statistics focused on ClinGen compliance metrics.
    """
    return curation_crud.get_statistics(db=db)


@router.get("/summary", response_model=list[CurationSummary])
async def get_curations_summary(
    limit: int = Query(
        100, ge=1, le=1000, description="Maximum number of curations to return"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get curation summary list for dropdowns and quick selection.
    """
    curations, _ = curation_crud.get_multi(db=db, skip=0, limit=limit)

    return [
        {
            "id": curation.id,
            "gene_id": curation.gene_id,
            "mondo_id": curation.mondo_id,
            "disease_name": curation.disease_name,
            "verdict": curation.verdict,
            "total_score": curation.total_score,
            "status": curation.status,
            "created_at": curation.created_at,
            "gene_symbol": curation.gene.approved_symbol if curation.gene else None,
            "gene_hgnc_id": curation.gene.hgnc_id if curation.gene else None,
        }
        for curation in curations
    ]


@router.get("/gene/{gene_id}", response_model=list[CurationResponse])
async def get_curations_by_gene(
    gene_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all curations for a specific gene.
    """
    curations = curation_crud.get_by_gene_id(db=db, gene_id=gene_id)
    return curations


@router.get("/verdict/{verdict}", response_model=list[CurationResponse])
async def get_curations_by_verdict(
    verdict: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get curations by ClinGen verdict classification.
    """
    curations = curation_crud.get_by_verdict(db=db, verdict=verdict)
    return curations


@router.get("/{curation_id}", response_model=CurationResponse)
async def get_curation(
    curation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific curation by ID with complete ClinGen data.
    """
    curation = curation_crud.get(db=db, curation_id=curation_id)
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Curation not found"
        )
    return curation


@router.get("/{curation_id}/score-summary", response_model=CurationScoreSummary)
async def get_curation_score_summary(
    curation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get detailed ClinGen score breakdown and rationale for a curation.
    """
    curation = curation_crud.get(db=db, curation_id=curation_id)
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Curation not found"
        )

    return curation_crud.calculate_score_summary(curation)


@router.post("/", response_model=CurationResponse, status_code=status.HTTP_201_CREATED)
async def create_curation(
    curation_data: CurationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin),
) -> Any:
    """
    Create a new curation with automatic ClinGen SOP v11 compliance scoring.

    The database will automatically:
    - Calculate genetic evidence scores (max 12 points)
    - Calculate experimental evidence scores (max 6 points)
    - Determine verdict based on total score and contradictory evidence
    - Generate record hash for integrity

    Requires curator or admin privileges.
    """
    return curation_crud.create(
        db=db, curation_create=curation_data, user_id=str(current_user.id)
    )


@router.put("/{curation_id}", response_model=CurationResponse)
async def update_curation(
    curation_id: str,
    curation_update: CurationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin),
) -> Any:
    """
    Update a curation with automatic recalculation of ClinGen scores.

    Requires curator or admin privileges.
    """
    curation = curation_crud.update(
        db=db,
        curation_id=curation_id,
        curation_update=curation_update,
        user_id=str(current_user.id),
    )
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Curation not found"
        )
    return curation


@router.delete("/{curation_id}", response_model=CurationResponse)
async def delete_curation(
    curation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Delete a curation.

    Requires admin privileges.
    """
    curation = curation_crud.delete(db=db, curation_id=curation_id)
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Curation not found"
        )
    return curation


@router.post("/{curation_id}/workflow", response_model=CurationResponse)
async def curation_workflow_action(
    curation_id: str,
    action: CurationWorkflowAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_curator_or_admin),
) -> Any:
    """
    Perform workflow action on a curation.

    Supported actions:
    - approve: Move to Approved status (admin only)
    - publish: Move to Published status (requires approval first)
    - reject: Move to Rejected status (admin only)
    - request_changes: Move back to Draft status
    - submit_for_review: Move to In_Primary_Review status
    """
    curation = curation_crud.get(db=db, curation_id=curation_id)
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Curation not found"
        )

    # Handle different workflow actions
    if action.action == "approve":
        # Only admin can approve
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can approve curations",
            )
        return curation_crud.approve(
            db=db, curation_id=curation_id, user_id=str(current_user.id)
        )

    elif action.action == "publish":
        # Can be done by curator or admin, but requires approval first
        return curation_crud.publish(
            db=db, curation_id=curation_id, user_id=str(current_user.id)
        )

    elif action.action == "submit_for_review":
        # Update status to In_Primary_Review
        update_data = CurationUpdate(status="In_Primary_Review")
        return curation_crud.update(
            db=db,
            curation_id=curation_id,
            curation_update=update_data,
            user_id=str(current_user.id),
        )

    elif action.action == "request_changes":
        # Update status back to Draft
        update_data = CurationUpdate(status="Draft")
        return curation_crud.update(
            db=db,
            curation_id=curation_id,
            curation_update=update_data,
            user_id=str(current_user.id),
        )

    elif action.action == "reject":
        # Only admin can reject
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can reject curations",
            )
        update_data = CurationUpdate(status="Rejected")
        return curation_crud.update(
            db=db,
            curation_id=curation_id,
            curation_update=update_data,
            user_id=str(current_user.id),
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported workflow action: {action.action}",
        )


@router.get("/{curation_id}/history")
async def get_curation_history(
    curation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get curation change history with complete audit trail.

    Returns the complete audit trail for a specific curation including
    evidence changes, score recalculations, and workflow transitions.
    """
    curation = curation_crud.get(db=db, curation_id=curation_id)
    if not curation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Curation not found"
        )

    # Query change log for this curation
    from app.models.database_models import ChangeLog

    history = (
        db.query(ChangeLog)
        .filter(
            ChangeLog.entity_type == "curations", ChangeLog.entity_id == curation_id
        )
        .order_by(ChangeLog.timestamp.desc())
        .all()
    )

    return {
        "curation_id": curation_id,
        "gene_id": str(curation.gene_id),
        "mondo_id": curation.mondo_id,
        "disease_name": curation.disease_name,
        "current_verdict": curation.verdict,
        "current_total_score": float(curation.total_score),
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


@router.get("/analytics/score-distribution")
async def get_score_distribution(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get ClinGen score distribution analytics for data visualization.
    """
    from sqlalchemy import func

    from app.models.database_models import Curation

    # Score distribution by ranges
    score_ranges = [
        ("0-3 (Limited)", 0, 3),
        ("3-7 (Limited-Moderate)", 3, 7),
        ("7-12 (Moderate-Strong)", 7, 12),
        ("12-18 (Strong-Definitive)", 12, 18),
    ]

    distribution = {}
    for range_name, min_score, max_score in score_ranges:
        count = (
            db.query(Curation)
            .filter(Curation.total_score >= min_score, Curation.total_score < max_score)
            .count()
        )
        distribution[range_name] = count

    # Verdict distribution
    verdict_counts = (
        db.query(Curation.verdict, func.count(Curation.id))
        .group_by(Curation.verdict)
        .all()
    )

    verdict_distribution = {str(verdict): count for verdict, count in verdict_counts}

    # Average scores by verdict
    avg_scores_by_verdict = (
        db.query(
            Curation.verdict,
            func.avg(Curation.genetic_evidence_score).label("avg_genetic"),
            func.avg(Curation.experimental_evidence_score).label("avg_experimental"),
            func.avg(Curation.total_score).label("avg_total"),
        )
        .group_by(Curation.verdict)
        .all()
    )

    verdict_scores = {}
    for verdict, avg_genetic, avg_experimental, avg_total in avg_scores_by_verdict:
        verdict_scores[str(verdict)] = {
            "avg_genetic_score": round(float(avg_genetic or 0), 2),
            "avg_experimental_score": round(float(avg_experimental or 0), 2),
            "avg_total_score": round(float(avg_total or 0), 2),
        }

    return {
        "score_distribution": distribution,
        "verdict_distribution": verdict_distribution,
        "verdict_score_averages": verdict_scores,
        "total_curations": sum(distribution.values()),
    }
