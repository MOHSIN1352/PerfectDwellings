// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a6bd2.firebaseapp.com",
  projectId: "mern-estate-a6bd2",
  storageBucket: "mern-estate-a6bd2.appspot.com",
  messagingSenderId: "248904594462",
  appId: "1:248904594462:web:a631d389441052fae7ea0f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);