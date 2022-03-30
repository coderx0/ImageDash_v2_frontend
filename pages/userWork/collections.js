import React from 'react'
import { useRouter } from 'next/router';
import CollectionFeed from '../../components/CollectionFeed';
import Loadingv1 from "../../lottie/Loadingv1";
import Boring from '../../lottie/Boring';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const fetcher = (url) => fetch(url).then(res => res.json());

const UserCollections = () => {
    const { data: session, status } = useSession();
        
    const router = useRouter();
    if (status === 'unauthenticated')
        router.replace("/");
    
    const { uId } = router.query;

    const { data, error } = useSWR(`/api/data/collections/${uId}`, fetcher);

    if (!data)
        return <Loadingv1 />
    
    if (!data.collections)
        return <Boring />
    
    return (
        <>
              <h1 className='text-center text-xl pt-2 font-bold'>My Collections</h1>
 <CollectionFeed viewPage='profile' collections={data.collections}/>
      </>
  )
}

export default UserCollections;