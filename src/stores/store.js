// store.js

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Adjust this path as necessary

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
