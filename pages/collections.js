import React from 'react'
import { client } from "../lib/sanityClient";
import { collectionFeedQuery } from "../lib/Data";
import CollectionFeed from '../components/CollectionFeed';

const Collections = ({collectionsData}) => {
  return (
      <div>
          <CollectionFeed collections={collectionsData}/>
    </div>
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