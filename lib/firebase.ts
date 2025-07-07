import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if we have Firebase config
const hasApiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const hasAuthDomain = !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const hasProjectId = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Log warning but don't throw error to prevent app from crashing
if (!hasApiKey || !hasAuthDomain || !hasProjectId) {
  console.warn('Missing Firebase environment variables:', { hasApiKey, hasAuthDomain, hasProjectId });
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };