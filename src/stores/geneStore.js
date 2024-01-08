// geneStore.js

import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'; // Firestore API
import { db } from '@/firebase'; // Firebase app instance
import Papa from 'papaparse'; // for CSV parsing

/**
 * Fetches and returns a dictionary of gene data from the Firestore 'genes' collection, 
 * indexed by a unique identifier created from specified columns.
 * 
 * @async
 * @function getGenes
 * @param {Array<string>} [uniqueColumns=['hgnc_id', 'cur_id']] - Columns to create a unique identifier for each gene.
 * @returns {Promise<Object>} - An object mapping unique identifiers to gene data with document IDs.
 * @description Retrieves all documents from the 'genes' collection in Firestore and indexes them using a unique identifier.
 */
export const getGenes = async (uniqueColumns = ['hgnc_id', 'cur_id']) => {
  const querySnapshot = await getDocs(collection(db, 'genes')); // Fetch all documents in the 'genes' collection
  let fetchedItems = {}; // Initialize an empty object to hold fetched items

  // Iterate through each document in the collection
  querySnapshot.forEach((doc) => {
    const data = doc.data(); // Get document data
    // Construct a unique identifier using the specified columns
    const uniqueId = uniqueColumns.map(column => data[column]).join('-'); 
    fetchedItems[uniqueId] = { ...data, docId: doc.id }; // Add document data and ID to fetched items
  });

  return fetchedItems; // Return the fetched items
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
    const timestampedData = addCreationTimestamp(geneData); // Add creation timestamp
    const docRef = await addDoc(collection(db, 'genes'), timestampedData);
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
    const timestampedUpdate = updateLastUpdatedTimestamp(updatedData); // Update lastUpdated timestamp
    const geneRef = doc(db, 'genes', docId);
    await updateDoc(geneRef, timestampedUpdate);
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
 * Parses a CSV string, checks against existing entries based on unique columns, 
 * and writes or updates each row as a document in the 'genes' collection with timestamps.
 * 
 * @async
 * @function writeGenesFromCSV
 * @param {string} csvString - The CSV content as a string.
 * @param {Array<string>} [uniqueColumns=['hgnc_id', 'cur_id']] - Columns to create a unique identifier for each gene.
 * @param {boolean} [overwrite=true] - Whether to overwrite existing entries with the same unique identifier.
 * @returns {Promise<Object>} - An object indicating the number of added, overwritten, and skipped entries.
 * @throws {Error} - If CSV parsing or processing fails.
 * @description Parses a CSV string and writes or updates each row in the 'genes' collection with timestamps.
 */
export const writeGenesFromCSV = async (csvString, uniqueColumns = ['hgnc_id', 'cur_id'], overwrite = true) => {
  try {
    const existingGenes = await getGenes(uniqueColumns); // Fetch existing genes for comparison
    const rows = Papa.parse(csvString, { header: true }).data; // Parse CSV string into rows
    let summary = { added: 0, overwritten: 0, skipped: 0 }; // Initialize a summary of operations

    // Iterate through each row from the CSV
    for (const row of rows) {
      const uniqueId = uniqueColumns.map(column => row[column]).join('-'); // Construct a unique identifier
      validateGeneData(row, uniqueColumns); // Validate the gene data

      // Check if a gene with the same unique identifier already exists
      if (existingGenes[uniqueId]) {
        if (overwrite) {
          const updatedRow = updateLastUpdatedTimestamp(row); // Update the last updated timestamp
          await updateDoc(doc(db, 'genes', existingGenes[uniqueId].docId), updatedRow); // Update the document
          summary.overwritten++; // Increment the overwritten counter
        } else {
          summary.skipped++; // Increment the skipped counter
        }
      } else {
        const newRow = addCreationTimestamp(row); // Add a creation timestamp to the new row
        await addDoc(collection(db, 'genes'), newRow); // Create a new document
        summary.added++; // Increment the added counter
      }
    }

    return `Upload Summary: ${summary.added} added, ${summary.overwritten} overwritten, ${summary.skipped} skipped.`; // Return a summary of the operations
  } catch (error) {
    throw new Error(`Failed to process CSV: ${error.message}`); // Throw an error if processing fails
  }
};


/**
 * Deletes all gene documents from the Firestore 'genes' collection.
 * @async
 * @function deleteAllGenes
 * @description This function deletes all documents in the 'genes' collection.
 * @throws {Error} - Throws an error if the deletion fails or is unauthorized.
 */
export const deleteAllGenes = async () => {
  try {
    // Security check: Ensure the user is authorized
    if (!isUserAuthorized()) {
      throw new Error("Unauthorized access to delete all genes.");
    }

    // Fetch all documents in the 'genes' collection
    const querySnapshot = await getDocs(collection(db, 'genes'));
    
    // Initialize a batch operation
    const batch = db.batch();

    // Iterate through each document and schedule it for deletion
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch deletion
    await batch.commit();
    
    // Log the deletion operation
    console.log(`All genes deleted by ${getCurrentUserID()} at ${new Date().toISOString()}`);
  } catch (error) {
    throw new Error(`Failed to delete all genes: ${error.message}`);
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


// Utility function to add timestamps to gene data
/**
 * Adds a creation timestamp to the gene data.
 *
 * @param {Object} geneData - An object containing the data for the gene.
 * @returns {Object} The gene data object augmented with a 'createdAt' timestamp.
 * @description This function adds a 'createdAt' timestamp to the gene data object, using the current date and time.
 */
const addCreationTimestamp = (geneData) => {
  return { ...geneData, createdAt: Timestamp.fromDate(new Date()) };
};


/**
 * Updates the 'lastUpdated' timestamp in the gene data.
 *
 * @param {Object} geneData - An object containing the data for the gene.
 * @returns {Object} The gene data object augmented with an updated 'lastUpdated' timestamp.
 * @description This function updates the 'lastUpdated' timestamp in the gene data object, using the current date and time.
 */
const updateLastUpdatedTimestamp = (geneData) => {
  return { ...geneData, lastUpdated: Timestamp.fromDate(new Date()) };
};


// Mock implementation of isUserAuthorized
const isUserAuthorized = () => {
  // For now, return true to simulate an authorized user
  // In a real application, implement actual authentication and authorization checks here
  return true;
};


// Mock implementation of getCurrentUserID
const getCurrentUserID = () => {
  // For now, return a static user ID to simulate a user
  // In a real application, retrieve the actual user ID from your authentication system
  return "mockUserID123";
};