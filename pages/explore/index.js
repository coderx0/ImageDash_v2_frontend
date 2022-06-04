import React, { useState } from 'react'
import { cdnClient, client } from '../../lib/sanityClient';
import { categoryQuery } from '../../lib/Data';
import Layout from "../../components/Layout";
import Feed from "../../components/Feed";
import InfiniteScroll from 'react-infinite-scroller';
import { useRouter } from 'next/router';

const Explore = ({ categoryData }) => {
    const [disable, setDisable] = useState(false);
    const [start, setStart] = useState(2);
  const [end, setEnd] = useState(3);
  const router = useRouter();

    const loadmore = async () => {
        console.log('triggered');
        const data = await client.fetch(categoryQuery(start, end));
        if (data.length < 1)
          setDisable(true);
        
          categoryData.push(...data);
        setStart(prev => prev + 1);
        setEnd(prev => prev + 1);
    }
    
  return (
             <InfiniteScroll
    pageStart={0}
    loadMore={loadmore}
    hasMore={!disable}
    loader={<div className="loader" key={0}>Loading ...</div>}
> 
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
      </InfiniteScroll>
         
        
  )
}

export default Explore;

export async function getStaticProps() {
        const categoryData = await cdnClient.fetch(categoryQuery(0,2));

    return {
        props: {
            categoryData
        },
        revalidate: 3600
    }
  }