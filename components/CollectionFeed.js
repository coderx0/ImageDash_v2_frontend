import React from 'react'
import Masonry from "react-masonry-css";
import Link from 'next/link';

const breakPointObj = {
    default: 3,
    1200: 3,
    900: 2,
    600: 1
}

const CollectionFeed = ({ collections }) => {
    const showableCollections = collections.filter(collection =>
        collection?.pins.length > 1);
    
  return (
           <Masonry
                className="px-2 md:px-4 pt-8 flex gap-4"
                columnClassName="bg-clip-padding"
                breakpointCols={breakPointObj}>
                  {showableCollections?.map(collection =>
              <div
                  className='bg-stone-900 my-4'
                          key={collection._id}>
                          <Link href={`collectionDetails/${collection._id}`}>
                              <a>
                              <div className='overflow-hidden'>
                              <img
                                  src={collection.pins[0].item.image.asset.url}
                                  alt={collection.pins[0].item.title}
                                className='hover:scale-125 transition duration-1000'
                              />
                          </div>
                  <div className='flex'>
                      {collection.pins.map(pin =>
                          <div className='border-2' key={pin._key}>
                          <img
                            src={pin.item.image.asset.url}
                            alt={pin.item.title}
                            className='object-cover h-full'
                              />
                             </div>
                      )}
                          </div>
                          <div className='font-bold flex p-2'>
                              <h1 className='flex-1'>{collection.title}</h1>
                            <span className='px-2'>{collection.pins.length}</span>
                          </div>
                              </a>
                    </Link>

                      </div>)}
              
            </Masonry>
  )
}

export default CollectionFeed