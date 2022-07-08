import React, { useEffect, useState } from 'react'
import { cdnClient, client } from '../../lib/sanityClient';
import { categoryQuery } from '../../lib/Data';
import Feed from "../../components/Feed";

const Explore = ({ categoryData }) => {
 
  return (
    <>
     {categoryData.map(category => (
                  <div key={category._id}
                  className="mx-2 md:mx-6 mt-2">
                      <div className='flex gap-4 items-center'>
                      <h1 className='text-xl font-bold'>
                              {category.title} </h1>
                          {category.pinCount > 3 &&
                    <button className='btn btn-info px-2' onClick={()=>router.push(`/explore/${category._id}`)}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                 </svg>
                              </button>
               }
                        
                      </div>
                    <Feed pins={category.pins}/>
                  </div>
              ))}
      </>
        
  )
}

export default Explore;

export async function getStaticProps() {
        const categoryData = await cdnClient.fetch(categoryQuery(0,4));

    return {
        props: {
            categoryData
        },
        revalidate: 3600
    }
  }