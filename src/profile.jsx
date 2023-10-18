import React, { useEffect, useState } from 'react';
import './profile.css';
import { Link } from 'react-router-dom';
import { authContext } from './AuthProvider';
import { useContext } from 'react';
import { ref } from 'firebase/storage';
import { storage } from './firebase';

import { listAll, getDownloadURL } from 'firebase/storage';
const Profile = () => {
  const user = useContext(authContext);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    async function handleVideo() {
      const storageRef = ref(storage, `/post/${user.uid}`);
      
      try {
        const listResult = await listAll(storageRef);
        const videoURLs = [];
    
        for (const item of listResult.items) {
          const downloadURL = await getDownloadURL(item);
          videoURLs.push(downloadURL);
        }
    
        setVideoList(videoURLs);
      } catch (error) {
        console.error('Error listing or downloading videos:', error);
      }
    }

    handleVideo();
  }, [videoList,user.uid]);

  return (
    <div className='containerProfile'>
      <Link to='/'>
        <div className='homepage'><i class='bx bx-arrow-back' ></i></div>
      </Link>
      <div className='ExactProfile'>
        <img src={user.photoURL} alt='' />
        <span className='profileName'>{user.displayName}</span>
      </div>
      <div className='allVideo'>
        <div className='allVideoContainer'>
        {videoList.length > 0 ? (
          videoList.map((videoURL, index) => (
            <div className='videoCardMini' key={index} >
            <video 
            width="100%"
            height="100%"
            src={console.log(videoURL)}
            itemType='mp4'
            controls
            ></video>
            </div>
          ))
        ) : (
          <p>No videos found here.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Profile;
