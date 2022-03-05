import React from 'react'
import { cdnClient } from '../../lib/sanityClient';
import { categoryDetailQuery } from '../../lib/Data';
import Feed from '../../components/Feed';

 const CategotyDetails = ({categoryData}) => {
   
   return (
     <div>
       <h1>{categoryData.title}</h1>
       <Feed pins={categoryData.pins}/>
    </div>
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