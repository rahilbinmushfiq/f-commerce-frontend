import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGIN_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to retrieve the Firebase Admin app instance
export function getFirebaseApp() {
  // Check for existing Firebase app instances
  if (!getApps().length) {
    // If no app instances exist, initialize a new app with the configuration
    return initializeApp(firebaseConfig);
  } else {
    // If an app instance already exists, return that instance
    return getApp();
  }
}

const app = getFirebaseApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
