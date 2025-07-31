-- ClinGen Automatic Scoring Triggers
-- Implements SOP v11 scoring rules at the database level

-- Function to calculate ClinGen genetic evidence score
CREATE OR REPLACE FUNCTION calculate_genetic_evidence_score(evidence_data JSONB)
RETURNS NUMERIC(4,2) AS $$
DECLARE
    case_level_score NUMERIC(4,2) := 0.0;
    segregation_score NUMERIC(4,2) := 0.0;
    case_control_score NUMERIC(4,2) := 0.0;
    total_score NUMERIC(4,2) := 0.0;
    evidence_item JSONB;
BEGIN
    -- Calculate case-level data score (max 12 points)
    IF evidence_data ? 'genetic_evidence' AND evidence_data->'genetic_evidence' ? 'case_level_data' THEN
        FOR evidence_item IN SELECT * FROM jsonb_array_elements(evidence_data->'genetic_evidence'->'case_level_data')
        LOOP
            case_level_score := case_level_score + COALESCE((evidence_item->>'points')::NUMERIC, 0);
        END LOOP;
        case_level_score := LEAST(case_level_score, 12.0);
    END IF;
    
    -- Calculate segregation data score (max 3 points)
    IF evidence_data ? 'genetic_evidence' AND evidence_data->'genetic_evidence' ? 'segregation_data' THEN
        FOR evidence_item IN SELECT * FROM jsonb_array_elements(evidence_data->'genetic_evidence'->'segregation_data')
        LOOP
            segregation_score := segregation_score + COALESCE((evidence_item->>'points')::NUMERIC, 0);
        END LOOP;
        segregation_score := LEAST(segregation_score, 3.0);
    END IF;
    
    -- Calculate case-control data score (max 6 points)
    IF evidence_data ? 'genetic_evidence' AND evidence_data->'genetic_evidence' ? 'case_control_data' THEN
        FOR evidence_item IN SELECT * FROM jsonb_array_elements(evidence_data->'genetic_evidence'->'case_control_data')
        LOOP
            case_control_score := case_control_score + COALESCE((evidence_item->>'points')::NUMERIC, 0);
        END LOOP;
        case_control_score := LEAST(case_control_score, 6.0);
    END IF;
    
    -- Apply overall genetic evidence maximum (12 points)
    total_score := case_level_score + segregation_score + case_control_score;
    RETURN LEAST(total_score, 12.0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate ClinGen experimental evidence score
CREATE OR REPLACE FUNCTION calculate_experimental_evidence_score(evidence_data JSONB)
RETURNS NUMERIC(4,2) AS $$
DECLARE
    total_score NUMERIC(4,2) := 0.0;
    evidence_item JSONB;
BEGIN
    -- Calculate experimental evidence score (max 6 points)
    IF evidence_data ? 'experimental_evidence' THEN
        -- Function evidence
        IF evidence_data->'experimental_evidence' ? 'function' THEN
            FOR evidence_item IN SELECT * FROM jsonb_array_elements(evidence_data->'experimental_evidence'->'function')
            LOOP
                total_score := total_score + COALESCE((evidence_item->>'points')::NUMERIC, 0);
            END LOOP;
        END IF;
        
        -- Model evidence  
        IF evidence_data->'experimental_evidence' ? 'models' THEN
            FOR evidence_item IN SELECT * FROM jsonb_array_elements(evidence_data->'experimental_evidence'->'models')
            LOOP
                total_score := total_score + COALESCE((evidence_item->>'points')::NUMERIC, 0);
            END LOOP;
        END IF;
        
        -- Rescue evidence
        IF evidence_data->'experimental_evidence' ? 'rescue' THEN
            FOR evidence_item IN SELECT * FROM jsonb_array_elements(evidence_data->'experimental_evidence'->'rescue')
            LOOP
                total_score := total_score + COALESCE((evidence_item->>'points')::NUMERIC, 0);
            END LOOP;
        END IF;
    END IF;
    
    -- Apply overall experimental evidence maximum (6 points)
    RETURN LEAST(total_score, 6.0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to determine ClinGen verdict based on scores
CREATE OR REPLACE FUNCTION determine_clingen_verdict(
    genetic_score NUMERIC(4,2),
    experimental_score NUMERIC(4,2), 
    has_contradictory BOOLEAN
) RETURNS curation_verdict AS $$
DECLARE
    total_score NUMERIC(4,2);
BEGIN
    total_score := genetic_score + experimental_score;
    
    -- Check for contradictory evidence first
    IF has_contradictory THEN
        RETURN 'Disputed';
    END IF;
    
    -- Apply SOP v11 classification thresholds
    IF total_score >= 12.0 THEN
        RETURN 'Definitive';
    ELSIF total_score >= 7.0 THEN
        RETURN 'Strong';
    ELSIF total_score >= 3.0 THEN
        RETURN 'Moderate';
    ELSIF total_score >= 1.0 THEN
        RETURN 'Limited';
    ELSE
        RETURN 'No Known Disease Relationship';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check for contradictory evidence
CREATE OR REPLACE FUNCTION has_contradictory_evidence(evidence_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        evidence_data ? 'contradictory_evidence' AND 
        jsonb_array_length(evidence_data->'contradictory_evidence') > 0
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main trigger function for automatic ClinGen scoring
CREATE OR REPLACE FUNCTION calculate_clingen_scores()
RETURNS TRIGGER AS $$
DECLARE
    genetic_score NUMERIC(4,2) := 0.0;
    experimental_score NUMERIC(4,2) := 0.0;
    has_contradictory BOOLEAN := false;
    calculated_verdict curation_verdict;
BEGIN
    -- Only calculate scores if we have evidence data
    IF NEW.details IS NOT NULL THEN
        -- Calculate genetic evidence score
        genetic_score := calculate_genetic_evidence_score(NEW.details);
        
        -- Calculate experimental evidence score
        experimental_score := calculate_experimental_evidence_score(NEW.details);
        
        -- Check for contradictory evidence
        has_contradictory := has_contradictory_evidence(NEW.details);
        
        -- Determine verdict
        calculated_verdict := determine_clingen_verdict(genetic_score, experimental_score, has_contradictory);
        
        -- Update the record with calculated values
        NEW.genetic_evidence_score := genetic_score;
        NEW.experimental_evidence_score := experimental_score;
        NEW.has_contradictory_evidence := has_contradictory;
        
        -- Only auto-update verdict if it's not already set by a curator
        IF NEW.verdict IS NULL OR OLD.verdict IS NULL THEN
            NEW.verdict := calculated_verdict;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic scoring on curations
DROP TRIGGER IF EXISTS trigger_calculate_scores ON curations;
CREATE TRIGGER trigger_calculate_scores
    BEFORE INSERT OR UPDATE ON curations
    FOR EACH ROW
    EXECUTE FUNCTION calculate_clingen_scores();

-- Function to generate content hash for gene records
CREATE OR REPLACE FUNCTION generate_gene_record_hash()
RETURNS TRIGGER AS $$
DECLARE
    content_string TEXT;
BEGIN
    -- Generate deterministic content string based on core gene data
    content_string := COALESCE(NEW.hgnc_id, '') || 
                     COALESCE(NEW.approved_symbol, '') || 
                     COALESCE(NEW.chromosome, '') || 
                     COALESCE(NEW.details::text, '') ||
                     COALESCE(EXTRACT(epoch FROM NEW.created_at)::text, '');
    
    -- Generate SHA-256 hash
    NEW.record_hash := encode(digest(content_string, 'sha256'), 'hex');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate content hash for precuration records
CREATE OR REPLACE FUNCTION generate_precuration_record_hash()
RETURNS TRIGGER AS $$
DECLARE
    content_string TEXT;
BEGIN
    -- Generate deterministic content string based on precuration data
    content_string := COALESCE(NEW.gene_id::text, '') || 
                     COALESCE(NEW.mondo_id, '') || 
                     COALESCE(NEW.mode_of_inheritance, '') || 
                     COALESCE(NEW.details::text, '') ||
                     COALESCE(EXTRACT(epoch FROM NEW.created_at)::text, '');
    
    -- Generate SHA-256 hash
    NEW.record_hash := encode(digest(content_string, 'sha256'), 'hex');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate content hash for curation records
CREATE OR REPLACE FUNCTION generate_curation_record_hash()
RETURNS TRIGGER AS $$
DECLARE
    content_string TEXT;
BEGIN
    -- Generate deterministic content string based on curation data
    content_string := COALESCE(NEW.gene_id::text, '') || 
                     COALESCE(NEW.mondo_id, '') || 
                     COALESCE(NEW.mode_of_inheritance, '') || 
                     COALESCE(NEW.details::text, '') ||
                     COALESCE(EXTRACT(epoch FROM NEW.created_at)::text, '');
    
    -- Generate SHA-256 hash
    NEW.record_hash := encode(digest(content_string, 'sha256'), 'hex');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for hash generation
DROP TRIGGER IF EXISTS trigger_generate_gene_hash ON genes;
CREATE TRIGGER trigger_generate_gene_hash
    BEFORE INSERT ON genes
    FOR EACH ROW
    EXECUTE FUNCTION generate_gene_record_hash();

DROP TRIGGER IF EXISTS trigger_generate_precuration_hash ON precurations;
CREATE TRIGGER trigger_generate_precuration_hash
    BEFORE INSERT ON precurations
    FOR EACH ROW
    EXECUTE FUNCTION generate_precuration_record_hash();

DROP TRIGGER IF EXISTS trigger_generate_curation_hash ON curations;
CREATE TRIGGER trigger_generate_curation_hash
    BEFORE INSERT ON curations
    FOR EACH ROW
    EXECUTE FUNCTION generate_curation_record_hash();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update timestamp triggers
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_genes_updated_at ON genes;
CREATE TRIGGER trigger_genes_updated_at
    BEFORE UPDATE ON genes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_precurations_updated_at ON precurations;
CREATE TRIGGER trigger_precurations_updated_at
    BEFORE UPDATE ON precurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_curations_updated_at ON curations;
CREATE TRIGGER trigger_curations_updated_at
    BEFORE UPDATE ON curations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to log changes
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
DECLARE
    operation_type TEXT;
    changes_json JSONB := '{}';
BEGIN
    -- Determine operation type
    IF TG_OP = 'INSERT' THEN
        operation_type := 'CREATE';
    ELSIF TG_OP = 'UPDATE' THEN
        operation_type := 'UPDATE';
        -- Calculate what changed
        changes_json := jsonb_build_object(
            'old_values', to_jsonb(OLD),
            'new_values', to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        operation_type := 'DELETE';
    END IF;
    
    -- Insert change log entry
    INSERT INTO change_log (
        entity_type,
        entity_id,
        operation,
        record_hash,
        previous_hash,
        changes,
        timestamp
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        operation_type,
        COALESCE(NEW.record_hash, OLD.record_hash),
        COALESCE(OLD.record_hash, NEW.previous_hash),
        changes_json,
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create change logging triggers
DROP TRIGGER IF EXISTS trigger_log_gene_changes ON genes;
CREATE TRIGGER trigger_log_gene_changes
    AFTER INSERT OR UPDATE OR DELETE ON genes
    FOR EACH ROW
    EXECUTE FUNCTION log_changes();

DROP TRIGGER IF EXISTS trigger_log_precuration_changes ON precurations;
CREATE TRIGGER trigger_log_precuration_changes
    AFTER INSERT OR UPDATE OR DELETE ON precurations
    FOR EACH ROW
    EXECUTE FUNCTION log_changes();

DROP TRIGGER IF EXISTS trigger_log_curation_changes ON curations;
CREATE TRIGGER trigger_log_curation_changes
    AFTER INSERT OR UPDATE OR DELETE ON curations
    FOR EACH ROW
    EXECUTE FUNCTION log_changes();

-- Create helper views for common queries
CREATE OR REPLACE VIEW curations_complete AS
SELECT 
    c.id,
    c.gene_id,
    g.approved_symbol,
    g.hgnc_id,
    c.mondo_id,
    c.disease_name,
    c.mode_of_inheritance,
    c.verdict,
    c.genetic_evidence_score,
    c.experimental_evidence_score,
    c.total_score,
    c.has_contradictory_evidence,
    c.summary_text,
    c.gcep_affiliation,
    c.status,
    c.approved_at,
    c.published_at,
    c.details,
    c.created_at,
    c.updated_at,
    creator.name as created_by_name,
    creator.email as created_by_email,
    approver.name as approved_by_name,
    approver.email as approved_by_email
FROM curations c
JOIN genes g ON c.gene_id = g.id
LEFT JOIN users creator ON c.created_by = creator.id
LEFT JOIN users approver ON c.approved_by = approver.id;

-- ClinGen statistics view
CREATE OR REPLACE VIEW clingen_statistics AS
SELECT 
    gcep_affiliation,
    verdict,
    COUNT(*) as curation_count,
    ROUND(AVG(genetic_evidence_score), 2) as avg_genetic_score,
    ROUND(AVG(experimental_evidence_score), 2) as avg_experimental_score,
    ROUND(AVG(total_score), 2) as avg_total_score,
    COUNT(*) FILTER (WHERE status = 'Approved') as approved_count,
    COUNT(*) FILTER (WHERE status = 'Published') as published_count,
    COUNT(*) FILTER (WHERE has_contradictory_evidence = true) as contradictory_count
FROM curations
GROUP BY gcep_affiliation, verdict
ORDER BY gcep_affiliation, verdict;

-- Evidence summary view
CREATE OR REPLACE VIEW evidence_summary AS
SELECT 
    c.id as curation_id,
    g.approved_symbol,
    c.mondo_id,
    c.disease_name,
    c.verdict,
    c.total_score,
    jsonb_array_length(COALESCE(c.details->'genetic_evidence'->'case_level_data', '[]'::jsonb)) as case_level_evidence_count,
    jsonb_array_length(COALESCE(c.details->'genetic_evidence'->'segregation_data', '[]'::jsonb)) as segregation_evidence_count,
    jsonb_array_length(COALESCE(c.details->'genetic_evidence'->'case_control_data', '[]'::jsonb)) as case_control_evidence_count,
    jsonb_array_length(COALESCE(c.details->'experimental_evidence'->'function', '[]'::jsonb)) as functional_evidence_count,
    jsonb_array_length(COALESCE(c.details->'experimental_evidence'->'models', '[]'::jsonb)) as model_evidence_count,
    jsonb_array_length(COALESCE(c.details->'experimental_evidence'->'rescue', '[]'::jsonb)) as rescue_evidence_count,
    jsonb_array_length(COALESCE(c.details->'external_evidence', '[]'::jsonb)) as external_evidence_count
FROM curations c
JOIN genes g ON c.gene_id = g.id;

-- Grant permissions to application user (will be created later)
-- These will be run when the application user is created