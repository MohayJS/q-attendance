// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signOut, User
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { addDoc, collection, CollectionReference, deleteDoc, doc, getCountFromServer, getDoc, getDocFromCache, getDocs, getFirestore, or, query, QueryFieldFilterConstraint, setDoc, where, WhereFilterOp } from "firebase/firestore";
import { ClassMeetingModel, MeetingCheckInModel } from 'src/models/attendance.models';
import { Entity } from 'src/models/base.model';
import { ClassKeepingModel, ClassModel } from 'src/models/class.models';
import { UserModel } from 'src/models/user.models';

function copyObject<T>(source: T) {
  return JSON.parse(JSON.stringify(source)) as T;
}

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
//Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
//firestore: https://firebase.google.com/docs/firestore/quickstart
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

type CollectionTypes = {
  users: UserModel;
  classes: ClassModel;
  'teachers': UserModel;
  'enrolled': UserModel;
  meetings: ClassMeetingModel;
  'check-ins': MeetingCheckInModel,
  'class-keepings': ClassKeepingModel
}

type CollectionName = keyof CollectionTypes;
type WhereArgs = Parameters<typeof where>;
type Operand = Partial<Record<WhereFilterOp, WhereArgs[2]>>;
type WhereCondition<T extends Entity> = Partial<Record<keyof T, Operand>>;
type Condition<T extends Entity> = WhereCondition<T>[] | WhereCondition<T>;

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
    return new Promise<User | undefined>((resolve) => {
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
            resolve(undefined);
          }
        });
      }
    })
  }
  /**
   * https://firebase.google.com/docs/auth/web/manage-users
   * @param email
   * @returns
   */
  resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }
  //CRUD
  async createRecord<C extends CollectionName>(collectionName: C, record: CollectionTypes[C], path?: string): Promise<CollectionTypes[C] | undefined> {
    //https://firebase.google.com/docs/firestore/query-data/get-data#example_data
    let collRef = collection(db, collectionName);
    if (path) {
      const parts = path.split('/');
      const [colName] = parts.splice(1, 1);
      collRef = collection(db, colName!, [...parts, collectionName].join('/'));
    }
    try {
      if (!record.key) {
        const docRef = await addDoc(collRef, copyObject({
          ...record
        }));
        record.key = docRef.id;
      } else {
        const docRef = doc(collRef, record.key);
        await setDoc(docRef, copyObject({
          ...record
        }));
      }
      return record;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return undefined;
  }
  /**
   * https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
   * @param collectionName
   * @param key
   * @param path
   * @returns
   */
  async getRecord<C extends CollectionName>(collectionName: C, key: string, path?: string): Promise<CollectionTypes[C] | undefined> {
    const docRef = path ? doc(db, collectionName, path, key) : doc(db, collectionName, key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CollectionTypes[C];
    }
    return undefined;
  }
  /**
  * https://firebase.google.com/docs/firestore/query-data/get-data#source_options
  * @param collectionName
  * @param key
  * @param path
  * @returns
  */
  async getCachedRecord<C extends CollectionName>(collectionName: C, key: string, path?: string): Promise<CollectionTypes[C] | undefined> {
    const docRef = path ? doc(db, collectionName, path, key) : doc(db, collectionName, key);
    const docSnap = await getDocFromCache(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CollectionTypes[C];
    }
    return undefined;
  }
  /**
   * https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
   * @param collectionName
   * @param key
   * @param record
   * @param path
   * @returns
   */
  async updateRecord<C extends CollectionName>(collectionName: C, key: string, record: Partial<CollectionTypes[C]>, path?: string): Promise<boolean> {
    const docSnap = path ? doc(db, collectionName, path, key) : doc(db, collectionName, key);
    try {
      await setDoc(docSnap, copyObject(record), { merge: true });
      return true;
    } catch (error) {
      console.error('failed to update record:', error);
    }
    return false;
  }
  /**
   * https://firebase.google.com/docs/firestore/manage-data/delete-data
   * @param collectionName
   * @param key
   * @param path
   * @returns
   */
  async deleteRecord<C extends CollectionName>(collectionName: C, key: string, path?: string): Promise<boolean> {
    const docSnap = path ? doc(db, collectionName, path, key) : doc(db, collectionName, key);
    try {
      await deleteDoc(docSnap);
      return true;
    } catch (error) {
      console.error('failed to deleting record:', error);
    }
    return false;
  }
  getAndWhere<T extends Entity>(condition: WhereCondition<T>) {
    const andCon: QueryFieldFilterConstraint[] = [];
    for (const prop in condition) {
      const con = condition[prop];
      for (const op in con) {
        const operator = op as WhereFilterOp;
        const val = con?.[operator];
        andCon.push(where(prop, operator, val));
      }
    }
    return andCon;
  }
  getCollRef<C extends CollectionName>(collRef: CollectionReference, condition?: Condition<CollectionTypes[C]>) {
    if (Array.isArray(condition)) {
      const orCon: QueryFieldFilterConstraint[] = [];
      for (const con of condition) {
        orCon.push(...this.getAndWhere(con));
      }
      return query(collRef, or(...orCon));
    } else if (condition) {
      const andCon = this.getAndWhere(condition);
      if (andCon.length) {
        return query(collRef, ...andCon);
      }
    }
    return collRef;
  }
  async findRecords<C extends CollectionName>(collectionName: C, path?: string, condition?: Condition<CollectionTypes[C]>): Promise<CollectionTypes[C][]> {
    let collRef = collection(db, collectionName);
    if (path) {
      const parts = path.split('/');
      const [colName] = parts.splice(1, 1);
      collRef = collection(db, colName!, [...parts, collectionName].join('/'));
    }
    const snapshot = await getDocs(this.getCollRef(collRef, condition));
    if (snapshot.empty) {
      return [];
    } else {
      return snapshot.docs.map((item) => item.data() as CollectionTypes[C]);
    }
  }
  async countRecords<C extends CollectionName>(collectionName: C, path?: string, condition?: Condition<CollectionTypes[C]>): Promise<number> {
    let collRef = collection(db, collectionName);
    if (path) {
      const parts = path.split('/');
      const [colName] = parts.splice(1, 1);
      collRef = collection(db, colName!, [...parts, collectionName].join('/'));
    }
    const response = await getCountFromServer(this.getCollRef(collRef, condition));
    return response.data().count;
  }

}

export const firebaseService = new FirebaseService();
