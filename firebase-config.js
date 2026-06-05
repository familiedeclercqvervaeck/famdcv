import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjmBHKyFp37tMOAFGGMCH19pXmNzde0B8",
  authDomain: "famdcv-627b7.firebaseapp.com",
  projectId: "famdcv-627b7",
  storageBucket: "famdcv-627b7.firebasestorage.app",
  messagingSenderId: "717582668195",
  appId: "1:717582668195:web:a31c75423e3ce46b3e0a16"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);