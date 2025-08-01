# Gene Curator - Database Schema Documentation

## Overview

The Gene Curator database implements a PostgreSQL schema with native ClinGen SOP v11 compliance. This document provides comprehensive details of the database design, including tables, relationships, JSONB structures, and automated scoring mechanisms.

## Schema Design Principles

1. **ClinGen Standards as Database Constraints**: Evidence scoring rules implemented as database logic
2. **Hybrid Structure**: Relational columns for core metrics, JSONB for detailed evidence
3. **Immutable Provenance**: Every record is content-addressable and verifiable
4. **Performance First**: Optimized for complex queries and real-time scoring

## Core Database Tables

### 1. Users Table (RBAC Foundation)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer', -- viewer|curator|admin
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

**Key Features:**
- **Role-Based Access Control**: `viewer` (read-only), `curator` (create/edit), `admin` (all permissions)
- **JWT Integration**: Works with FastAPI Security for token-based auth
- **Audit Trail**: Tracks last login and account status
- **Email Validation**: Regex constraint ensures valid email format

**Indexes:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
```

### 2. Genes Table (HGNC Compliant)

```sql
CREATE TABLE genes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hgnc_id VARCHAR(50) UNIQUE NOT NULL,           -- HGNC:12345 format
    approved_symbol VARCHAR(100) NOT NULL,         -- Official gene symbol
    previous_symbols TEXT[],                       -- Array of old symbols
    alias_symbols TEXT[],                          -- Array of aliases
    chromosome VARCHAR(10),                        -- 1-22, X, Y, MT
    location VARCHAR(50),                          -- Chromosomal position
    details TEXT[],                            -- Gene family classifications
    details VARCHAR(255),              -- ClinGen dyadic naming
    
    -- Configuration-driven details (preserves flexibility)
    details JSONB DEFAULT '{}',
    
    -- Provenance & integrity
    record_hash VARCHAR(64) NOT NULL UNIQUE,       -- SHA-256 content hash
    previous_hash VARCHAR(64),                     -- Version chaining
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT valid_hgnc_id CHECK (hgnc_id ~* '^HGNC:[0-9]+$')
);
```

**Key Features:**
- **HGNC Compliance**: Validates HGNC ID format with constraints
- **Dyadic Naming**: Supports ClinGen gene-disease naming conventions
- **Flexible Configuration**: JSONB `details` preserves existing config-driven UI system
- **Content Integrity**: SHA-256 hashing enables verification and distributed collaboration
- **Change Tracking**: Immutable record chaining with `previous_hash`

**Indexes:**
```sql
CREATE INDEX idx_genes_hgnc_id ON genes(hgnc_id);
CREATE INDEX idx_genes_symbol ON genes(approved_symbol);
CREATE INDEX idx_genes_chromosome ON genes(chromosome);
CREATE INDEX idx_genes_details_gin ON genes USING GIN (details);
CREATE INDEX idx_genes_created_by ON genes(created_by);
CREATE INDEX idx_genes_updated_at ON genes(updated_at);
```

### 3. Precurations Table (Workflow Intermediate)

```sql
CREATE TABLE precurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    
    -- Core precuration data
    mondo_id VARCHAR(50) NOT NULL,                 -- MONDO:0000001 format
    mode_of_inheritance TEXT NOT NULL,             -- AR, AD, XL, etc.
    lumping_splitting_decision precuration_decision DEFAULT 'Undecided',
    rationale TEXT,                                -- Required for decisions
    
    -- Workflow management
    status workflow_status DEFAULT 'Draft',        -- Draft|Review|Approved|Published
    
    -- Configuration-driven details
    details JSONB NOT NULL DEFAULT '{}',
    
    -- Provenance tracking
    record_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT valid_mondo_id CHECK (mondo_id ~* '^MONDO:[0-9]+$')
);
```

**Key Features:**
- **Lumping/Splitting Logic**: Core ClinGen requirement for entity definition
- **MONDO Integration**: Validates MONDO ontology identifiers
- **Workflow States**: Draft → Review → Approved progression
- **Flexible Details**: Configuration-driven field system preserved from legacy

**Indexes:**
```sql
CREATE INDEX idx_precurations_gene_id ON precurations(gene_id);
CREATE INDEX idx_precurations_mondo_id ON precurations(mondo_id);
CREATE INDEX idx_precurations_decision ON precurations(lumping_splitting_decision);
CREATE INDEX idx_precurations_status ON precurations(status);
CREATE INDEX idx_precurations_details_gin ON precurations USING GIN (details);
CREATE INDEX idx_precurations_created_by ON precurations(created_by);
```

### 4. Curations Table (ClinGen SOP v11 Core)

```sql
CREATE TABLE curations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    precuration_id UUID REFERENCES precurations(id) ON DELETE SET NULL,
    
    -- Entity definition
    mondo_id VARCHAR(50) NOT NULL,
    mode_of_inheritance TEXT NOT NULL,
    disease_name TEXT NOT NULL,
    
    -- *** CORE CLINGEN METRICS (Automated Calculation) ***
    verdict curation_verdict NOT NULL,             -- SOP v11 classifications
    genetic_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,    -- Max 12
    experimental_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0, -- Max 6
    total_score NUMERIC(4, 2) GENERATED ALWAYS AS 
        (genetic_evidence_score + experimental_evidence_score) STORED, -- Max 18
    has_contradictory_evidence BOOLEAN NOT NULL DEFAULT false,
    
    -- *** CLINGEN WORKFLOW & SUMMARY ***
    summary_text TEXT,                            -- Auto-generated from Template v5.1
    gcep_affiliation TEXT NOT NULL,               -- "Cardiovascular GCEP"
    sop_version VARCHAR(10) NOT NULL DEFAULT 'v11',
    status workflow_status DEFAULT 'Draft',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    
    -- *** DECENTRALIZATION READY ***
    record_hash VARCHAR(64) NOT NULL UNIQUE,      -- Content-addressable
    previous_hash VARCHAR(64),                    -- Version chaining
    origin_node_id UUID,                          -- Multi-node deployment
    
    -- *** DETAILED EVIDENCE STORE (JSONB) ***
    details JSONB NOT NULL,                       -- Complete evidence structure
    
    -- *** METADATA ***
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- *** SOP v11 CONSTRAINTS ***
    CONSTRAINT valid_genetic_score CHECK (genetic_evidence_score >= 0 AND genetic_evidence_score <= 12),
    CONSTRAINT valid_experimental_score CHECK (experimental_evidence_score >= 0 AND experimental_evidence_score <= 6),
    CONSTRAINT valid_total_score CHECK (total_score <= 18),
    CONSTRAINT valid_mondo_id CHECK (mondo_id ~* '^MONDO:[0-9]+$'),
    CONSTRAINT approved_metadata CHECK (
        (approved_at IS NULL AND approved_by IS NULL) OR 
        (approved_at IS NOT NULL AND approved_by IS NOT NULL)
    )
);
```

**Key Features:**
- **Native ClinGen Scoring**: Database-level enforcement of SOP v11 point maximums
- **Automated Evidence Calculation**: Computed columns with triggers
- **Professional Workflow**: Draft → Review → Approved → Published states
- **Summary Generation**: Template-driven evidence summaries
- **Scientific Integrity**: Immutable records with cryptographic content addressing

**Indexes:**
```sql
-- Core ClinGen queries
CREATE INDEX idx_curations_gene_id ON curations(gene_id);
CREATE INDEX idx_curations_mondo_id ON curations(mondo_id);
CREATE INDEX idx_curations_verdict ON curations(verdict);
CREATE INDEX idx_curations_scores ON curations(genetic_evidence_score, experimental_evidence_score);
CREATE INDEX idx_curations_total_score ON curations(total_score);
CREATE INDEX idx_curations_gcep ON curations(gcep_affiliation);
CREATE INDEX idx_curations_status ON curations(status);
CREATE INDEX idx_curations_approved ON curations(approved_at) WHERE approved_at IS NOT NULL;
CREATE INDEX idx_curations_published ON curations(published_at) WHERE published_at IS NOT NULL;

-- Advanced JSONB indexes for evidence queries
CREATE INDEX idx_curations_details_gin ON curations USING GIN (details);
CREATE INDEX idx_curations_genetic_evidence ON curations USING GIN ((details->'genetic_evidence'));
CREATE INDEX idx_curations_experimental_evidence ON curations USING GIN ((details->'experimental_evidence'));
CREATE INDEX idx_curations_external_evidence ON curations USING GIN ((details->'external_evidence'));
CREATE INDEX idx_curations_workflow_status ON curations USING GIN ((details->'curation_workflow'->'status'));
CREATE INDEX idx_curations_provenance ON curations USING GIN ((details->'ancillary_data'));
```

## JSONB Evidence Structure (curations.details)

The `details` JSONB column stores the complete ClinGen evidence hierarchy:

### Structure Overview
```json
{
  "genetic_evidence": {
    "case_level_data": [...],      // Max 12 points total
    "segregation_data": [...],     // Max 3 points total  
    "case_control_data": [...]     // Max 6 points total
  },
  "experimental_evidence": {
    "function": [...],             // Biochemical function evidence
    "models": [...],               // Model organism evidence
    "rescue": [...]                // Rescue evidence
  },
  "contradictory_evidence": [...], // Evidence against gene-disease relationship
  "external_evidence": [...],     // Supporting data from other sources
  "curation_workflow": {...},     // Workflow metadata and review log
  "ancillary_data": {...}         // Additional supporting data
}
```

### Detailed Evidence Entry Format

#### Genetic Evidence - Case Level Data
```json
{
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
  ]
}
```

#### Experimental Evidence - Function
```json
{
  "function": [
    {
      "type": "Biochemical Function",
      "pmid": "55566677",
      "description": "Enzyme assay demonstrated loss of catalytic activity", 
      "points": 0.5,
      "methodology": "In vitro enzyme kinetics",
      "significance": "Functional validation of pathogenicity"
    }
  ]
}
```

#### Workflow & Review Tracking
```json
{
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

## Database Enums

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

-- Workflow status for all entities
CREATE TYPE workflow_status AS ENUM (
    'Draft',
    'In_Primary_Review',
    'In_Secondary_Review', 
    'Approved',
    'Published',
    'Rejected'
);
```

## ClinGen Scoring Engine (Database Triggers)

### Automated Scoring Trigger

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
    -- Calculate genetic evidence score (SOP v11 rules)
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO case_level_total
    FROM jsonb_array_elements(NEW.details->'genetic_evidence'->'case_level_data') AS evidence;
    
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO segregation_total
    FROM jsonb_array_elements(NEW.details->'genetic_evidence'->'segregation_data') AS evidence;
    
    SELECT COALESCE(SUM((evidence->>'points')::NUMERIC), 0)
    INTO case_control_total
    FROM jsonb_array_elements(NEW.details->'genetic_evidence'->'case_control_data') AS evidence;
    
    -- Apply SOP v11 maximums: Case-level (12), Segregation (3), Case-control (6)
    genetic_score := LEAST(
        LEAST(case_level_total, 12.0) + 
        LEAST(segregation_total, 3.0) + 
        LEAST(case_control_total, 6.0),
        12.0  -- Overall genetic maximum
    );
    
    -- Calculate experimental evidence score (max 6 points total)
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
    
    -- Update the record with calculated scores
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

## Audit and Support Tables

### Change Log Table
```sql
CREATE TABLE change_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'gene', 'precuration', 'curation'
    entity_id UUID NOT NULL,
    operation TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'APPROVE', 'PUBLISH', 'DELETE'
    record_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    changes JSONB, -- Detailed change information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT valid_entity_type CHECK (entity_type IN ('gene', 'precuration', 'curation')),
    CONSTRAINT valid_operation CHECK (operation IN ('CREATE', 'UPDATE', 'APPROVE', 'PUBLISH', 'DELETE'))
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_jti VARCHAR(255) NOT NULL UNIQUE, -- JWT ID claim
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true
);
```

## Database Views

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

## Performance Optimizations

### JSONB Indexing Strategy
- **GIN Indexes**: Fast queries on evidence structures
- **Specific Path Indexes**: Targeted indexes on frequently queried JSONB paths
- **Partial Indexes**: Workflow-specific indexes (e.g., only approved curations)

### Query Optimization
- **Computed Columns**: Total scores calculated automatically and indexed
- **Materialized Views**: Complex analytics pre-computed
- **Connection Pooling**: SQLAlchemy session management for concurrent access

### Maintenance Procedures
```sql
-- Reindex JSONB columns monthly
REINDEX INDEX CONCURRENTLY idx_curations_details_gin;

-- Update statistics weekly
ANALYZE curations;

-- Vacuum full quarterly (during maintenance window)
VACUUM FULL curations;
```

## Migration and Backup Strategy

### Data Migration
1. **Schema Creation**: Run DDL scripts in sequence (001-004)
2. **Data Export**: Extract Firebase collections using admin SDK
3. **Data Transform**: Map Firebase documents to PostgreSQL records
4. **Validation**: Verify all scores and relationships are correct
5. **Cutover**: Switch API endpoints to PostgreSQL backend

### Backup Procedures
```bash
# Daily automated backups
pg_dump -Fc gene_curator > backup_$(date +%Y%m%d).dump

# Point-in-time recovery setup
pg_basebackup -D /backup/base -Ft -z -P

# Test restore procedures monthly
pg_restore -d gene_curator_test backup_latest.dump
```

---

## Related Documentation

- [ClinGen Compliance](./CLINGEN_COMPLIANCE.md) - SOP v11 implementation details
- [API Reference](./API_REFERENCE.md) - Database model mappings
- [Architecture](./ARCHITECTURE.md) - Overall system design
- [Workflow Documentation](./WORKFLOW.md) - Data flow and state transitions