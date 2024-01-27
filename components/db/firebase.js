import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr41MKz1VzffM1ddAJ4F989kP5sx5IaYI",
  authDomain: "fir-practice-33835.firebaseapp.com",
  projectId: "fir-practice-33835",
  storageBucket: "fir-practice-33835.appspot.com",
  messagingSenderId: "946864864820",
  appId: "1:946864864820:web:3adfed5c488b992816d461",
  databaseURL:
    "https://fir-practice-33835-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const realTimeDB = getDatabase(app);
export const db = getFirestore(app);
