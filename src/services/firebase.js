import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBE12I70R5wQ2_XNL3agnRT5PiKtq_kSr8",
  authDomain: "doan-dpt.firebaseapp.com",
  projectId: "doan-dpt",
  storageBucket: "doan-dpt.firebasestorage.app",
  messagingSenderId: "534813204985",
  appId: "1:534813204985:web:6ed168d3b2dd1c22039d28",
  measurementId: "G-XL1F6C5DHR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
