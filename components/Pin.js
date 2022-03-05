import { useState } from "react";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import {motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Share from "./Share";

const Pin = ({ pin,setShowPinModal }) => {
  const [postHovered, setPostHovered] = useState(false);

  const router = useRouter();
  
  const { data: session, status } = useSession();
  const [showShareModal, setShowShareModal] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [pinLikes, setPinLikes] = useState(null);
  const [pinSaves, setPinSaves] = useState(null);

  let { postedBy, image, _id, destination,title } = pin;

  let alreadySaved = pinSaves ? pinSaves.filter((item) => item.userId === session?.user.id) :
    pin?.save?.filter((item) => item?.postedBy?._id === session?.user?.id);
  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  let alreadyLiked = pinLikes ? pinLikes.filter((item) => item.userId === session?.user.id) :
    pin?.likes?.filter((item) => item?.likedBy?._id === session?.user?.id);
  alreadyLiked = alreadyLiked?.length > 0 ? alreadyLiked : [];

  const likePin = (id) => { 
    if (alreadyLiked?.length === 0 && session && postedBy._id!==session?.user.id) {
      setLikingPost(true);
      fetch(`/api/utils/like/image_${id}/user_${session.user.id}`).then((response) => response.json()).then((data) => {
        setPinLikes(data.message);
        setLikingPost(false);
      });
    }
  };
  
  const savePin = (id) => {
    if (alreadySaved?.length === 0 && session && postedBy._id!==session?.user.id) {
      setSavingPost(true);
      fetch(`/api/utils/save/image_${id}/user_${session.user.id}`).then((response) => response.json()).then(data => {
        setPinSaves(data.message);
        setSavingPost(false);
      });
    }
  };

  const showPin = () => {
    // router.push(`/pindetails/${_id}`);
    setShowPinModal(pin);
  }

  return (
    <>
      <div
        className="md:mx-1 my-4 md:p-0 z-10 border-2 border-slate-700"
        style={{
          backgroundColor: 'rgba(17, 25, 40, 0.15)',
        }}>
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          className="relative cursor-zoom-in w-auto hover:shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
          <div className="w-full relative overflow-hidden">
            <img
              onClick={showPin}
              src={image.asset.url}
              className="w-full h-full hover:scale-125 transition duration-1000"
              alt="user-post" 
              />
          </div>
    
          {
            postHovered &&
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{duration:0.5}}
                className="absolute font-semibold top-0 right-0 pr-2 p-1 backdrop-blur-md">
            <img src={postedBy.image} className="ml-1 object-cover cursor-pointer rounded-full w-4 h-4 md:w-8 md:h-8 inline-block" onClick={()=>{router.push(`/user-profile/${postedBy._id}`)}}/>
            <span className="ml-2 sm:text-sm md:text-md lg:text-lg cursor-pointer" onClick={()=>{router.push(`/user-profile/${postedBy._id}`)}}>
              {postedBy.userName}
            </span>
        </motion.div>
          }
          {
            postHovered && (
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="absolute top-0 flex">
                {alreadySaved?.length !== 0 ? (
                  <button type="button"
                    onClick={e => e.stopPropagation()}
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-semibold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                   Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
              </motion.div>
            )
          }
        </div>
      
          <div className="bg-slate-900 flex relative justify-around items-center">
          <h1 className="flex-1 pl-2 text-[1rem] font-semibold">
            {title}
          </h1>

          <div className="flex items-center btn-group">
          <button className="btn bg-slate-900 px-2 text-lg hover:bg-red-500 flex gap-2">
            {pinLikes? pinLikes.length: pin?.likes?.length}
            {alreadyLiked.length > 0 &&
              <span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
</svg>
              </span>}
            
            {alreadyLiked.length === 0 &&
              <span className="cursor-pointer"  onClick={(e) => {
                e.stopPropagation();
                likePin(_id);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
</span>}
            </button>
            <label htmlFor="my-modal" className="btn bg-slate-900 px-2 modal-button" onClick={()=>setShowShareModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
</svg>
</label>
            {showShareModal && <Share setShowShareModal={setShowShareModal} title={title} id={_id} imageUrl={image.asset.url}/>}

          <a
              href={`${image?.asset?.url}?dl=`}
              download
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="btn bg-slate-900 px-2 hover:animate-pulse"
                          >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
          </a>
         </div>
       </div>
      </div>
      </>
  );
};

export default Pin;



{/* <Link href={`/pindetails/${pin._id}`}>
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
</svg>
</Link> */}