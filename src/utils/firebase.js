// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOdKPAXFQ7MA5JM_96jeYjGDVUE6q3anY",
  authDomain: "movielens18.firebaseapp.com",
  projectId: "movielens18",
  storageBucket: "movielens18.firebasestorage.app",
  messagingSenderId: "836939121600",
  appId: "1:836939121600:web:ef9fdcd06bb153cbfa7e25",
  measurementId: "G-JDQQF8T1XK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
