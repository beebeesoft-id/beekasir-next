// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { localGet } from "./helper";
import { User } from "./model";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIwg51nO3FYcJAhTGR7eZHZ3kkYv2UgoE",
  authDomain: "beekasir-60f31.firebaseapp.com",
  databaseURL: "https://beekasir-60f31-default-rtdb.firebaseio.com",
  projectId: "beekasir-60f31",
  storageBucket: "beekasir-60f31.appspot.com",
  messagingSenderId: "767478061624",
  appId: "1:767478061624:web:acbc798142d4814f0fe4cd",
  measurementId: "G-G7EQ64BJER"
};

// Initialize Firebase
const APP = initializeApp(firebaseConfig);
export const DB = getFirestore(APP);
export const AUTH = getAuth(APP);

export function refProduct() {
  const user = localGet('@user');
  console.log(user);
  
  return 'Company/' + user.companyId + '/Branch/' + user.branchId + '/Products';
}

export function getSessionUser() : User {
  const user = localGet('@user');
  
  return user;
}