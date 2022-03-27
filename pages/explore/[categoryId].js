import React from 'react'
import { cdnClient } from '../../lib/sanityClient';
import { categoryDetailQuery } from '../../lib/Data';
import Feed from '../../components/Feed';

 const CategotyDetails = ({categoryData}) => {
   console.log(categoryData);

   return (
     <>
       <div
         className='h-44 relative'
         style={{
           backgroundImage: `url(${categoryData.bannerImage.asset.url})`,
          }}>
         <div className='bg-[#11111195] p-12'>
         <h1 className='text-sky-500 font-bold text-6xl '>{categoryData.title}</h1>
         <p className=' text-lg'>{categoryData.about}</p>
      
       </div>  
       </div>
         <div>
       <Feed pins={categoryData.pins}/>
    </div>
   </>
  )
}

export default CategotyDetails;

export async function getServerSideProps(context) {
  const {categoryId} = context.params;
  const query = categoryDetailQuery(categoryId)
  const categoryData = await cdnClient.fetch(query);

  return {
    props: {
      categoryData:categoryData[0]
      },
  }
}