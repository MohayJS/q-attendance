// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { getAuth } from "firebase/auth";


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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

class FirebaseService {
  /**
   * https://firebase.google.com/docs/auth/web/google-signin
   */
  async signInWithGoogle() {
    const authentication = await signInWithPopup(auth, googleProvider);
    return authentication.user;
  }
  /**
   * https://firebase.google.com/docs/auth/web/password-auth
   * @param email
   * @param password
   */
  async registerWithEmailPassword(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  }
  /**
   * https://firebase.google.com/docs/auth/web/password-auth
   * @param email
   * @param password
   */
  async signWithEmailPassword(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }
  signOut() {
    return signOut(auth)
  }
  /**
   * https://firebase.google.com/docs/auth/web/start
   * @returns User
   */
  async authorizeUser() {
    return new Promise<User>((resolve) => {
      if (auth.currentUser) {
        resolve(auth.currentUser);
      } else {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            resolve(user);
          } else {
            // User is signed out
            // ...
          }
        });
      }
    })
  }
  resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

}

export const firebaseService = new FirebaseService();
