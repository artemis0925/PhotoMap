

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDfTwOH31gylX6ouluwo5nzvKRmxc_n9Hc",
  authDomain: "photomap-4b251.firebaseapp.com",
  projectId: "photomap-4b251",
  storageBucket: "photomap-4b251.appspot.com",
  messagingSenderId: "605551994185",
  appId: "1:605551994185:web:3f04d5a94f457f40e7e698",
  measurementId: "G-8HJK487CRG"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
