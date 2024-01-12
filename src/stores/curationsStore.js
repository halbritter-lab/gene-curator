// curationsStore.js
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/firebase';


/**
 * Fetches all curation documents from the Firestore 'curations' collection.
 * @returns {Promise<Object>} A promise that resolves to an object mapping document IDs to curation data.
 */
export const getCurations = async () => {
  const querySnapshot = await getDocs(collection(db, 'curations'));
  let curations = {};

  querySnapshot.forEach((docSnapshot) => {
    curations[docSnapshot.id] = docSnapshot.data();
  });

  return curations;
};


/**
 * Creates a new curation document in the Firestore 'curations' collection with the provided data.
 * @param {Object} curationData - The data to create a new curation document.
 * @returns {Promise<string>} A promise that resolves to the new document's ID.
 */
export const createCuration = async (curationData) => {
  const docRef = await addDoc(collection(db, 'curations'), {
    ...curationData,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  });

  return docRef.id;
};


/**
 * Retrieves a specific curation document from Firestore using the document ID.
 * @param {string} docId - The document ID of the curation to retrieve.
 * @returns {Promise<Object>} A promise that resolves to an object containing the curation data, if found.
 * @throws {Error} If the document does not exist.
 */
export const getCuration = async (docId) => {
  const curationRef = doc(db, 'curations', docId);
  const docSnap = await getDoc(curationRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Curation document not found");
  }
};


/**
 * Updates a specific curation document in Firestore with the provided data.
 * @param {string} docId - The document ID of the curation to update.
 * @param {Object} updatedData - An object containing the updated data for the curation.
 * @returns {Promise<void>} A promise that resolves once the update is complete.
 */
export const updateCuration = async (docId, updatedData) => {
  const curationRef = doc(db, 'curations', docId);
  await updateDoc(curationRef, {
    ...updatedData,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};


/**
 * Deletes a specific curation document from Firestore using the document ID.
 * @param {string} docId - The document ID of the curation to delete.
 * @returns {Promise<void>} A promise that resolves once the document is deleted.
 * @throws {Error} If the document does not exist or cannot be deleted.
 */
export const deleteCuration = async (docId) => {
  const curationRef = doc(db, 'curations', docId);
  await deleteDoc(curationRef);
};


/**
 * Retrieves a curation document from Firestore by either the approved symbol or HGNC ID.
 * @param {string} identifier - The approved symbol or HGNC ID to search for.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the curation data if found, otherwise null.
 */
export const getCurationByHGNCIdOrSymbol = async (identifier) => {
    const curationsRef = collection(db, 'curations');
    const symbolQuery = query(curationsRef, where("approved_symbol", "==", identifier));
    const hgncQuery = query(curationsRef, where("hgnc_id", "==", identifier));
  
    const symbolSnapshot = await getDocs(symbolQuery);
    let curationData = null;
  
    symbolSnapshot.forEach((doc) => {
      if (doc.exists()) {
        curationData = { id: doc.id, ...doc.data() };
      }
    });
  
    if (!curationData) {
      const hgncSnapshot = await getDocs(hgncQuery);
      hgncSnapshot.forEach((doc) => {
        if (doc.exists()) {
          curationData = { id: doc.id, ...doc.data() };
        }
      });
    }
  
    return curationData;
  };