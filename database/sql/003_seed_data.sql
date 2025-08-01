-- Seed Data for Gene Curator Database
-- Creates initial data for development and testing

-- Create application user for the API
CREATE USER gene_curator_app WITH PASSWORD 'app_password_change_in_production';

-- Grant necessary permissions to application user
-- Note: Database name is set by environment variable, this will work in both dev and prod
GRANT USAGE ON SCHEMA public TO gene_curator_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gene_curator_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gene_curator_app;

-- Grant permissions on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO gene_curator_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO gene_curator_app;

-- Create initial admin user
INSERT INTO users (
    email, 
    hashed_password, 
    name, 
    role,
    is_active
) VALUES (
    'admin@gene-curator.org',
    -- Password: 'admin123' - CHANGE IN PRODUCTION
    '$2b$12$LQv3c1yqBwEHxPiehz5.ZOKy0QLT4UqhsN8H8T0LkzKq5Q5Q5Q5Q5',
    'System Administrator',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Create sample curator user
INSERT INTO users (
    email,
    hashed_password,
    name,
    role,
    is_active
) VALUES (
    'curator@gene-curator.org',
    -- Password: 'curator123' - CHANGE IN PRODUCTION  
    '$2b$12$LQv3c1yqBwEHxPiehz5.ZOKy0QLT4UqhsN8H8T0LkzKq5Q5Q5Q5Q5',
    'Sample Curator',
    'curator',
    true
) ON CONFLICT (email) DO NOTHING;

-- Create sample viewer user
INSERT INTO users (
    email,
    hashed_password,
    name,
    role,
    is_active
) VALUES (
    'viewer@gene-curator.org',
    -- Password: 'viewer123' - CHANGE IN PRODUCTION
    '$2b$12$LQv3c1yqBwEHxPiehz5.ZOKy0QLT4UqhsN8H8T0LkzKq5Q5Q5Q5Q5',
    'Sample Viewer',
    'viewer',
    true
) ON CONFLICT (email) DO NOTHING;

-- Sample genes from kidney genetics and other disease areas
INSERT INTO genes (
    hgnc_id,
    approved_symbol,
    previous_symbols,
    alias_symbols,
    chromosome,
    location,
    details,
    record_hash,
    created_by
) VALUES 
(
    'HGNC:9076',
    'PKD1',
    ARRAY['PKD', 'PBP'],
    ARRAY['APKD1', 'ADPKD1'],
    '16',
    '16p13.3',
    '{
        "gene_type": "protein-coding",
        "gene_description": "polycystin 1, transient receptor potential channel interacting",
        "omim_id": "601313",
        "ensembl_id": "ENSG00000173262",
        "ncbi_gene_id": "5310",
        "uniprot_id": "P98161",
        "clingen_haploinsufficiency_score": "3",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Polycystic Kidney Disease", "Hereditary kidney disease"],
        "constraint_metrics": {
            "gnomad_pli": 1.0,
            "gnomad_oe_lof": 0.02,
            "gnomad_lof_z": 4.2,
            "gnomad_mis_z": 2.1
        }
    }',
    encode(digest(concat('HGNC:9076', 'PKD1', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'admin@gene-curator.dev')
),
(
    'HGNC:9077', 
    'PKD2',
    ARRAY['PKD4', 'TRPP2'],
    ARRAY['APKD2', 'ADPKD2'],
    '4',
    '4q22.1',
    ARRAY['Polycystin family', 'TRP channels'],
    'PKD2-related polycystic kidney disease',
    '{
        "gene_type": "protein-coding",
        "gene_description": "polycystin 2, transient receptor potential cation channel",
        "omim_id": "173910",
        "ensembl_id": "ENSG00000118762",
        "ncbi_gene_id": "5311",
        "uniprot_id": "Q13563",
        "clingen_haploinsufficiency_score": "3",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Polycystic Kidney Disease", "Hereditary kidney disease"],
        "constraint_metrics": {
            "gnomad_pli": 0.95,
            "gnomad_oe_lof": 0.03,
            "gnomad_lof_z": 3.8,
            "gnomad_mis_z": 1.9
        }
    }',
    encode(digest(concat('HGNC:9077', 'PKD2', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'admin@gene-curator.dev')
),
(
    'HGNC:7773',
    'NPHP1',
    ARRAY['NPH1', 'SLSN1'],
    ARRAY['nephrocystin-1'],
    '2',
    '2q13',
    ARRAY['Nephrocystin family'],
    'NPHP1-related nephronophthisis',
    '{
        "gene_type": "protein-coding", 
        "gene_description": "nephrocystin 1",
        "omim_id": "607100",
        "ensembl_id": "ENSG00000144061",
        "ncbi_gene_id": "4867",
        "uniprot_id": "O15259",
        "clingen_haploinsufficiency_score": "3",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Nephronophthisis", "Cystic kidney disease"],
        "constraint_metrics": {
            "gnomad_pli": 0.88,
            "gnomad_oe_lof": 0.12,
            "gnomad_lof_z": 2.5,
            "gnomad_mis_z": 1.2
        }
    }',
    encode(digest(concat('HGNC:7773', 'NPHP1', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'admin@gene-curator.dev')
),
(
    'HGNC:1101',
    'BRCA1',
    ARRAY['RNF53'],
    ARRAY['BRCAI', 'BRCC1'],
    '17',
    '17q21.31',
    ARRAY['BRCA family', 'RING finger proteins'],
    'BRCA1-related hereditary breast and ovarian cancer',
    '{
        "gene_type": "protein-coding",
        "gene_description": "BRCA1 DNA repair associated",
        "omim_id": "113705",
        "ensembl_id": "ENSG00000012048",
        "ncbi_gene_id": "672",
        "uniprot_id": "P38398",
        "clingen_haploinsufficiency_score": "3",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Hereditary breast and ovarian cancer", "Familial cancer"],
        "constraint_metrics": {
            "gnomad_pli": 1.0,
            "gnomad_oe_lof": 0.01,
            "gnomad_lof_z": 6.8,
            "gnomad_mis_z": 3.4
        }
    }',
    encode(digest(concat('HGNC:1101', 'BRCA1', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'admin@gene-curator.dev')
),
(
    'HGNC:1102',
    'BRCA2',
    ARRAY['FACD', 'FAD1'],
    ARRAY['BRCAI2', 'FANCD1'],
    '13',
    '13q13.1',
    ARRAY['BRCA family', 'Fanconi anemia proteins'],
    'BRCA2-related hereditary breast and ovarian cancer',
    '{
        "gene_type": "protein-coding",
        "gene_description": "BRCA2 DNA repair associated", 
        "omim_id": "600185",
        "ensembl_id": "ENSG00000139618",
        "ncbi_gene_id": "675",
        "uniprot_id": "P51587",
        "clingen_haploinsufficiency_score": "3",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Hereditary breast and ovarian cancer", "Familial cancer"],
        "constraint_metrics": {
            "gnomad_pli": 1.0,
            "gnomad_oe_lof": 0.02,
            "gnomad_lof_z": 5.9,
            "gnomad_mis_z": 2.8
        }
    }',
    encode(digest(concat('HGNC:1102', 'BRCA2', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'admin@gene-curator.dev')
),
(
    'HGNC:4893',
    'HNPP1',
    ARRAY['HNPP'],
    ARRAY['hereditary neuropathy with liability to pressure palsies'],
    '17',
    '17p12',
    ARRAY['PMP22 family'],
    'HNPP1-related hereditary neuropathy with liability to pressure palsies',
    '{
        "gene_type": "protein-coding",
        "gene_description": "hereditary neuropathy with liability to pressure palsies 1",
        "omim_id": "162500",
        "ensembl_id": "ENSG00000089048",
        "ncbi_gene_id": "5264",
        "uniprot_id": "Q01453",
        "clingen_haploinsufficiency_score": "2",
        "clingen_triplosensitivity_score": "1",
        "panelapp_green_panels": ["Peripheral neuropathy", "Hereditary motor and sensory neuropathy"],
        "constraint_metrics": {
            "gnomad_pli": 0.67,
            "gnomad_oe_lof": 0.45,
            "gnomad_lof_z": 1.8,
            "gnomad_mis_z": 0.9
        }
    }',
    encode(digest(concat('HGNC:4893', 'HNPP1', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'curator@gene-curator.dev')
),
(
    'HGNC:8975',
    'PCSK9',
    ARRAY['FH3', 'NARC1'],
    ARRAY['PCSK9'],
    '1',
    '1p32.3',
    ARRAY['Proprotein convertase family'],
    'PCSK9-related hypercholesterolemia',
    '{
        "gene_type": "protein-coding",
        "gene_description": "proprotein convertase subtilisin/kexin type 9",
        "omim_id": "607786",
        "ensembl_id": "ENSG00000169174",
        "ncbi_gene_id": "255738",
        "uniprot_id": "Q8NBP7",
        "clingen_haploinsufficiency_score": "1",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Familial hypercholesterolaemia", "Lipid disorders"],
        "constraint_metrics": {
            "gnomad_pli": 0.12,
            "gnomad_oe_lof": 0.78,
            "gnomad_lof_z": 0.5,
            "gnomad_mis_z": 2.3
        }
    }',
    encode(digest(concat('HGNC:8975', 'PCSK9', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'curator@gene-curator.dev')
),
(
    'HGNC:2197',
    'COL4A5',
    ARRAY['ATS', 'CA85'],
    ARRAY['Alport syndrome, X-linked'],
    'X',
    'Xq22.3',
    ARRAY['Collagen family', 'Type IV collagen'],
    'COL4A5-related Alport syndrome',
    '{
        "gene_type": "protein-coding",
        "gene_description": "collagen type IV alpha 5 chain",
        "omim_id": "303630",
        "ensembl_id": "ENSG00000188153",
        "ncbi_gene_id": "1287",
        "uniprot_id": "P29400",
        "clingen_haploinsufficiency_score": "3",
        "clingen_triplosensitivity_score": "0",
        "panelapp_green_panels": ["Alport syndrome", "Hereditary nephritis"],
        "constraint_metrics": {
            "gnomad_pli": 1.0,
            "gnomad_oe_lof": 0.05,
            "gnomad_lof_z": 4.1,
            "gnomad_mis_z": 3.2
        }
    }',
    encode(digest(concat('HGNC:2197', 'COL4A5', EXTRACT(epoch FROM NOW())::text), 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'curator@gene-curator.dev')
);

-- Sample precuration
INSERT INTO precurations (
    gene_id,
    mondo_id,
    mode_of_inheritance,
    lumping_splitting_decision,
    rationale,
    status,
    details,
    created_by
) VALUES (
    (SELECT id FROM genes WHERE approved_symbol = 'PKD1'),
    'MONDO:0009691',
    'autosomal dominant',
    'Lump',
    'PKD1 variants cause a spectrum of polycystic kidney disease phenotypes that should be lumped under a single entity due to shared pathophysiology and clinical management.',
    'Approved',
    '{
        "disease_name": "Polycystic kidney disease 1",
        "disease_description": "Autosomal dominant polycystic kidney disease characterized by progressive kidney cyst development",
        "clinical_features": ["Progressive kidney enlargement", "Kidney cysts", "Hypertension", "Kidney failure"],
        "age_of_onset": "Adult onset (typically 30-50 years)",
        "prevalence": "1 in 400-1000 individuals"
    }',
    (SELECT id FROM users WHERE email = 'curator@gene-curator.org')
);

-- Sample curation with ClinGen evidence
INSERT INTO curations (
    gene_id,
    precuration_id,
    mondo_id,
    mode_of_inheritance,
    disease_name,
    gcep_affiliation,
    status,
    details,
    created_by
) VALUES (
    (SELECT id FROM genes WHERE approved_symbol = 'PKD1'),
    (SELECT id FROM precurations WHERE mondo_id = 'MONDO:0009691'),
    'MONDO:0009691',
    'autosomal dominant',
    'Polycystic kidney disease 1',
    'Kidney GCEP',
    'Draft',
    '{
        "lumping_splitting_details": "PKD1 variants cause a spectrum of polycystic kidney disease phenotypes. All should be lumped under polycystic kidney disease 1 due to shared pathophysiology.",
        "variant_spectrum_summary": "Over 3000 variants have been reported in PKD1, including missense (45%), frameshift (20%), nonsense (15%), splice site (15%), and large deletions (5%).",
        "disease_mechanism": "loss of function",
        
        "genetic_evidence": {
            "case_level_data": [
                {
                    "pmid": "12345678",
                    "proband_label": "Torres et al, Family 1",
                    "hpo_terms": ["HP:0000003", "HP:0000107", "HP:0000822"],
                    "variant_type": "Predicted or Proven Null",
                    "is_de_novo": false,
                    "functional_impact_evidence": "Frameshift variant leading to premature termination",
                    "points": 1.5,
                    "rationale": "Null variant in affected individual with typical PKD phenotype"
                },
                {
                    "pmid": "87654321", 
                    "proband_label": "Harris et al, Proband 12",
                    "hpo_terms": ["HP:0000003", "HP:0000107"],
                    "variant_type": "Predicted or Proven Null",
                    "is_de_novo": false,
                    "functional_impact_evidence": "Nonsense variant confirmed by protein studies",
                    "points": 0.5,
                    "rationale": "Second null variant case, additional 0.5 points"
                }
            ],
            "segregation_data": [
                {
                    "pmid": "11223344",
                    "family_label": "European PKD Consortium, Family A",
                    "sequencing_method": "Exome sequencing",
                    "lod_score_published": 3.8,
                    "points": 2.0,
                    "rationale": "Strong segregation evidence with LOD score > 2.0"
                }
            ],
            "case_control_data": [
                {
                    "pmid": "55667788",
                    "study_type": "Aggregate variant analysis",
                    "odds_ratio": 12.4,
                    "confidence_interval": "8.2-18.7",
                    "p_value": 0.0001,
                    "points": 4.0,
                    "rationale": "Strong case-control evidence with high odds ratio"
                }
            ]
        },
        
        "experimental_evidence": {
            "function": [
                {
                    "type": "Biochemical Function",
                    "pmid": "99887766",
                    "description": "PKD1 protein shown to function as calcium channel in kidney cells",
                    "points": 0.5
                }
            ],
            "models": [
                {
                    "type": "Non-human model organism",
                    "pmid": "44556677",
                    "description": "Pkd1 knockout mice develop polycystic kidneys recapitulating human disease",
                    "points": 2.0
                }
            ],
            "rescue": [
                {
                    "type": "Rescue in non-human model",
                    "pmid": "22334455",
                    "description": "Wild-type PKD1 expression rescues cystic phenotype in Pkd1-/- mouse model",
                    "points": 1.0
                }
            ]
        },
        
        "contradictory_evidence": [],
        
        "external_evidence": [
            {
                "source_name": "ClinVar",
                "source_id": "PKD1_variants",
                "source_version": "2024-01",
                "date_accessed": "2024-01-15",
                "classification": "Pathogenic/Likely Pathogenic",
                "submitted_disease": "Polycystic kidney disease",
                "confidence_level": "Expert_Reviewed",
                "additional_metadata": {
                    "pathogenic_variants": 2847,
                    "likely_pathogenic_variants": 892,
                    "vus_variants": 1234
                }
            }
        ],
        
        "ancillary_data": {
            "constraint_metrics": [
                {
                    "source": "gnomAD",
                    "version": "v2.1.1", 
                    "date_accessed": "2024-01-15",
                    "pLI": 1.0,
                    "oe_lof": 0.02,
                    "lof_z": 4.2,
                    "mis_z": 2.1
                }
            ],
            "expression_data": [
                {
                    "source": "GTEx",
                    "version": "v8",
                    "date_accessed": "2024-01-15",
                    "measurements": [
                        {"tissue": "Kidney - Cortex", "value": 12.3, "unit": "TPM", "sample_size": 73},
                        {"tissue": "Kidney - Medulla", "value": 8.7, "unit": "TPM", "sample_size": 4}
                    ]
                }
            ]
        },
        
        "curation_workflow": {
            "status": "Draft",
            "clingen_compliance_status": "Validated",
            "primary_curator": "curator@gene-curator.org",
            "secondary_curator": null,
            "created_at": "2024-01-15T10:00:00Z",
            "last_modified": "2024-01-15T14:30:00Z",
            "review_log": [
                {
                    "timestamp": "2024-01-15T10:00:00Z",
                    "user_email": "curator@gene-curator.org",
                    "action": "curation_created",
                    "comment": "Initial curation created with comprehensive evidence",
                    "changes_made": {
                        "evidence_entries": 6,
                        "external_sources": 1
                    }
                }
            ],
            "flags": {
                "conflicting_evidence": false,
                "insufficient_evidence": false,
                "clingen_compliant": true,
                "ready_for_review": true
            }
        }
    }',
    (SELECT id FROM users WHERE email = 'curator@gene-curator.org')
);

-- The curation above should automatically calculate scores via triggers
-- Let's verify by checking the calculated scores
DO $$
DECLARE
    curation_record RECORD;
BEGIN
    SELECT genetic_evidence_score, experimental_evidence_score, total_score, verdict 
    INTO curation_record
    FROM curations 
    WHERE mondo_id = 'MONDO:0009691';
    
    RAISE NOTICE 'PKD1 Curation Scores - Genetic: %, Experimental: %, Total: %, Verdict: %', 
        curation_record.genetic_evidence_score,
        curation_record.experimental_evidence_score, 
        curation_record.total_score,
        curation_record.verdict;
END $$;

-- Create sample API key for development
INSERT INTO api_keys (
    name,
    key_hash,
    user_id,
    permissions,
    expires_at,
    is_active
) VALUES (
    'Development API Key',
    encode(digest('dev-api-key-12345', 'sha256'), 'hex'),
    (SELECT id FROM users WHERE email = 'admin@gene-curator.org'),
    ARRAY['read', 'write', 'admin'],
    NOW() + INTERVAL '1 year',
    true
);

-- Update statistics
ANALYZE;