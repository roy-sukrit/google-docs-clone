import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDcFfAeARtH01Er-kDn8tSVIgkcCdUdz-0",
  authDomain: "docs-ccfc9.firebaseapp.com",
  projectId: "docs-ccfc9",
  storageBucket: "docs-ccfc9.appspot.com",
  messagingSenderId: "863982647436",
  appId: "1:863982647436:web:7adba39e2d10d55650e3a9",
  measurementId: "G-RJY3WERG65"
};


//Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Firebase methods
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
