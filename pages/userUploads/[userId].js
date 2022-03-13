import React from 'react'
import { client } from '../../lib/sanityClient';
import { userCreatedPinsQuery } from '../../lib/Data';
import Feed from '../../components/Feed';

const UserUploads = ({ creadtedPins }) => {
  return (
    <Feed pins={creadtedPins}/>
  )
}

export default UserUploads;

export async function getServerSideProps(context) {
  const { userId } = context?.params;
  const createdPinsQuery = userCreatedPinsQuery(userId);
  console.log(userId);
  const data = await client.fetch(createdPinsQuery);
  return {
    props: {
      creadtedPins: data,
    }
  }
}