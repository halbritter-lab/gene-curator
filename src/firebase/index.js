// firebase/index.js
// Import the functions from the SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAlK6flaIujhnq9SUa4a3BCnezxZu583fI',
  authDomain: 'kidney-genetics.firebaseapp.com',
  projectId: 'kidney-genetics',
  storageBucket: 'kidney-genetics.appspot.com',
  messagingSenderId: '363889916499',
  appId: '1:363889916499:web:f6e81c45d3c2705b0d64a6',
  measurementId: 'G-XLBPTGJEW3'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize database
const db = getFirestore(app);

// initialize authentication
const auth = getAuth(app);

// export the database
export {
    db,
    auth
}