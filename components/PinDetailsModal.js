import React, { useEffect, useRef, useState } from 'react';
import { urlFor } from '../lib/sanityClient';
import Masonry from "react-masonry-css";
import Link from 'next/link';
import Pin from './Pin';

const breakPointObj = {
  default: 2,
   500:1
}


const PinDetailsModal = (props) => {
  
  const pinDetail = props?.pinDetail;
  const setShowPinModal = props?.setShowPinModal;
  const session = props?.session;
  
  const collectionInputRef = useRef();
  const [pins, setPins] = useState(null);
  const [moreDetails, setMoreDetails] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [pinSaves, setPinSaves] = useState(null);
  const [pinLikes, setPinLikes] = useState(null);
  const [followSuccess, setFollowSuccess] = useState(false);
  const [collection, setCollection] = useState(null);

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
    
  let alreadyLiked = pinLikes ? pinLikes.filter((item) => item.userId === session?.user.id) :
  pinDetail?.likes?.filter((item) => item?.likedBy?._id === session?.user?.id);
  alreadyLiked = alreadyLiked?.length > 0 ? alreadyLiked : [];

  const likePin = (id) => {
    if (alreadyLiked?.length === 0 && session) {
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
    if (alreadySaved?.length === 0 && session) {
      setSavingPost(true);
      fetch(`/api/utils/save/image_${id}/user_${session.user.id}`).then((response) => response.json()).then(data => {
        setPinSaves(data.message);
        setSavingPost(false);
      });
    }
  };

  const addComment = () => {
    if (comment && session) {
      setAddingComment(true);
      fetch(`/api/utils/comment/${pinDetail._id}/${session.user.id}/${comment}`).then(response => response.json()).then(data => {
        setComment('');
        setMoreDetails((prevData) => ({ ...prevData, comments: data.comments }));
        setAddingComment(false);
      })
    }
  };

  let alreadyFollowed = moreDetails?.postedBy?.followers?.filter((item) => item?.followedBy?._id === session?.user?.id);
  alreadyFollowed = alreadyFollowed?.length > 0 ? alreadyFollowed : [];

  const followUser = (id,userId) => {
    if (alreadyFollowed?.length === 0 && session) {

      fetch(`/api/utils/follow/${id}/${userId}`).then(response => response.json()).then(data => {
        if (data.message === "success") {
          setFollowSuccess(true);
        }
      });
      
    }
  }

  const closeModal = (e) => {
      if (e.target.id === "pinBackdrop") {
          setShowPinModal(null);
      }
  }

  const collectionModal = async() => {
    const response = await fetch(`/api/utils/collection/${session?.user.id}`);
    const data = await response.json();
    setCollection(data?.collectionData);
    setShowCollectionModal(true);
    console.log(data.collectionData);
  }
  
  const createCollection = async (event) => {
    event.preventDefault();
    const collectionName = collectionInputRef.current.value;
    const response = await fetch(`/api/utils/collection/create/${session?.user.id}/${collectionName}`);
    const data = await response.json();
    const createdId = data?.collectionData._id;
    const title = data?.collectionData.title;

    setCollection(prev=>[{_id:createdId,title,pins:null},...prev]);
  }

  const addPinToSelectedCollection = async (collectionItem, pinId) => {
    const response = await fetch(`/api/utils/collection/addPin`, {
      method: "POST",
      body: JSON.stringify({
        collectionItem,
        pinId,
        uId: session?.user.id
      }),
      headers: { "Content-Type": 'application/json' }
    });
    const data = await response.json();
    if (data) {
      console.log("added to collection " + collectionItem.title);
      setShowCollectionModal(false);
    }
  };
  
  const removePinFromCollection = async (collectionItem, pinId) => {
    const response = await fetch(`/api/utils/collection/removePin`, {
      method: "POST",
      body: JSON.stringify({
        collectionItem,
        pinId,
        uId: session?.user.id
      }),
      headers: { "Content-Type": 'application/json' }
    });
    const data = await response.json();
    if (data) {
      console.log("removed from collection " + collectionItem.title);
    }
  };

  return (
      <div className='fixed z-10 top-0 left-0 right-0 bottom-0 backdrop-blur-md' id="pinBackdrop" onClick={closeModal}>
      <div
        id="pinModal"
      className="bg-base-100 mt-16 md:mt-16 h-[92vh] md:h-[90vh] overflow-x-hidden overflow-y-auto md:mx-8 xl:mx-24">
        <button
          onClick={()=>setShowPinModal(null)}
          className='z-10 sticky top-0 md:hidden btn btn-error rounded-none mb-1 w-full text-lg font-bold'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
</svg>
        </button>
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
                <div className='text-right md:text-left flex-1'>
                <button className='btn btn-primary btn-outline font-bold' onClick={() => { followUser(pinDetail.postedBy._id, session?.user.id) }}>
                  {followSuccess?'Following':alreadyFollowed.length > 0 ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
            <div className='hidden md:flex btn-group  relative'>
                <button className='btn btn-outline p-2 px-3 border-2 hover:bg-red-500 text-lg' onClick={() => { likePin(pinDetail._id) }}>
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
                <button className='btn btn-outline p-2 px-3 border-2 hover:bg-sky-500' onClick={() => { savePin(pinDetail._id) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg><span className='ml-2'>{alreadySaved.length > 0 ? 'Saved' : 'Save'}</span>
                </button>
                <button className='btn btn-outline p-2 px-3 border-2 hover:bg-sky-600' onClick={collectionModal}>
                  Collection
                </button>
                {showCollectionModal &&
                  <div className='w-72 p-2 absolute -bottom-[18rem] right-0 bg-stone-900 border-2 rounded-xl'>
                  <button className='bg-red-500 absolute -top-4 -left-4 p-1 border-4 rounded-full' onClick={() => setShowCollectionModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
</svg>
                  </button>
                  <div className="dropdown w-full">
                  <button tabIndex="0" className="btn btn-info w-full font-bold">Create New Collection</button>
                  <form tabIndex="0" onSubmit={createCollection} className="py-2 w-full dropdown-content bg-base-700 rounded-box flex gap-2">
                  <input type="text" ref={collectionInputRef} placeholder="collection name" className="input input-bordered bg-stone-900 w-full max-w-xs"/>
                      <button className='btn btn-success font-bold'>Create</button>
                  </form>
                  </div>
                  
                  <div className='flex flex-col pt-2 px-4 gap-1 h-52 overflow-auto'>
                    {collection?.map(item =>
                      <div className='flex bg-stone-800 p-1' key={item.title}>
                        <span className='flex-1 p-2 text-lg'>{item.title}</span>
                        
                    {item.pins?.filter(pin=>pin.item._id===pinDetail._id).length===1 ?
                          <button
                            onClick={()=>removePinFromCollection(item,pinDetail._id)}
                            className='btn btn-error font-bold p-2 px-3'>
                        Remove
                      </button> :
                      <button
                        onClick={()=>{addPinToSelectedCollection(item,pinDetail._id)}}
                        className='btn btn-success font-bold p-2 px-3'>
                        Add
                          </button>}
                        
                      </div>)}
                  </div>
                  </div>}
                  <a
                href={`${pinDetail.image?.asset.url}?dl=`}
                download
                className="btn btn-outline border-2 p-2 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
</svg>
              </a>
            </div>
                
            </div>
            <div className='md:h-[65vh]'>
          <img
              className="mx-auto h-full object-cover"
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
                <button className='btn btn-outline p-2 hover:bg-red-500 text-lg' onClick={() => { likePin(pinDetail._id) }}>
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
                <button className='btn btn-outline p-2 hover:bg-sky-500' onClick={() => { savePin(pinDetail._id) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg><span className='ml-2'>{alreadySaved.length > 0 ? 'Saved' : 'Save'}</span>
                </button>
                <button className='btn btn-outline p-2 hover:bg-sky-600' onClick={collectionModal}>
                  Collection
                </button>
                {showCollectionModal &&
                  <div className='w-72 p-2 absolute bottom-0 right-0 bg-stone-900 border-2 rounded-xl'>
                  <button className='bg-red-500 absolute -top-4 -left-4 p-1 border-4 rounded-full' onClick={() => setShowCollectionModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
</svg>
                  </button>
                  <div className="dropdown w-full">
                  <button tabIndex="0" className="btn btn-info w-full font-bold">Create New Collection</button>
                  <form tabIndex="0" onSubmit={createCollection} className="py-2 w-full dropdown-content bg-base-700 rounded-box flex gap-2">
                  <input type="text" ref={collectionInputRef} placeholder="collection name" className="input input-bordered bg-stone-900 w-full max-w-xs"/>
                      <button className='btn btn-success font-bold'>Create</button>
                  </form>
                  </div>
                  
                  <div className='flex flex-col pt-2 px-4 gap-1 h-52 overflow-auto'>
                    {collection?.map(item =>
                      <div className='flex bg-stone-800 p-1' key={item.title}>
                        <span className='flex-1 p-2 text-lg'>{item.title}</span>
                        
                    {item.pins?.filter(pin=>pin.item._id===pinDetail._id).length===1 ?
                          <button
                            onClick={()=>removePinFromCollection(item,pinDetail._id)}
                            className='btn btn-error font-bold p-2 px-3'>
                        Remove
                      </button> :
                      <button
                        onClick={()=>{addPinToSelectedCollection(item,pinDetail._id)}}
                        className='btn btn-success font-bold p-2 px-3'>
                        Add
                          </button>}
                        
                      </div>)}
                  </div>
                  </div>}
                  <a
                href={`${pinDetail.image?.asset.url}?dl=`}
                download
                className="btn btn-outline p-2 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
</svg>
              </a>
            </div>
          </div>
        </div>
        )}
        
        <div className='flex py-2 px-1 md:px-4 w-full flex-col md:flex-row'>
          <div className='md:w-[40%] md:pr-4'>
          <h2 className="mt-5 text-2xl font-bold">Comments</h2>
            <div className="max-h-[220px] overflow-y-auto">
              {moreDetails?.comments?.map((item) => (
                <div className="flex my-4  mx-2 relative overflow-visible items-center rounded-box" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="h-10 w-10 object-cover rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  
                  <div className="ml-2 flex flex-col">
                    <p className="font-bold underline text-sm">{item.postedBy?.userName}</p>
                    <p className='text-md'>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex mt-6 w-full">
            <Link href={`/user-profile/${session?.user.id}`}>
                  <img
                    src={session?.user.image}
                    className="w-8 h-8 my-1 md:w-10 md:h-10 rounded-full object-cover cursor-pointer"
                    alt="user-profile" />
              </Link>
              <input
                className="flex-1 input input-bordered"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />
             <button
                type="button"
                className="mx-1 btn btn-success font-bold"
                onClick={addComment}
              >
                {addingComment ? 'Doing...' : 'Done'}
              </button>
          </div>
          </div>
          <div className='md:w-[60%]'>
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
