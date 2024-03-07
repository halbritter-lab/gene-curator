// config/workflow/KidneyGeneticsGeneCuration/geneDetailsConfig.js

// Define the version of the gene details configuration
export const geneDetailsConfigVersion = '0.1.0';

// Define the gene details configuration
export const geneDetailsConfig = {
  cur_id: {
    label: 'CUR ID',
    format: 'text',
    description: 'Unique identifier for the gene within the curation system.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  approved_symbol: {
    label: 'Approved Symbol',
    format: 'text',
    description: 'The official symbol provided by HGNC.',
    visibility: { tableView: true, standardView: true, curationView: false }
  },
  hgnc_id: {
    label: 'HGNC ID',
    format: 'text',
    description: 'Unique identifier provided by the HGNC.',
    visibility: { tableView: false, standardView: true, curationView: false }
  },
  clingen_summary: {
    label: 'ClinGen Summary',
    format: 'text',
    description: 'Summary information from the ClinGen database.',
    visibility: { tableView: false, standardView: true, curationView: true }
  },
  gencc_summary: {
    label: 'GenCC Summary',
    format: 'text',
    description: 'Summary from the GenCC database.',
    visibility: { tableView: false, standardView: true, curationView: true }
  },
  omim_summary: {
    label: 'OMIM Summary',
    format: 'array',
    separator: '|',
    description: 'Summary information from the Online Mendelian Inheritance in Man database.',
    visibility: { tableView: false, standardView: true, curationView: true }
  },
  clinical_groups_p: {
    label: 'Clinical Groups',
    format: 'text',
    description: 'Clinical groupings based on phenotype.',
    visibility: { tableView: false, standardView: true, curationView: true }
  },
  onset_groups_p: {
    label: 'Onset Groups',
    format: 'text',
    description: 'Information on the onset groups for the gene-related conditions.',
    visibility: { tableView: false, standardView: false, curationView: true }
  },
  syndromic_groups_p: {
    label: 'Syndromic Groups',
    format: 'text',
    description: 'Information about the syndromic grouping of the gene.',
    visibility: { tableView: false, standardView: false, curationView: true }
  },
  evidence_count: {
    label: 'Evidence Count',
    format: 'number',
    description: 'Count of evidence items associated with the gene.',
    visibility: { tableView: true, standardView: true, curationView: true }
  },
  source_count_percentile: {
    label: 'Source Count Percentile',
    format: 'number',
    description: 'The percentile rank based on the count of sources mentioning the gene.',
    visibility: { tableView: false, standardView: false, curationView: true }
  },
  clinvar: {
    label: 'ClinVar',
    format: 'map',
    separator: ';',
    keyValueSeparator: ':',
    description: 'Data from ClinVar including pathogenicity classifications.',
    visibility: { tableView: false, standardView: true, curationView: true }
  },
  descartes_kidney_tpm: {
    label: 'Descartes Kidney TPM',
    format: 'number',
    description: 'Transcripts Per Million in kidney tissue from Descartes dataset.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  gtex_kidney_cortex: {
    label: 'GTEx Kidney Cortex',
    format: 'number',
    description: 'Expression score from GTEx Kidney Cortex data.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  gtex_kidney_medulla: {
    label: 'GTEx Kidney Medulla',
    format: 'number',
    description: 'Expression score from GTEx Kidney Medulla data.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  expression_score: {
    label: 'Expression Score',
    format: 'number',
    description: 'Score based on gene expression levels.',
    visibility: { tableView: false, standardView: false, curationView: true }
  },
  interaction_score: {
    label: 'Interaction Score',
    format: 'number',
    description: 'Quantitative score representing gene interactions.',
    visibility: { tableView: false, standardView: false, curationView: true }
  },
  lof_z: {
    label: 'LOF Z',
    format: 'number',
    description: 'Loss of function Z-score.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  mis_z: {
    label: 'MIS Z',
    format: 'number',
    description: 'Missense Z-score.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  oe_lof: {
    label: 'OE LOF',
    format: 'number',
    description: 'Observed vs. expected loss of function score.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  pLI: {
    label: 'pLI Score',
    format: 'number',
    description: 'Probability of being loss-of-function intolerant (pLI) score.',
    visibility: { tableView: false, standardView: true, curationView: false }
  },
  mgi_phenotype: {
    label: 'MGI Phenotype',
    format: 'array',
    separator: ';',
    description: 'Phenotypic information from the Mouse Genome Informatics database.',
    visibility: { tableView: false, standardView: true, curationView: true }
  },
  stringdb_interaction_normalized_score: {
    label: 'StringDB Interaction Normalized Score',
    format: 'number',
    description: 'Normalized score of gene interactions from StringDB.',
    visibility: { tableView: false, standardView: false, curationView: true }
  },
  stringdb_interaction_string: {
    label: 'StringDB Interactions',
    format: 'array',
    separator: ';',
    description: 'List of interactions from StringDB.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  stringdb_interaction_sum_score: {
    label: 'StringDB Interaction Sum Score',
    format: 'number',
    description: 'Sum score of gene interactions from StringDB.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  createdAt: {
    label: 'Created At',
    format: 'date',
    description: 'Timestamp of when the gene record was created.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  updatedAt: {
    label: 'Updated At',
    format: 'date',
    description: 'The date and time when the gene record was last updated.',
    visibility: { tableView: false, standardView: true, curationView: false }
  },
  hasPrecuration: {
    label: 'Has Precuration',
    format: 'boolean',
    description: 'Indicates if the gene has been precurationed.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  hasCuration: {
    label: 'Has Curation',
    format: 'boolean',
    description: 'Indicates if the gene has been curated.',
    visibility: { tableView: false, standardView: false, curationView: false }
  },
  // Add additional fields as needed
};
