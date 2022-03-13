import React,{useState} from 'react'
import Link from 'next/link';

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
    <h2 className="mt-5 text-2xl font-bold">Comments</h2>
      <div className="max-h-[220px] overflow-y-auto">
        {comments?.map((item) => (
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
  )
}

export default Comment