// config/workflow/KidneyGeneticsGeneCuration/workflowConfig.js

// Importing step-specific configurations
import { geneDetailsConfig, geneDetailsConfigVersion } from './geneDetailsConfig';
import { precurationDetailsConfig, precurationDetailsConfigVersion } from './precurationDetailsConfig';
import { curationDetailsConfig, curationDetailsConfigVersion } from './curationDetailsConfig';

// Importing static help configurations
import geneHelpConfig from './static/geneHelp.json';
import precurationHelpConfig from './static/precurationHelp.json';
import curationHelpConfig from './static/curationHelp.json';

// Defining the workflow configuration version and name
export const workflowConfigVersion = '0.2.0';
export const workflowConfigName = 'Kidney Genetics Gene Curation';

// Defining the workflow configuration
export const workflowConfig = {
    stages: {
      gene: {
        configFile: 'geneDetailsConfig.js',
        version: '0.2.0',
        helpConfig: geneHelpConfig,
        checksum: 'md5-checksum-of-gene-config',
        nextStage: 'precuration'
      },
      precuration: {
        configFile: 'precurationDetailsConfig.js',
        version: '0.2.0',
        helpConfig: precurationHelpConfig,
        checksum: 'md5-checksum-of-precuration-config',
        nextStage: 'curation',
        prefillRules: [
          {
            source: 'geneDetailsConfig',
            target: 'precurationDetailsConfig',
            fields: [
              { sourceField: 'approved_symbol', targetField: 'approved_symbol' },
              { sourceField: 'hgnc_id', targetField: 'hgnc_id' },
              // Add more field mappings as needed
            ],
          },
          // Other rules can be added here
        ],
        decisionRules: [
          {
            conditions: [
              'entity_assertion', 
              'inheritance_difference', 
              'mechanism_difference', 
              'phenotypic_variability'
            ],
            decision: 'Split', // Or any other default decision
            threshold: 2 // Minimum number of true conditions to trigger this decision
          }
        ]
      },
      curation: {
        configFile: 'curationDetailsConfig.js',
        version: '0.2.0',
        helpConfig: curationHelpConfig,
        checksum: 'md5-checksum-of-curation-config',
        nextStage: null,
        prefillRules: [
          {
            source: 'geneDetailsConfig',
            target: 'curationDetailsConfig',
            fields: [
              { sourceField: 'approved_symbol', targetField: 'approved_symbol' },
              { sourceField: 'hgnc_id', targetField: 'hgnc_id' },
              // Add more field mappings as needed
            ],
          },
          // Other rules can be added here
        ],
        multipleCurationRules: [
          // Rules for multiple curation scenarios
        ]
      }
    },
    validateConfigIntegrity() {
      // Implementation for validating checksums and versions
    }
  };

// Re-exporting individual configurations
export { geneDetailsConfig, geneDetailsConfigVersion, precurationDetailsConfig, precurationDetailsConfigVersion, curationDetailsConfig, curationDetailsConfigVersion };
