// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq3nX8621vtVYXsf3uVsalYICvZdWR_-s",
  authDomain: "linen-walker-360706.firebaseapp.com",
  projectId: "linen-walker-360706",
  storageBucket: "linen-walker-360706.firebasestorage.app",
  messagingSenderId: "216354480671",
  appId: "1:216354480671:web:9d9a11608fef17fe0ceb2a",
  measurementId: "G-DZ5MZ2GGK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log(analytics);
