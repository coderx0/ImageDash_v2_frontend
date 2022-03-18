import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import UserWorks from '../../components/UserWork';
import { client } from '../../lib/sanityClient';
import CollectionFeed from '../../components/CollectionFeed';

const UserCollections = () => {
    const router = useRouter();
    const { uId } = router.query;
    const [userCollections, setUserCollections] = useState(null);
    const query = `*[_type == "pinCollection" && userId == '${uId}']{
        _id,
        title,
        pins[]{
            _key,
            item->{
                _id,
                image{
                asset->{
                    url
                }
                }
            }
            },
      }`;

    useEffect(() => {
        client.fetch(query)
            .then(data => setUserCollections(data));
    }, []);
    console.log(userCollections);
    if (!userCollections)
        return <h1>Loading</h1>
  return (
 <CollectionFeed collections={userCollections}/>
  )
}

export default UserCollections;