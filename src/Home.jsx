import React, { useEffect, useState } from "react";
import { auth, firestore,storage } from "./firebase";
import { useContext } from "react";
import { authContext } from "./AuthProvider";
import { Redirect } from "react-router-dom";
import "./Home.css";
import VideoCard from "./VideoCard";
import { ref,getDownloadURL, uploadBytesResumable,} from "firebase/storage";
import {  addDoc, collection, onSnapshot, query,  } from "firebase/firestore";



let Home = () => {
    let user = useContext(authContext);
    let [isFile,setFile]=useState(false);
    let [VideoList, setVideoList]=useState([]);
   
    
    useEffect(() => {

    const q = query(collection(firestore, "post"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const arr = [];
      querySnapshot.forEach((doc) => {
         
          arr.push({id:doc.id,...doc.data()});
      });
        setVideoList(arr);
    });
    return(()=>{
      unsubscribe();
    })
    }, []);

  
    return (
        <>
            {!user && <Redirect to="/login" />}

            <div className="Video-Container">
            {VideoList.map((el) => {
               return <VideoCard key={el.id} 
               data={el} 
               comments={el.comment}
          
                />;
                 })}
            </div>
          
            <label htmlFor="uploadVid" className="uploadedFile"><i className='bx bx-cloud-upload'></i></label>    
              <input id="uploadVid" type="file" style={{ display: "none", visibility: "none" }}

              onClick={(e)=>{
                e.currentTarget.value=null;
              }}
              onChange={(e)=>{
                
                let videoObj=e.currentTarget.files[0];
                

                let {name,size,type}=videoObj;
                  size=size/Math.pow(10,6);



                  type=type.split("/")[0];

                  if(type!=="video" || size>10){
                    alert(`Your file may not a video type or your video exceed 10 MB`);
                    setFile(false);
                    return;
                  }
                  setFile(true);
                  
                  const storageRef = ref(storage);
                 
                  const filePath =`post/${user.uid}/${Date.now()}-${name}`;
                  
                  const uploadedFileRef = ref(storageRef, filePath);
          
                  let uploadTask=uploadBytesResumable(uploadedFileRef,videoObj);

                  uploadTask.on('state_changed', (snapshot) => {

                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                    if(progress.valueOf()===100){
                      setFile(false);
                    }
                    
                  }, (error) => {
                    console.error("Error in uploadTask on state changed:", error);
                  }, async () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                      try {
                        return addDoc(collection(firestore, "post"), {
                          url: downloadURL,
                          name: user.displayName,
                          like: [],
                          comment: [],
                        });
                       
                      } catch (error) {
                        console.error("Error adding document to Firestore:", error);
                      }
                      setFile(false);
                    });
             
                  }); 

              }}
          /> 
           {(isFile)?(<div className="succUP">uploading</div>) : (<div className="succUP">No file</div>)}
           
           
            <button
                onClick={() => {
                    auth.signOut();
                }}
                type="button"
                className="home-logout btn btn-secondary m-4"
            >
                LogOut
            </button>
        </>
    );
};

export default Home;