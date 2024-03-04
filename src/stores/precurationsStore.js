// stores/precurationsStore.js
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/firebase';


/**
 * Validates the given precuration data against the precuration details configuration.
 * @param {Object} precurationData - The data to validate.
 * @returns {Array} An array of error messages, empty if no errors.
 */
const validatePrecurationData = (precurationData, config) => {
  const errors = [];
  for (const [key, field] of Object.entries(config)) {
    if (field.required && (precurationData[key] === undefined || precurationData[key] === '')) {
      errors.push(`The field "${field.label}" is required.`);
    }
  }
  return errors;
};


/**
 * Fetches all precuration documents from the Firestore collection.
 * @returns {Promise<Object>} An object mapping document IDs to precuration data.
 */
export const getPrecurations = async () => {
  const querySnapshot = await getDocs(collection(db, 'precurations'));
  let precurations = {};

  querySnapshot.forEach((docSnapshot) => {
    if (docSnapshot.exists()) {
      // Include the document ID in the returned object
      precurations[docSnapshot.id] = { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error("Precuration document not found");
    }
  });

  return precurations;
};


/**
 * Creates a new precuration document in Firestore with the given data.
 * @param {Object} precurationData - The data for the new precuration.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const createPrecuration = async (precurationData, config) => {
  const validationErrors = validatePrecurationData(precurationData, config);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join(' ')}`);
  }

  const docRef = await addDoc(collection(db, 'precurations'), {
    ...precurationData,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  });

  return docRef.id;
};


/**
 * Retrieves a specific precuration document from Firestore by its document ID.
 * @param {string} docId - The document ID of the precuration to retrieve.
 * @returns {Promise<Object>} An object containing the precuration data.
 * @throws {Error} If the document is not found.
 */
export const getPrecuration = async (docId) => {
  const precurationRef = doc(db, 'precurations', docId);
  const docSnap = await getDoc(precurationRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Precuration document not found");
  }
};


/**
 * Retrieves a specific precuration document from Firestore by either the approved symbol or HGNC ID.
 * @param {string} identifier - The approved symbol or HGNC ID to search for.
 * @returns {Promise<Object|null>} An object containing the precuration data if found, otherwise null.
 */
export const getPrecurationByHGNCIdOrSymbol = async (identifier) => {
  const precurationsRef = collection(db, 'precurations');
  const symbolQuery = query(precurationsRef, where("approved_symbol", "==", identifier));
  const hgncQuery = query(precurationsRef, where("hgnc_id", "==", identifier));

  const symbolSnapshot = await getDocs(symbolQuery);
  const hgncSnapshot = await getDocs(hgncQuery);

  let precurationData = null;
  symbolSnapshot.forEach((doc) => {
    if (doc.exists()) {
      precurationData = { id: doc.id, ...doc.data() };
    }
  });

  if (!precurationData) {
    hgncSnapshot.forEach((doc) => {
      if (doc.exists()) {
        precurationData = { id: doc.id, ...doc.data() };
      }
    });
  }

  return precurationData;
};


/**
 * Updates a precuration document in Firestore with the given data.
 * @param {string} docId - The document ID of the precuration to update.
 * @param {Object} updatedData - An object containing the updated data.
 * @returns {Promise<void>}
 */
export const updatePrecuration = async (docId, updatedData, config) => {
  const validationErrors = validatePrecurationData(updatedData, config);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join(' ')}`);
  }

  const precurationRef = doc(db, 'precurations', docId);
  await updateDoc(precurationRef, {
    ...updatedData,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};


/**
 * Deletes a specific precuration document from Firestore by its document ID.
 * @param {string} docId - The document ID of the precuration to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the document is not found or cannot be deleted.
 */
export const deletePrecuration = async (docId) => {
  const precurationRef = doc(db, 'precurations', docId);
  await deleteDoc(precurationRef);
};
