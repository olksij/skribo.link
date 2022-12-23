import { getApps, initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEqmhpSBE2wYNa3AdUuNMPmT7pXi1Bg9g",
  authDomain: "slikker-scratch-card.firebaseapp.com",
  databaseURL: "https://slikker-scratch-card-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slikker-scratch-card",
  storageBucket: "slikker-scratch-card.appspot.com",
  messagingSenderId: "463987856477",
  appId: "1:463987856477:web:106b4ef14b4abf678a69b4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export utils
export const database = getDatabase(app);
export const storage = getStorage(app);
