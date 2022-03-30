import React, { useEffect, useState } from 'react';
import Feed from '../../../components/Feed';
import { useRouter } from 'next/router';
import Loadingv1 from "../../../lottie/Loadingv1";
import Boring from '../../../lottie/Boring';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const fetcher = (url) => fetch(url).then(res =>res.json());

const UserLikes = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'unauthenticated')
    router.replace('/');
  
  const { uId } = router.query;

  const { data, error } = useSWR(`/api/data/likedPins/${uId}`,fetcher);

  if(error) return <h1>Failed to load</h1>
  if (!data) return <Loadingv1 />
  if (!data.pins) return <div>
    <Boring/>
  </div>
  

    return (
      <>
        <h1 className='text-center text-xl pt-2 font-bold'>Liked Images</h1>

         <Feed pins={data?.pins}/>
     </>
    )
}

export default UserLikes;