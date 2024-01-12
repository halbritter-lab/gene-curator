import { auth } from '@/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthService = {
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  registerWithEmail: async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
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

export default AuthService;
