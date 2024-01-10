// config/geneDetailsConfig.js
export const geneDetailsConfig = {
  approved_symbol: {
    label: 'Approved Symbol',
    format: 'text',
    description: 'The official symbol provided by HGNC.',
    visibility: { standardView: true, curationView: true }
  },
  hgnc_id: {
    label: 'HGNC ID',
    format: 'text',
    description: 'Unique identifier provided by the HGNC.',
    visibility: { standardView: true, curationView: true }
  },
  clingen_summary: {
    label: 'ClinGen Summary',
    format: 'text',
    description: 'Summary information from the ClinGen database.',
    visibility: { standardView: true, curationView: true }
  },
  clinical_groups_p: {
    label: 'Clinical Groups',
    format: 'text',
    description: 'Clinical groupings based on phenotype.',
    visibility: { standardView: true, curationView: true }
  },
  clinvar: {
    label: 'ClinVar',
    format: 'map',
    separator: ';',
    keyValueSeparator: ':',
    description: 'Data from ClinVar including pathogenicity classifications.',
    visibility: { standardView: true, curationView: true }
  },
  createdAt: {
    label: 'Created At',
    format: 'date',
    description: 'Timestamp of when the gene record was created.',
    visibility: { standardView: false, curationView: false }
  },
  cur_id: {
    label: 'CUR ID',
    format: 'text',
    description: 'Unique identifier for the gene within the curation system.',
    visibility: { standardView: false, curationView: true }
  },
  descartes_kidney_tpm: {
    label: 'Descartes Kidney TPM',
    format: 'number',
    description: 'Transcripts Per Million in kidney tissue from Descartes dataset.',
    visibility: { standardView: false, curationView: true }
  },
  evidence_count: {
    label: 'Evidence Count',
    format: 'number',
    description: 'Count of evidence items associated with the gene.',
    visibility: { standardView: true, curationView: true }
  },
  expression_score: {
    label: 'Expression Score',
    format: 'number',
    description: 'Score based on gene expression levels.',
    visibility: { standardView: false, curationView: true }
  },
  gencc_summary: {
    label: 'GenCC Summary',
    format: 'text',
    description: 'Summary from the GenCC database.',
    visibility: { standardView: true, curationView: true }
  },
  gtex_kidney_cortex: {
    label: 'GTEx Kidney Cortex',
    format: 'number',
    description: 'Expression score from GTEx Kidney Cortex data.',
    visibility: { standardView: false, curationView: true }
  },
  gtex_kidney_medulla: {
    label: 'GTEx Kidney Medulla',
    format: 'number',
    description: 'Expression score from GTEx Kidney Medulla data.',
    visibility: { standardView: false, curationView: true }
  },
  interaction_score: {
    label: 'Interaction Score',
    format: 'number',
    description: 'Quantitative score representing gene interactions.',
    visibility: { standardView: false, curationView: true }
  },
  lof_z: {
    label: 'LOF Z',
    format: 'number',
    description: 'Loss of function Z-score.',
    visibility: { standardView: false, curationView: true }
  },
  mgi_phenotype: {
    label: 'MGI Phenotype',
    format: 'array',
    separator: ';',
    description: 'Phenotypic information from the Mouse Genome Informatics database.',
    visibility: { standardView: true, curationView: true }
  },
  mis_z: {
    label: 'MIS Z',
    format: 'number',
    description: 'Missense Z-score.',
    visibility: { standardView: false, curationView: true }
  },
  oe_lof: {
    label: 'OE LOF',
    format: 'number',
    description: 'Observed vs. expected loss of function score.',
    visibility: { standardView: false, curationView: true }
  },
  omim_summary: {
    label: 'OMIM Summary',
    format: 'array',
    separator: '|',
    description: 'Summary information from the Online Mendelian Inheritance in Man database.',
    visibility: { standardView: true, curationView: true }
  },
  onset_groups_p: {
    label: 'Onset Groups',
    format: 'text',
    description: 'Information on the onset groups for the gene-related conditions.',
    visibility: { standardView: false, curationView: true }
  },
  pLI: {
    label: 'pLI Score',
    format: 'number',
    description: 'Probability of being loss-of-function intolerant (pLI) score.',
    visibility: { standardView: true, curationView: true }
  },
  source_count_percentile: {
    label: 'Source Count Percentile',
    format: 'number',
    description: 'The percentile rank based on the count of sources mentioning the gene.',
    visibility: { standardView: false, curationView: true }
  },
  stringdb_interaction_normalized_score: {
    label: 'StringDB Interaction Normalized Score',
    format: 'number',
    description: 'Normalized score of gene interactions from StringDB.',
    visibility: { standardView: false, curationView: true }
  },
  stringdb_interaction_string: {
    label: 'StringDB Interactions',
    format: 'array',
    separator: ';',
    description: 'List of interactions from StringDB.',
    visibility: { standardView: false, curationView: true }
  },
  stringdb_interaction_sum_score: {
    label: 'StringDB Interaction Sum Score',
    format: 'number',
    description: 'Sum score of gene interactions from StringDB.',
    visibility: { standardView: false, curationView: true }
  },
  syndromic_groups_p: {
    label: 'Syndromic Groups',
    format: 'text',
    description: 'Information about the syndromic grouping of the gene.',
    visibility: { standardView: false, curationView: true }
  },
  // Add additional fields as needed
};
