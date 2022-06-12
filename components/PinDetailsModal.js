import React, { useEffect, useState } from 'react';
import { urlFor } from '../lib/sanityClient';
import Masonry from "react-masonry-css";
import Link from 'next/link';
import Pin from './Pin';
import CollectionCreation from "./CollectionCreation";
import FollowUser from "./FollowUser";
import Comment from './Comment';
import LoginModal from './LoginModal';
import LikePin from './LikePin';
import { useScrollLock } from '@mantine/hooks';

const breakPointObj = {
  default: 3,
  800:2,
   500:1
}

const PinDetailsModal = (props) => {
  
  const [scrollLocked, setScrollLocked] = useScrollLock(true);
  
  const pinDetail = props?.pinDetail;
  const setShowPinModal = props?.setShowPinModal;
  const session = props?.session;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [pins, setPins] = useState(null);
  const [moreDetails, setMoreDetails] = useState(null);
  const [loginImage, setloginImage] = useState(null);

  useEffect(() => {
    if (pinDetail._id) {
      const element = document.getElementById("pinModal");
      element.scrollTo(0, 0);
      
        fetch(`/api/data/pinDetails/${pinDetail._id}`).then(response => response.json()).then(data => {
            setPins(data.morePins);
            setMoreDetails(data.pinData);
        });
   }
    }, [pinDetail._id]);

 
  const closeModal = (e) => {
      if (e.target.id === "pinBackdrop") {
          setShowPinModal(null);
      }
  }

  return (
      <div className='fixed z-10 top-0 left-0 right-0 bottom-0 bg-[#222222b1]' id="pinBackdrop" onClick={closeModal}>
      {showLoginModal &&
        <LoginModal
        loginImage={loginImage}
        loginMessage={loginMessage}
          setShowLoginModal={setShowLoginModal} />}
      
        <button
          onClick={()=>setShowPinModal(null)}
          className='btn btn-rounded-none mb-1 text-lg font-bold absolute top-0 right-0 z-20'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
</svg>
        </button>
      <div
        id="pinModal"
      className="bg-base-100 h-[100vh] overflow-x-hidden overflow-y-auto md:mx-6 xl:mx-24">
       
      {pinDetail && (
        <div className="flex flex-col w-full md:px-4">
          <div className='flex justify-between text-md md:text-xl p-2 w-full'>
              <div className='flex flex-1 w-full gap-4'>
              <Link href={`/user-profile/${pinDetail?.postedBy?._id}`}>
                <a className='flex gap-2 '>
                <img src={pinDetail?.postedBy?.image} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" alt="user-profile" />
                        <div>
                            <p className="font-bold">{pinDetail?.postedBy?.userName}</p>
                          <p className='text-[12px] md:text-sm'>{moreDetails?.postedBy?.followers? moreDetails.postedBy.followers.length:0} Followers</p>
                        </div>
          </a>
              </Link>
                <div className='text-left flex-1'>
                  {moreDetails &&
                    <FollowUser
                    userFollowers={moreDetails.postedBy.followers}
                    id={pinDetail.postedBy._id}
                    userId={session?.user.id}
                    setloginImage={setloginImage}
                  setLoginMessage={setLoginMessage}
                  setShowLoginModal={setShowLoginModal}
                  imageUrl={pinDetail.image.asset.url}
                 />
                  }
                </div>
                
              </div>
            <div className='hidden md:flex btn-group  relative'>
            <LikePin
                  likes={moreDetails?.likes}
                  pinId={pinDetail._id}
                  setLoginMessage={setLoginMessage}
                  setShowLoginModal={setShowLoginModal}
                  setloginImage={setloginImage}
                  userId={session?.user.id} 
                  imageUrl={pinDetail.image.asset.url}
                  pinTitle= {pinDetail.title}
                  />
                <CollectionCreation
                  imageUrl= {pinDetail.image.asset.url}
                  setShowLoginModal={setShowLoginModal}
                  setloginImage={setloginImage}
                  pinTitle= {pinDetail.title}
                  setLoginMessage={setLoginMessage}
                  userId={session?.user.id}
                  pinId={pinDetail._id} />
               <a
                href={`${pinDetail.image?.asset.url}?dl=`}
                download
                className="btn p-2 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
</svg>
                </a>
            </div>
                
            </div>
            <div className=''>
          <img
              className="w-full max-h-[80vh] object-contain"
              src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
              alt="user-post"
              />
          </div>
          <div className="w-full px-2 md:px-0 flex flex-col">
            <div className='md:border-b-2 pb-2 text-center md:mr-2'>
                <h1 className='flex-1 mt-2 text-[#fffffe] text-xl md:text-3xl font-bold break-words'>
                  {pinDetail.title}
                </h1>
              <p className="mt-2 text-[#a7a9be] font-semibold text-sm md:text-md">{moreDetails?.about}</p>
              </div>
              <div className='flex block md:hidden btn-group mx-auto relative'>
                <LikePin
                  likes={moreDetails?.likes}
                  pinId={pinDetail._id}
                  setLoginMessage={setLoginMessage}
                  setShowLoginModal={setShowLoginModal}
                  setloginImage={setloginImage}
                  userId={session?.user.id}
                  imageUrl={pinDetail.image.asset.url}
                  pinTitle= {pinDetail.title}
                  />
                <CollectionCreation
                  imageUrl= {pinDetail.image.asset.url}
                  setShowLoginModal={setShowLoginModal}
                  setloginImage={setloginImage}
                  pinTitle= {pinDetail.title}
                  setLoginMessage={setLoginMessage}
                  userId={session?.user.id}
                  pinId={pinDetail._id} />
                  <a
                href={`${pinDetail.image?.asset.url}?dl=`}
                download
                className="btn p-2 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
</svg>
              </a>
            </div>
          </div>
        </div>
        )}
        
        <div className='flex py-2 px-1 md:px-4 w-full flex-col'>
          <Comment
            session={session}
            pinId={pinDetail._id}
            setMoreDetails={setMoreDetails}
            comments={moreDetails?.comments}
            setloginImage={setloginImage}
                  setLoginMessage={setLoginMessage}
                  setShowLoginModal={setShowLoginModal}
            imageUrl={pinDetail.image.asset.url}
            pinTitle= {pinDetail.title}
                  />
          <div className=''>
          {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
              {pins ? (    
               <Masonry className="pl-2 flex gap-2 lg:gap-0" breakpointCols={breakPointObj}>
            {pins?.map(pin => <Pin key={pin._id} pin={pin} setShowPinModal={setShowPinModal}/>)}
            </Masonry>
      ) : (
        <h1 className='w-full text-center font-semibold mt-4 text-xl'>Loading More Pins...</h1>
        )}
          </div>
        </div>
        </div>
     </div>
  );
};

export default PinDetailsModal;