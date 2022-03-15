import React, { useState,useEffect } from 'react'
import { client } from '../../lib/sanityClient';
import { userCreatedPinsQuery } from '../../lib/Data';
import Feed from '../../components/Feed';
import { useRouter } from 'next/router';

const UserUploads = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [createdPins, setCreatedPins] = useState(null);
  useEffect(() => {
    const createdPinsQuery = userCreatedPinsQuery(userId);
    client.fetch(createdPinsQuery).then(data => setCreatedPins(data));
  },[]);
  return (
    <Feed pins={createdPins}/>
  )
}

export default UserUploads;