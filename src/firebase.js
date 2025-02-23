// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA0WJfvzCmK-7i-RoCt5B6JAYnoRdEmOBQ",
    authDomain: "insight-hive-login-system.firebaseapp.com",
    projectId: "insight-hive-login-system",
    storageBucket: "insight-hive-login-system.firebasestorage.app",
    messagingSenderId: "1092609284363",
    appId: "1:1092609284363:web:7d5bd7fa7bcd0250cfaa0e",
    measurementId: "G-M34H3WLWWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);