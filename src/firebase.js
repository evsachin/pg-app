import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCv0iPONPJF62XEOZzaqwPDPRSY05uZfk8",
  authDomain: "pgapp-c92d8.firebaseapp.com",
  projectId: "pgapp-c92d8",
  storageBucket: "pgapp-c92d8.firebasestorage.app",
  messagingSenderId: "325156913447",
  appId: "1:325156913447:web:aafccff5134b76ff702902",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
