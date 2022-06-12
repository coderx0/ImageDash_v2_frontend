import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { client } from '../../lib/sanityClient';
import { useSession,signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from "../../components/Layout";
import Link from 'next/link';
import CollectionFeed from '../../components/CollectionFeed';
import Image from 'next/image';
import FollowUser from '../../components/FollowUser';
import UserSettings from '../../components/UserSettings';
import LoginModal from '../../components/LoginModal';
import LoadingV2 from '../../lottie/LoadingV2';
import UserCreatedPins from '../../components/UserCreatedPins';
import LoadingV3 from '../../lottie/LoadingV3';


const activeBtnStyles = 'btn text-[0.7rem] sm:text-[1rem] text-sky-500 font-bold rounded-none';
const notActiveBtnStyles = 'btn text-[0.7rem] sm:text-[1rem] rounded-none';

const UserProfile = ({ user: userData }) => {
  const [user, setUser] = useState(userData);

  const [pins, setPins] = useState();
  const [text, setText] = useState('images');
  const [activeBtn, setActiveBtn] = useState('images');
  const [uploadCount, setUploadCount] = useState(0);
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [collections, setCollections] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { userId } = router.query;

  const { data: session, status } = useSession();

  useEffect(() => {
    if (userId) {
      switch (text) {
        case 'images':
          if(!pins)
          setLoading(true);

          fetch(`/api/data/createdPins/${userId}`).then(response => response.json()).then(data => {
            setPins(data.pins);
            setUploadCount(data?.pins?.length);
            setLoading(false);
          });
          break;

        case 'followers':
          if(!followers)
          setLoading(true);

          fetch(`/api/data/followers/${userId}`).then(response => response.json()).then(data => {
            setFollowers(data.followers.followers);
            setLoading(false);
          });
          break;

        case 'following':
          if(!following)
          setLoading(true);

          fetch(`/api/data/following/${userId}`).then(response => response.json()).then(data => {
            setFollowing(data.following.following);
            setLoading(false);
          });
          break;

        case 'collection':
          if(!collections)
          setLoading(true);

          fetch(`/api/data/collections/${userId}`).then(response => response.json()).then(data => {
            setCollections(data.collections);
            setLoading(false);
          });
      }
  }
  }, [text, userId]);

  useEffect(() => {
    if (userId) {
      const query = `*[_type == "user" && _id == '${userId}']{
        _id,
        userName,
        about,
        image,
        bannerImage,
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
    
      client.fetch(query).then(data => {
        setUser(data[0]);
      });

      fetch(`/api/data/createdPins/${userId}`).then(response => response.json()).then(data => {
        setPins(data.pins);
        setUploadCount(data?.pins?.length);
        setText('images');
        setActiveBtn('images');
        setCollections(null);
      });
    }
  }, [userId])
  
  const showOption = session ? session.user.id === userId ? true : false : false;
 
  if (!user) return <LoadingV2/>;
  return (
    <Layout>
         {showLoginModal &&
        <LoginModal
        loginMessage={loginMessage}
          setShowLoginModal={setShowLoginModal} />}
      
      <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
         {!user?.bannerImage && <img
              className=" w-full h-48 md:h-64 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />}
          {user?.bannerImage &&  <img
              className=" w-full h-48 md:h-64 shadow-lg object-cover"
              src={user.bannerImage}
              alt="user-pic"
            />}
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
              <FollowUser
                userFollowers={user.followers}
                id={user._id}
                userId={session?.user.id} 
                  setLoginMessage={setLoginMessage}
                  setShowLoginModal={setShowLoginModal}
                />
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
         
          <div className="sm:mx-auto whitespace-nowrap overflow-y-hidden overflow-x-auto ">
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
    loading && <LoadingV3/>
   }
          {
            (text === 'images' && pins) &&

           <UserCreatedPins loading={loading} uploadedPins={pins} session={session} userId={userId}/>
          }

          {
            text === 'collection' &&
            <div>
              {collections?.length==0 && <h1 className='text-center m-4'>No Collections yet</h1>}  
                {collections &&  <CollectionFeed viewPage='profile' collections={collections}/>
                
              }
            </div>
                  }
   
          

          {
            text === 'followers' && <div >
              {
                !followers && <h1 className='text-center m-4'>No Followers Yet</h1>
              }
              <div className='flex justify-center gap-4 flex-wrap mx-2 mt-4'>
              {followers && followers?.map(follower =>
                    <div
                       key={follower.followedBy?._id}
                      className="flex flex-col w-40 border-2 bg-slate-900 rounded-box">
                      <div className='flex bg-stone-800 rounded-box h-24 items-center justify-center p-2'>
                      <Image
                        src={follower.followedBy?.image}
                        height={50}
                        width={50}
                        className="object-cover rounded-full"
                        />
                        <h2 className="font-semibold text-xl p-2">{follower.followedBy?.userName}</h2>
                     </div>
                                            
                      <p className='px-2 text-sm text-stone-300 py-4 text-center'>Just Wandering about here and there</p>
               
                      <Link             
                        href={`/user-profile/${follower.followedBy?._id}`}>
                    
                          <button className="btn w-[90%] m-2 btn-info">View Profile</button>
                          </Link>
                  </div>
                    
                  )}
              </div>
                 
                  </div>
          }

          {
            text === 'following' && <div className='flex justify-center gap-4 flex-wrap mx-2 mt-4'>
            {
                !following && <h1>Not Following anyone yet</h1>
              }    
              {following?.map(follower =>
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
            text === 'settings' &&
            <UserSettings user={user} setUser={setUser} />
          }
        
     
      </div>

    </div>
    </Layout>
  );
};

export default UserProfile;