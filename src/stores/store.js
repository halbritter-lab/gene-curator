// store.js

import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Firestore API
import { db } from '@/firebase'; // Firebase app instance
import Papa from 'papaparse'; // for CSV parsing

/**
 * Fetches and returns a dictionary of gene data from the Firestore 'genes' collection, indexed by a unique identifier.
 * 
 * @async
 * @function getGenes
 * @param {Array<string>} [uniqueColumns=['hgnc_id', 'cur_id']] - The columns used to create a unique identifier for each gene.
 * @returns {Promise<Object>} - A promise that resolves to an object where each key is a unique identifier constructed from the specified columns, and each value is the gene data along with its Firestore document ID.
 * @description This function asynchronously retrieves all documents from the 'genes' collection in Firestore and indexes them using a unique identifier created from the specified columns.
 */
export const getGenes = async (uniqueColumns = ['hgnc_id', 'cur_id']) => {
  const querySnapshot = await getDocs(collection(db, 'genes'));
  let fetchedItems = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Construct the unique identifier using specified columns
    const uniqueId = uniqueColumns.map(column => data[column]).join('-');
    fetchedItems[uniqueId] = { ...data, docId: doc.id };
  });

  return fetchedItems;
};


/**
 * Creates a new gene document in the Firestore 'genes' collection.
 *
 * @async
 * @function createGene
 * @param {Object} geneData - An object containing the data for the new gene.
 * @returns {Promise<string>} - A promise that resolves with the new document's ID once the creation is complete.
 * @throws {Error} - Throws an error if the gene data is invalid or the creation fails.
 * @description This function creates a new gene document in the Firestore 'genes' collection after validating the provided data.
 */
export const createGene = async (geneData) => {
  try {
    validateGeneData(geneData); // Validate gene data before creating
    const docRef = await addDoc(collection(db, 'genes'), geneData);
    return docRef.id; // Returns the new document's ID
  } catch (error) {
    throw new Error(`Failed to create gene: ${error.message}`);
  }
};


/**
 * Retrieves a specific gene document from the Firestore 'genes' collection.
 *
 * @async
 * @function getGene
 * @param {string} docId - The document ID of the gene to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the gene data.
 * @throws {Error} - Throws an error if the document doesn't exist or the retrieval fails.
 * @description This function retrieves a specific gene document from the Firestore 'genes' collection using the provided document ID.
 */
export const getGene = async (docId) => {
  const geneRef = doc(db, 'genes', docId);
  const docSnap = await getDoc(geneRef);

  if (docSnap.exists()) {
    return { docId: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("No such document!");
  }
};


/**
 * Updates a specific gene document in the Firestore 'genes' collection.
 *
 * @async
 * @function updateGene
 * @param {string} docId - The document ID of the gene to update.
 * @param {Object} updatedData - An object containing the fields to update and their new values.
 * @returns {Promise<void>} - A promise that resolves once the update is complete.
 * @throws {Error} - Throws an error if the document ID is missing, the data is invalid, or the update fails.
 * @description This function updates the specified fields of a single gene document in the Firestore 'genes' collection after validating the provided data.
 */
export const updateGene = async (docId, updatedData) => {
  try {
    if (!docId) throw new Error("Document ID is required for updating.");
    validateGeneData(updatedData); // Optionally validate data for update as well
    const geneRef = doc(db, 'genes', docId);
    await updateDoc(geneRef, updatedData);
  } catch (error) {
    throw new Error(`Failed to update gene: ${error.message}`);
  }
};


/**
 * Deletes a specific gene document from the Firestore 'genes' collection.
 *
 * @async
 * @function deleteGene
 * @param {string} docId - The document ID of the gene to delete.
 * @returns {Promise<void>} - A promise that resolves once the document is deleted.
 * @throws {Error} - Throws an error if the document ID is missing or the deletion fails.
 * @description This function deletes a single gene document from the Firestore 'genes' collection using the provided document ID.
 */
export const deleteGene = async (docId) => {
  try {
    if (!docId) throw new Error("Document ID is required for deletion.");
    const geneRef = doc(db, 'genes', docId);
    await deleteDoc(geneRef);
  } catch (error) {
    throw new Error(`Failed to delete gene: ${error.message}`);
  }
};


/**
 * Parses a CSV string, checks against existing entries based on a set of unique columns, and writes or updates each row as a document in the 'genes' collection.
 * 
 * @async
 * @function writeGenesFromCSV
 * @param {string} csvString - The CSV file content as a string.
 * @param {Array<string>} [uniqueColumns=['hgnc_id', 'cur_id']] - The columns used to create a unique identifier for each gene.
 * @param {boolean} [overwrite=true] - Indicates whether to overwrite existing entries with the same unique identifier.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the number of added, overwritten, and skipped entries.
 * @throws {Error} - Throws an error if the CSV parsing or processing fails.
 * @description This function parses a CSV string, converts each row to a Firestore document, and writes or updates it in the 'genes' collection based on the unique identifier constructed from the specified columns.
 */
export const writeGenesFromCSV = async (csvString, uniqueColumns = ['hgnc_id', 'cur_id'], overwrite = false) => {
  try {
    const existingGenes = await getGenes(uniqueColumns);
    const rows = Papa.parse(csvString, { header: true }).data;
    let summary = { added: 0, overwritten: 0, skipped: 0 };

    for (const row of rows) {
      // Construct the unique identifier using specified columns
      const uniqueId = uniqueColumns.map(column => row[column]).join('-');

      // Validate the gene data
      validateGeneData(row, uniqueColumns);

      if (existingGenes[uniqueId]) {
        if (overwrite) {
          await updateDoc(doc(db, 'genes', existingGenes[uniqueId].docId), row);
          summary.overwritten++;
        } else {
          summary.skipped++;
        }
      } else {
        await addDoc(collection(db, 'genes'), row);
        summary.added++;
      }
    }

    return `Upload Summary: ${summary.added} added, ${summary.overwritten} overwritten, ${summary.skipped} skipped.`;
  } catch (error) {
    throw new Error(`Failed to process CSV: ${error.message}`);
  }
};


// Utility function to validate gene data
/**
 * Validates the provided gene data against required fields.
 * 
 * @function validateGeneData
 * @param {Object} geneData - An object containing the data for the gene.
 * @param {Array<string>} [requiredFields=['hgnc_id', 'cur_id']] - An array of strings representing the fields that are required in the gene data.
 * @throws {Error} - Throws an error if any required fields are missing or if the gene data fails other validation criteria.
 * @description This function checks the provided gene data against a set of required fields and potentially other validation criteria. It's used to ensure data integrity before creating or updating gene documents in the Firestore 'genes' collection.
 */
const validateGeneData = (geneData) => {
  const requiredFields = ['hgnc_id', 'cur_id']; // Add more fields as required
  const missingFields = requiredFields.filter(field => !geneData[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  // Add more validation as necessary
};