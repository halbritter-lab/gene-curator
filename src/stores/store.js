// store.js

import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore API
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
  let fetchedItems = {};
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Create a unique identifier, e.g., a combination of approved_symbol, hgnc_id, and cur_id
    const uniqueId = `${data.approved_symbol}-${data.hgnc_id}-${data.cur_id}`;
    fetchedItems[uniqueId] = { ...data, docId: doc.id };
  });
  return fetchedItems;
};


/**
 * Parses a CSV string, checks against existing entries, and writes or updates each row as a document in the 'genes' collection.
 * 
 * @async
 * @function writeGenesFromCSV
 * @param {string} csvString - The CSV file content as a string.
 * @param {boolean} overwrite - Indicates whether to overwrite existing entries.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the number of added, overwritten, and skipped entries.
 */
export const writeGenesFromCSV = async (csvString, overwrite = false) => {
  const existingGenes = await getGenes();
  const rows = Papa.parse(csvString, { header: true }).data;

  let summary = { added: 0, overwritten: 0, skipped: 0 };

  for (const row of rows) {
    const uniqueId = `${row.approved_symbol}-${row.hgnc_id}-${row.cur_id}`;
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
};