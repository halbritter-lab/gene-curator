// stores/usersStore.js
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '@/firebase';
import { userRolesConfig } from '@/config/userRolesConfig'; // Import the roles configuration


/**
 * Retrieves all user documents from Firestore.
 * @returns {Promise<Object>} A promise that resolves to an object containing user data keyed by document IDs.
 */
export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  let users = {};

  querySnapshot.forEach((docSnapshot) => {
    users[docSnapshot.id] = {
      id: docSnapshot.id, // Include the document ID
      ...docSnapshot.data() // Spread the rest of the user data
    };
  });

  return users;
};


/**
 * Creates a new user document in Firestore with the provided user data.
 * @param {Object} userData - The user data including email, role, etc.
 * @returns {Promise<string>} A promise that resolves to the new document's ID.
 */
export const createUser = async (userData) => {
    const userRole = userData.role || 'viewer'; // Default to 'viewer' if no role is provided
    const roleConfig = userRolesConfig[userRole]; // Get the role configuration
  
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      role: userRole,
      permissions: roleConfig, // Assign permissions based on the role
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return docRef.id;
  };


/**
 * Retrieves a specific user document from Firestore by document ID.
 * @param {string} docId - The document ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the user data.
 */
export const getUser = async (docId) => {
  const userRef = doc(db, 'users', docId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("User document not found");
  }
};


/**
Updates a user document in Firestore.
@param {string} docId - The document ID of the user to update.
@param {Object} updatedData - An object containing the updated data for the user.
@returns {Promise<void>} A promise that resolves when the update is complete.
*/
export const updateUser = async (docId, updatedData) => {
  const userRef = doc(db, 'users', docId);
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};

/**
Deletes a user document from Firestore.
@param {string} docId - The document ID of the user to delete.
@returns {Promise<void>} A promise that resolves when the deletion is complete.
*/
export const deleteUser = async (docId) => {
  const userRef = doc(db, 'users', docId);
  await deleteDoc(userRef);
};


/**
 * Retrieves a user document from Firestore based on the email address.
 * @param {string} email - The email address to search for.
 * @returns {Promise<Object|null>} A promise that resolves to the user data if found, otherwise null.
 */
export const getUserByEmail = async (email) => {
  const usersRef = collection(db, 'users');
  const emailQuery = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(emailQuery);

  let userData = null;
  querySnapshot.forEach((doc) => {
    if (doc.exists()) {
      userData = { id: doc.id, ...doc.data() };
    }
  });

  return userData;
};
