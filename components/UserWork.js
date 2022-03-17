import React, { useEffect, useState } from 'react'
import { client } from '../lib/sanityClient';
import { userLikedPinsQuery,userCreatedPinsQuery,userSavedPinsQuery } from '../lib/Data';
import Feed from './Feed';
import Lottie from "lottie-react";
import loading1 from "../public/loading1.json";
import boring from "../public/boring.json";
import Link from 'next/link';

const UserWorks = ({userId,work}) => {
  const [pins, setPins] = useState(null);

  useEffect(() => {
    let query;
    switch (work) {
      case 'uploads': query = userCreatedPinsQuery(userId);
        client.fetch(query).then(data => setPins(data[0].pins))
        break;
      case 'likes': query = userLikedPinsQuery(userId);
      client.fetch(query).then(data => setPins(data))
   }
      
    ;
  }, [])
 
  if (!pins)
    return <Lottie
    className="h-[70vh]"
      animationData={loading1}
    loop />
  if (pins.length === 0)
    return <div>
      {work === 'uploads' && <h1 className='flex flex-col items-center gap-4 mt-4 text-lg'>You have not uploaded any image yet.
      <Link href='/createPin'><span className='btn w-48 btn-success'>Upload</span></Link>
      </h1>}
      {work === 'saves' && <h1 className='text-center mt-4 text-lg'>You have not saved any images yet.</h1>}
      {work === 'likes' && <h1 className='text-center mt-4 text-lg'>You have not liked any image yet.</h1>}
      <Lottie
    className="h-[70vh]"
      animationData={boring}
    loop />
    </div>
  console.log(pins);
  return (
 <Feed pins={pins}/>
  )
}

export default UserWorks;