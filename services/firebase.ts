
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, off } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_IYue8EOjkWWHIi9YBM6paBv_gWKu8Ms",
  authDomain: "ep--design-maker-lab.firebaseapp.com",
  databaseURL: "https://ep--design-maker-lab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ep--design-maker-lab",
  storageBucket: "ep--design-maker-lab.firebasestorage.app",
  messagingSenderId: "858917668308",
  appId: "1:858917668308:web:cf5a190782adb8d827c241",
  measurementId: "G-V5FJNS8SES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google helper using popup
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// DB Helpers
export { ref, set, push, onValue, off };

export default app;
