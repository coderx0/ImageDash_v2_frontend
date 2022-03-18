import React, { useEffect, useState } from 'react'
import { client } from '../lib/sanityClient';
import { userLikedPinsQuery,userCreatedPinsQuery,userCollectionQuery } from '../lib/Data';
import Feed from './Feed';
import Lottie from "lottie-react";
import loading1 from "../public/loading1.json";
import Boring from '../lottie/boring';
import Link from 'next/link';


const UserWorks = ({userId,work}) => {
  const [pins, setPins] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let query;
    switch (work) {
      case 'uploads': query = userCreatedPinsQuery(userId);
        client.fetch(query).then(data => {
          setPins(data[0].pins);
          setIsLoading(false);
        });
        break;
      case 'likes': query = userLikedPinsQuery(userId);
        client.fetch(query).then(data => {
          setPins(data);
          setIsLoading(false);
        });
   }
      
    ;
  }, [])


  if (isLoading)
    return <Lottie
    className="h-[70vh]"
      animationData={loading1}
      loop />
  if (!pins && !isLoading) {
    return <h1 className='flex flex-col items-center gap-4 mt-4 text-lg'>You have not uploaded any image yet.
    <Link href='/createPin'><span className='btn w-48 btn-success'>Upload</span></Link>
    </h1>
  }
  if (pins?.length === 0)
    return <div>
       <h1 className='text-center mt-4 text-lg'>
        You have not liked any image yet
      </h1>
      <Boring/>
    </div>
  
  return (
 <Feed pins={pins}/>
  )
}

export default UserWorks;