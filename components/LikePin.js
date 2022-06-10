import React,{useState} from 'react'
import { BsFillHeartFill,BsHeart } from "react-icons/bs";

const LikePin = ({ likes, pinId,pinTitle, userId,setShowLoginModal,setloginImage,setLoginMessage,imageUrl}) => {
    const [likingPost, setLikingPost] = useState(false);
    const [pinLikes, setPinLikes] = useState(null);

    let alreadyLiked = pinLikes ? pinLikes.filter((item) => item.userId === userId) :
    likes?.filter((item) => item?.likedBy?._id === userId);
    
    alreadyLiked = alreadyLiked?.length > 0 ? alreadyLiked : [];
  
    const likePin = () => {
      if (userId) {
        if (alreadyLiked?.length === 0) {
          setLikingPost(true);
          fetch(`/api/utils/like/image_${pinId}/user_${userId}`).then((response) => response.json()).then((data) => {
            setPinLikes(data.message);
              setLikingPost(false);
          });
        }
      } else {
        setShowLoginModal(true);
        setloginImage(imageUrl);
        setLoginMessage(`Login to like the image '${pinTitle}'`);
      }
    
    };
  return (
      <button
          className='btn px-3 border-2 hover:bg-red-500 text-lg flex items-center '
          onClick={likePin}>
    <span className='mb-1 pr-2'>
      {pinLikes?pinLikes.length: likes?likes.length : <p></p>}
    </span>
          {likingPost &&  <BsFillHeartFill className='h-4 w-4'/> }
    {!likingPost && (alreadyLiked.length > 0 ? 
      <BsFillHeartFill className='h-4 w-4'/> : 
      <BsHeart className='h-4 w-4'/>)}
  </button>
  )
}

export default LikePin