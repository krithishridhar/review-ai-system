import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTaBFbrSI6jRq83UH8ux1c2G2qUxJ51Nw",
  authDomain: "review-ai-system.firebaseapp.com",
  projectId: "review-ai-system",
  storageBucket: "review-ai-system.firebasestorage.app",
  messagingSenderId: "299087814236",
  appId: "1:299087814236:web:30b08793f6ca12b85fd099"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
