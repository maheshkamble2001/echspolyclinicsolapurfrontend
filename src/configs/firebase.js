import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPBW8qzxGT6NgLj3XE0Z_ZBjkR3u8Ffws",
  authDomain: "srexpense-f95c9.firebaseapp.com",
  projectId: "srexpense-f95c9",
  storageBucket: "srexpense-f95c9.firebasestorage.app",
  messagingSenderId: "255796235364",
  appId: "1:255796235364:web:202574df5dcd11deca2371",
  measurementId: "G-3336R06PEZ"
};

// ✅ Prevent duplicate initialization
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };