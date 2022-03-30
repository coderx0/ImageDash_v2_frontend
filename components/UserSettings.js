import React,{useState,useEffect,useRef} from 'react'
import axios from "axios";
import ImageUploader from './ImageUploader';
import { useSession } from 'next-auth/react';

const UserSettings = ({user,setUser}) => {
    const { data: session, status } = useSession();

    const [isUserNameUpdating, setIsUserNameUpdating] = useState(false);
    const [isAboutUpdating, setIsAboutUpdating] = useState(false);
    const [imageAsset, setImageAsset] = useState(null);
    const [isBannerUploading, setIsBannerUploading] = useState(false);
    const [isProfilePicUploading, setIsProfilePicUploading] = useState(false);
    const userNameRef = useRef();
    const aboutRef = useRef();
    

    const changeUserName = async() => {
        const newUserName = userNameRef.current.value;
        if (newUserName.trim().length>0)
        {
          setIsUserNameUpdating(true);
          const response = await axios.post('/api/user-profile/changeUserName', {
            userId: session.user.id,
            newUserName
          });
          
        setUser(prev => ({ ...prev, userName: response.data.message }));
          userNameRef.current.value = '';
          setIsUserNameUpdating(false);
        }
      
      };
    const updateAbout = async() => {
    const about = aboutRef.current.value;
        if (about.trim().length > 0) {
            setIsAboutUpdating(true);
        const response = await axios.post('/api/user-profile/updateAbout', {
            userId: session.user.id,
            about
        });
        setUser(prev => ({ ...prev, about: response.data.message }));
        aboutRef.current.value = '';
        setIsAboutUpdating(false);
        
    }
    };
    const updateProfilePic = async () => {
    if (imageAsset)
    {
        setIsProfilePicUploading(true);
        const response = await axios.post('/api/user-profile/updateProfilePic', {
        userId: session.user.id,
        imageUrl:imageAsset.url
        });
        setUser(prev=>({...prev,image:response.data.image}));
        setIsProfilePicUploading(false);
    }  
    };
    
    const updateBannerPic = async () => {
    if (imageAsset)
    {
        setIsBannerUploading(true);
        const response = await axios.post('/api/user-profile/updateBannerImage', {
        userId: session.user.id,
        imageUrl:imageAsset.url
        });
        setUser((prev)=>({...prev,bannerImage:response.data.bannerImage}))
        setIsBannerUploading(false);
    }  
    };

    
  return (
    <div className='flex flex-col md:items-center px-2 py-4'>
              <div className='form-control md:w-[30rem]'>
              <label htmlFor='userName' className='p-1'>
                <h1>Change User Name</h1>
                </label>
                <div className='flex'>
                <input ref={userNameRef} id='userName' type='text' placeholder = 'Enter New user_name' className='input input-bordered flex-1 '/>
                  {!isUserNameUpdating && <button className='btn btn-info mx-2' onClick={changeUserName}>Change</button>}
                  {isUserNameUpdating && <button className='btn btn-info loading mx-2'></button>}
                </div>
              </div>
           
              <div className='form-control md:w-[30rem]'>
              <label htmlFor='about' className='p-1'>
                <h1>Change About</h1>
                </label>
                <div className='flex'>
                <input ref={aboutRef} id='about' type='text' placeholder = 'Enter about yourself' className='input input-bordered flex-1 '/>
                  {!isAboutUpdating && <button onClick={updateAbout} className='btn btn-info mx-2'>Change</button>}
                  {isAboutUpdating && <button onClick={updateAbout} className='btn btn-info loading mx-2'></button>}
                </div>
              </div>
              <div className='pt-1 mx-auto'>
                <h1 className='text-center m-1 text-lg'>Change Profile Picture</h1>
                <div className='w-64 '>
                <ImageUploader  profilePage={true} setImageAsset={setImageAsset}/>
                </div>
                {!isProfilePicUploading && <button className='btn btn-info w-full' onClick={updateProfilePic}>Update</button>}
                {isProfilePicUploading && <button className='btn btn-info w-full loading'></button>}
              </div>
              <div className='pt-1 mx-auto'>
                <h1 className='text-center m-1 text-lg'>
                  Change Banner Image</h1>
                <div className='w-[80vw] '>
                <ImageUploader  profilePage={true} setImageAsset={setImageAsset}/>
                </div>
               {!isBannerUploading && <button className='btn btn-info w-full' onClick={updateBannerPic}>Update</button>}
               {isBannerUploading && <button className='btn btn-info w-full loading'></button>}
              </div>
            </div>
  )
}

export default UserSettings