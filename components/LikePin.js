import React,{useState} from 'react'
import { BsFillHeartFill,BsHeart } from "react-icons/bs";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

const LikePin = ({ likes, pinId, userId,setShowLoginModal,setloginImage,setLoginMessage}) => {
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
        setloginImage(pinDetail.image.asset.url);
        setLoginMessage(`Login to like the image '${pinDetail.title}'`);
      }
    
    };
  return (
      <button
          className='btn btn-outline px-3 border-2 hover:bg-red-500 text-lg flex items-center '
          onClick={likePin}>
    <span className='mr-2'>
      {pinLikes?pinLikes.length: likes?likes.length : <p></p>}
          </span>
          {likingPost &&  <UseAnimations animation={loading} size={26} style={{ padding: 100,color:'white' }} />}
    {!likingPost && (alreadyLiked.length > 0 ? 
      <BsFillHeartFill/> : 
      <BsHeart/>)}
  </button>
  )
}

export default LikePin