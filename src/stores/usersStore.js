// stores/usersStore.js
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { userRolesConfig } from '@/config/userRolesConfig'; // Import the roles configuration

export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  let users = {};

  querySnapshot.forEach((docSnapshot) => {
    users[docSnapshot.id] = docSnapshot.data();
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

export const getUser = async (docId) => {
  const userRef = doc(db, 'users', docId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("User document not found");
  }
};

export const updateUser = async (docId, updatedData) => {
  const userRef = doc(db, 'users', docId);
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};

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
