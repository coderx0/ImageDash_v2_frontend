import { cdnClient } from "../lib/sanityClient";
import { feedQuery } from "../lib/Data";
import Feed from "../components/Feed";
import { useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';


export default function Home({ pins }) { 

  const [start, setStart] = useState(8);
  const [end, setEnd] = useState(16);
  const [disable, setDisable] = useState(false);
  
  const loadmore = async () => {
    const data = await cdnClient.fetch(feedQuery(start, end));
    if (data.length < 8)
      setDisable(true);
    
    pins.push(...data);
    setStart(prev => prev + 8);
    setEnd(prev => prev + 8);
}

  return (
  <>
        <div className="bg-fixed bg-center bg-no-repeat bg-cover h-96 flex justify-center items-center"
      style={{backgroundImage:`url("https://i.pinimg.com/originals/ed/e1/d6/ede1d669ed75699be57f39d14bb4306b.jpg")`}}>
        
          <div className="p-8 font-bold text-2xl md:text-4xl">
            Share Images and connect with people
          </div>
      </div>
      
      
      <InfiniteScroll
    pageStart={0}
    loadMore={loadmore}
    hasMore={!disable}
    loader={<div className="loader" key={0}>Loading ...</div>}
>
       <Feed pins={pins} />
        
      </InfiniteScroll>

    </>
  )
}

export async function getStaticProps() {
    
  const data = await cdnClient.fetch(feedQuery(0,8));

  return {
      props: {
      pins: data,
      },
      revalidate: 3600
  }
}