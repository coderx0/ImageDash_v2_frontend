import React, { useEffect, useState,useRef } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { client } from '../../lib/sanityClient';
import { useSession,signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from "../../components/Layout";
import Feed from "../../components/Feed";
import Link from 'next/link';
import CollectionFeed from '../../components/CollectionFeed';
import Image from 'next/image';
import ImageUploader from '../../components/ImageUploader';
import axios from 'axios';
import FollowUser from '../../components/FollowUser';

const breakPointObj = {
  default: 4,
  1100: 3,
  900: 2,
  600: 1
}


const activeBtnStyles = 'btn text-[0.7rem] sm:text-[1rem] text-sky-500 font-bold rounded-none';
const notActiveBtnStyles = 'btn text-[0.7rem] sm:text-[1rem] rounded-none';

const UserProfile = ({user}) => {
  const [pins, setPins] = useState();
  const [text, setText] = useState('images');
  const [activeBtn, setActiveBtn] = useState('images');
  const [uploadCount, setUploadCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [imageAsset, setImageAsset] = useState(null);
  const userNameRef = useRef();
  const aboutRef = useRef();

  const router = useRouter();

  const { userId } = router.query;

  const { data: session, status } = useSession();

  useEffect(() => {
    if (userId) {
      switch (text) {
        case 'images':
          fetch(`/api/data/createdPins/${userId}`).then(response => response.json()).then(data => {
            setPins(data.pins);
            setUploadCount(data.pins.length);
          });
          break;
        case 'saved':
          fetch(`/api/data/savedPins/${userId}`).then(response => response.json()).then(data => {
            setPins(data.pins);
          });
          break;
        case 'followers':
          fetch(`/api/data/followers/${userId}`).then(response => response.json()).then(data => {
            setFollowers(data.followers.followers);
          });
          break;
        case 'following':
          fetch(`/api/data/following/${userId}`).then(response => response.json()).then(data => {
            setFollowers(data.following.following);
          });
          break;
        case 'collection':
          fetch(`/api/data/collections/${userId}`).then(response => response.json()).then(data => {
            setCollections(data.collections);
          });
      }
  }
  }, [text, userId]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/data/createdPins/${userId}`).then(response => response.json()).then(data => {
        setPins(data.pins);
        setUploadCount(data.pins.length);
      });
    }
  },[userId])

  const changeUserName = async() => {
    const newUserName = userNameRef.current.value;
    const response = await axios.post('/api/user-profile/changeUserName', {
      userId: session.user.id,
      newUserName
    });
  
    console.log(response.data.message);
  };
  const updateAbout = async() => {
    const about = aboutRef.current.value;
    const response = await axios.post('/api/user-profile/updateAbout', {
      userId: session.user.id,
      about
    });
  
    console.log(response.data.message);
  };
  const updateProfilePic = async () => {
    if (imageAsset)
    {
      const response = await axios.post('/api/user-profile/updateProfilePic', {
        userId: session.user.id,
        imageUrl:imageAsset.url
      });
      console.log(response);
    }  
  };

  const showOption = session ? session.user.id === userId ? true : false : false;

  if (!user) return <h1>Loading Profile</h1>;

  return (
    <Layout>
      <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
            <img
              className=" w-full h-48 md:h-64 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
          <div className='flex justify-around lg:justify-center lg:gap-32 p-4 '>
            <div className='flex gap-2 mr-2'>
            <img
              className="rounded-full w-12 h-12 md:w-16 md:h-16 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
              <div className='flex flex-col'>
              <h1 className="font-bold text-xl md:text-3xl">
                    {user.userName}
                  </h1>
                 
                  <p className='text-[12px] md:text-sm'>{user.about}</p>
            </div>
            </div>
              <FollowUser userFollowers ={user.followers} id={user._id} userId={session?.user.id}/>
            </div>
          
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === session?.user?.id && (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={()=>signOut({redirect:false})}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
            )}
          </div>
        </div>
        <div className="sm:mx-auto whitespace-nowrap overflow-y-hidden overflow-x-auto sticky top-16 z-10">
          <button
            type="button"
            onClick={(e) => {
              setText('images');
              setActiveBtn('images');
            }}
            className={`${activeBtn === 'images' ? activeBtnStyles : notActiveBtnStyles}`}
          >
           {uploadCount} Images
          </button>
          { showOption && <button
            type="button"
            onClick={(e) => {
              setText('saved');
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>}
          <button
              onClick={(e) => {
              setText('collection');
              setActiveBtn('collection');
            }}
              className={`${activeBtn === 'collection' ? activeBtnStyles : notActiveBtnStyles}`}>
              Collection
          </button>
          <button
               onClick={(e) => {
              setText('followers');
              setActiveBtn('followers');
            }}
              className={`${activeBtn === 'followers' ? activeBtnStyles : notActiveBtnStyles}`}>
              {user?.followers ? user.followers.length : 0} Followers
          </button>
            { showOption &&  <button
               onClick={(e) => {
              setText('following');
              setActiveBtn('following');
            }}
              className={`${activeBtn === 'following' ? activeBtnStyles : notActiveBtnStyles}`}>
              {user?.following ? user.following.length : 0} Following
            </button>}
            { showOption && <button
               onClick={(e) => {
              setText('settings');
              setActiveBtn('settings');
            }}
              className={`${activeBtn === 'settings' ? activeBtnStyles : notActiveBtnStyles}`}>
              Settings
            </button>}
        </div>
   
          {
            (text === 'images' || text === 'saved') &&
              (pins?.length === 0 ?
                (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Pins Found!
        </div>
                ) :
                <div className="px-2">
            <Feed pins={pins}/>
                </div>)
          }

          {
            text==='collection' && 
                 <CollectionFeed viewPage='profile' collections={collections}/>
                
          }

          {
            text==='followers' && <div className='flex justify-center gap-4 flex-wrap mx-2 mt-4'>
                  {followers?.map(follower =>
                    <div
                       key={follower.followedBy._id}
                      className="flex flex-col w-40 border-2 bg-slate-900 rounded-box">
                      <div className='flex bg-stone-800 rounded-box h-24 items-center justify-center p-2'>
                      <Image
                        src={follower.followedBy.image}
                        height={50}
                        width={50}
                        className="object-cover rounded-full"
                        />
                        <h2 className="font-semibold text-xl p-2">{follower.followedBy.userName}</h2>
                     </div>
                                            
                      <p className='px-2 text-sm text-stone-300 py-4 text-center'>Just Wandering about here and there</p>
               
                      <Link             
                        href={`/user-profile/${follower.followedBy._id}`}>
                    
                          <button className="btn w-[90%] m-2 btn-info">View Profile</button>
                          </Link>
                  </div>
                    
                  )}
                  </div>
          }

          {
            text === 'following' && <div className='flex justify-center gap-4 flex-wrap mx-2 mt-4'>
                  {followers?.map(follower =>
                    <div
                       key={follower.following?._id}
                      className="flex flex-col w-40 border-2 bg-slate-900 rounded-box">
                      <div className='flex flex-col bg-stone-800 rounded-box h-30 items-center justify-center p-2'>
                      <Image
                        src={follower?.following?.image}
                        height={50}
                        width={50}
                        className="object-cover rounded-full"
                        />
                        <h2 className="font-semibold text-xl p-2">{follower.following?.userName}</h2>
                     </div>
                                            
                      <p className='px-2 text-sm text-stone-300 py-4 text-center'>Just Wandering about here and there</p>
               
                      <Link             
                        href={`/user-profile/${follower.following?._id}`}>
                    
                          <button className="btn w-[90%] m-2 btn-info">View Profile</button>
                          </Link>
                  </div>
                    
                  )}
          </div>
          }
          {
            text === 'settings' && <div className='flex flex-col md:items-center px-2 py-4'>
              <div className='form-control md:w-[30rem]'>
              <label htmlFor='userName' className='p-1'>
                <h1>Change User Name</h1>
                </label>
                <div className='flex'>
                <input ref={userNameRef} id='userName' type='text' placeholder = 'Enter New user_name' className='input input-bordered flex-1 '/>
                 <button className='btn btn-info mx-2' onClick={changeUserName}>Change</button>
                </div>
              </div>
              <div className='form-control md:w-[30rem]'>
              <label htmlFor='password' className='p-1'>
                <h1>Change Password</h1>
                </label>
                <div className='flex'>
                <input id='password' type='text' placeholder = 'Enter New password' className='input input-bordered flex-1 '/>
                 <button className='btn btn-info mx-2'>Change</button>
                </div>
              </div>
              <div className='form-control md:w-[30rem]'>
              <label htmlFor='about' className='p-1'>
                <h1>Change About</h1>
                </label>
                <div className='flex'>
                <input ref={aboutRef} id='about' type='text' placeholder = 'Enter about yourself' className='input input-bordered flex-1 '/>
                 <button onClick={updateAbout} className='btn btn-info mx-2'>Change</button>
                </div>
              </div>
              <div className='pt-1 mx-auto'>
                <h1 className='text-center m-1 text-lg'>Change Profile Picture</h1>
                <div className='w-64 '>
                <ImageUploader imageAsset={imageAsset} profilePage={true} setImageAsset={setImageAsset}/>
                </div>
                <button className='btn btn-info w-full' onClick={updateProfilePic}>Update</button>
              </div>
            </div>
          }
        
     
      </div>

    </div>
    </Layout>
  );
};

export default UserProfile;

export async function getServerSideProps(context) {
  const { userId } = context?.params;
  const query = `*[_type == "user" && _id == '${userId}']{
    _id,
    userName,
    about,
    image,
    followers[]{
      followedBy->{
        _id
      }
    },
    following[]{
      following->{
        _id,
      }
    }
  }`;

  const data = await client.fetch(query);
  return {
    props: {
      user:data[0]
    }
  }
}