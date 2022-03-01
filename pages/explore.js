import React from 'react'
import { cdnClient } from '../lib/sanityClient';
import { collectionFeedQuery,categoryQuery } from '../lib/Data';
import CollectionFeed from '../components/CollectionFeed';
import Layout from "../components/Layout";
import Masonry from "react-masonry-css";

const breakPointObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
}

const Explore = ({ collections, categoryData }) => {
    console.log(categoryData);

  return (
      <Layout>
          <div>
              {categoryData.map(category => (
                  <div key={category._id}
                  className="mx-2 md:mx-6 mt-2">
                      <h1 className='text-xl font-bold'>{category.title}</h1>
                      <Masonry
                className="px-2 md:px-4 pt-8 flex gap-2"
                          breakpointCols={breakPointObj}>
                          {category.pins.map(pin => (
                              <div key={pin._key}>
                                  <img
                                      src={pin.item.image.asset.url}
                                      alt={pin.item.title}/>
                              </div>
                          ))}
            </Masonry>
                  </div>
              ))}
          </div>
          <div className='mx-2 md:mx-6 mt-2'>
          <h1 className="pt-2 font-bold text-2xl">
              Popular Collections
          </h1>
        <CollectionFeed collections={collections}/>
    </div>
      </Layout>
  )
}

export default Explore;

export async function getStaticProps() {
    
    const collectionData = await cdnClient.fetch(collectionFeedQuery);
    const categoryData = await cdnClient.fetch(categoryQuery);

    return {
        props: {
            collections: collectionData,
            categoryData
        },
        revalidate: 3600
    }
  }