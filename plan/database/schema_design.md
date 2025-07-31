# PostgreSQL Schema Design - ClinGen Compliant

## Overview

This schema design directly implements ClinGen SOP v11 requirements in the database layer, ensuring that evidence scoring and classification are handled consistently and automatically.

## Core Design Principles

1. **ClinGen Standards as Database Constraints**: Evidence scoring rules implemented as database logic
2. **Hybrid Structure**: Relational columns for core metrics, JSONB for detailed evidence
3. **Immutable Provenance**: Every record is content-addressable and verifiable
4. **Performance First**: Optimized for complex queries and real-time scoring

## Database Schema

### Enum Types

```sql
-- User roles for RBAC
CREATE TYPE user_role AS ENUM ('viewer', 'curator', 'admin');

-- Precuration decision tracking
CREATE TYPE precuration_decision AS ENUM ('Lump', 'Split', 'Undecided');

-- ClinGen SOP v11 verdict classifications
CREATE TYPE curation_verdict AS ENUM (
    'Definitive', 
    'Strong', 
    'Moderate', 
    'Limited', 
    'No Known Disease Relationship', 
    'Disputed', 
    'Refuted'
);

-- ClinGen variant types for evidence scoring
CREATE TYPE clingen_variant_type AS ENUM (
    'Predicted or Proven Null',
    'Other Variant Type'
);

-- Experimental evidence categories
CREATE TYPE experimental_evidence_type AS ENUM (
    'Biochemical Function',
    'Protein Interaction',
    'Expression',
    'Functional Alteration',
    'Model Systems',
    'Rescue'
);
```

### Core Tables

#### Users Table
```sql
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Genes Table
```sql
CREATE TABLE genes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hgnc_id VARCHAR(50) UNIQUE NOT NULL,
    approved_symbol VARCHAR(100) NOT NULL,
    -- ClinGen dyadic naming support
    current_dyadic_name VARCHAR(255),
    -- Gene details (preserves current flexibility)
    details JSONB DEFAULT '{}',
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_genes_hgnc_id ON genes(hgnc_id);
CREATE INDEX idx_genes_symbol ON genes(approved_symbol);
CREATE INDEX idx_genes_details_gin ON genes USING GIN (details);
```

#### Precurations Table
```sql
CREATE TABLE precurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    -- Core precuration fields
    mondo_id VARCHAR(50) NOT NULL,
    mode_of_inheritance TEXT NOT NULL,
    lumping_splitting_decision precuration_decision DEFAULT 'Undecided',
    -- Flexible details storage
    details JSONB NOT NULL DEFAULT '{}',
    -- Provenance tracking
    record_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64),
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_precurations_gene_id ON precurations(gene_id);
CREATE INDEX idx_precurations_mondo_id ON precurations(mondo_id);
CREATE INDEX idx_precurations_decision ON precurations(lumping_splitting_decision);
CREATE INDEX idx_precurations_details_gin ON precurations USING GIN (details);
```

#### Curations Table (Core ClinGen Implementation)
```sql
CREATE TABLE curations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    precuration_id UUID REFERENCES precurations(id) ON DELETE SET NULL,
    
    -- Core entity definition
    mondo_id VARCHAR(50) NOT NULL,
    mode_of_inheritance TEXT NOT NULL,
    
    -- ** CORE CLINGEN METRICS (SOP v11 Compliance) **
    verdict curation_verdict NOT NULL,
    genetic_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    experimental_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    total_score NUMERIC(4, 2) GENERATED ALWAYS AS (genetic_evidence_score + experimental_evidence_score) STORED,
    has_contradictory_evidence BOOLEAN NOT NULL DEFAULT false,
    
    -- ** CLINGEN SUMMARY & WORKFLOW **
    summary_text TEXT, -- Auto-generated from Evidence Summary Template v5.1
    gcep_affiliation TEXT NOT NULL, -- e.g., "Cardiovascular GCEP"
    sop_version VARCHAR(10) NOT NULL DEFAULT 'v11',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- ** DECENTRALIZATION & VERIFIABILITY **
    record_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64), -- Enables chaining for version control
    origin_node_id UUID, -- For future distributed deployment
    
    -- ** DETAILED EVIDENCE STORE **
    details JSONB NOT NULL,
    
    -- ** METADATA **
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- ** CONSTRAINTS **
    CONSTRAINT valid_genetic_score CHECK (genetic_evidence_score >= 0 AND genetic_evidence_score <= 12),
    CONSTRAINT valid_experimental_score CHECK (experimental_evidence_score >= 0 AND experimental_evidence_score <= 6),
    CONSTRAINT valid_total_score CHECK (total_score <= 18)
);

-- Core indexes for ClinGen queries
CREATE INDEX idx_curations_gene_id ON curations(gene_id);
CREATE INDEX idx_curations_mondo_id ON curations(mondo_id);
CREATE INDEX idx_curations_verdict ON curations(verdict);
CREATE INDEX idx_curations_scores ON curations(genetic_evidence_score, experimental_evidence_score);
CREATE INDEX idx_curations_total_score ON curations(total_score);
CREATE INDEX idx_curations_gcep ON curations(gcep_affiliation);
CREATE INDEX idx_curations_approved ON curations(approved_at) WHERE approved_at IS NOT NULL;

-- Advanced JSONB indexes for evidence queries
CREATE INDEX idx_curations_details_gin ON curations USING GIN (details);
CREATE INDEX idx_curations_genetic_evidence ON curations USING GIN ((details->'genetic_evidence'));
CREATE INDEX idx_curations_experimental_evidence ON curations USING GIN ((details->'experimental_evidence'));
CREATE INDEX idx_curations_external_evidence ON curations USING GIN ((details->'external_evidence'));
CREATE INDEX idx_curations_workflow_status ON curations USING GIN ((details->'curation_workflow'->'status'));
CREATE INDEX idx_curations_provenance ON curations USING GIN ((details->'ancillary_data'));
```

#### Change Log Table (Audit Trail)
```sql
CREATE TABLE change_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'gene', 'precuration', 'curation'
    entity_id UUID NOT NULL,
    operation TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'APPROVE', 'DELETE'
    record_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    changes JSONB, -- Detailed change information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_change_log_entity ON change_log(entity_type, entity_id);
CREATE INDEX idx_change_log_user ON change_log(user_id);
CREATE INDEX idx_change_log_timestamp ON change_log(timestamp);
CREATE INDEX idx_change_log_operation ON change_log(operation);
```

## JSONB Structure for curations.details

The `details` column stores the complete ClinGen evidence structure:

```json
{
  "lumping_splitting_details": "Rationale for entity definition decisions",
  "variant_spectrum_summary": "Description of variant types and distribution",
  "disease_mechanism": "loss of function | gain of function | dominant negative",
  
  "genetic_evidence": {
    "case_level_data": [
      {
        "pmid": "12345678",
        "proband_label": "Smith et al, Proband 1",
        "hpo_terms": ["HP:0001250", "HP:0000505"],
        "variant_type": "Predicted or Proven Null",
        "is_de_novo": true,
        "functional_impact_evidence": "Western blot showed no protein product",
        "points": 2.0,
        "rationale": "De novo null variant in highly constrained gene"
      }
    ],
    "segregation_data": [
      {
        "pmid": "87654321",
        "family_label": "Jones et al, Family A",
        "sequencing_method": "Exome/genome",
        "lod_score_published": 3.2,
        "points": 2.0,
        "rationale": "Published LOD score meets threshold"
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
        "rationale": "Significant association, controls from population database"
      }
    ]
  },
  
  "experimental_evidence": {
    "function": [
      {
        "type": "Biochemical Function",
        "pmid": "55566677",
        "description": "Enzyme assay demonstrated loss of catalytic activity",
        "points": 0.5
      }
    ],
    "models": [
      {
        "type": "Non-human model organism",
        "pmid": "88899900",
        "description": "Zebrafish model recapitulated cardiac defects",
        "points": 2.0
      }
    ],
    "rescue": [
      {
        "type": "Rescue in human",
        "pmid": "11122233",
        "description": "Enzyme replacement therapy showed clinical improvement",
        "points": 2.0
      }
    ]
  },
  
  "contradictory_evidence": [
    {
      "pmid": "44455566",
      "description": "Case-control study failed to replicate association",
      "category": "Case-control",
      "impact": "Contradicts genetic evidence"
    }
  ],
  
  "external_evidence": [
    {
      "source_name": "PanelApp UK",
      "source_id": "Panel_137",
      "source_version": "v1.3",
      "date_accessed": "2024-07-31",
      "classification": "Green",
      "submitted_disease": "Polycystic kidney disease",
      "confidence_level": "Expert_Reviewed"
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
        "tissue_measurements": [
          {"tissue": "Kidney - Cortex", "value": 45.2, "unit": "TPM"}
        ]
      }
    ]
  },
  
  "curation_workflow": {
    "status": "In_Primary_Review",
    "clingen_compliance_status": "Validated",
    "primary_curator": "curator1@institution.edu",
    "secondary_curator": "senior_curator@institution.edu",
    "review_log": [
      {
        "timestamp": "2024-07-31T10:00:00Z",
        "user_email": "system@gene-curator.org",
        "action": "curation_created",
        "comment": "Automated curation with ClinGen scoring",
        "changes_made": {
          "genetic_evidence_score": 12.0,
          "experimental_evidence_score": 4.0,
          "verdict": "Definitive"
        }
      }
    ],
    "flags": {
      "conflicting_evidence": false,
      "insufficient_evidence": false,
      "clingen_compliant": true,
      "ready_for_gencc_submission": true
    }
  }
}
```

## Triggers and Constraints

### Automatic Scoring Trigger
```sql
CREATE OR REPLACE FUNCTION calculate_clingen_scores()
RETURNS TRIGGER AS $$
DECLARE
    genetic_score NUMERIC(4,2) := 0.0;
    experimental_score NUMERIC(4,2) := 0.0;
    case_level_total NUMERIC(4,2) := 0.0;
    segregation_total NUMERIC(4,2) := 0.0;
    case_control_total NUMERIC(4,2) := 0.0;
    experimental_total NUMERIC(4,2) := 0.0;
BEGIN
    -- Calculate genetic evidence score
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO case_level_total
    FROM jsonb_array_elements(NEW.details->'genetic_evidence'->'case_level_data') AS evidence;
    
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO segregation_total
    FROM jsonb_array_elements(NEW.details->'genetic_evidence'->'segregation_data') AS evidence;
    
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO case_control_total
    FROM jsonb_array_elements(NEW.details->'genetic_evidence'->'case_control_data') AS evidence;
    
    -- Apply SOP v11 maximums
    genetic_score := LEAST(
        LEAST(case_level_total, 12.0) + 
        LEAST(segregation_total, 3.0) + 
        LEAST(case_control_total, 6.0),
        12.0
    );
    
    -- Calculate experimental evidence score
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO experimental_total
    FROM (
        SELECT evidence FROM jsonb_array_elements(NEW.details->'experimental_evidence'->'function') AS evidence
        UNION ALL
        SELECT evidence FROM jsonb_array_elements(NEW.details->'experimental_evidence'->'models') AS evidence
        UNION ALL
        SELECT evidence FROM jsonb_array_elements(NEW.details->'experimental_evidence'->'rescue') AS evidence
    ) AS all_evidence;
    
    experimental_score := LEAST(experimental_total, 6.0);
    
    -- Update the record
    NEW.genetic_evidence_score := genetic_score;
    NEW.experimental_evidence_score := experimental_score;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_scores
    BEFORE INSERT OR UPDATE ON curations
    FOR EACH ROW
    EXECUTE FUNCTION calculate_clingen_scores();
```

### Content Hash Generation
```sql
CREATE OR REPLACE FUNCTION generate_record_hash()
RETURNS TRIGGER AS $$
BEGIN
    NEW.record_hash := encode(
        digest(
            NEW.gene_id::text || 
            NEW.mondo_id || 
            NEW.mode_of_inheritance || 
            NEW.details::text ||
            EXTRACT(epoch FROM NEW.created_at)::text,
            'sha256'
        ),
        'hex'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_hash
    BEFORE INSERT ON curations
    FOR EACH ROW
    EXECUTE FUNCTION generate_record_hash();
```

## Views for Common Queries

### Complete Curation View
```sql
CREATE VIEW curations_complete AS
SELECT 
    c.id,
    c.gene_id,
    g.approved_symbol,
    g.hgnc_id,
    c.mondo_id,
    c.mode_of_inheritance,
    c.verdict,
    c.genetic_evidence_score,
    c.experimental_evidence_score,
    c.total_score,
    c.has_contradictory_evidence,
    c.summary_text,
    c.gcep_affiliation,
    c.approved_at,
    c.details,
    c.created_at,
    c.updated_at,
    creator.name as created_by_name,
    approver.name as approved_by_name
FROM curations c
JOIN genes g ON c.gene_id = g.id
LEFT JOIN users creator ON c.created_by = creator.id
LEFT JOIN users approver ON c.approved_by = approver.id;
```

### ClinGen Summary Statistics
```sql
CREATE VIEW clingen_statistics AS
SELECT 
    gcep_affiliation,
    verdict,
    COUNT(*) as curation_count,
    AVG(genetic_evidence_score) as avg_genetic_score,
    AVG(experimental_evidence_score) as avg_experimental_score,
    AVG(total_score) as avg_total_score,
    COUNT(*) FILTER (WHERE approved_at IS NOT NULL) as approved_count
FROM curations
GROUP BY gcep_affiliation, verdict
ORDER BY gcep_affiliation, verdict;
```

## Performance Considerations

1. **JSONB Indexing**: GIN indexes on evidence structures for fast queries
2. **Computed Columns**: Total score calculated automatically, indexed for sorting
3. **Partial Indexes**: Approved curations indexed separately for dashboard queries
4. **Connection Pooling**: Database connection management for concurrent access
5. **Query Optimization**: Materialized views for complex analytics

## Migration Strategy

1. **Schema Creation**: Run DDL scripts in order (001-004)
2. **Data Export**: Extract Firebase collections using admin SDK
3. **Data Transform**: Map Firebase documents to PostgreSQL records
4. **Validation**: Verify all scores and relationships are correct
5. **Cutover**: Switch API endpoints to PostgreSQL backend

## Next Steps

1. Implement SQL scripts in `sql/` directory
2. Create migration tooling in `migration/` directory
3. Build validation and testing procedures
4. Document ClinGen compliance verification process