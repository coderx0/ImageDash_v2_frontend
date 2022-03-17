import { useState } from "react";
import { useRouter } from 'next/router';
import {motion} from "framer-motion";
import Share from "./Share";

import { AiOutlineHeart,AiFillHeart,AiOutlineShareAlt,AiOutlineDownload } from "react-icons/ai";

const Pin = ({ pin,userId,setShowPinModal,setShowLoginModal,setLoginMessage,setLoginImage}) => {
  const [postHovered, setPostHovered] = useState(false);

  const router = useRouter();
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [pinLikes, setPinLikes] = useState(null);

  let { postedBy, image, _id, destination,title } = pin;

  let alreadyLiked = pinLikes ? pinLikes.filter((item) => item.userId === userId) :
    pin?.likes?.filter((item) => item?.likedBy?._id === userId);
  alreadyLiked = alreadyLiked?.length > 0 ? alreadyLiked : [];

  const likePin = (id) => { 
    console.log('strange');
    if (userId) {
      if (alreadyLiked?.length === 0 && postedBy._id!==userId) {
        setLikingPost(true);
        fetch(`/api/utils/like/image_${id}/user_${userId}`).then((response) => response.json()).then((data) => {
          setPinLikes(data.message);
          setLikingPost(false);
        });
      }
    } else {
      setShowLoginModal(true);
      setLoginImage(image.asset.url);
      setLoginMessage(`Login to like the image ${title}`);
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
              className="w-full h-full object-cover hover:scale-125 transition duration-1000"
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
            <img src={postedBy.image} className="ml-1 object-cover cursor-pointer rounded-full w-8 h-8 inline-block" onClick={()=>{router.push(`/user-profile/${postedBy._id}`)}}/>
            <span className="ml-2 sm:text-sm md:text-md lg:text-lg cursor-pointer" onClick={()=>{router.push(`/user-profile/${postedBy._id}`)}}>
              {postedBy.userName}
            </span>
        </motion.div>
          }
        
        </div>
      
          <div className="bg-slate-900 flex relative justify-around items-center">
          <h1 className="flex-1 pl-2 text-[1rem] font-semibold">
            {title}
          </h1>

          <div className="flex items-center btn-group">
            { alreadyLiked.length>0 && 
              <button className="btn bg-slate-900 px-2 text-lg hover:bg-red-500 flex gap-2">
              {pinLikes ? pinLikes.length : pin?.likes?.length}
              {alreadyLiked.length > 0 &&
              <span>
           <AiFillHeart className="h-5 w-5"/>
              </span>}
              </button>}
            
            { alreadyLiked.length === 0 && 
              <button
                onClick={(e) => {
                e.stopPropagation();
                likePin(_id);
              }}
                className="btn bg-slate-900 px-2 text-lg hover:bg-red-500 flex gap-2">
              {pinLikes ? pinLikes.length : pin?.likes?.length}
             
              <span className="cursor-pointer">
              <AiOutlineHeart className="h-5 w-5"/>
                </span>
            </button>
            }
            
          <label htmlFor="my-modal" className="btn bg-slate-900 px-2 modal-button" onClick={()=>setShowShareModal(true)}>
          <AiOutlineShareAlt className="h-5 w-5"/>
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
             <AiOutlineDownload className="h-5 w-5"/>
          </a>
         </div>
       </div>
      </div>
      </>
  );
};

export default Pin;