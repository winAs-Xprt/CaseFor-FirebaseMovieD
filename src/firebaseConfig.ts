// src/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyATgEDr7L97P6DUT7PAyavkxwxVxhA3vmA",
  authDomain: "movie-details-d1c96.firebaseapp.com",
  projectId: "movie-details-d1c96",
  storageBucket: "movie-details-d1c96.appspot.com",
  messagingSenderId: "789297151510",
  appId: "1:789297151510:web:544d0c1968cff8e601bf37",
  measurementId: "G-118KYHC8K3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export the storage
