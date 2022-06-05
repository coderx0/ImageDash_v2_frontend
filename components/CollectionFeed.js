import React from 'react'
import Masonry from "react-masonry-css";
import Link from 'next/link';
import Image from 'next/image';

const breakPointObj = {
    default: 3,
    1200: 3,
    900: 2,
    600: 1
}

const CollectionFeed = ({ viewPage, collections }) => {
  let showableCollections = collections;
  return (
           <Masonry
                className="px-2 md:px-4 pt-8 flex gap-4"
                columnClassName="bg-clip-padding"
                breakpointCols={breakPointObj}>
                  {showableCollections?.map(collection =>
              <div
                  className='bg-stone-900 my-4'
                          key={collection._id}>
                          <Link href={`/collectionDetails/${collection._id}`}>
                              <a>
                        {collection.pins && <div className='overflow-hidden'>
                            <img
                                  src={collection?.pins[0]?.item.image?.asset.url}
                              alt={collection.pins[0]?.item.title}
                             
                                className='hover:scale-125 transition duration-1000 object-cover'
                              />
                             
                          </div>}
                          {
                            collection.pins  && <div className='flex'>
                      {collection.pins.map((pin,idx) =>
                          (idx<4 && <div className='border-2 relative h-20 w-24' key={pin._key}>
                          <Image
                            src={pin.item.image.asset.url}
                          alt={pin.item.title}
                          layout='fill'
                          objectFit='cover'
                              />
                             </div>)
                      )}
                          </div>
                  }
                          <div className='font-bold text-lg flex p-2'>
                              <h1 className='flex-1'>{collection.title}</h1>
                            <h1 className='px-2 flex items-center gap-2'>
                            <span> {collection?.pins?.length}</span>
                              <span><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
</svg></span>
                            </h1>
                          </div>
                              </a>
                    </Link>

                      </div>)}
              
            </Masonry>
  )
}

export default CollectionFeed