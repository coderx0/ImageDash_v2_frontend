import React from 'react'
import { client } from '../../lib/sanityClient';
import { userSavedPinsQuery } from '../../lib/Data';
import Feed from '../../components/Feed';

const UserSaves = ({ savedPins }) => {
  return (
    <Feed pins={savedPins}/>
  )
}

export default UserSaves;

export async function getServerSideProps(context) {
  const { userId } = context?.params;
  const savedPinsQuery = userSavedPinsQuery(userId);
  console.log(userId);
  const data = await client.fetch(savedPinsQuery);
  return {
    props: {
      savedPins: data,
    }
  }
}