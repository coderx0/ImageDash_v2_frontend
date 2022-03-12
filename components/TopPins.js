import { AnimatePresence, motion } from 'framer-motion'
import React,{useEffect, useState} from 'react'
import Image from 'next/image';

const TopPins = ({ topPins }) => {
    // const [showPin, setShowPin] = useState(topPins[0]);
    const [pinIndex, setPinIndex] = useState(0);

    useEffect(() => {
        const changeTimer = setTimeout(() => {
            setPinIndex(prev=>((prev+1)%3))
         }, 5000);
        return () => {clearTimeout(changeTimer)};
    },[pinIndex]);

    
  return (
      <div
          className='h-98 flex justify-center overflow-x-hidden'
      >
          <button className='bg-slate-900 w-6 md:w-12 md:p-2 md:animate-pulse'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
</svg>
          </button>
          <div className=''>
          <AnimatePresence exitBeforeEnter>
          {topPins.map((pin,idx) =>
              (idx===pinIndex && <motion.div
                  key={pin._id}
              initial={{ x: 100,opacity:0 }}
              animate={{ x: 0,opacity:1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{type:'linear'}}
              className='flex flex-col h-full w-full relative items-center'>
          <div className='h-full'>
          <Image
              className='object-cover'
                  src={pin.image.asset.url}
                  alt={pin.title} 
                  height={400}
                  width={800}
              />
              </div>
             <h1
                  className='absolute bottom-0 text-center w-full backdrop-blur-sm text-xl font-bold py-2'>
                  {pin.title}
              </h1>
              </motion.div>))
          }
          </AnimatePresence>
          </div>
          <button className='bg-slate-900 w-6 md:w-12 md:p-2 md:animate-pulse'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
</svg>
         </button>
    </div>
  )
}

export default TopPins