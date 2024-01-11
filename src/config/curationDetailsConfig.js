// config/curationDetailsConfig.js
export const curationDetailsConfig = {
    approved_symbol: {
      label: 'Approved Symbol',
      format: 'text',
      description: 'The official symbol for the gene as provided by HGNC.',
      visibility: { standardView: true, curationView: true }
    },
    hgnc_id: {
      label: 'HGNC ID',
      format: 'text',
      description: 'Unique identifier for the gene provided by the HGNC.',
      visibility: { standardView: true, curationView: true }
    },
    disease: {
      label: 'Disease',
      format: 'text',
      description: 'MONDO identifier for the disease associated with the gene.',
      visibility: { standardView: true, curationView: true }
    },
    inheritance: {
      label: 'Inheritance',
      format: 'text',
      description: 'Type of inheritance pattern observed for the gene-related conditions.',
      visibility: { standardView: true, curationView: true }
    },
    groups: {
      label: 'Groups',
      format: 'object',
      description: 'Group classifications for the gene, such as clinical and syndromic categorizations.',
      visibility: { standardView: true, curationView: true },
      subfields: {
        clinical: {
          label: 'Clinical Group',
          format: 'text',
          description: 'Clinical categorization of the gene.',
          visibility: { standardView: true, curationView: true }
        },
        onset: {
          label: 'Onset Group',
          format: 'array',
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
    users: {
      label: 'Users',
      format: 'array',
      description: 'A list of user identifiers who have worked on this curation record.',
      visibility: { standardView: true, curationView: true }
    },
    comment: {
      label: 'Comment',
      format: 'text',
      description: 'Curator’s comment about the decision made regarding the gene.',
      visibility: { standardView: false, curationView: true }
    }
    // Additional fields can be added as per requirements.
  };
  