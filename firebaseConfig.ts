// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// FIX: Import getAuth to initialize Firebase Authentication.
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKZu291a9RIIIGTkpQ2raTce9lb0mJtf4",
  authDomain: "studio-3979737596-2c211.firebaseapp.com",
  projectId: "studio-3979737596-2c211",
  storageBucket: "studio-3979737596-2c211.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "703763279840",
  appId: "1:703763279840:web:3976e3af046dde1abf4585"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
// FIX: Initialize and export Firebase Auth so it can be used in other components.
const auth = getAuth(app);

export { app, db, storage, auth };
