// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmiEIaRVQgPIXLScV0nsr2w_Qdl-fIL5I",
  authDomain: "usuarios-70246.firebaseapp.com",
  projectId: "usuarios-70246",
  storageBucket: "usuarios-70246.firebasestorage.app",
  messagingSenderId: "390372040078",
  appId: "1:390372040078:web:4aeb469f42e2dcd19798df"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;