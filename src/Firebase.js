import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyARB4flMZ0o8U7vA6Z1q8t-cSaQsXSC6i0",
  authDomain: "ecommerce-3c8ac.firebaseapp.com",
  projectId: "ecommerce-3c8ac",
  storageBucket: "ecommerce-3c8ac.appspot.com",
  messagingSenderId: "627282559961",
  appId: "1:627282559961:web:492de3b56a0d8f7e250fc8",
  measurementId: "G-SPWPF7S313",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const Storage = getStorage(app);
