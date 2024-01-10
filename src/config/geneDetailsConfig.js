// config/geneDetailsConfig.js
export const geneDetailsConfig = {
  approved_symbol: { label: 'Approved Symbol', format: 'text' },
  clingen_summary: { label: 'ClinGen Summary', format: 'text' },
  clinical_groups_p: { label: 'Clinical Groups', format: 'text' }, // TODO: Change to nested map
  clinvar: { label: 'ClinVar', format: 'map', separator: ';', keyValueSeparator: ':' },
  createdAt: { label: 'Created At', format: 'date' },
  cur_id: { label: 'CUR ID', format: 'text' },
  descartes_kidney_tpm: { label: 'Descartes Kidney TPM', format: 'number' },
  evidence_count: { label: 'Evidence Count', format: 'number' },
  expression_score: { label: 'Expression Score', format: 'number' },
  gencc_summary: { label: 'GenCC Summary', format: 'text' }, // TODO: Change to nested map
  gtex_kidney_cortex: { label: 'GTEx Kidney Cortex', format: 'number' },
  gtex_kidney_medulla: { label: 'GTEx Kidney Medulla', format: 'number' },
  hgnc_id: { label: 'HGNC ID', format: 'text' },
  interaction_score: { label: 'Interaction Score', format: 'number' },
  lof_z: { label: 'LOF Z', format: 'number' },
  mgi_phenotype: { label: 'MGI Phenotype', format: 'array', separator: ';' }, // TODO: Change to map
  mis_z: { label: 'MIS Z', format: 'number' },
  oe_lof: { label: 'OE LOF', format: 'number' },
  omim_summary: { label: 'OMIM Summary', format: 'array', separator: '|' }, // TODO: Change to nested map
  onset_groups_p: { label: 'Onset Groups', format: 'text' }, // TODO: Change to nested map
  pLI: { label: 'pLI Score', format: 'text' },
  source_count_percentile: { label: 'Source Count Percentile', format: 'number' },
  stringdb_interaction_normalized_score: { label: 'StringDB Interaction Normalized Score', format: 'number' },
  stringdb_interaction_string: { label: 'StringDB Interactions', format: 'array', separator: ';' },
  stringdb_interaction_sum_score: { label: 'StringDB Interaction Sum Score', format: 'number' },
  syndromic_groups_p: { label: 'Syndromic Groups', format: 'text' }, // TODO: Change to nested map
  // Add additional fields as needed
};
