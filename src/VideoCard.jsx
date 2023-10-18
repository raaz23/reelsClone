import React, { useEffect, useState } from "react";
import "./VideoCard.css";
import { useContext } from "react";
import { authContext } from "./AuthProvider";
import { firestore } from "./firebase";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom/cjs/react-router-dom.min";





const VideoCard = (props) => {
  const user= useContext(authContext);
  console.log(user.uid);


  const currLikes=props.data.like.includes(user.uid);


  let [playing, setPlaying] = useState(false);
 
  let [commentOpen, setComment] = useState(false);
  let [currentComment, setCurrentComment] = useState("");
  let [comments, setComments] = useState([]); 
  let [currVid,setCurrVid]=useState();
  useEffect(() => {
    let f = async () => {
      let commentArr = props.data.comment;
      let arr = [];

      for (let x of commentArr) {
        try {
          let commentDoc = doc(firestore, "comment", x);

          let commentDocSnap = await getDoc(commentDoc);

          if (commentDocSnap.exists()) {
            arr.push(commentDocSnap.data());
          } else {
            console.warn("Comment does not exist.");
          }
        } catch (error) {
          console.error("Error fetching comment:", error);
        }
      }

      setComments(arr); 
    };

    f();
  }, [props]);

  useEffect(()=>{

    if(!currVid){
      return ;
    }

currVid.oncanplay=()=>{
  const observerConfig={
    root:null,
    margin:"0px",
    threshold:[0.25,0.5,0.75,1],
  }
  const myObserver=new IntersectionObserver((ele)=>{
      const entry=ele[0];

      if(entry.intersectionRatio>=0.5){
      
        currVid.muted= false;
        currVid.autoplay=true;
        currVid.play();
        setPlaying(true);
        
      }
      else {
       
        currVid.pause();
        setPlaying(false);
        if(commentOpen){
          setComment(false);
        }
        
      }
      
  },observerConfig);

  myObserver.observe(currVid);
  return () => {
    myObserver.disconnect();
  };
}
      
  
}
  ,[commentOpen, currVid]);

  const handleLike = async () => {
    if (currLikes) {
      const likeArr = props.data.like.filter((el) => el !== user.uid);
      const likeRef = doc(firestore, "post", props.data.id);
      try {
        await updateDoc(likeRef, { like: likeArr });
      } catch (error) {
        console.error("Error removing like:", error);
      }
    } else {
      const likeRef = doc(firestore, "post", props.data.id);
      try {
        await updateDoc(likeRef, {
          like: [...props.data.like, user.uid],
        });
      } catch (error) {
        console.error("Error adding like:", error);
      }
    }
  };
  
   
  return (
    <div className="VideoCard">
      <span className="fakeUser">
        <Link to="/profile"><img className="profileIMG" src={user.photoURL}  alt="profilePhoto"/></Link>
        <h3>{props.data.name}</h3>
      </span>

      <span className="title">
        <span>
          <i className="bx bxl-tiktok"></i>
        </span>
        <marquee className="scrolling-text"> {"song playing"} </marquee>
      </span>

      <span
        className="commentBox"
        onClick={() => {
          if (commentOpen) {
            setComment(false);
          } else {
            setComment(true);
          }
        }}
      >
        <i className={`bx ${commentOpen ? "bx-comment" : "bx-comment-detail"}`}></i>
      </span>

      <span
        className="likeBtn"
        onClick={() => {
          handleLike();
        }
        }
      >
        <i className={`bx ${!currLikes ? "bx-heart" : "bxs-heart"}`}></i>
        <p>{props.data.like.length}</p>
      </span>

      {commentOpen && (
        <div className="commentBoxOpen">
          <div className="actualComment">
            {comments.map((el) => {
              return (
                <div className="post-user-comment" key={el.id}>
                  <img src={el.photo} alt="User Profile" />
                  <div className="NamCom">
                    <h6>{props.data.username}</h6>
                    <p>{el.comment != null ? el.comment : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="comment-form">
            <input
              type="text"
              value={currentComment}
              placeholder="Add a comment"
              onChange={(e) => {
                setCurrentComment(e.currentTarget.value);
              }}
            />
            <button
              type="submit"
              onClick={async () => {
                if (currentComment.trim() !== "") {
                  const commentDocRef = await addDoc(collection(firestore, "comment"), {
                    name: user.displayName,
                    photo: user.photoURL,
                    comment: currentComment,
                  });

                  // Finding added doc id
                  const commentId = commentDocRef.id;

                  const postDocRef = doc(firestore, "post", props.data.id);

                  const postDocSnap = await getDoc(postDocRef);

                  if (postDocSnap.exists()) {
                    const postCommentArr = postDocSnap.data().comment;
                    postCommentArr.push(commentId);
                    await updateDoc(postDocRef, { comment: postCommentArr });
                    setCurrentComment("");
                   // console.log("Comment added and post updated successfully.");
                  } else {
                    console.error("Post document does not exist.");
                  }
                  if(commentOpen){
                    setComment(false);
                  }
                }
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      <video 
        className="video-card-video"
     
        onClick={(e) => {
          setCurrVid(e.currentTarget);
          if (playing) {
            e.currentTarget.pause();
            setPlaying(false);
          } else {
            e.currentTarget.play().catch((err)=>{
             // console.log("problem")
              throw err ;
            });
            setPlaying(true);
          }
        }}
        
      >
        <source src={props.data.url} type="video/mp4" />
      </video>
     
    </div>
  );
};

export default VideoCard;
