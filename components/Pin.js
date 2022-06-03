import { useState } from "react";
import { useRouter } from 'next/router';
import Share from "./Share";

import { AiOutlineHeart,AiFillHeart,AiOutlineShareAlt,AiOutlineDownload } from "react-icons/ai";

const Pin = ({ pin,userId,setShowPinModal,setShowLoginModal,setLoginMessage,setLoginImage}) => {
  const [postHovered, setPostHovered] = useState(false);

  const router = useRouter();
  
  const [showShareModal, setShowShareModal] = useState(false);

  let { postedBy, image, _id, destination,title } = pin;


  
  const showPin = () => {
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
              src={image?.asset.url}
              height={500}
              width={500}
              className="w-full h-full object-cover hover:scale-125 transition duration-1000"
              alt="user-post" 
              />
          </div>
    
          {
            postHovered &&
            <div
                className="absolute font-semibold top-0 right-0 left-0 pr-2 p-2 bg-gradient-to-b from-slate-900" >
            <img src={postedBy.image} className="ml-1 object-cover cursor-pointer rounded-full w-8 h-8 inline-block" onClick={()=>{router.push(`/user-profile/${postedBy._id}`)}}/>
                <span className="ml-2 sm:text-sm md:text-md cursor-pointer" onClick={() => {
                  router.push(`/user-profile/${postedBy._id}`);
                  setShowPinModal(null);
}}>
              {postedBy.userName}
            </span>
        </div>
          }
        
        </div>
      
          <div className="bg-slate-900 flex relative justify-around items-center">
          <h1 className="flex-1 pl-2 text-[1rem] font-semibold">
            {title}
          </h1>

          <div className="flex items-center btn-group">
            
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