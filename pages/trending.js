import React,{ useState } from 'react'
import { client } from '../lib/sanityClient'
import Feed from "../components/Feed";
import Image from 'next/image';
import Link from 'next/link';

const Trending = ({ topPins,topUsers }) => {

  return (
      <>
          <h1 className='text-center mt-4 text-xl font-bold'>Top Pins</h1>
      <div className='flex justify-center'>
      <Feed pins={topPins} />
      </div>
      <h1 className='text-center text-xl font-bold my-4'>Top Uploaders</h1>
    <div className='flex justify-center'>
    <div className='flex flex-wrap justify-center gap-4 p-4'>
        {
          topUsers.map(user =>
            <div key={user._id}
              className="card border-2 w-72 bg-base-100 shadow-xl">
              <figure className='relative h-48 w-full'>
                <Image src={user.image}
                  alt={user.userName} 
                  layout='fill'
                  objectFit='cover'
                  
                  />
              </figure>
              <div className="card-body p-4">
                <div className='flex items-center justify-between'>
                  <h2 className=" text-lg">{user.userName}</h2>
                  <Link href={`/user-profile/${user._id}`}>
                  <a className='btn btn-outline btn-success btn-sm  text-sm'>
                    View Profile
                  </a>
                  </Link>  
                </div>
                <p>{user.about ? user.about : 'Just wandering here and there.'}</p>
                <div className='flex justify-between py-2'>
                  <span>{user.uploadCount} Pins</span>
                  <span>{user.followerCount} Followers</span>
                </div>
                <div className='flex gap-2 mt-2'>
                  {user.pins.map(pin =>
                    <div key={pin._id}>
                      <Image
                        src={pin.image.asset.url}
                        height={100}
                        width={100}
                        alt={pin.title}
                        className=' object-cover'
                      />
                  </div>)}
    </div>
  </div>
</div>)
        }
      </div>
    </div>
         </>
  )
}

export default Trending

export async function getStaticProps() {
    const trendingPinQuery = `*[_type == "pin"] | order(totalLikes desc) {
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
          }[0...4]`;
          const trendingUserQuery = `*[_type == "user" && uploads!=null] | order(count(uploads) desc) {
            image,
            _id,
            userName,
            about,
            'uploadCount':count(uploads),
            'followerCount':count(followers),
           'pins':uploads[0...3].item->{
             title,
             _id,
             image{
               asset->{
                 url
               }
             }
           }
          }[0...3]`;
  const userData = await client.fetch(trendingUserQuery);
  const pinData = await client.fetch(trendingPinQuery);
  
  
    return {
        props: {
        topPins: pinData,
          topUsers:userData
        }
    }
}