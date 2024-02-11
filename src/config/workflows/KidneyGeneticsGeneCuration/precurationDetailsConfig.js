// config/workflow/KidneyGeneticsGeneCuration/precurationDetailsConfig.js

export const precurationDetailsConfigVersion = '0.1.0';

export const precurationDetailsConfig = {
    approved_symbol: {
      label: 'Approved Symbol',
      format: 'text',
      description: 'The official gene symbol approved by the HGNC.',
      visibility: { standardView: true, curationView: true }
    },
    hgnc_id: {
      label: 'HGNC ID',
      format: 'text',
      description: 'The unique identifier for the gene provided by the HGNC.',
      visibility: { standardView: true, curationView: true }
    },
    entity_assertion: {
      label: 'Entity Assertion',
      format: 'boolean',
      description: 'A boolean value indicating whether an assertion about the entity was made.',
      visibility: { standardView: true, curationView: true }
    },
    inheritance_difference: {
      label: 'Inheritance Difference',
      format: 'boolean',
      description: 'Indicates if there is a difference in inheritance patterns noted.',
      visibility: { standardView: true, curationView: true }
    },
    mechanism_difference: {
      label: 'Mechanism Difference',
      format: 'boolean',
      description: 'Indicates if there is a difference in the mechanism of action noted.',
      visibility: { standardView: true, curationView: true }
    },
    phenotypic_variability: {
      label: 'Phenotypic Variability',
      format: 'boolean',
      description: 'Indicates if there is phenotypic variability associated with the gene.',
      visibility: { standardView: true, curationView: true }
    },
    decision: {
      label: 'Decision',
      format: 'text',
      description: 'The decision made during precuration, such as "lump" or "split".',
      visibility: { standardView: true, curationView: true }
    },
    comment: {
      label: 'Comment',
      format: 'text',
      description: 'Curator’s comment about the decision made regarding the gene.'
    },
    createdAt: {
      label: 'Created At',
      format: 'date',
      description: 'The date and time when the precuration record was created.',
      visibility: { standardView: true, curationView: true }
    },
    updatedAt: {
      label: 'Updated At',
      format: 'date',
      description: 'The date and time when the precuration record was last updated.',
      visibility: { standardView: true, curationView: true }
    },
    users: {
      label: 'Users',
      format: 'array',
      description: 'A list of user identifiers who have worked on this precuration record.',
      visibility: { standardView: true, curationView: true }
    },
    // Add additional fields as needed based on the specific requirements of the precuration workflow.
  };
  