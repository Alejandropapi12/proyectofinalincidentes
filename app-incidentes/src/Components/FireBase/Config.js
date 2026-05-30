import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 Importar Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDYtmlD8udnoHnhEfnbY2qi_OhIqw55Fms",
  authDomain: "incidentes-e7662.firebaseapp.com",
  databaseURL: "https://incidentes-e7662-default-rtdb.firebaseio.com",
  projectId: "incidentes-e7662",
  storageBucket: "incidentes-e7662.firebasestorage.app",
  messagingSenderId: "607270087598",
  appId: "1:607270087598:web:063c6049c43af24cd8763f",
  measurementId: "G-GXDGB52R0B"
};

const appFirebase = initializeApp(firebaseConfig);
export const auth = getAuth(appFirebase);
export const db = getFirestore(appFirebase); // 👈 Exportar la base de datos

export default appFirebase;