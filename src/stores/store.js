// store.js

import { collection, getDocs, addDoc } from 'firebase/firestore'; // Firestore API
import { db } from '@/firebase'; // Firebase app instance
import Papa from 'papaparse'; // for CSV parsing

/**
 * Fetches and returns an array of gene data from the Firestore 'genes' collection.
 * 
 * @async
 * @function getGenes
 * @returns {Promise<Array>} A promise that resolves to an array of gene objects. Each object contains the data for a single gene and its Firestore document ID.
 * @description This function asynchronously retrieves all documents from the 'genes' collection in Firestore. It constructs an array of gene objects, each containing the data from one document, and the document ID. This array is then returned.
 */
export const getGenes = async () => {
  const querySnapshot = await getDocs(collection(db, 'genes'));
  let fetchedItems = [];
  querySnapshot.forEach((doc) => {
    // Combine document ID with the document data
    fetchedItems.push({ id: doc.id, ...doc.data() });
  });
  return fetchedItems;
};

/**
 * Parses a CSV string and writes each row as a new document in the 'genes' collection.
 *
 * @async
 * @function writeGenesFromCSV
 * @param {string} csvString - The CSV file content as a string.
 * @returns {Promise<Array>} A promise that resolves to an array of results, each indicating the success or failure of writing each document.
 * @description This function parses a given CSV string, converts each row to a Firestore document, and writes it to the 'genes' collection. Each row should represent a gene with fields corresponding to the CSV columns.
 */
export const writeGenesFromCSV = async (csvString) => {
  // Parse the CSV string
  const parseResults = Papa.parse(csvString, { header: true });

  // Array to hold write results for each row/document
  let writeResults = [];

  for (const row of parseResults.data) {
    try {
      // Add a new document with the row data to the 'genes' collection
      const docRef = await addDoc(collection(db, 'genes'), row);
      writeResults.push({ id: docRef.id, status: 'success' });
    } catch (error) {
      // In case of error, push the error details
      writeResults.push({ status: 'error', error: error.message });
    }
  }

  return writeResults;
};
