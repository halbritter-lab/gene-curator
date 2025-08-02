"""
Curation-related Pydantic schemas.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


class CurationVerdict(str, Enum):
    """ClinGen SOP v11 curation verdict options."""

    DEFINITIVE = "Definitive"
    STRONG = "Strong"
    MODERATE = "Moderate"
    LIMITED = "Limited"
    NO_KNOWN_DISEASE_RELATIONSHIP = "No Known Disease Relationship"
    DISPUTED = "Disputed"
    REFUTED = "Refuted"


class WorkflowStatus(str, Enum):
    """Workflow status options."""

    DRAFT = "Draft"
    IN_PRIMARY_REVIEW = "In_Primary_Review"
    IN_SECONDARY_REVIEW = "In_Secondary_Review"
    APPROVED = "Approved"
    PUBLISHED = "Published"
    REJECTED = "Rejected"


class CurationBase(BaseModel):
    """Base curation schema with common fields."""

    gene_id: str | uuid.UUID = Field(..., description="Gene ID reference")
    precuration_id: str | uuid.UUID | None = Field(
        None, description="Precuration ID reference"
    )
    mondo_id: str = Field(..., description="MONDO disease identifier")
    mode_of_inheritance: str = Field(
        ..., description="Mode of inheritance (e.g., AR, AD, XL)"
    )
    disease_name: str = Field(..., description="Human-readable disease name")
    verdict: CurationVerdict = Field(..., description="ClinGen curation verdict")
    gcep_affiliation: str = Field(
        ..., description="Gene Curation Expert Panel affiliation"
    )
    sop_version: str | None = Field(
        default="v11", description="ClinGen SOP version used"
    )
    status: WorkflowStatus | None = Field(
        default=WorkflowStatus.DRAFT, description="Workflow status"
    )
    details: dict[str, Any] | None = Field(
        default={}, description="Detailed evidence data structure"
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

    @field_validator("sop_version")
    @classmethod
    def validate_sop_version(cls, v: str | None) -> str | None:
        """Validate SOP version format."""
        if v and not v.startswith("v") and not v[1:].replace(".", "").isdigit():
            raise ValueError("SOP version must be in format v## (e.g., v11, v10.1)")
        return v


class CurationCreate(CurationBase):
    """Schema for creating a new curation."""

    pass


class CurationUpdate(BaseModel):
    """Schema for updating curation information."""

    gene_id: str | uuid.UUID | None = None
    precuration_id: str | uuid.UUID | None = None
    mondo_id: str | None = None
    mode_of_inheritance: str | None = None
    disease_name: str | None = None
    verdict: CurationVerdict | None = None
    gcep_affiliation: str | None = None
    sop_version: str | None = None
    status: WorkflowStatus | None = None
    details: dict[str, Any] | None = None
    summary_text: str | None = None

    @field_validator("mondo_id")
    @classmethod
    def validate_mondo_id(cls, v: str | None) -> str | None:
        """Validate MONDO ID format if provided."""
        if v is not None and (not v.startswith("MONDO:") or not v[6:].isdigit()):
            raise ValueError(
                "MONDO ID must be in format MONDO:#### where #### is a number"
            )
        return v

    @field_validator("sop_version")
    @classmethod
    def validate_sop_version(cls, v: str | None) -> str | None:
        """Validate SOP version format if provided."""
        if v and not v.startswith("v") and not v[1:].replace(".", "").isdigit():
            raise ValueError("SOP version must be in format v## (e.g., v11, v10.1)")
        return v


class CurationResponse(CurationBase):
    """Schema for curation responses."""

    id: str | uuid.UUID

    # ClinGen scoring fields (calculated automatically)
    genetic_evidence_score: float
    experimental_evidence_score: float
    total_score: float
    has_contradictory_evidence: bool

    # Auto-generated summary
    summary_text: str | None = None

    # Workflow metadata
    approved_at: datetime | None = None
    approved_by: str | uuid.UUID | None = None
    published_at: datetime | None = None

    # Record integrity
    record_hash: str
    previous_hash: str | None = None
    origin_node_id: str | uuid.UUID | None = None

    # Timestamps and users
    created_at: datetime
    updated_at: datetime
    created_by: str | uuid.UUID | None = None
    updated_by: str | uuid.UUID | None = None

    # Include related data
    gene: dict[str, Any] | None = None
    precuration: dict[str, Any] | None = None

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class CurationListResponse(BaseModel):
    """Schema for paginated curation list responses."""

    curations: list[CurationResponse]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool


class CurationSearchQuery(BaseModel):
    """Schema for curation search queries."""

    query: str | None = Field(
        None, description="Search term for gene symbol, disease name, or GCEP"
    )
    gene_id: str | uuid.UUID | None = Field(None, description="Filter by gene ID")
    mondo_id: str | None = Field(None, description="Filter by MONDO ID")
    verdict: CurationVerdict | None = Field(
        None, description="Filter by curation verdict"
    )
    status: WorkflowStatus | None = Field(None, description="Filter by workflow status")
    gcep_affiliation: str | None = Field(None, description="Filter by GCEP affiliation")
    min_total_score: float | None = Field(
        None, ge=0, le=18, description="Minimum total score"
    )
    max_total_score: float | None = Field(
        None, ge=0, le=18, description="Maximum total score"
    )
    has_contradictory_evidence: bool | None = Field(
        None, description="Filter by contradictory evidence"
    )
    created_by: str | uuid.UUID | None = Field(None, description="Filter by creator")
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(
        50, ge=1, le=500, description="Maximum number of records to return"
    )
    sort_by: str | None = Field("created_at", description="Field to sort by")
    sort_order: str | None = Field(
        "desc", pattern="^(asc|desc)$", description="Sort order"
    )


class CurationSummary(BaseModel):
    """Minimal curation information for lists and dropdowns."""

    id: str | uuid.UUID
    gene_id: str | uuid.UUID
    mondo_id: str
    disease_name: str
    verdict: CurationVerdict
    total_score: float
    status: WorkflowStatus
    created_at: datetime

    # Gene information
    gene_symbol: str | None = None
    gene_hgnc_id: str | None = None

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class CurationStatistics(BaseModel):
    """Curation database statistics focused on ClinGen compliance."""

    total_curations: int
    curations_by_verdict: dict[str, int]
    curations_by_status: dict[str, int]
    avg_genetic_score: float
    avg_experimental_score: float
    avg_total_score: float
    high_confidence_count: int
    contradictory_evidence_count: int
    recent_additions: int
    updated_last_week: int
    pending_approval: int
    approved_count: int
    published_count: int


class CurationWorkflowAction(BaseModel):
    """Schema for workflow actions on curations."""

    action: str = Field(..., description="Action to perform")
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


class CurationScoreSummary(BaseModel):
    """Detailed score breakdown for a curation."""

    genetic_evidence_score: float
    experimental_evidence_score: float
    total_score: float
    verdict: CurationVerdict
    has_contradictory_evidence: bool
    evidence_breakdown: dict[str, int]
    classification_rationale: str


class EvidenceEntry(BaseModel):
    """Schema for individual evidence entries in curation details."""

    pmid: str | None = Field(None, description="PubMed ID reference")
    description: str = Field(..., description="Evidence description")
    points: float = Field(..., ge=0, description="Points assigned to this evidence")
    evidence_type: str = Field(..., description="Type of evidence")

    @field_validator("pmid")
    @classmethod
    def validate_pmid(cls, v: str | None) -> str | None:
        """Validate PubMed ID format if provided."""
        if v and not v.isdigit():
            raise ValueError("PMID must be numeric")
        return v


class GeneticEvidence(BaseModel):
    """Schema for genetic evidence section in curation details."""

    case_level_data: list[EvidenceEntry] = Field(
        default=[], description="Case-level evidence (max 12 points)"
    )
    segregation_data: list[EvidenceEntry] = Field(
        default=[], description="Segregation evidence (max 3 points)"
    )
    case_control_data: list[EvidenceEntry] = Field(
        default=[], description="Case-control evidence (max 6 points)"
    )


class ExperimentalEvidence(BaseModel):
    """Schema for experimental evidence section in curation details."""

    function: list[EvidenceEntry] = Field(default=[], description="Functional evidence")
    models: list[EvidenceEntry] = Field(
        default=[], description="Model organism evidence"
    )
    rescue: list[EvidenceEntry] = Field(default=[], description="Rescue evidence")


class CurationDetails(BaseModel):
    """Complete schema for curation details JSONB field."""

    genetic_evidence: GeneticEvidence | None = None
    experimental_evidence: ExperimentalEvidence | None = None
    contradictory_evidence: list[EvidenceEntry] = Field(
        default=[],
        description="Evidence that contradicts the gene-disease relationship",
    )
    external_evidence: list[EvidenceEntry] = Field(
        default=[], description="External supporting evidence"
    )
    curation_workflow: dict[str, Any] = Field(
        default={}, description="Workflow-specific metadata"
    )
    ancillary_data: dict[str, Any] = Field(
        default={}, description="Additional data and notes"
    )
