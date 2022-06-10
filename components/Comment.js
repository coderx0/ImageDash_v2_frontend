import React,{useState} from 'react'
import Link from 'next/link';
import Image from "next/image";
import defaultProfile from "../public/images/defaultProfile.png"

const Comment = ({session,pinId,setMoreDetails,comments,pinTitle,setloginImage,setLoginMessage,setShowLoginModal,imageUrl}) => {
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);

    const addComment = () => {
        if (comment && session) {
          setAddingComment(true);
            fetch(`/api/utils/comment/${pinId}/${session.user.id}/${comment}`)
                .then(response => response.json()).then(data => {
            setComment('');
            setMoreDetails((prevData) => ({ ...prevData, comments: data.comments }));
            setAddingComment(false);
          })
        } else {
          setShowLoginModal(true);
          setloginImage(imageUrl);
          setLoginMessage(`Login to like the image '${pinTitle}'`);
     
        }
    };
 
  return (
    <div className=''>
      <h2 className="mt-5 text-2xl font-bold ">Comments</h2>
      
      <div className="max-h-[40vh] md:max-h-full overflow-y-auto">
        {comments?.map((item) => (
          <div className=" my-4 mx-2 relative overflow-visible rounded-box" key={item.comment}>
            <div className='flex gap-4'>
            <div className='w-22'>
            <Image
                src={item?.postedBy?.image}
                height={45}
                width={45}
              className=" object-cover rounded-full cursor-pointer"
              alt="user-profile"
            />
            </div>
              <div className='flex-1'>
              <p className="font-bold underline text-sm">{item.postedBy?.userName}</p>
            <p className='text-md'>{item.comment}</p>
           </div>
         </div>
              
          </div>
        ))}
       
      </div>
      <div className="flex gap-2 mt-6 w-full">
        <div className='w-18'>
        <Link href={`/user-profile/${session?.user.id}`}>
          <a>
          <Image
            width={44}
            height={44}
              src={session? session.user.image : defaultProfile}
              className="rounded-full object-cover cursor-pointer"
              alt="user-profile" />
         </a>
        </Link>
     </div>
        <input
          className="flex-1 sm:flex-none sm:w-[50%] input input-bordered"
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          />
       
          {addingComment ? <button  className="w-16 btn btn-success loading"></button> : <button    className="w-16 btn btn-success font-bold"
          onClick={addComment}>Done</button>}
        
    </div>
    </div>
  )
}

export default Comment