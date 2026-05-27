// 1. Importamos la función para inicializar Firebase y el SDK de Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 🗄️ Solo base de datos

// 2. Tus credenciales oficiales de la aplicación web
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

// 3. Inicializamos esta instancia de Firebase
const appFirebase2 = initializeApp(firebaseConfig, "databaseApp"); // Usamos un identificador único para evitar conflictos

// 4. Inicializamos el servicio de Firestore pasándole la app
const db = getFirestore(appFirebase2);

// 5. Exportamos únicamente 'db' para usarla en el formulario de incidentes
export { db };
export default appFirebase2;