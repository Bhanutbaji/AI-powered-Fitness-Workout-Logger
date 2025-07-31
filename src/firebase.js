import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBF6mbo1vvZ4Tm_smPxj5cfXFjCPWJGnOE",
  authDomain: "ai-fitness-logger.firebaseapp.com",
  projectId: "ai-fitness-logger",
  storageBucket: "ai-fitness-logger.firebasestorage.app",
  messagingSenderId: "562839569345",
  appId: "1:562839569345:web:a587de89104f84a1b76540",
  measurementId: "G-DQBKRH15SB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 