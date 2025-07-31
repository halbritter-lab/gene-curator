// config/inheritanceTermEqualityConfig.js

/**
 * Config file for mapping human phenotype ontology (HPO) terms related to inheritance patterns.
 * This configuration includes each HPO term's name, definition, short text, and equivalents.
 */
export const inheritanceTermEqualityConfig = {
    "HP:0000006": {
      hpoName: "Autosomal dominant inheritance",
      shortText: "Autosomal dominant",
      definition: "A mode of inheritance that is observed for traits related to a gene encoded on one of the autosomes...",
      abbreviation: "AD",
      equivalents: ["Autosomal dominant", "dominant", "AD", "Autosomal dominant inheritance"]
    },
    "HP:0000007": {
      hpoName: "Autosomal recessive inheritance",
      shortText: "Autosomal recessive",
      definition: "A mode of inheritance that is observed for traits related to a gene encoded on one of the autosomes...",
      abbreviation: "AR",
      equivalents: ["Autosomal recessive", "recessive", "AR", "Autosomal recessive inheritance"]
    },
    "HP:0001417": {
      hpoName: "X-linked other inheritance",
      shortText: "X-linked",
      definition: "A mode of inheritance that is observed for traits related to a gene encoded on the X chromosome.",
      abbreviation: "Xo",
      equivalents: ["X-linked", "Xo", "X-linked other inheritance"]
    },
    "HP:0001419": {
      hpoName: "X-linked recessive inheritance",
      shortText: "X-linked recessive",
      definition: "A mode of inheritance that is observed for recessive traits related to a gene encoded on the X chromosome...",
      abbreviation: "XR",
      equivalents: ["X-linked recessive", "recessive X-linked", "XR", "X-linked recessive inheritance"]
    },
    "HP:0001423": {
      hpoName: "X-linked dominant inheritance",
      shortText: "X-linked dominant",
      definition: "A mode of inheritance that is observed for dominant traits related to a gene encoded on the X chromosome...",
      abbreviation: "XD",
      equivalents: ["X-linked dominant", "dominant X-linked", "XD", "X-linked dominant inheritance"]
    },
    "HP:0001427": {
      hpoName: "Mitochondrial inheritance",
      shortText: "Mitochondrial",
      definition: "A mode of inheritance that is observed for traits related to a gene encoded on the mitochondrial genome...",
      abbreviation: "Mit",
      equivalents: ["Mitochondrial", "Mit", "Mitochondrial inheritance"]
    },
    "HP:0001428": {
      hpoName: "Somatic mutation",
      shortText: "Somatic",
      definition: "A mode of inheritance in which a trait or disorder results from a de novo mutation occurring after conception...",
      abbreviation: "Som",
      equivalents: ["Somatic", "Som", "Somatic mutation"]
    }
    // Additional mappings can be added here
  };
  

/**
 * Retrieves detailed information for a specific HPO term based on its ID.
 * 
 * @param {string} hpoId - The HPO ID for which term details are requested.
 * @returns {Object|null} An object containing term details if the ID is found, otherwise null.
 */
export function getInheritanceTermDetails(hpoId) {
    return inheritanceTermEqualityConfig[hpoId] || null;
  }
  

/**
 * Retrieves a list of equivalent terms for a given HPO term ID.
 * 
 * @param {string} hpoId - The HPO ID for which equivalent terms are requested.
 * @returns {string[]} An array of equivalent terms if the ID is found, otherwise an empty array.
 */
export function getEquivalentTerms(hpoId) {
const termDetails = getInheritanceTermDetails(hpoId);
return termDetails ? termDetails.equivalents : [];
}


/**
 * Finds the HPO term ID corresponding to an equivalent term.
 * 
 * @param {string} equivalentTerm - The equivalent term for which the corresponding HPO ID is required.
 * @returns {string|null} The HPO ID if a matching term is found, otherwise null.
 */
export function getHpoIdByEquivalentTerm(equivalentTerm) {
    for (const [hpoId, termDetails] of Object.entries(inheritanceTermEqualityConfig)) {
        if (termDetails.equivalents.includes(equivalentTerm)) {
        return hpoId;
        }
    }
    return null;
}
