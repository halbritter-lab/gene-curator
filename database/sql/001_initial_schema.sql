-- Gene Curator Database Schema
-- ClinGen SOP v11 Compliant Schema Design
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set search path
SET search_path TO public;

-- Custom ENUM types for ClinGen compliance
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

CREATE TYPE clingen_variant_type AS ENUM (
    'Predicted or Proven Null',
    'Other Variant Type'
);

CREATE TYPE experimental_evidence_type AS ENUM (
    'Biochemical Function',
    'Protein Interaction', 
    'Expression',
    'Functional Alteration',
    'Model Systems',
    'Rescue'
);

CREATE TYPE workflow_status AS ENUM (
    'Draft',
    'In_Primary_Review',
    'In_Secondary_Review', 
    'Approved',
    'Published',
    'Rejected'
);

-- Users table with RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Genes table with HGNC compliance
CREATE TABLE genes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hgnc_id VARCHAR(50) UNIQUE NOT NULL,
    approved_symbol VARCHAR(100) NOT NULL,
    previous_symbols TEXT[], -- Array of previous gene symbols
    alias_symbols TEXT[], -- Array of alias symbols
    chromosome VARCHAR(10),
    location VARCHAR(50), -- Chromosomal location
    
    -- Flexible details storage (preserves current config system)
    details JSONB DEFAULT '{}',
    
    -- Provenance tracking
    record_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT valid_hgnc_id CHECK (hgnc_id ~* '^HGNC:[0-9]+$')
);

-- Precurations table (intermediate workflow step)
CREATE TABLE precurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    
    -- Core precuration fields
    mondo_id VARCHAR(50) NOT NULL,
    mode_of_inheritance TEXT NOT NULL,
    lumping_splitting_decision precuration_decision DEFAULT 'Undecided',
    rationale TEXT,
    
    -- Workflow status
    status workflow_status DEFAULT 'Draft',
    
    -- Flexible details storage (configuration-driven)
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

-- Curations table - Core ClinGen implementation
CREATE TABLE curations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gene_id UUID NOT NULL REFERENCES genes(id) ON DELETE CASCADE,
    precuration_id UUID REFERENCES precurations(id) ON DELETE SET NULL,
    
    -- Core entity definition
    mondo_id VARCHAR(50) NOT NULL,
    mode_of_inheritance TEXT NOT NULL,
    disease_name TEXT NOT NULL,
    
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
    status workflow_status DEFAULT 'Draft',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    
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
    CONSTRAINT valid_total_score CHECK (total_score <= 18),
    CONSTRAINT valid_mondo_id CHECK (mondo_id ~* '^MONDO:[0-9]+$'),
    CONSTRAINT approved_metadata CHECK (
        (approved_at IS NULL AND approved_by IS NULL) OR 
        (approved_at IS NOT NULL AND approved_by IS NOT NULL)
    )
);

-- Change log table for complete audit trail
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

-- Sessions table for JWT token management
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

-- API keys table for external integrations
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT '{}', -- Array of permission strings
    last_used TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- Genes indexes
CREATE INDEX idx_genes_hgnc_id ON genes(hgnc_id);
CREATE INDEX idx_genes_symbol ON genes(approved_symbol);
CREATE INDEX idx_genes_chromosome ON genes(chromosome);
CREATE INDEX idx_genes_details_gin ON genes USING GIN (details);
CREATE INDEX idx_genes_created_by ON genes(created_by);
CREATE INDEX idx_genes_updated_at ON genes(updated_at);

-- Precurations indexes
CREATE INDEX idx_precurations_gene_id ON precurations(gene_id);
CREATE INDEX idx_precurations_mondo_id ON precurations(mondo_id);
CREATE INDEX idx_precurations_decision ON precurations(lumping_splitting_decision);
CREATE INDEX idx_precurations_status ON precurations(status);
CREATE INDEX idx_precurations_details_gin ON precurations USING GIN (details);
CREATE INDEX idx_precurations_created_by ON precurations(created_by);

-- Curations indexes (Core ClinGen queries)
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

-- Change log indexes
CREATE INDEX idx_change_log_entity ON change_log(entity_type, entity_id);
CREATE INDEX idx_change_log_user ON change_log(user_id);
CREATE INDEX idx_change_log_timestamp ON change_log(timestamp);
CREATE INDEX idx_change_log_operation ON change_log(operation);

-- Session indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_jti);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = true;

-- API keys indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;