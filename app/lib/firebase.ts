import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBacx24mQBh1ZxfkZC4h52XBpXL8SJVmDA",
  authDomain: "family-alias.firebaseapp.com",
  projectId: "family-alias",
  storageBucket: "family-alias.firebasestorage.app",
  messagingSenderId: "212725483111",
  appId: "1:212725483111:web:954cc70182e7e01b1af6c2"
};

// אתחול Firebase בצורה שמונעת שגיאות ב-Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// הקולקציה החדשה שתשמש רק את משחק ה-Charades
export const gamesCollection = collection(db, 'charades_games');