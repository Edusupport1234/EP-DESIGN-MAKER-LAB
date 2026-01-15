
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Your web app's Firebase configuration from the Firebase Console
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
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export { onAuthStateChanged };
export type { User };
