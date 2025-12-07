import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase configuration with direct keys
const firebaseConfig = {
  apiKey: "AIzaSyBzXkDT3wJ30MKL77_bHXYJBGEErPoQqdk",
  authDomain: "medicarebd-d28a9.firebaseapp.com",
  projectId: "medicarebd-d28a9",
  storageBucket: "medicarebd-d28a9.appspot.com",
  messagingSenderId: "841401211498",
  appId: "1:841401211498:web:3b587994fd8e1c44cfc813",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
