import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
    apiKey,
    authDomain: "erindawncampbell.firebaseapp.com",
    projectId: "erindawncampbell",
    storageBucket: "erindawncampbell.firebasestorage.app",
    messagingSenderId: "97789714078",
    appId,
    measurementId: "G-L5NEBH1WBD"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);


export { auth, analytics, app, db, storage };