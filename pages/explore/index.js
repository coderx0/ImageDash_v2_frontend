import React from 'react'
import { cdnClient } from '../../lib/sanityClient';
import { collectionFeedQuery,categoryQuery } from '../../lib/Data';
import CollectionFeed from '../../components/CollectionFeed';
import Layout from "../../components/Layout";
import Feed from "../../components/Feed";
import Link from 'next/link';

const breakPointObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
}

const Explore = ({ collections, categoryData }) => {

  return (
      <Layout>
          <div>
              {categoryData.map(category => (
                  <div key={category._id}
                  className="mx-2 md:mx-6 mt-2">
                      <div className='flex gap-4 items-center'>
                      <h1 className='text-xl font-bold'>
                              {category.title} </h1>
                          {category.pinCount > 3 &&
                            <button className='btn btn-info px-2'>
                          <Link
                              href={`/explore/${category._id}`}
                              ><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
</svg></Link>
                          </button>}
                        
                      </div>
                    <Feed pins={category.pins}/>
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