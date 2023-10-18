import { initializeApp} from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXdvNsT9y-ZhGKWZb59NCUsB6w2PSBZyo",
  authDomain: "test-8d583.firebaseapp.com",
  projectId: "test-8d583",
  storageBucket: "test-8d583.appspot.com",
  messagingSenderId: "123196240898",
  appId: "1:123196240898:web:1a2a52be92ccbaf1dfe31b"
};

  const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
export const firestore=getFirestore();
 export const storage = getStorage(app);
 

  let provider=new GoogleAuthProvider();

export const signInWithGoogle = async ()=> {
   
    try {
      await signInWithPopup(auth,provider);
    } catch (error) {
      console.error("Error signing in with Google:", error.code, error.message);  
      throw error;
    }
  }
  
  export default app;
  
  
  
  