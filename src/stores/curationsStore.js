// stores/curationsStore.js
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
    if (docSnapshot.exists()) {
      // Include the document ID in the returned object
      curations[docSnapshot.id] = { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      throw new Error("Curation document not found");
    }
  });

  return curations;
};


/**
 * Checks if the provided curation data is valid according to the provided configuration.
 * @param {Object} curationData - The data to validate.
 * @param {Object} config - The configuration object against which to validate.
 * @returns {Array} An array of error messages, empty if no errors.
 */
const validateCurationData = (curationData, config) => {
  const errors = [];

  for (const [key, field] of Object.entries(config)) {
    const value = curationData[key];
    
    // Check for required fields
    if (field.required && !value) {
      errors.push(`The field "${field.label}" is required.`);
    }

    // Check for number fields with min and max values
    if (field.format === 'number') {
      if (field.min !== undefined && value < field.min) {
        errors.push(`The value for "${field.label}" should not be less than ${field.min}.`);
      }
      if (field.max !== undefined && value > field.max) {
        errors.push(`The value for "${field.label}" should not exceed ${field.max}.`);
      }
    }
  }

  return errors;
};


/**
 * Creates a new curation document in the Firestore 'curations' collection with the provided data.
 * @param {Object} curationData - The data to create a new curation document.
 * @param {Object} config - The configuration object against which to validate.
 * @param {string} userId - The user ID of the user creating the curation.
 * @param {Object} config - The configuration object against which to validate.
 * @returns {Promise<string>} A promise that resolves to the new document's ID.
 */
export const createCuration = async (curationData, userId, config) => {
  const errors = validateCurationData(curationData, config);
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(' ')}`);
  }

  // Check for existing curation
  const exists = await checkForExistingCuration({
    approvedSymbol: curationData.approved_symbol,
    disease: curationData.disease,
    inheritance: curationData.inheritance
  });
  
  if (exists) {
    throw new Error("A curation with the same symbol, disease, and inheritance already exists.");
  }

  const docRef = await addDoc(collection(db, 'curations'), {
    ...curationData,
    users: [userId],
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
 * @param {string} userId - The user ID of the user performing the update.
 * @param {Object} config - The configuration object against which to validate.
 * @returns {Promise<void>} A promise that resolves once the update is complete.
 */
export const updateCuration = async (docId, updatedData, userId, config) => {
  const errors = validateCurationData(updatedData, config);
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(' ')}`);
  }

  const curationRef = doc(db, 'curations', docId);
  const docSnap = await getDoc(curationRef);

  if (!docSnap.exists()) {
    throw new Error("Curation document not found");
  }

  const existingData = docSnap.data();
  const updatedUsers = updateUsersArray(existingData.users || [], userId);

  await updateDoc(curationRef, {
    ...updatedData,
    users: updatedUsers,
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

  
  /**
 * Retrieves all curation documents from Firestore by either the approved symbol or HGNC ID.
 * @param {string} identifier - The approved symbol or HGNC ID to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of objects containing the curation data if found, otherwise an empty array.
 */
export const getCurationsByHGNCIdOrSymbol = async (identifier) => {
  const curationsRef = collection(db, 'curations');
  const symbolQuery = query(curationsRef, where("approved_symbol", "==", identifier));
  const hgncQuery = query(curationsRef, where("hgnc_id", "==", identifier));

  let curationDataArray = [];

  const addToCurationDataArray = (docSnapshot) => {
    if (docSnapshot.exists()) {
      curationDataArray.push({ id: docSnapshot.id, ...docSnapshot.data() });
    }
  };

  const symbolSnapshot = await getDocs(symbolQuery);
  symbolSnapshot.forEach(addToCurationDataArray);

  if (curationDataArray.length === 0) {
    const hgncSnapshot = await getDocs(hgncQuery);
    hgncSnapshot.forEach(addToCurationDataArray);
  }

  return curationDataArray;
};


/**
 * Updates the users array with the given userId, maintaining order and uniqueness.
 * @param {Array} usersArray - The current array of user IDs.
 * @param {string} userId - The ID of the user to add or move in the array.
 * @returns {Array} The updated array of user IDs.
 */
const updateUsersArray = (usersArray, userId) => {
  const newUsersArray = usersArray.filter(id => id !== userId);
  newUsersArray.push(userId); // Add the userId at the end
  return newUsersArray;
};


/**
 * Checks if a curation with the given parameters already exists.
 * @param {Object} params - Parameters to check for existing curation.
 * @returns {Promise<boolean>} - Returns true if curation exists, false otherwise.
 */
const checkForExistingCuration = async ({ approvedSymbol, disease, inheritance }) => {
  const curationsRef = collection(db, 'curations');
  const q = query(curationsRef, where("approved_symbol", "==", approvedSymbol), where("disease", "==", disease), where("inheritance", "==", inheritance));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
