import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCTYuhtoNWMBDpPtvXxJq4hMywP1hVYufU",
  authDomain: "calorieapp-30c82.firebaseapp.com",
  projectId: "calorieapp-30c82",
  storageBucket: "calorieapp-30c82.firebasestorage.app",
  messagingSenderId: "1021237154742",
  appId: "1:1021237154742:web:022d451f6edabe9d8de717"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);