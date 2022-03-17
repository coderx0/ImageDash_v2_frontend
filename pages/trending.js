import React,{ useState } from 'react'
import { client } from '../lib/sanityClient'
import Feed from "../components/Feed";

const Trending = ({ topPins }) => {

  return (
      <>
          <h1 className='text-center mt-4'>Top Pins</h1>
      <Feed pins={topPins}/>
         </>
  )
}

export default Trending

export async function getStaticProps() {
    const trendingQuery = `*[_type == "pin"] | order(totalLikes desc) {
        image{
          asset->{
            url
          }
        },
            _id,
            title,
            destination,
            postedBy->{
              _id,
              userName,
              image
            },
            likes[]{
              _key,
              likedBy->{
                _id,
                userName,
                image
              }
            },
            save[]{
              _key,
              postedBy->{
                _id,
              },
            },
          }[0...3]`;
    
    const data = await client.fetch(trendingQuery);

    return {
        props: {
            topPins: data
        }
    }
}