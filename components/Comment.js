import React,{useState} from 'react'
import Link from 'next/link';
import Image from "next/image";

const Comment = ({session,pinId,setMoreDetails,comments}) => {
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
        }
    };
    
  return (
    <div className='md:w-[40%] md:pr-4'>
      <h2 className="mt-5 text-2xl font-bold ">Comments</h2>
      
      <div className="h-[40vh] md:h-[auto] overflow-y-auto">
        {comments?.map((item) => (
          <div className=" my-4 mx-2 relative overflow-visible rounded-box" key={item.comment}>
            <div className='flex gap-4'>
            <div className='w-22'>
            <Image
                src={item.postedBy?.image}
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
              src={session?.user.image}
              className="rounded-full object-cover cursor-pointer"
              alt="user-profile" />
         </a>
        </Link>
     </div>
        <input
          className="flex-1 input input-bordered"
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