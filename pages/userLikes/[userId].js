import React from 'react'
import { client } from '../../lib/sanityClient';
import { userLikedPinsQuery } from '../../lib/Data';
import Feed from '../../components/Feed';

const UserLikes = ({ likedPins }) => {
  return (
    <Feed pins={likedPins}/>
  )
}

export default UserLikes;

export async function getServerSideProps(context) {
  const { userId } = context?.params;
  const likedPinsQuery = userLikedPinsQuery(userId);
  console.log(userId);
  const data = await client.fetch(likedPinsQuery);
  return {
    props: {
      likedPins: data,
    }
  }
}