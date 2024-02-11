// config/workflow/KidneyGeneticsGeneCuration/workflowConfig.js

// Importing step-specific configurations
import { geneDetailsConfig, geneDetailsConfigVersion } from './geneDetailsConfig';
import { precurationDetailsConfig, precurationDetailsConfigVersion } from './precurationDetailsConfig';
import { curationDetailsConfig, curationDetailsConfigVersion } from './curationDetailsConfig';

export const workflowConfig = {
    name: 'Kidney Genetics Gene Curation',
    version: '0.1.0',
    stages: {
      gene: {
        configFile: 'geneDetailsConfig.js',
        version: '0.1.0',
        checksum: 'md5-checksum-of-gene-config',
        nextStage: 'precuration'
      },
      precuration: {
        configFile: 'precurationDetailsConfig.js',
        version: '0.1.0',
        checksum: 'md5-checksum-of-precuration-config',
        nextStage: 'curation',
        prefillRules: [
          // Define rules to prefill data from gene to pre-curation
        ],
        decisionRules: [
          // Rules for decisions
        ]
      },
      curation: {
        configFile: 'curationDetailsConfig.js',
        version: '0.1.0',
        checksum: 'md5-checksum-of-curation-config',
        nextStage: null,
        prefillRules: [
          // Define rules to prefill data from gene and pre-curation to curation
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