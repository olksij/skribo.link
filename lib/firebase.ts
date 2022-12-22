import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEqmhpSBE2wYNa3AdUuNMPmT7pXi1Bg9g",
  authDomain: "slikker-scratch-card.firebaseapp.com",
  projectId: "slikker-scratch-card",
  storageBucket: "slikker-scratch-card.appspot.com",
  messagingSenderId: "463987856477",
  appId: "1:463987856477:web:106b4ef14b4abf678a69b4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export utils
export const db = getFirestore(app);
