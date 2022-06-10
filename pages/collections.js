import React from 'react'
import { client } from "../lib/sanityClient";
import { collectionFeedQuery } from "../lib/Data";
import CollectionFeed from '../components/CollectionFeed';

const Collections = ({collectionsData}) => {
  return (
      <>
      
      <h1 className='text-center text-xl pt-2 font-bold'>Collections</h1>
          <CollectionFeed collections={collectionsData}/>
    </>
  )
}

export default Collections;

export async function getStaticProps() {
    const collectionsData = await client.fetch(collectionFeedQuery);
    
    return {
        props: {
            collectionsData:collectionsData
        }
    }
}