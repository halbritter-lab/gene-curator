// config/workflow/KidneyGeneticsGeneCuration/precurationDetailsConfig.js

// Define the version of the precuration details configuration
export const precurationDetailsConfigVersion = '0.1.0';

// Define the precuration details configuration
export const precurationDetailsConfig = {
    approved_symbol: {
      label: 'Approved Symbol',
      format: 'text',
      description: 'The official gene symbol approved by the HGNC.',
      visibility: { tableView: true, standardView: true, curationView: false }
    },
    hgnc_id: {
      label: 'HGNC ID',
      format: 'text',
      description: 'The unique identifier for the gene provided by the HGNC.',
      visibility: { tableView: false, standardView: true, curationView: false }
    },
    entity_assertion: {
      label: 'Entity Assertion',
      format: 'boolean',
      description: 'A boolean value indicating whether an assertion about the entity was made.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    inheritance_difference: {
      label: 'Inheritance Difference',
      format: 'boolean',
      description: 'Indicates if there is a difference in inheritance patterns noted.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    mechanism_difference: {
      label: 'Mechanism Difference',
      format: 'boolean',
      description: 'Indicates if there is a difference in the mechanism of action noted.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    phenotypic_variability: {
      label: 'Phenotypic Variability',
      format: 'boolean',
      description: 'Indicates if there is phenotypic variability associated with the gene.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    decision: {
      label: 'Decision',
      format: 'text',
      description: 'The decision made during precuration, such as "lump" or "split".',
      visibility: { tableView: true, standardView: true, curationView: true }
    },
    comment: {
      label: 'Comment',
      format: 'text',
      description: 'Curator’s comment about the decision made regarding the gene.',
      visibility: { tableView: false, standardView: true, curationView: true }
    },
    createdAt: {
      label: 'Created At',
      format: 'date',
      description: 'The date and time when the precuration record was created.',
      visibility: { tableView: true, standardView: true, curationView: false }
    },
    updatedAt: {
      label: 'Updated At',
      format: 'date',
      description: 'The date and time when the precuration record was last updated.',
      visibility: { tableView: false, standardView: true, curationView: false }
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
      description: 'A list of user identifiers who have worked on this precuration record.',
      visibility: { tableView: false, standardView: true, curationView: false }
    },
    approvedBy: {
      label: 'Approved By',
      format: 'array',
      description: 'A list of user identifiers who have approved this curation.',
      visibility: { tableView: false, standardView: true, curationView: false }
    },
    approvedAt: {
      label: 'Approved At',
      format: 'date',
      description: 'The date and time when the curation record was approved.',
      visibility: { tableView: false, standardView: true, curationView: false }
    },
    // Add additional fields as needed based on the specific requirements of the precuration workflow.
  };
  