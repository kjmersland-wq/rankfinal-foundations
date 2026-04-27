import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDohtiWF1cEh159o9FBpUijdV80FxnH8WY",
  authDomain: "rankfinal-605d7.firebaseapp.com",
  projectId: "rankfinal-605d7",
  storageBucket: "rankfinal-605d7.firebasestorage.app",
  messagingSenderId: "399885949104",
  appId: "1:399885949104:web:caa1638336d067a6433575",
  measurementId: "G-FN71MH66PQ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
