// stores/AuthService.js
import { auth } from '@/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { createUser, getUserByEmail, getUsers } from '@/stores/usersStore'; // Import usersStore functions

const AuthService = {
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleFirstLogin(result.user);
      const userData = await getUserByEmail(result.user.email); // Retrieve user data
      return userData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  registerWithEmail: async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleFirstLogin(result.user);
      const userData = await getUserByEmail(result.user.email); // Retrieve user data
      return userData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserByEmail(result.user.email); // Retrieve user data
      return userData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

async function handleFirstLogin(user) {
  const existingUser = await getUserByEmail(user.email);
  if (!existingUser) {
    const users = await getUsers();
    const isFirstUser = Object.keys(users).length === 0;
    const role = isFirstUser ? 'admin' : 'viewer';

    await createUser({
      uid: user.uid,
      email: user.email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

export default AuthService;
