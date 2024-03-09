// config/workflow/KidneyGeneticsGeneCuration/curationDetailsConfig.js

// Define the version of the curation details configuration
export const curationDetailsConfigVersion = '0.1.0';

// Define the curation details configuration
export const curationDetailsConfig = {
    approved_symbol: {
      label: 'Approved Symbol',
      format: 'text',
      description: 'The official symbol for the gene as provided by HGNC.',
      visibility: { tableView: true, standardView: true, curationView: true },
      style: { curationView: 'text-field'},
      group: {name: 'Entity Information', order: 1},
      required: true
    },
    hgnc_id: {
      label: 'HGNC ID',
      format: 'text',
      description: 'Unique identifier for the gene provided by the HGNC.',
      visibility: { tableView: false, standardView: false, curationView: false },
      style: { curationView: 'text-field'},
      group: {name: 'Entity Information', order: 1},
      required: true
    },
    disease: {
      label: 'Disease',
      format: 'text',
      description: 'MONDO identifier for the disease associated with the gene.',
      visibility: { tableView: true, standardView: true, curationView: true },
      style: { curationView: 'text-field'},
      group: {name: 'Entity Information', order: 1},
      required: true
    },
    inheritance: {
      label: 'Inheritance',
      format: 'text',
      options: ['Autosomal dominant', 'Autosomal recessive', 'X-linked other', 'X-linked recessive', 'X-linked dominant', 'Mitochondrial', 'Somatic mutation'],
      description: 'Type of inheritance pattern observed for the gene-related conditions.',
      visibility: { tableView: true, standardView: true, curationView: true },
      style: { curationView: 'select'},
      group: {name: 'Entity Information', order: 1},
      required: true
    },
    variants: {
      label: 'Genetic evidence',
      format: 'number',
      description: 'Points for genetic data. Give 0.5 points per LP/P variant in ClinVar.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'number-field'},
      min: 0,
      max: 12,
      step: 0.5,
      group: {name: 'Points', order: 2}
  },
  models: {
      label: 'Models',
      format: 'number',
      description: 'Points for animal or cellular models studied. Two points if MGI Phenotype and MOI fit, if only phenotype fits, give 1 point.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'number-field'},
      min: 0,
      max: 2,
      step: 0.5,
      group: {name: 'Points', order: 2}
  },
  functional: {
      label: 'Functional',
      format: 'number',
      description: 'Points for functional categories: Just add interaction_score and expression_score if available.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'number-field'},
      min: 0,
      max: 2,
      step: 0.5,
      group: {name: 'Points', order: 2}
  },
  rescue: {
      label: 'Rescue',
      format: 'number',
      description: 'Points for rescue experiments performed. Research in literature if necessary.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'number-field'},
      min: 0,
      max: 2,
      step: 0.5,
      group: {name: 'Points', order: 2}
  },
  replication: {
      label: 'Replication',
      format: 'text',
      description: 'References to replication studies after the initial clinical report.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'text-field'},
      group: {name: 'Points', order: 2}
  },
  clinical: {
      label: 'Clinical Group',
      format: 'array',
      options: ['complement_mediated_kidney_diseases', 'congenital_anomalies_of_the_kidney_and_urinary_tract', 'glomerulopathy', 'kidney_cystic_and_ciliopathy_disorders', 'tubulopathy', 'tubulointerstitial_disease', 'hereditary_cancer', 'nephrocalcinosis_or_nephrolithiasis'],
      description: 'Clinical categorization of the entity.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'select'},
      group: {name: 'Groups', order: 3}
  },
  onset: {
      label: 'Onset Group',
      format: 'array',
      options: ['adult', 'neonatal_or_pediatric', 'antenatal_or_congenital'],
      description: 'Classifications of the onset group for the entity.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'select'},
      group: {name: 'Groups', order: 3}
  },
  syndromic: {
      label: 'Syndromic',
      format: 'text',
      options: ['syndromic', 'non_syndromic'],
      description: 'Indicates if the entity is part of a syndromic group.',
      visibility: { tableView: false, standardView: true, curationView: true },
      style: { curationView: 'select'},
      group: {name: 'Groups', order: 3}
  },
  comment: {
    label: 'Comment',
    format: 'text',
    description: 'Curator’s comment about this curated entity.',
    visibility: { tableView: false, standardView: false, curationView: true },
    style: { curationView: 'text-field'},
    group: {name: 'Verdict', order: 3}
  },
  decision: {
    label: 'Verdict',
    format: 'text',
    options: ['Definitive', 'Strong', 'Moderate', 'Limited', 'Refuted'],
    description: 'The decision made during curation, such as "Definitive" or "Refuted".',
    visibility: { tableView: true, standardView: true, curationView: true },
    style: { curationView: 'select'},
    group: {name: 'Verdict', order: 3},
    required: true
  },
  createdAt: {
    label: 'Created At',
    format: 'date',
    description: 'The date and time when the curation record was created.',
    visibility: { tableView: false, standardView: true, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  updatedAt: {
    label: 'Updated At',
    format: 'date',
    description: 'The date and time when the curation record was last updated.',
    visibility: { tableView: false, standardView: true, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  workflowConfigVersionUsed: {
    label: 'Workflow Config Version Used',
    format: 'text',
    description: 'The version of the workflow configuration used to curate this entity.',
    visibility: { tableView: false, standardView: false, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  workflowConfigNameUsed: {
    label: 'Workflow Config Name Used',
    format: 'text',
    description: 'The name of the workflow configuration used to curate this entity.',
    visibility: { tableView: false, standardView: false, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  users: {
    label: 'Users',
    format: 'array',
    description: 'A list of user identifiers who have worked on this curation record.',
    visibility: { tableView: false, standardView: true, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  approvedBy: {
    label: 'Approved By',
    format: 'array',
    description: 'A list of user identifiers who have approved this curation.',
    visibility: { tableView: false, standardView: true, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  approvedAt: {
    label: 'Approved At',
    format: 'date',
    description: 'The date and time when the curation record was approved.',
    visibility: { tableView: false, standardView: true, curationView: false },
    group: {name: 'Metadata', order: 4}
  },
  // Additional fields can be added as per requirements.
};
