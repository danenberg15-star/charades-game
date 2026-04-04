import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBacx24mQBh1ZxfkZC4h52XBpXL8SJVmDA",
  authDomain: "family-alias.firebaseapp.com",
  projectId: "family-alias",
  storageBucket: "family-alias.firebasestorage.app",
  messagingSenderId: "212725483111",
  appId: "1:212725483111:web:954cc70182e7e01b1af6c2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);