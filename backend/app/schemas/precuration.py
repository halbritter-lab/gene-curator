"""
Precuration-related Pydantic schemas.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


class PrecurationDecision(str, Enum):
    """Precuration lumping/splitting decision options."""

    LUMP = "Lump"
    SPLIT = "Split"
    UNDECIDED = "Undecided"


class WorkflowStatus(str, Enum):
    """Workflow status options."""

    DRAFT = "Draft"
    IN_PRIMARY_REVIEW = "In_Primary_Review"
    IN_SECONDARY_REVIEW = "In_Secondary_Review"
    APPROVED = "Approved"
    PUBLISHED = "Published"
    REJECTED = "Rejected"


class PrecurationBase(BaseModel):
    """Base precuration schema with common fields."""

    gene_id: str | uuid.UUID = Field(..., description="Gene ID reference")
    mondo_id: str = Field(..., description="MONDO disease identifier")
    mode_of_inheritance: str = Field(
        ..., description="Mode of inheritance (e.g., AR, AD, XL)"
    )
    lumping_splitting_decision: PrecurationDecision | None = Field(
        default=PrecurationDecision.UNDECIDED,
        description="Decision on disease entity lumping or splitting",
    )
    rationale: str | None = Field(
        None, description="Rationale for the precuration decision"
    )
    status: WorkflowStatus | None = Field(
        default=WorkflowStatus.DRAFT, description="Workflow status"
    )
    details: dict[str, Any] | None = Field(
        default={}, description="Additional precuration details"
    )

    @field_validator("mondo_id")
    @classmethod
    def validate_mondo_id(cls, v: str) -> str:
        """Validate MONDO ID format."""
        if not v.startswith("MONDO:") or not v[6:].isdigit():
            raise ValueError(
                "MONDO ID must be in format MONDO:#### where #### is a number"
            )
        return v


class PrecurationCreate(PrecurationBase):
    """Schema for creating a new precuration."""

    pass


class PrecurationUpdate(BaseModel):
    """Schema for updating precuration information."""

    gene_id: str | uuid.UUID | None = None
    mondo_id: str | None = None
    mode_of_inheritance: str | None = None
    lumping_splitting_decision: PrecurationDecision | None = None
    rationale: str | None = None
    status: WorkflowStatus | None = None
    details: dict[str, Any] | None = None

    @field_validator("mondo_id")
    @classmethod
    def validate_mondo_id(cls, v: str | None) -> str | None:
        """Validate MONDO ID format if provided."""
        if v is not None and (not v.startswith("MONDO:") or not v[6:].isdigit()):
            raise ValueError(
                "MONDO ID must be in format MONDO:#### where #### is a number"
            )
        return v


class PrecurationResponse(PrecurationBase):
    """Schema for precuration responses."""

    id: str | uuid.UUID
    record_hash: str
    previous_hash: str | None = None
    created_at: datetime
    updated_at: datetime
    created_by: str | uuid.UUID | None = None
    updated_by: str | uuid.UUID | None = None

    # Include gene information
    gene: dict[str, Any] | None = None

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class PrecurationListResponse(BaseModel):
    """Schema for paginated precuration list responses."""

    precurations: list[PrecurationResponse]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool


class PrecurationSearchQuery(BaseModel):
    """Schema for precuration search queries."""

    query: str | None = Field(
        None, description="Search term for gene symbol, MONDO ID, or rationale"
    )
    gene_id: str | uuid.UUID | None = Field(
        None, description="Filter by gene ID"
    )
    mondo_id: str | None = Field(None, description="Filter by MONDO ID")
    lumping_splitting_decision: PrecurationDecision | None = Field(
        None, description="Filter by decision"
    )
    status: WorkflowStatus | None = Field(
        None, description="Filter by workflow status"
    )
    created_by: str | uuid.UUID | None = Field(
        None, description="Filter by creator"
    )
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(
        50, ge=1, le=500, description="Maximum number of records to return"
    )
    sort_by: str | None = Field("created_at", description="Field to sort by")
    sort_order: str | None = Field(
        "desc", pattern="^(asc|desc)$", description="Sort order"
    )


class PrecurationSummary(BaseModel):
    """Minimal precuration information for lists and dropdowns."""

    id: str | uuid.UUID
    gene_id: str | uuid.UUID
    mondo_id: str
    mode_of_inheritance: str
    lumping_splitting_decision: PrecurationDecision | None
    status: WorkflowStatus
    created_at: datetime

    # Gene information
    gene_symbol: str | None = None
    gene_hgnc_id: str | None = None

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class PrecurationStatistics(BaseModel):
    """Precuration database statistics."""

    total_precurations: int
    precurations_by_status: dict[str, int]
    precurations_by_decision: dict[str, int]
    recent_additions: int
    updated_last_week: int
    pending_review: int


class PrecurationWorkflowAction(BaseModel):
    """Schema for workflow actions on precurations."""

    action: str = Field(
        ..., description="Action to perform (approve, reject, request_changes)"
    )
    comment: str | None = Field(None, description="Optional comment for the action")

    @field_validator("action")
    @classmethod
    def validate_action(cls, v: str) -> str:
        """Validate workflow action."""
        allowed_actions = [
            "approve",
            "reject",
            "request_changes",
            "submit_for_review",
            "publish",
        ]
        if v not in allowed_actions:
            raise ValueError(f'Action must be one of: {", ".join(allowed_actions)}')
        return v
