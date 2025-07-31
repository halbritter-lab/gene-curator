# Gene Curator Refactoring Plan - ClinGen Compliant Edition

## Executive Summary

**Project Directive**: Refactor Gene Curator from a monolithic Firebase architecture to a modern, containerized three-tier architecture with PostgreSQL, FastAPI, and Vue 3/Vite, with **native ClinGen Standard Operating Procedure (SOP v11) compliance**.

**Strategic Enhancement**: 
1. **ClinGen Compliance**: Implement data structures and business logic that directly mirror the ClinGen Gene-Disease Validity SOP v11 and Evidence Summary Template v5.1
2. **Decentralized Collaboration**: Future-proof the application with foundational data structures for verifiable, attributable, and replicable scientific curation data

**Key Innovation**: The database schema and business logic become active participants in enforcing ClinGen curation standards, automatically calculating evidence scores and generating compliant summary texts.

**Risk Level**: Medium-High (due to data migration complexity)
**Rollback Strategy**: Maintain Firebase version until full validation complete

## ClinGen Integration Principles

**Schema Mirrors the SOP**: Database structure directly reflects evidence matrices from SOP v11. Core metrics (scores, verdicts) are relational columns; detailed evidence stored in structured JSONB fields.

**Backend Enforces Business Logic**: FastAPI backend implements all ClinGen scoring calculations and evidence summary generation. Frontend collects data; backend ensures compliance.

**Data as Source of Truth**: Evidence Summary Text programmatically generated from structured data, ensuring consistency and automatic updates when evidence changes.

**Standards Compliance**: Native support for ClinGen nomenclature guidelines, evidence categories, scoring rules, and reporting templates.

## Decentralization-Ready Architecture Principles

**Immutable Data Primitives**: Every curation and precuration record is treated as an immutable event. Updates create new, versioned records that link to predecessors, establishing a verifiable chain of custody.

**Verifiable Provenance**: Every record is cryptographically verifiable (content integrity) and attributable to its origin (creator, institution, timestamp), enabling trust in distributed scientific collaboration.

**Content Addressing**: All records are content-addressable through SHA-256 hashes, making data tamper-evident and enabling efficient synchronization between distributed instances.

**Event Sourcing Foundation**: An append-only change log captures all data modifications, providing the foundation for peer-to-peer synchronization and distributed consensus mechanisms.

## Current Architecture Analysis

### Technical Debt Assessment
- **Monolithic coupling**: Frontend directly coupled to Firebase
- **Limited query capabilities**: Firestore lacks complex relational queries
- **No API layer**: Direct database access from frontend
- **Build system obsolescence**: Vue CLI being deprecated
- **State management**: Ad-hoc stores instead of centralized state
- **Testing gaps**: No comprehensive testing strategy
- **Deployment constraints**: Limited to GitHub Pages
- **ClinGen compliance gaps**: Manual scoring and summary generation

### Complexity Hotspots
- Configuration-driven workflow system (`src/config/workflows/`)
- User authentication and role management
- CSV import/export functionality
- Multi-stage curation workflow (gene → precuration → curation)
- Dynamic form rendering based on field configurations
- **NEW**: ClinGen evidence scoring and summary generation

## Target Architecture

### Technology Stack
| Layer | Current | Target | Rationale |
|-------|---------|---------|-----------|
| Database | Firestore | PostgreSQL 15+ | ACID compliance, complex queries, data integrity, ClinGen schema support |
| Backend | Firebase Functions | FastAPI + SQLAlchemy | Type safety, performance, API-first design, ClinGen business logic |
| Frontend | Vue 3 + Vue CLI | Vue 3 + Vite + Pinia | Modern build tools, proper state management, ClinGen form components |
| Auth | Firebase Auth | JWT + FastAPI Security | Better control, standards compliance |
| Deployment | GitHub Pages | Docker + Docker Compose | Environment consistency, scalability |
| **Standards** | **Manual** | **Automated ClinGen SOP** | **Evidence scoring, summary generation, nomenclature validation** |

---

## PHASE 0: FOUNDATION & ARCHITECTURAL BLUEPRINT (ClinGen-Enhanced)

### Step 0.1: Environment Preparation & Risk Mitigation

**Objective**: Establish development environment and backup strategies before any changes.

**Prerequisites**:
- [ ] Full Firebase database backup (automated export)
- [ ] Git branch strategy (`main` → `refactor-v2-clingen` → feature branches)
- [ ] Development environment setup (Docker, Python 3.11+, Node 18+)
- [ ] ClinGen training materials analysis (completed ✅)

**Key Actions**:
1. **Create backup strategy**:
   ```bash
   # Firebase backup script
   firebase firestore:export gs://bucket-name/backup-$(date +%Y%m%d_%H%M%S)
   ```

2. **Initialize new repository structure**:
   ```
   gene-curator-v2/
   ├── backend/
   │   ├── app/
   │   │   ├── api/v1/
   │   │   ├── core/
   │   │   │   ├── scoring.py          # ClinGen evidence scoring engine
   │   │   │   ├── summary_generator.py # Evidence summary generation
   │   │   │   ├── nomenclature.py     # ClinGen naming validation
   │   │   │   └── clingen/            # ClinGen-specific modules
   │   │   ├── crud/
   │   │   ├── models/
   │   │   ├── schemas/
   │   │   │   ├── clingen/            # ClinGen evidence schemas
   │   │   │   └── ...
   │   │   └── main.py
   │   ├── alembic/
   │   ├── scripts/
   │   ├── tests/
   │   │   ├── test_clingen_scoring.py
   │   │   └── test_summary_generation.py
   │   └── pyproject.toml
   │   └── clingen_reference/          # ClinGen SOP reference materials
   ├── frontend/
   │   ├── src/
   │   │   ├── api/
   │   │   ├── components/
   │   │   │   ├── clingen/            # ClinGen-specific components
   │   │   │   │   ├── EvidenceForm.vue
   │   │   │   │   ├── ScoreDisplay.vue
   │   │   │   │   └── SummaryViewer.vue
   │   │   │   └── ...
   │   │   ├── stores/
   │   │   ├── views/
   │   │   └── main.ts
   │   ├── public/
   │   └── package.json
   ├── docker-compose.yml
   ├── docker-compose.dev.yml
   └── README.md
   ```

**Outputs**:
- [ ] Complete Firebase data export
- [ ] New project structure initialized with ClinGen modules
- [ ] Development environment documented
- [ ] ClinGen reference materials integrated

---

### Step 0.2: Database Schema Design (ClinGen-Compliant)

**Objective**: Design hybrid PostgreSQL schema that directly implements ClinGen SOP v11 requirements.

**ClinGen Research Integration**:
- [x] ClinGen SOP v11 evidence categories analyzed
- [x] Evidence Summary Template v5.1 structure documented
- [x] Disease naming guidance (v1.1) requirements captured
- [x] Scoring matrix rules and point allocations mapped

**Enhanced Schema Design**:

```sql
-- Native ENUM types for ClinGen data integrity
CREATE TYPE user_role AS ENUM ('viewer', 'curator', 'admin');
CREATE TYPE precuration_decision AS ENUM ('Lump', 'Split', 'Undecided');
CREATE TYPE curation_verdict AS ENUM (
    'Definitive', 
    'Strong', 
    'Moderate', 
    'Limited', 
    'No Known Disease Relationship', 
    'Disputed', 
    'Refuted'
);

-- Core Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE genes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hgnc_id VARCHAR(50) UNIQUE NOT NULL,
    approved_symbol VARCHAR(100) NOT NULL,
    -- ClinGen dyadic naming support
    current_dyadic_name VARCHAR(255),
    -- Other core gene identifiers
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE curations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    mondo_id VARCHAR(50) NOT NULL,
    mode_of_inheritance TEXT NOT NULL, -- Core to ClinGen entity definition
    
    -- ** CORE CLINGEN METRICS & STATUS **
    verdict curation_verdict NOT NULL,
    genetic_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    experimental_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    total_score NUMERIC(4, 2) GENERATED ALWAYS AS (genetic_evidence_score + experimental_evidence_score) STORED,
    has_contradictory_evidence BOOLEAN NOT NULL DEFAULT false,
    is_lumped_split BOOLEAN NOT NULL DEFAULT false,
    
    -- ** CLINGEN SUMMARY & PROVENANCE **
    summary_text TEXT, -- Auto-generated from Evidence Summary Template
    gcep_affiliation TEXT NOT NULL, -- e.g., "Cardiovascular GCEP"
    approved_at TIMESTAMPTZ,
    sop_version VARCHAR(10) NOT NULL DEFAULT 'v11', -- Track SOP version used
    
    -- ** DECENTRALIZATION & VERIFIABILITY FIELDS **
    record_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64), -- FK to curations(record_hash), enables chaining
    origin_node_id UUID,
    
    -- ** DETAILED EVIDENCE STORE (CORE OF CURATION) **
    details JSONB NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN curations.details IS 'Enhanced ClinGen + provenance tracking schema. Stores SOP v11 evidence, external sources, complete provenance, and professional workflow data. Schema enforced by Pydantic models.';

CREATE TABLE change_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'gene', 'curation'
    entity_id UUID NOT NULL,
    operation TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'APPROVE'
    record_hash VARCHAR(64) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ClinGen-specific queries
CREATE INDEX idx_curations_verdict ON curations(verdict);
CREATE INDEX idx_curations_scores ON curations(genetic_evidence_score, experimental_evidence_score);
CREATE INDEX idx_curations_gcep ON curations(gcep_affiliation);
CREATE INDEX idx_curations_evidence_gin ON curations USING GIN (details);

-- Enhanced indexes for merged schema queries
CREATE INDEX idx_curations_external_evidence ON curations USING GIN ((details->'external_evidence'));
CREATE INDEX idx_curations_ancillary_data ON curations USING GIN ((details->'ancillary_data'));
CREATE INDEX idx_curations_workflow_status ON curations USING GIN ((details->'curation_workflow'->'status'));
CREATE INDEX idx_curations_workflow_flags ON curations USING GIN ((details->'curation_workflow'->'flags'));
CREATE INDEX idx_curations_provenance_sources ON curations USING GIN ((details->'ancillary_data'->'constraint_metrics'));
CREATE INDEX idx_curations_submission_tracking ON curations USING GIN ((details->'curation_workflow'->'submission_tracking'));
```

**Structure of curations.details JSONB (Enhanced ClinGen + Provenance Tracking)**:

```json
{
  "lumping_splitting_details": "Free text explaining the decision, per the template.",
  "variant_spectrum_summary": "e.g., 'Over 50 missense, 10 frameshift, and 5 large deletions...'",
  "disease_mechanism": "e.g., 'loss of function', 'gain of function', 'dominant negative'",
  
  "genetic_evidence": {
    "case_level_data": [
      {
        "pmid": "12345678",
        "proband_label": "Smith et al, Proband 1",
        "hpo_terms": ["HP:0001250", "HP:0000505"],
        "variant_type": "Predicted or Proven Null",
        "is_de_novo": true,
        "functional_impact_evidence": "Western blot showed no protein product.",
        "points": 2.0,
        "rationale": "De novo null variant in a highly constrained gene."
      }
    ],
    "segregation_data": [
      {
        "pmid": "87654321",
        "family_label": "Jones et al, Family A",
        "sequencing_method": "Exome/genome",
        "lod_score_published": 3.2,
        "points": 2.0
      }
    ],
    "case_control_data": [
      {
        "pmid": "11223344",
        "study_type": "Aggregate",
        "odds_ratio": 4.9,
        "confidence_interval": "1.4-17.7",
        "p_value": 0.015,
        "points": 2.0,
        "rationale": "Controls from population database, potential for bias."
      }
    ]
  },

  "experimental_evidence": {
    "function": [
      { "type": "Biochemical Function", "pmid": "...", "description": "...", "points": 0.5 },
      { "type": "Protein Interaction", "pmid": "...", "description": "...", "points": 0.5 }
    ],
    "models": [
      { "type": "Non-human model organism", "pmid": "...", "description": "Zebrafish model recapitulated cardiac defects.", "points": 2.0 }
    ],
    "rescue": [
      { "type": "Rescue in human", "pmid": "...", "description": "Enzyme replacement therapy showed clinical improvement.", "points": 2.0 }
    ]
  },

  "contradictory_evidence": [
    { "pmid": "...", "description": "A case-control study (Author et al.) failed to replicate the association...", "category": "Case-control" }
  ],

  "external_evidence": [
    {
      "source_name": "PanelApp UK",
      "source_id": "Panel_137",
      "source_version": "v1.3",
      "date_accessed": "2024-07-31",
      "classification": "Green",
      "submitted_disease": "Polycystic kidney disease",
      "confidence_level": "Expert_Reviewed",
      "additional_metadata": {
        "panel_name": "Cystic kidney disease",
        "evidence_level": "Expert Review Green"
      }
    },
    {
      "source_name": "Blueprint Genetics",
      "source_id": "Panel_KidneyDisease",
      "source_version": "2024-Q2",
      "date_accessed": "2024-07-31",
      "classification": "Included",
      "submitted_disease": "Kidney disease panel",
      "confidence_level": "Commercial_Panel",
      "additional_metadata": {
        "panel_type": "Comprehensive",
        "clinical_indication": "Suspected kidney disease"
      }
    }
  ],

  "ancillary_data": {
    "constraint_metrics": [
      {
        "source": "gnomAD",
        "version": "v2.1.1",
        "date_accessed": "2024-07-31",
        "pLI": 0.999,
        "oe_lof": 0.04,
        "lof_z": 3.2,
        "mis_z": 1.8
      }
    ],
    "expression_data": [
      {
        "source": "GTEx",
        "version": "v8",
        "date_accessed": "2024-07-31",
        "measurements": [
          {"tissue": "Kidney - Cortex", "value": 45.2, "unit": "TPM", "sample_size": 73},
          {"tissue": "Kidney - Medulla", "value": 38.7, "unit": "TPM", "sample_size": 4}
        ]
      }
    ],
    "interaction_data": [
      {
        "source": "STRING-DB",
        "version": "v11.5",
        "date_accessed": "2024-07-31",
        "interaction_score": 0.85,
        "interaction_partners": ["PKD2", "TSC1", "TSC2"],
        "combined_score": 950
      }
    ],
    "clinical_annotations": [
      {
        "source": "ClinVar",
        "version": "2024-07",
        "date_accessed": "2024-07-31",
        "pathogenic_variants": 156,
        "benign_variants": 23,
        "vus_variants": 45
      },
      {
        "source": "OMIM",
        "version": "2024-07-31",
        "date_accessed": "2024-07-31",
        "mim_number": "601313",
        "phenotype_summary": "Polycystic kidney disease 1"
      }
    ]
  },

  "curation_workflow": {
    "status": "In_Primary_Review",
    "clingen_compliance_status": "Validated",
    "primary_curator": "curator1@institution.edu",
    "secondary_curator": "senior_curator@institution.edu",
    "created_at": "2024-07-31T10:00:00Z",
    "last_modified": "2024-07-31T14:30:00Z",
    "review_log": [
      {
        "timestamp": "2024-07-31T10:00:00Z",
        "user_email": "system@gene-curator.org",
        "action": "curation_created",
        "comment": "Automated curation created from ClinGen evidence",
        "changes_made": {
          "genetic_evidence_score": 12.0,
          "experimental_evidence_score": 4.0,
          "verdict": "Definitive"
        }
      },
      {
        "timestamp": "2024-07-31T14:30:00Z",
        "user_email": "curator1@institution.edu",
        "action": "status_change",
        "previous_status": "Automated",
        "new_status": "In_Primary_Review",
        "comment": "Assigned for review. Evidence comprehensive, external sources added.",
        "changes_made": {
          "external_evidence": "Added PanelApp and Blueprint Genetics evidence",
          "ancillary_data": "Enhanced with provenance tracking"
        }
      }
    ],
    "flags": {
      "conflicting_evidence": false,
      "insufficient_evidence": false,
      "clingen_compliant": true,
      "ready_for_gencc_submission": true,
      "requires_expert_review": false
    },
    "submission_tracking": {
      "gencc_submitted": false,
      "gencc_submission_date": null,
      "clingen_panel_review": "Pending",
      "publication_ready": true
    }
  }
}
```

---

### Step 0.3: API Contract Definition (ClinGen-Aware)

**Objective**: Define FastAPI schemas that enforce ClinGen SOP structure and enable automatic scoring.

**Enhanced Pydantic Models (ClinGen + Provenance + Workflow)**:

```python
# ClinGen Evidence Models (Core functionality preserved)
class CaseLevelEvidence(BaseModel):
    pmid: str
    proband_label: str
    hpo_terms: List[str]
    variant_type: ClinGenVariantType
    is_de_novo: bool
    functional_impact_evidence: Optional[str]
    points: float = Field(ge=0, le=2.0)
    rationale: str

class ExperimentalEvidence(BaseModel):
    type: ClinGenExperimentalType
    pmid: str
    description: str
    points: float = Field(ge=0, le=2.0)

# External Evidence for Plugin Architecture
class ExternalEvidenceItem(BaseModel):
    source_name: str = Field(..., description="PanelApp UK, Blueprint Genetics, Literature, etc.")
    source_id: str = Field(..., description="Panel ID, PMID, DOI, etc.")
    source_version: str
    date_accessed: str = Field(..., description="ISO date when data was accessed")
    classification: str = Field(..., description="Green, Included, Pathogenic, etc.")
    submitted_disease: str
    confidence_level: str
    additional_metadata: Dict[str, Any] = {}

# Provenance Tracking for Scientific Rigor
class ProvenanceDataPoint(BaseModel):
    source: str
    version: str
    date_accessed: str
    
class ConstraintMetrics(ProvenanceDataPoint):
    pLI: Optional[float] = None
    oe_lof: Optional[float] = None
    lof_z: Optional[float] = None
    mis_z: Optional[float] = None

class ExpressionMeasurement(BaseModel):
    tissue: str
    value: float
    unit: str = "TPM"
    sample_size: Optional[int] = None

class ExpressionData(ProvenanceDataPoint):
    measurements: List[ExpressionMeasurement]

class InteractionData(ProvenanceDataPoint):
    interaction_score: float
    interaction_partners: List[str]
    combined_score: Optional[int] = None

class ClinicalAnnotation(ProvenanceDataPoint):
    annotation_type: str = Field(..., description="ClinVar, OMIM, GenCC, etc.")
    data: Dict[str, Any]

# Professional Curation Workflow
class CurationWorkflowLog(BaseModel):
    timestamp: str
    user_email: str
    action: str
    comment: str
    changes_made: Dict[str, Any]
    previous_status: Optional[str] = None
    new_status: Optional[str] = None

class CurationWorkflow(BaseModel):
    status: str = Field(..., description="Automated | In_Primary_Review | In_Secondary_Review | Approved")
    clingen_compliance_status: str = "Validated"
    primary_curator: Optional[str] = None
    secondary_curator: Optional[str] = None
    created_at: str
    last_modified: str
    review_log: List[CurationWorkflowLog]
    flags: Dict[str, bool] = Field(default_factory=lambda: {
        "conflicting_evidence": False,
        "insufficient_evidence": False,
        "clingen_compliant": True,
        "ready_for_gencc_submission": False,
        "requires_expert_review": False
    })
    submission_tracking: Dict[str, Any] = Field(default_factory=dict)

class AncillaryData(BaseModel):
    constraint_metrics: List[ConstraintMetrics] = []
    expression_data: List[ExpressionData] = []
    interaction_data: List[InteractionData] = []
    clinical_annotations: List[ClinicalAnnotation] = []

# Complete Enhanced Curation Model
class CurationCreate(BaseModel):
    gene_id: UUID
    mondo_id: str
    mode_of_inheritance: str
    gcep_affiliation: str
    
    # Core ClinGen Evidence (required)
    genetic_evidence: GeneticEvidenceData
    experimental_evidence: ExperimentalEvidenceData
    contradictory_evidence: List[ContradictoryEvidence] = []
    
    # Core Metadata (required)
    lumping_splitting_details: Optional[str] = None
    variant_spectrum_summary: str
    disease_mechanism: str
    
    # Enhanced Features (now integral to the system)
    external_evidence: List[ExternalEvidenceItem] = []
    ancillary_data: AncillaryData = Field(default_factory=AncillaryData)
    curation_workflow: CurationWorkflow

class CurationResponse(BaseModel):
    id: UUID
    gene_id: UUID
    mondo_id: str
    mode_of_inheritance: str
    gcep_affiliation: str
    
    # Core ClinGen Evidence
    genetic_evidence: GeneticEvidenceData
    experimental_evidence: ExperimentalEvidenceData
    contradictory_evidence: List[ContradictoryEvidence]
    
    # Core Metadata
    lumping_splitting_details: Optional[str]
    variant_spectrum_summary: str
    disease_mechanism: str
    
    # Enhanced Features
    external_evidence: List[ExternalEvidenceItem]
    ancillary_data: AncillaryData
    curation_workflow: CurationWorkflow
    
    # Auto-calculated ClinGen scores
    genetic_evidence_score: float
    experimental_evidence_score: float
    total_score: float
    verdict: CurationVerdict
    summary_text: str  # Auto-generated from template
    
    # System fields
    record_hash: str
    created_at: datetime
    updated_at: datetime
```

### Enhanced API Endpoints (Clean Architecture)

**Objective**: Implement comprehensive curation API with ClinGen compliance, provenance tracking, and professional workflow.

**Core API Endpoints**:

```python
# Standard curation endpoints with full enhanced features
@router.get("/curations/{curation_id}")
async def get_curation(
    curation_id: UUID, 
    db: Session = Depends(get_db)
) -> CurationResponse:
    """Get complete curation data with all enhanced features"""
    curation = get_curation_by_id(db, curation_id)
    return CurationResponse.from_orm(curation)

@router.post("/curations/")
async def create_curation(
    curation_data: CurationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CurationResponse:
    """
    Create new curation with:
    - Automatic ClinGen SOP v11 scoring
    - Complete provenance tracking
    - Professional workflow initialization
    - External evidence integration
    """
    
    # 1. Apply ClinGen scoring engine
    scoring_engine = ClinGenScoringEngine()
    genetic_score = scoring_engine.calculate_genetic_evidence_score(curation_data.genetic_evidence)
    experimental_score = scoring_engine.calculate_experimental_evidence_score(curation_data.experimental_evidence)
    verdict = scoring_engine.determine_verdict(
        genetic_score, 
        experimental_score, 
        bool(curation_data.contradictory_evidence)
    )
    
    # 2. Generate evidence summary
    summary_generator = EvidenceSummaryGenerator()
    summary_text = summary_generator.generate_summary(curation_data, verdict)
    
    # 3. Initialize workflow with first log entry
    if not curation_data.curation_workflow:
        curation_data.curation_workflow = CurationWorkflow(
            status="Automated",
            clingen_compliance_status="Validated",
            created_at=datetime.utcnow().isoformat(),
            last_modified=datetime.utcnow().isoformat(),
            review_log=[
                CurationWorkflowLog(
                    timestamp=datetime.utcnow().isoformat(),
                    user_email=current_user.email,
                    action="curation_created",
                    comment="Automated curation with ClinGen scoring and enhanced features",
                    changes_made={
                        "genetic_evidence_score": genetic_score,
                        "experimental_evidence_score": experimental_score,
                        "verdict": verdict.value,
                        "external_sources": len(curation_data.external_evidence),
                        "provenance_complete": bool(curation_data.ancillary_data.constraint_metrics)
                    }
                )
            ]
        )
    
    # 4. Create database record
    db_curation = CurationModel(
        gene_id=curation_data.gene_id,
        mondo_id=curation_data.mondo_id,
        mode_of_inheritance=curation_data.mode_of_inheritance,
        gcep_affiliation=curation_data.gcep_affiliation,
        genetic_evidence_score=genetic_score,
        experimental_evidence_score=experimental_score,
        verdict=verdict,
        summary_text=summary_text,
        details=curation_data.dict(exclude={'gene_id', 'mondo_id', 'mode_of_inheritance', 'gcep_affiliation'}),
        record_hash=generate_content_hash(curation_data)
    )
    
    db.add(db_curation)
    db.commit()
    db.refresh(db_curation)
    
    return CurationResponse.from_orm(db_curation)

@router.put("/curations/{curation_id}")
async def update_curation(
    curation_id: UUID,
    curation_update: CurationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CurationResponse:
    """
    Update curation with workflow tracking
    - Automatic re-scoring if evidence changed
    - Workflow log entry for all changes
    - Provenance update tracking
    """
    
    existing_curation = get_curation_by_id(db, curation_id)
    
    # Track what changed for workflow log
    changes_made = {}
    
    # Re-score if evidence changed
    scoring_engine = ClinGenScoringEngine()
    new_genetic_score = scoring_engine.calculate_genetic_evidence_score(curation_update.genetic_evidence)
    new_experimental_score = scoring_engine.calculate_experimental_evidence_score(curation_update.experimental_evidence)
    new_verdict = scoring_engine.determine_verdict(
        new_genetic_score, 
        new_experimental_score, 
        bool(curation_update.contradictory_evidence)
    )
    
    if new_genetic_score != existing_curation.genetic_evidence_score:
        changes_made["genetic_evidence_score"] = f"{existing_curation.genetic_evidence_score} → {new_genetic_score}"
    if new_experimental_score != existing_curation.experimental_evidence_score:
        changes_made["experimental_evidence_score"] = f"{existing_curation.experimental_evidence_score} → {new_experimental_score}"
    if new_verdict != existing_curation.verdict:
        changes_made["verdict"] = f"{existing_curation.verdict} → {new_verdict}"
    
    # Add workflow log entry
    workflow_log = CurationWorkflowLog(
        timestamp=datetime.utcnow().isoformat(),
        user_email=current_user.email,
        action="curation_updated",
        comment="Curation updated with re-scoring",
        changes_made=changes_made
    )
    curation_update.curation_workflow.review_log.append(workflow_log)
    curation_update.curation_workflow.last_modified = datetime.utcnow().isoformat()
    
    # Update database record
    for field, value in curation_update.dict().items():
        if hasattr(existing_curation, field):
            setattr(existing_curation, field, value)
    
    existing_curation.genetic_evidence_score = new_genetic_score
    existing_curation.experimental_evidence_score = new_experimental_score
    existing_curation.verdict = new_verdict
    existing_curation.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(existing_curation)
    
    return CurationResponse.from_orm(existing_curation)

@router.get("/curations/search")
async def search_curations(
    # ClinGen filters
    verdict: Optional[CurationVerdict] = None,
    min_score: Optional[float] = None,
    gcep_affiliation: Optional[str] = None,
    
    # Enhanced filters
    workflow_status: Optional[str] = None,
    has_external_evidence: Optional[bool] = None,
    source_name: Optional[str] = None,
    curator_email: Optional[str] = None,
    provenance_complete: Optional[bool] = None,
    
    # Pagination
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    
    db: Session = Depends(get_db)
):
    """Enhanced search with provenance and workflow filtering"""
    
    query = db.query(CurationModel)
    
    # ClinGen filters
    if verdict:
        query = query.filter(CurationModel.verdict == verdict)
    if min_score:
        query = query.filter(CurationModel.total_score >= min_score)
    if gcep_affiliation:
        query = query.filter(CurationModel.gcep_affiliation == gcep_affiliation)
    
    # Enhanced JSONB filters
    if workflow_status:
        query = query.filter(CurationModel.details['curation_workflow']['status'].astext == workflow_status)
    if has_external_evidence is not None:
        if has_external_evidence:
            query = query.filter(func.jsonb_array_length(CurationModel.details['external_evidence']) > 0)
        else:
            query = query.filter(func.jsonb_array_length(CurationModel.details['external_evidence']) == 0)
    if source_name:
        query = query.filter(
            CurationModel.details['external_evidence'].op('@>')([{"source_name": source_name}])
        )
    if curator_email:
        query = query.filter(
            CurationModel.details['curation_workflow']['primary_curator'].astext == curator_email
        )
    if provenance_complete is not None:
        query = query.filter(
            CurationModel.details['curation_workflow']['flags']['provenance_complete'].astext.cast(Boolean) == provenance_complete
        )
    
    # Execute with pagination
    curations = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {
        "curations": [CurationResponse.from_orm(c) for c in curations],
        "total": total,
        "skip": skip,
        "limit": limit
    }

# Workflow management endpoints
@router.post("/curations/{curation_id}/workflow/advance")
async def advance_curation_workflow(
    curation_id: UUID,
    action: str,
    comment: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Advance curation through workflow stages with logging"""
    
    curation = get_curation_by_id(db, curation_id)
    workflow = CurationWorkflow.parse_obj(curation.details['curation_workflow'])
    
    # Define valid transitions
    valid_transitions = {
        "Automated": ["In_Primary_Review", "Approved"],
        "In_Primary_Review": ["In_Secondary_Review", "Approved", "Rejected"],
        "In_Secondary_Review": ["Approved", "Rejected", "In_Primary_Review"],
        "Approved": ["In_Primary_Review"],  # Allow re-review
        "Rejected": ["In_Primary_Review"]
    }
    
    if action not in valid_transitions.get(workflow.status, []):
        raise HTTPException(status_code=400, detail=f"Invalid transition from {workflow.status} to {action}")
    
    # Add workflow log
    workflow_log = CurationWorkflowLog(
        timestamp=datetime.utcnow().isoformat(),
        user_email=current_user.email,
        action="status_change",
        previous_status=workflow.status,
        new_status=action,
        comment=comment,
        changes_made={"workflow_status": f"{workflow.status} → {action}"}
    )
    
    workflow.status = action
    workflow.review_log.append(workflow_log)
    workflow.last_modified = datetime.utcnow().isoformat()
    
    # Update curator assignments
    if action == "In_Primary_Review" and not workflow.primary_curator:
        workflow.primary_curator = current_user.email
    elif action == "In_Secondary_Review" and not workflow.secondary_curator:
        workflow.secondary_curator = current_user.email
    
    # Update database
    curation.details['curation_workflow'] = workflow.dict()
    db.commit()
    
    return {"status": "success", "new_status": action}
```

**Key Features**:

1. **Clean Architecture**: No backward compatibility complexity
2. **Full ClinGen Compliance**: Automatic scoring and validation
3. **Complete Provenance**: Every data point tracked with source and date
4. **Professional Workflow**: Multi-stage review with audit trail
5. **Enhanced Querying**: Rich filtering capabilities for complex searches

---

## PHASE 1: BACKEND IMPLEMENTATION (ClinGen-Enhanced)

### Step 1.1: Core Infrastructure Setup

**Standard FastAPI setup with ClinGen-specific additions**:
- SQLAlchemy models matching the enhanced schema
- Alembic migrations with ClinGen-specific indexes
- Authentication and authorization
- **NEW**: ClinGen scoring engine initialization
- **NEW**: Evidence summary template system

### Step 1.2: ClinGen Business Logic Engine

**Objective**: Implement the core ClinGen SOP compliance engine that transforms raw evidence into scored, compliant curations.

**Key Modules**:

1. **Scoring Engine** (`backend/app/core/clingen/scoring.py`):
```python
class ClinGenScoringEngine:
    """Implements ClinGen SOP v11 scoring rules"""
    
    def calculate_genetic_evidence_score(self, evidence: GeneticEvidenceData) -> float:
        """Apply SOP v11 genetic evidence scoring matrix"""
        total_score = 0.0
        
        # Case-level data scoring (max 12 points)
        case_score = sum(item.points for item in evidence.case_level_data)
        total_score += min(case_score, 12.0)
        
        # Segregation data scoring (max 3 points)
        seg_score = sum(item.points for item in evidence.segregation_data)
        total_score += min(seg_score, 3.0)
        
        # Case-control data scoring (max 6 points)
        cc_score = sum(item.points for item in evidence.case_control_data)
        total_score += min(cc_score, 6.0)
        
        return min(total_score, 12.0)  # Overall genetic evidence max
    
    def determine_verdict(self, genetic_score: float, experimental_score: float, 
                         has_contradictory: bool) -> CurationVerdict:
        """Apply SOP v11 classification rules"""
        total = genetic_score + experimental_score
        
        if has_contradictory:
            return CurationVerdict.DISPUTED
        
        if total >= 12.0:
            return CurationVerdict.DEFINITIVE
        elif total >= 7.0:
            return CurationVerdict.STRONG
        elif total >= 3.0:
            return CurationVerdict.MODERATE
        elif total >= 1.0:
            return CurationVerdict.LIMITED
        else:
            return CurationVerdict.NO_KNOWN_DISEASE_RELATIONSHIP
```

2. **Summary Generator** (`backend/app/core/clingen/summary_generator.py`):
```python
class EvidenceSummaryGenerator:
    """Generates ClinGen-compliant evidence summaries per Template v5.1"""
    
    def generate_summary(self, curation: CurationData) -> str:
        """Generate complete evidence summary text"""
        sections = [
            self._generate_general_description(curation),
            self._generate_evidence_description(curation),
            self._generate_summary_statement(curation)
        ]
        return "\n\n".join(sections)
    
    def _generate_summary_statement(self, curation: CurationData) -> str:
        """Generate verdict-specific summary statement"""
        templates = {
            CurationVerdict.DEFINITIVE: 
                "In summary, there is definitive evidence to support the relationship between {gene} and {disease}. This has been repeatedly demonstrated in both the research and clinical diagnostic settings and has been upheld over time.",
            # ... other templates
        }
        return templates[curation.verdict].format(
            gene=curation.gene_symbol,
            disease=curation.disease_name
        )
```

### Step 1.3: Enhanced CRUD Operations

**Objective**: Implement CRUD operations that automatically apply ClinGen business logic.

**Key Enhancement**:
```python
async def create_curation(curation_data: CurationCreate, db: Session) -> CurationResponse:
    """Create curation with automatic ClinGen compliance"""
    
    # 1. Score the evidence using ClinGen engine
    scoring_engine = ClinGenScoringEngine()
    genetic_score = scoring_engine.calculate_genetic_evidence_score(curation_data.genetic_evidence)
    experimental_score = scoring_engine.calculate_experimental_evidence_score(curation_data.experimental_evidence)
    
    # 2. Determine verdict based on scores
    verdict = scoring_engine.determine_verdict(
        genetic_score, 
        experimental_score, 
        bool(curation_data.contradictory_evidence)
    )
    
    # 3. Generate evidence summary text
    summary_generator = EvidenceSummaryGenerator()
    preliminary_curation = CurationData(**curation_data.dict(), 
                                       genetic_evidence_score=genetic_score,
                                       experimental_evidence_score=experimental_score,
                                       verdict=verdict)
    summary_text = summary_generator.generate_summary(preliminary_curation)
    
    # 4. Create final curation record
    db_curation = CurationModel(
        **curation_data.dict(),
        genetic_evidence_score=genetic_score,
        experimental_evidence_score=experimental_score,
        verdict=verdict,
        summary_text=summary_text,
        record_hash=generate_content_hash(preliminary_curation)
    )
    
    # 5. Save and return
    db.add(db_curation)
    db.commit()
    db.refresh(db_curation)
    
    return CurationResponse.from_orm(db_curation)
```

---

## PHASE 2: DATA MIGRATION & API TESTING (ClinGen-Enhanced)

### Step 2.1: Firebase to PostgreSQL Migration

**Enhanced migration script to handle ClinGen compliance**:
- Map existing Firebase data to new ClinGen-compliant schema
- Retroactively calculate scores for existing curations where possible
- Generate evidence summaries for migrated data
- Validate data integrity and ClinGen compliance

### Step 2.2: ClinGen Compliance Validation

**New validation phase**:
- [ ] Verify all scoring calculations match SOP v11 examples
- [ ] Validate evidence summary generation against Template v5.1
- [ ] Test dyadic naming convention support
- [ ] Confirm GCEP workflow compatibility

---

## PHASE 3: FRONTEND MODERNIZATION (ClinGen-Enhanced)

### Step 3.1: Vue 3 + Vite Migration (Standard)

**Standard modern frontend setup**: 
- Migrate to Vite build system
- Implement Pinia for state management
- Update component composition API
- Modern TypeScript integration

### Step 3.2: ClinGen-Specific UI Components

**Objective**: Create specialized components for ClinGen evidence entry and display.

**Key Components**:

1. **Evidence Entry Forms**:
```vue
<!-- CaseLevelEvidenceForm.vue -->
<template>
  <v-card>
    <v-card-title>Case-Level Evidence Entry</v-card-title>
    <v-form @submit="addEvidence">
      <v-text-field v-model="evidence.pmid" label="PMID" required />
      <v-text-field v-model="evidence.proband_label" label="Proband Label" />
      <v-select 
        v-model="evidence.variant_type" 
        :items="clingen_variant_types" 
        label="Variant Type"
      />
      <v-switch v-model="evidence.is_de_novo" label="De Novo Variant" />
      <v-textarea v-model="evidence.rationale" label="Rationale" />
      <!-- Points auto-calculated by backend -->
    </v-form>
  </v-card>
</template>
```

2. **Score Display Components**:
```vue
<!-- ClinGenScoreDisplay.vue -->
<template>
  <v-card>
    <v-card-title>ClinGen Evidence Scores</v-card-title>
    <v-row>
      <v-col>
        <v-chip :color="getScoreColor(genetic_score)">
          Genetic Evidence: {{ genetic_score }}/12
        </v-chip>
      </v-col>
      <v-col>
        <v-chip :color="getScoreColor(experimental_score)">
          Experimental: {{ experimental_score }}/6
        </v-chip>
      </v-col>
    </v-row>
    <v-alert :type="getVerdictType(verdict)" class="mt-3">
      <strong>Classification: {{ verdict }}</strong>
    </v-alert>
  </v-card>
</template>
```

### Step 3.3: Enhanced Curation Workflow

**Objective**: Transform curation interface into ClinGen-compliant evidence collection system.

**Key Features**:
- **Multi-tab evidence entry**: Separate tabs for case-level, segregation, case-control, and experimental evidence
- **Real-time scoring feedback**: Show running scores as evidence is added
- **Evidence validation**: Client-side validation for required fields and formatting
- **Summary preview**: Live preview of auto-generated evidence summary
- **ClinGen nomenclature support**: Integrated dyadic naming validation

---

## PHASE 4: TESTING & VALIDATION (ClinGen-Enhanced)

### Step 4.1: ClinGen Compliance Testing

**Objective**: Comprehensive testing against ClinGen standards.

**Test Categories**:
1. **Scoring Accuracy Tests**:
   - Unit tests for each evidence type scoring
   - Integration tests with SOP v11 examples
   - Edge case handling (max points, contradictory evidence)

2. **Summary Generation Tests**:
   - Template compliance verification
   - Content accuracy validation
   - Formatting and structure tests

3. **Nomenclature Tests**:
   - Dyadic naming convention validation
   - Disease naming guidance compliance
   - GCEP affiliation handling

### Step 4.2: Scientific Validation

**Expert Review Process**:
- [ ] ClinGen expert panel review of scoring implementation
- [ ] Validation with real curation examples
- [ ] Compliance certification documentation

---

## PHASE 5: DEPLOYMENT & MIGRATION (Enhanced)

### Step 5.1: Production Deployment

**Standard containerized deployment with ClinGen enhancements**:
- Docker-based production environment
- ClinGen reference data integration
- Monitoring and logging for scientific compliance
- Backup strategies for critical curation data

### Step 5.2: User Training & Documentation

**ClinGen-Specific Training Materials**:
- [ ] ClinGen workflow integration guide
- [ ] Scoring system explanation
- [ ] Evidence summary generation documentation
- [ ] Migration guide for existing curators

---

## Success Metrics & Validation

### Technical Metrics
- [ ] 100% data migration accuracy
- [ ] API response times < 200ms
- [ ] Zero data loss during migration
- [ ] Complete test coverage (>90%)

### ClinGen Compliance Metrics
- [ ] 100% accuracy in evidence scoring calculations
- [ ] Evidence summaries pass expert panel review
- [ ] Nomenclature validation matches ClinGen guidelines
- [ ] GCEP workflow integration successful

### User Experience Metrics
- [ ] Reduced curation time (target: 30% reduction)
- [ ] Improved data consistency (automated scoring)
- [ ] Enhanced summary quality (standardized generation)
- [ ] Expert user adoption and satisfaction

---

## Risk Assessment & Mitigation

### High-Risk Areas
1. **Data Migration Complexity**: Mapping Firebase flexibility to PostgreSQL structure
   - *Mitigation*: Extensive validation, rollback procedures, parallel running

2. **ClinGen Compliance Accuracy**: Ensuring scoring matches SOP exactly
   - *Mitigation*: Expert panel review, extensive testing with known examples

3. **User Adoption**: Learning curve for new interface
   - *Mitigation*: Comprehensive training, gradual rollout, expert support

### Medium-Risk Areas
1. **Performance**: Complex scoring calculations and summary generation
   - *Mitigation*: Caching strategies, optimized algorithms, monitoring

2. **Integration**: Maintaining backward compatibility during transition
   - *Mitigation*: API versioning, feature flags, gradual migration

---

## Conclusion

This enhanced plan transforms Gene Curator from a data management tool into a **ClinGen-compliant curation engine** that actively enforces scientific standards while maintaining modern technical architecture and decentralization readiness.

**Key Innovations**:
1. **Automated ClinGen Compliance**: Native SOP v11 scoring and summary generation
2. **Scientific Rigor**: Evidence-based scoring with automatic calculation and validation
3. **Expert Efficiency**: Reduced manual work through automation while maintaining scientific accuracy
4. **Future-Proof Architecture**: Decentralization-ready with verifiable provenance

The result will be a state-of-the-art scientific application that is both technically excellent and scientifically rigorous, setting a new standard for genetic curation tools.