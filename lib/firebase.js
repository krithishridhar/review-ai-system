import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "Your key",
  authDomain: "review-ai-system.firebaseapp.com",
  projectId: "review-ai-system",
  storageBucket: "review-ai-system.firebasestorage.app",
  messagingSenderId: "sender id",
  appId: "app id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
