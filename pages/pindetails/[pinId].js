import React, { useState } from 'react';
import { client, urlFor } from '../../lib/sanityClient';
import Masonry from "react-masonry-css";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Pin from '../../components/Pin';
import { pinDetailQuery,pinDetailMorePinQuery } from '../../lib/Data';

const breakPointObj = {
    default: 3,
    1500: 3,
    1000: 2,
    700:1
}


const PinDetail = ({pinDetail:pinDetails,morePin:pins}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { pinId } = router.query;
    
  // const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState(pinDetails);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [pinSaves, setPinSaves] = useState(null);
  const [pinLikes, setPinLikes] = useState(null);
  const [followSuccess, setFollowSuccess] = useState(false);

  let alreadyLiked = pinLikes ? pinLikes.filter((item) => item.userId === session?.user.id) :
  pinDetail?.likes?.filter((item) => item?.likedBy?._id === session?.user?.id);
  alreadyLiked = alreadyLiked?.length > 0 ? alreadyLiked : [];

  const likePin = (id) => {
    if (alreadyLiked?.length === 0) {
      setLikingPost(true);
      fetch(`/api/utils/like/image_${id}/user_${session.user.id}`).then((response) => response.json()).then((data) => {
        setPinLikes(data.message);
        setLikingPost(false);
      });
    }
  };

  let alreadySaved = pinSaves ? pinSaves.filter((item) => item.userId === session?.user.id) :
  pinDetail?.save?.filter((item) => item?.postedBy?._id === session?.user?.id);
  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);
      fetch(`/api/utils/save/image_${id}/user_${session.user.id}`).then((response) => response.json()).then(data => {
        setPinSaves(data.message);
        setSavingPost(false);
      });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      fetch(`/api/utils/comment/${pinId}/${session.user.id}/${comment}`).then(response => response.json()).then(data => {
        setComment('');
        setPinDetail((prevData) => ({ ...prevData, comments: data.comments }));
        setAddingComment(false);
      })
    }
  };


  let alreadyFollowed = pinDetail?.postedBy?.followers?.filter((item) => item?.followedBy?._id === session?.user?.id);
  alreadyFollowed = alreadyFollowed?.length > 0 ? alreadyFollowed : [];

  const followUser = (id,userId) => {
    if (alreadyFollowed?.length === 0) {

      fetch(`/api/utils/follow/${id}/${userId}`).then(response => response.json()).then(data => {
        if (data.message === "success") {
          setFollowSuccess(true);
        }
      });
      
    }
  }


  return (
    <>
      <div className="bg-center bg-no-repeat bg-cover bg-fixed" style={{backgroundImage:`url("https://cdn.pixabay.com/photo/2020/01/03/00/09/mountains-4737080_960_720.png")`}}>
      
        {!pinDetail && <h1 className='w-full h-[90vh] flex justify-center items-center bg-red-300'>Wait</h1>}
      {pinDetail && (
        <div className="flex lg:flex-row flex-col justify-center conatiner mx-auto" style={{ maxWidth: '1500px'}}>
          <div>
          <img
              className="w-full h-full object-cover"
              src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 bg-[#0f0e17] md:min-w-[25rem] lg:max-w-[35rem]">
            <div className='border-b-2 pb-8'>
              <h1 className="text-4xl font-bold break-words mt-3 text-[#fffffe]">
                {pinDetail.title}
              </h1>
              <p className="mt-3 text-[#a7a9be] text-lg">{pinDetail.about}</p>
              
            </div>
            <div className='mt-8 flex justify-between text-xl border-b-2 pb-6'>
                      <Link href={`/user-profile/${pinDetail?.postedBy?._id}`}>
                          <a className='flex gap-2 '>
                          <img src={pinDetail?.postedBy?.image} className="w-12 h-12 object-cover rounded-full" alt="user-profile" />
                                  <div className="font-bold">
                                      <p>{pinDetail?.postedBy?.userName}</p>
                                    <p className='text-sm font-normal'>{pinDetail?.postedBy?.followers? pinDetail.postedBy.followers.length:0} Followers</p>
                                  </div>
                    </a>
                          </Link>
                <button className='btn bg-[#ff8906] text-[#fffffe] font-bold' onClick={() => { followUser(pinDetail.postedBy._id, session.user.id) }}>
                  {followSuccess?'Following':alreadyFollowed.length > 0 ? 'Following' : 'Follow'}
                          </button>
            </div>
            <div className='mt-8 flex justify-between'>
                <button className='btn bg-[#ff8906] hover:bg-red-500 text-xl' onClick={() => { likePin(pinDetail._id) }}>
                  <span className='mr-2'>
                    {pinDetail?.likes ? pinDetail.likes.length : 0}
                  </span>
                  {alreadyLiked.length > 0 ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>}
                </button>
                <button className='btn' onClick={() => { savePin(pinDetail._id) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
</svg><span className='ml-2'>{alreadySaved.length>0?'Saved':'Save'}</span></button>
                            <a
    href={`${pinDetail.image?.asset.url}?dl=`}
    download
    className="btn"
  >
    download
  </a>
                      </div>
            <h2 className="mt-5 text-2xl font-semibold">Comments</h2>
            <div className="max-h-[220px] overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div className="flex gap-1 mt-2 items-center rounded-lg" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-8 h-8 object-cover rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold underline text-sm">{item.postedBy?.userName}</p>
                    <p className='text-md'>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link href={`/user-profile/${session?.user.id}`}>
                <img src={session?.user.image} className="w-10 h-10 rounded-full object-cover cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 text-md bg-stone-700 outline-none border-4 p-2 text-white  rounded-2xl focus:border-sky-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={addComment}
              >
                {addingComment ? 'Doing...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
              <Masonry className="p-4 flex animate-slide-fwd" breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin key={pin._id} pin={pin}/>)}
            </Masonry>
      ) : (
        <h1>Loading More Pins...</h1>
        )}
        </div>
    </>
  );
};

export default PinDetail;

export async function getServerSideProps(context) {
  const { pinId } = context.params;
  const query = pinDetailQuery(pinId);

  const data = await client.fetch(`${query}`);
  let morePinData = null;
  if (data[0]) {
      const query1 = pinDetailMorePinQuery(data[0]);
      morePinData = await client.fetch(query1);
  }

  return {
    props: {
      pinDetail: data[0],
      morePin:morePinData
    }
  }
}


// <div className="flex items-center justify-between">
// <div className="flex gap-2 items-center">

// </div>
// <a href={pinDetail.destination} target="_blank" rel="noreferrer">
//   {pinDetail.destination?.slice(8)}
// </a>
// </div>