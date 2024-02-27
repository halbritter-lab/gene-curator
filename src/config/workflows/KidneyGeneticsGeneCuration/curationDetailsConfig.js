// config/workflow/KidneyGeneticsGeneCuration/curationDetailsConfig.js

// Define the version of the curation details configuration
export const curationDetailsConfigVersion = '0.1.0';

// Define the curation details configuration
export const curationDetailsConfig = {
    approved_symbol: {
      label: 'Approved Symbol',
      format: 'text',
      description: 'The official symbol for the gene as provided by HGNC.',
      visibility: { tableView: true, standardView: true, curationView: true }
    },
    hgnc_id: {
      label: 'HGNC ID',
      format: 'text',
      description: 'Unique identifier for the gene provided by the HGNC.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    disease: {
      label: 'Disease',
      format: 'text',
      description: 'MONDO identifier for the disease associated with the gene.',
      visibility: { tableView: true, standardView: true, curationView: true }
    },
    inheritance: {
      label: 'Inheritance',
      format: 'text',
      description: 'Type of inheritance pattern observed for the gene-related conditions.',
      visibility: { tableView: true, standardView: true, curationView: true }
    },
    groups: {
      label: 'Groups',
      format: 'object',
      description: 'Group classifications for the gene, such as clinical and syndromic categorizations.',
      visibility: { tableView: false, standardView: true, curationView: true },
      subfields: {
        clinical: {
          label: 'Clinical Group',
          format: 'text',
          description: 'Clinical categorization of the gene.',
          visibility: { standardView: true, curationView: true }
        },
        onset: {
          label: 'Onset Group',
          format: 'text',
          description: 'Classifications of the onset group for the gene.',
          visibility: { standardView: true, curationView: true }
        },
        syndromic: {
          label: 'Syndromic',
          format: 'boolean',
          description: 'Indicates if the gene is part of a syndromic group.',
          visibility: { standardView: true, curationView: true }
        }
      }
    },
    points: {
      label: 'Points',
      format: 'object',
      description: 'Quantitative and qualitative assessment points for the gene.',
      visibility: { tableView: false, standardView: true, curationView: true },
      subfields: {
        variants: {
          label: 'Variants',
          format: 'number',
          description: 'Number of variants identified.',
          visibility: { standardView: true, curationView: true }
        },
        models: {
          label: 'Models',
          format: 'number',
          description: 'Number of animal or cellular models studied.',
          visibility: { tableView: false, standardView: true, curationView: true }
        },
        functional: {
          label: 'Functional',
          format: 'number',
          description: 'Number of functional studies performed.',
          visibility: { tableView: false, standardView: true, curationView: true }
        },
        rescue: {
          label: 'Rescue',
          format: 'number',
          description: 'Number of rescue experiments performed.',
          visibility: { tableView: false, standardView: true, curationView: true }
        },
        replication: {
          label: 'Replication',
          format: 'array',
          description: 'References to replication studies.',
          visibility: { tableView: false, standardView: true, curationView: true }
        },
      }
    },
    createdAt: {
      label: 'Created At',
      format: 'date',
      description: 'The date and time when the curation record was created.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    updatedAt: {
      label: 'Updated At',
      format: 'date',
      description: 'The date and time when the curation record was last updated.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    comment: {
      label: 'Comment',
      format: 'text',
      description: 'Curator’s comment about this curated entity.',
      visibility: { tableView: false, standardView: false, curationView: true }
    },
    workflowConfigVersionUsed: {
      label: 'Workflow Config Version Used',
      format: 'text',
      description: 'The version of the workflow configuration used to curate this entity.',
      visibility: { tableView: false, standardView: false, curationView: true }
    },
    workflowConfigNameUsed: {
      label: 'Workflow Config Name Used',
      format: 'text',
      description: 'The name of the workflow configuration used to curate this entity.',
      visibility: { tableView: false, standardView: false, curationView: true }
    },
    users: {
      label: 'Users',
      format: 'array',
      description: 'A list of user identifiers who have worked on this curation record.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    approvedBy: {
      label: 'Approved By',
      format: 'array',
      description: 'A list of user identifiers who have approved this curation.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    approvedAt: {
      label: 'Approved At',
      format: 'date',
      description: 'The date and time when the curation record was approved.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    // Additional fields can be added as per requirements.
  };
  