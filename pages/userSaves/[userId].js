import React, { useEffect, useState } from 'react'
import { client } from '../../lib/sanityClient';
import { userSavedPinsQuery } from '../../lib/Data';
import Feed from '../../components/Feed';
import { useRouter } from 'next/router';

const UserSaves = () => {
  const [savedPins, setSavedPins] = useState(null);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const savedPinsQuery = userSavedPinsQuery(userId);
    client.fetch(savedPinsQuery).then(data => setSavedPins(data));
  }, []);

  return (
    <Feed pins={savedPins}/>
  )
}

export default UserSaves;