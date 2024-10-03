import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBjqmB4XOM3F5whdIRRB9b3rpPs-cZtSM0",
  authDomain: "voice-app-3b55a.firebaseapp.com",
  projectId: "voice-app-3b55a",
  storageBucket: "voice-app-3b55a.appspot.com",
  messagingSenderId: "401723709338",
  appId: "1:401723709338:web:5c4450849985da94cd0c23",
  measurementId: "G-SLQL5PELR0"
};

let app; 

if (!getApps().length) { // Check if there are any initialized apps
  app = initializeApp(firebaseConfig); // Only initialize if no apps exist
} else {
  app = getApp(); // Get the already initialized app
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Initialize Auth with persistence using AsyncStorage
});

const firestore = getFirestore(app); // Use getFirestore to initialize

export { auth, firestore };
