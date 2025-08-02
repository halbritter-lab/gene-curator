"""
Complete Gene schema with all legacy fields and ClinGen enhancements.
This comprehensive schema preserves all functionality from the original Firebase system
while adding new ClinGen compliance features.
"""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class ExpressionData(BaseModel):
    """Gene expression data from various sources."""

    descartes_kidney_tpm: float | None = Field(
        None,
        description="Transcripts Per Million in kidney tissue from Descartes dataset",
    )
    gtex_kidney_cortex: float | None = Field(
        None, description="Expression score from GTEx Kidney Cortex data"
    )
    gtex_kidney_medulla: float | None = Field(
        None, description="Expression score from GTEx Kidney Medulla data"
    )
    expression_score: float | None = Field(
        None, description="Composite score based on gene expression levels"
    )


class ConstraintMetrics(BaseModel):
    """Gene constraint and intolerance metrics."""

    pli: float | None = Field(
        None,
        alias="pLI",
        description="Probability of being loss-of-function intolerant",
    )
    lof_z: float | None = Field(None, description="Loss of function Z-score")
    mis_z: float | None = Field(None, description="Missense Z-score")
    oe_lof: float | None = Field(
        None, description="Observed vs. expected loss of function ratio"
    )


class InteractionData(BaseModel):
    """Gene interaction data from STRING-DB and other sources."""

    interaction_score: float | None = Field(
        None, description="Quantitative score representing gene interactions"
    )
    stringdb_normalized_score: float | None = Field(
        None, description="Normalized score of gene interactions from StringDB"
    )
    stringdb_sum_score: float | None = Field(
        None, description="Sum score of gene interactions from StringDB"
    )
    stringdb_interactions: list[str] | None = Field(
        default=[], description="List of gene interactions from StringDB"
    )


class ClinicalData(BaseModel):
    """Clinical and phenotype data."""

    clinical_groups: str | None = Field(
        None, description="Clinical groupings based on phenotype"
    )
    onset_groups: str | None = Field(
        None, description="Information on the onset groups for gene-related conditions"
    )
    syndromic_groups: str | None = Field(
        None, description="Information about syndromic grouping of the gene"
    )
    mgi_phenotype: list[str] | None = Field(
        default=[], description="Phenotypic information from Mouse Genome Informatics"
    )


class ExternalSummaries(BaseModel):
    """Summaries from external databases."""

    clingen_summary: str | None = Field(
        None, description="Summary information from the ClinGen database"
    )
    gencc_summary: str | None = Field(
        None, description="Summary from the GenCC database"
    )
    omim_summary: list[str] | None = Field(
        default=[], description="Summary information from OMIM database"
    )
    clinvar_data: dict[str, Any] | None = Field(
        default={},
        description="Data from ClinVar including pathogenicity classifications",
    )


class CurationTracking(BaseModel):
    """Tracking of curation activities."""

    evidence_count: int | None = Field(
        None, description="Count of evidence items associated with the gene"
    )
    source_count_percentile: float | None = Field(
        None,
        description="Percentile rank based on count of sources mentioning the gene",
    )
    has_precuration: list[str] | None = Field(
        default=[], description="Array of precuration document IDs"
    )
    has_curation: list[str] | None = Field(
        default=[], description="Array of curation document IDs"
    )
    precurated_by: list[str] | None = Field(
        default=[], description="Array of user IDs who have precurated the gene"
    )
    curated_by: list[str] | None = Field(
        default=[], description="Array of user IDs who have curated the gene"
    )


class GeneDetailsComplete(BaseModel):
    """Complete gene details structure for JSONB storage."""

    # Expression data
    expression: ExpressionData | None = None

    # Constraint metrics
    constraints: ConstraintMetrics | None = None

    # Interaction data
    interactions: InteractionData | None = None

    # Clinical data
    clinical: ClinicalData | None = None

    # External summaries
    external_summaries: ExternalSummaries | None = None

    # Curation tracking
    curation_tracking: CurationTracking | None = None

    # Custom fields for extensibility
    custom_fields: dict[str, Any] | None = Field(
        default={}, description="Custom fields for institution-specific data"
    )


class GeneComplete(BaseModel):
    """Complete gene schema with all fields."""

    # Core HGNC fields
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

    # Genomic location
    chromosome: str | None = Field(
        None, max_length=10, description="Chromosome location (1-22, X, Y, MT)"
    )
    location: str | None = Field(
        None, max_length=50, description="Chromosomal location (e.g., 17q21.31)"
    )

    # Gene type
    gene_type: str | None = Field(
        None, description="Gene type (protein_coding, lncRNA, etc.)"
    )

    # Comprehensive details in JSONB
    details: GeneDetailsComplete | None = Field(
        default_factory=GeneDetailsComplete, description="Complete gene metadata"
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

    @field_validator("chromosome")
    @classmethod
    def validate_chromosome(cls, v: str | None) -> str | None:
        """Validate chromosome format."""
        if v is not None:
            valid_chromosomes = [str(i) for i in range(1, 23)] + ["X", "Y", "MT"]
            if v not in valid_chromosomes:
                raise ValueError(
                    f"Chromosome must be one of: {', '.join(valid_chromosomes)}"
                )
        return v


class GeneCreateComplete(GeneComplete):
    """Schema for creating a complete gene with all fields."""

    pass


class GeneUpdateComplete(BaseModel):
    """Schema for updating gene information - all fields optional."""

    hgnc_id: str | None = None
    approved_symbol: str | None = Field(None, min_length=1, max_length=100)
    previous_symbols: list[str] | None = None
    alias_symbols: list[str] | None = None
    chromosome: str | None = Field(None, max_length=10)
    location: str | None = Field(None, max_length=50)
    gene_type: str | None = None
    details: GeneDetailsComplete | None = None

    @field_validator("hgnc_id")
    @classmethod
    def validate_hgnc_id(cls, v: str | None) -> str | None:
        """Validate HGNC ID format if provided."""
        if v is not None and (not v.startswith("HGNC:") or not v[5:].isdigit()):
            raise ValueError(
                "HGNC ID must be in format HGNC:#### where #### is a number"
            )
        return v

    @field_validator("chromosome")
    @classmethod
    def validate_chromosome(cls, v: str | None) -> str | None:
        """Validate chromosome format if provided."""
        if v is not None:
            valid_chromosomes = [str(i) for i in range(1, 23)] + ["X", "Y", "MT"]
            if v not in valid_chromosomes:
                raise ValueError(
                    f"Chromosome must be one of: {', '.join(valid_chromosomes)}"
                )
        return v


class GeneResponseComplete(GeneComplete):
    """Complete gene response schema with metadata."""

    id: str | uuid.UUID
    record_hash: str
    previous_hash: str | None = None

    # Metadata
    created_at: datetime
    updated_at: datetime
    created_by: str | uuid.UUID | None = None
    updated_by: str | uuid.UUID | None = None

    # Computed fields
    total_precurations: int | None = Field(
        None, description="Total number of precurations for this gene"
    )
    total_curations: int | None = Field(
        None, description="Total number of curations for this gene"
    )
    latest_activity: datetime | None = Field(
        None, description="Timestamp of latest curation activity"
    )

    class Config:
        from_attributes = True
        json_encoders = {uuid.UUID: str}


class GeneImportMapping(BaseModel):
    """Mapping for importing genes from external sources."""

    source: str = Field(..., description="Data source (e.g., HGNC, Ensembl)")
    source_version: str | None = Field(None, description="Version of source data")
    mapping_rules: dict[str, str] = Field(
        ..., description="Field mapping from source to our schema"
    )
    validation_rules: dict[str, Any] | None = Field(
        default={}, description="Additional validation rules for import"
    )


class GeneBulkImport(BaseModel):
    """Schema for bulk gene import operations."""

    genes: list[dict[str, Any]] = Field(..., min_length=1, max_length=1000)
    mapping: GeneImportMapping
    options: dict[str, Any] | None = Field(
        default={
            "validate_hgnc": True,
            "skip_duplicates": True,
            "update_existing": False,
            "create_audit_log": True,
        }
    )


class GeneAnalytics(BaseModel):
    """Analytics data about gene curation progress."""

    gene_id: str | uuid.UUID

    # Curation metrics
    precuration_count: int = 0
    curation_count: int = 0
    published_curation_count: int = 0

    # Evidence metrics
    total_evidence_entries: int = 0
    avg_evidence_score: float | None = None

    # Collaboration metrics
    unique_contributors: int = 0
    total_reviews: int = 0

    # Timeline metrics
    first_precuration_date: datetime | None = None
    latest_curation_date: datetime | None = None
    avg_curation_time_days: float | None = None

    # Quality metrics
    review_approval_rate: float | None = None
    evidence_citation_rate: float | None = None


class GeneExportOptions(BaseModel):
    """Options for gene data export."""

    include_details: bool = Field(True, description="Include full details JSONB")
    include_metadata: bool = Field(True, description="Include creation/update metadata")
    include_analytics: bool = Field(False, description="Include analytics data")
    format_type: str = Field("json", description="Export format (json, csv, xlsx)")
    filter_criteria: dict[str, Any] | None = Field(
        default={}, description="Criteria for filtering genes"
    )


# Migration helpers for backward compatibility
class LegacyGeneData(BaseModel):
    """Helper for migrating legacy gene data."""

    cur_id: str | None = None

    # Original field mappings
    approved_symbol: str
    hgnc_id: str
    clingen_summary: str | None = None
    gencc_summary: str | None = None
    omim_summary: list[str] | None = None
    clinical_groups_p: str | None = None
    onset_groups_p: str | None = None
    syndromic_groups_p: str | None = None
    evidence_count: int | None = None
    source_count_percentile: float | None = None
    clinvar: dict[str, Any] | None = None

    # Expression fields
    descartes_kidney_tpm: float | None = None
    gtex_kidney_cortex: float | None = None
    gtex_kidney_medulla: float | None = None
    expression_score: float | None = None

    # Constraint fields
    lof_z: float | None = None
    mis_z: float | None = None
    oe_lof: float | None = None
    pLI: float | None = None

    # Interaction fields
    interaction_score: float | None = None
    stringdb_interaction_normalized_score: float | None = None
    stringdb_interaction_string: list[str] | None = None
    stringdb_interaction_sum_score: float | None = None

    # Phenotype fields
    mgi_phenotype: list[str] | None = None

    # Tracking fields
    hasPrecuration: list[str] | None = None
    hasCuration: list[str] | None = None
    precuratedBy: list[str] | None = None
    curatedBy: list[str] | None = None

    # Timestamps
    createdAt: datetime | None = None
    updatedAt: datetime | None = None

    def to_complete_gene(self) -> GeneCreateComplete:
        """Convert legacy data to complete gene schema."""

        # Map expression data
        expression = ExpressionData(
            descartes_kidney_tpm=self.descartes_kidney_tpm,
            gtex_kidney_cortex=self.gtex_kidney_cortex,
            gtex_kidney_medulla=self.gtex_kidney_medulla,
            expression_score=self.expression_score,
        )

        # Map constraint metrics
        constraints = ConstraintMetrics(
            pli=self.pLI, lof_z=self.lof_z, mis_z=self.mis_z, oe_lof=self.oe_lof
        )

        # Map interaction data
        interactions = InteractionData(
            interaction_score=self.interaction_score,
            stringdb_normalized_score=self.stringdb_interaction_normalized_score,
            stringdb_sum_score=self.stringdb_interaction_sum_score,
            stringdb_interactions=self.stringdb_interaction_string or [],
        )

        # Map clinical data
        clinical = ClinicalData(
            clinical_groups=self.clinical_groups_p,
            onset_groups=self.onset_groups_p,
            syndromic_groups=self.syndromic_groups_p,
            mgi_phenotype=self.mgi_phenotype or [],
        )

        # Map external summaries
        external_summaries = ExternalSummaries(
            clingen_summary=self.clingen_summary,
            gencc_summary=self.gencc_summary,
            omim_summary=self.omim_summary or [],
            clinvar_data=self.clinvar or {},
        )

        # Map curation tracking
        curation_tracking = CurationTracking(
            evidence_count=self.evidence_count,
            source_count_percentile=self.source_count_percentile,
            has_precuration=self.hasPrecuration or [],
            has_curation=self.hasCuration or [],
            precurated_by=self.precuratedBy or [],
            curated_by=self.curatedBy or [],
        )

        # Create complete details
        details = GeneDetailsComplete(
            expression=expression,
            constraints=constraints,
            interactions=interactions,
            clinical=clinical,
            external_summaries=external_summaries,
            curation_tracking=curation_tracking,
            custom_fields={"cur_id": self.cur_id} if self.cur_id else {},
        )

        return GeneCreateComplete(
            hgnc_id=self.hgnc_id, approved_symbol=self.approved_symbol, details=details
        )


# Validation functions
def validate_gene_completeness(gene: GeneComplete) -> dict[str, bool]:
    """Validate completeness of gene data for curation readiness."""

    completeness = {
        "has_basic_info": bool(gene.hgnc_id and gene.approved_symbol),
        "has_location": bool(gene.chromosome and gene.location),
        "has_external_summaries": False,
        "has_expression_data": False,
        "has_constraint_data": False,
        "has_phenotype_data": False,
        "ready_for_curation": False,
    }

    if gene.details:
        if gene.details.external_summaries:
            completeness["has_external_summaries"] = bool(
                gene.details.external_summaries.clingen_summary
                or gene.details.external_summaries.gencc_summary
                or gene.details.external_summaries.omim_summary
            )

        if gene.details.expression:
            completeness["has_expression_data"] = bool(
                gene.details.expression.expression_score is not None
                or gene.details.expression.gtex_kidney_cortex is not None
            )

        if gene.details.constraints:
            completeness["has_constraint_data"] = bool(
                gene.details.constraints.pli is not None
                or gene.details.constraints.lof_z is not None
            )

        if gene.details.clinical:
            completeness["has_phenotype_data"] = bool(
                gene.details.clinical.mgi_phenotype
                or gene.details.clinical.clinical_groups
            )

    # Gene is ready for curation if it has basic info and at least some supporting data
    completeness["ready_for_curation"] = (
        completeness["has_basic_info"]
        and completeness["has_location"]
        and (
            completeness["has_external_summaries"]
            or completeness["has_constraint_data"]
            or completeness["has_phenotype_data"]
        )
    )

    return completeness
