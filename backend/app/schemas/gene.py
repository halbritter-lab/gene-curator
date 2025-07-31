"""
Gene-related Pydantic schemas.
"""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class GeneBase(BaseModel):
    """Base gene schema with common fields."""

    hgnc_id: str = Field(..., description="HGNC identifier (e.g., HGNC:1234)")
    approved_symbol: str = Field(
        ..., min_length=1, max_length=100, description="Official gene symbol"
    )
    previous_symbols: list[str] | None = Field(
        default=[], description="Previously used gene symbols"
    )
    alias_symbols: list[str] | None = Field(
        default=[], description="Alternative gene symbols"
    )
    chromosome: str | None = Field(
        None, max_length=10, description="Chromosome location"
    )
    location: str | None = Field(
        None, max_length=50, description="Chromosomal location (e.g., 17q21.31)"
    )
    gene_family: list[str] | None = Field(
        default=[], description="Gene family classifications"
    )
    current_dyadic_name: str | None = Field(
        None, max_length=255, description="ClinGen dyadic naming"
    )
    details: dict[str, Any] | None = Field(
        default={}, description="Additional gene metadata"
    )

    @field_validator("hgnc_id")
    @classmethod
    def validate_hgnc_id(cls, v: str) -> str:
        """Validate HGNC ID format."""
        if not v.startswith("HGNC:") or not v[5:].isdigit():
            raise ValueError(
                "HGNC ID must be in format HGNC:#### where #### is a number"
            )
        return v


class GeneCreate(GeneBase):
    """Schema for creating a new gene."""

    pass


class GeneUpdate(BaseModel):
    """Schema for updating gene information."""

    hgnc_id: str | None = None
    approved_symbol: str | None = Field(None, min_length=1, max_length=100)
    previous_symbols: list[str] | None = None
    alias_symbols: list[str] | None = None
    chromosome: str | None = Field(None, max_length=10)
    location: str | None = Field(None, max_length=50)
    gene_family: list[str] | None = None
    current_dyadic_name: str | None = Field(None, max_length=255)
    details: dict[str, Any] | None = None

    @field_validator("hgnc_id")
    @classmethod
    def validate_hgnc_id(cls, v: str | None) -> str | None:
        """Validate HGNC ID format if provided."""
        if v is not None and (not v.startswith("HGNC:") or not v[5:].isdigit()):
            raise ValueError(
                "HGNC ID must be in format HGNC:#### where #### is a number"
            )
        return v


class GeneResponse(GeneBase):
    """Schema for gene responses."""

    id: str | uuid.UUID
    record_hash: str
    previous_hash: str | None = None
    created_at: datetime
    updated_at: datetime
    created_by: str | uuid.UUID | None = None
    updated_by: str | uuid.UUID | None = None

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class GeneListResponse(BaseModel):
    """Schema for paginated gene list responses."""

    genes: list[GeneResponse]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool


class GeneSearchQuery(BaseModel):
    """Schema for gene search queries."""

    query: str | None = Field(
        None, description="Search term for gene symbol, name, or HGNC ID"
    )
    chromosome: str | None = Field(None, description="Filter by chromosome")
    gene_family: list[str] | None = Field(None, description="Filter by gene family")
    hgnc_id: str | None = Field(None, description="Filter by specific HGNC ID")
    created_by: str | None = Field(None, description="Filter by creator")
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(
        50, ge=1, le=500, description="Maximum number of records to return"
    )
    sort_by: str | None = Field("approved_symbol", description="Field to sort by")
    sort_order: str | None = Field(
        "asc", pattern="^(asc|desc)$", description="Sort order"
    )


class GeneSummary(BaseModel):
    """Minimal gene information for lists and dropdowns."""

    id: str | uuid.UUID
    hgnc_id: str
    approved_symbol: str
    chromosome: str | None = None
    current_dyadic_name: str | None = None

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class GeneStatistics(BaseModel):
    """Gene database statistics focused on curation-relevant metrics."""

    total_genes: int
    recent_additions: int
    updated_last_week: int
    genes_with_dyadic_names: int
    genes_ready_for_curation: int


class GeneBulkCreate(BaseModel):
    """Schema for bulk gene creation."""

    genes: list[GeneCreate] = Field(..., min_length=1, max_length=100)
    validate_hgnc: bool = Field(
        True, description="Whether to validate HGNC IDs against external API"
    )
    skip_duplicates: bool = Field(
        True, description="Whether to skip genes with existing HGNC IDs"
    )


class GeneBulkCreateResponse(BaseModel):
    """Response for bulk gene creation."""

    created_genes: list[GeneResponse]
    skipped_genes: list[dict[str, Any]]
    errors: list[dict[str, Any]]
    total_processed: int
    total_created: int
    total_skipped: int
    total_errors: int
