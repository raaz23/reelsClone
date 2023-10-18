import { createContext, useEffect, useState } from "react";
import React from "react";
import { auth, firestore } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const authContext = createContext();

const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                
                const { displayName, uid, email, photoURL } = user;
                
               const docRef = doc(firestore, "users", uid);
                    
               const documentSnapshot = await getDoc(docRef);
               if (!documentSnapshot.exists()) {
               try {
                
                await setDoc(docRef, {
                  displayName,
                  email,
                  uid,
                  photoURL,
                });
                
              } catch (error) {
                console.error("Error adding user data to Firestore:", error);
              }
            }
                setUser({ displayName, uid, email, photoURL });
               
            } else {
                setUser(null);
              
            }
            setLoading(false);

        });

        return () => {
            unsubscribe();
           
        };
    }, []);


    return (
        <authContext.Provider value={user}>
            {!loading && props.children}
        </authContext.Provider>
    );
};

export default AuthProvider;
