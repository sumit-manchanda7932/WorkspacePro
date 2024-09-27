// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "workspace-ea3cb.firebaseapp.com",
  projectId: "workspace-ea3cb",
  storageBucket: "workspace-ea3cb.appspot.com",
  messagingSenderId: "253847912353",
  appId: "1:253847912353:web:b3d22427ac3e5579e695e0",
  measurementId: "G-CSHFNPZZPZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);