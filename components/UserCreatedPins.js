import React from 'react'
import Feed from './Feed'
import Link from 'next/link'

const UserCreatedPins = ({loading,uploadedPins,session,userId}) => {

  return (
    <div>
    {
        uploadedPins?.length>0 &&  <Feed pins={uploadedPins}/>
    }
    {
        (uploadedPins?.length==0 && !session) && <h1 className='text-center m-6'>User has not uploaded any images yet.</h1>
    }
    {
        (uploadedPins?.length==0 && session?.user?.id == userId) &&  <div className="flex flex-col gap-4 justify-center font-bold items-center w-full text-1xl mt-2">
                  <span className='mt-4 font-normal'>
                  No Images Uploaded Yet.
                  </span>
                  <Link href='/createPin'>
      <a className='btn btn-info'>
      Upload
    </a></Link>
        </div>
    }   
    </div>
  )
}

export default UserCreatedPins;