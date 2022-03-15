import React, { useEffect, useState } from 'react'
import { client } from '../../lib/sanityClient';
import { userLikedPinsQuery } from '../../lib/Data';
import Feed from '../../components/Feed';
import { useRouter } from 'next/router';

const UserLikes = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [likedPins, setLikedPins] = useState(null);

  useEffect(() => {
    const likedPinsQuery = userLikedPinsQuery(userId);
    client.fetch(likedPinsQuery).then(data => setLikedPins(data));
  }, [])
  
  return (
    <Feed pins={likedPins}/>
  )
}

export default UserLikes;