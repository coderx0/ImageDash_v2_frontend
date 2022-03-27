import { collectionDetailQuery } from "../../lib/Data";
import { client } from "../../lib/sanityClient";
import Feed from "../../components/Feed";
import { getSession } from "next-auth/react";
import { useState } from "react";

const CollectionDetails = ({ collectionDetails, userID }) => {
  const [collection, setCollection] = useState(collectionDetails)
    if (collectionDetails.error)
        return <h1>You are not allowed.</h1>

    
    const pins = collectionDetails?.pins?.map(pin => pin.item);
    const changePrivacy = async(e) => {
        setCollection(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
        const response = await fetch(`/api/utils/collection/changePrivacy`, {
          method: "POST",
          body: JSON.stringify({
            collection,
            isPrivate:!collection.isPrivate
          }),
          headers: { "Content-Type": 'application/json' }
        });
      }
    console.log(collectionDetails);
    return (
        <div>
            <div className="mt-2">
                <h1 className="text-center text-4xl font-bold">{collectionDetails.title}</h1>
                <p className="text-center mt-2">{collectionDetails.about}</p>
            </div>
            <div className="flex items-center gap-4 px-4 text-xl">
                <div className="flex-1 flex">
                    <div>
                        <img
                            className="h-10 w-10 object-cover"
                            src={collectionDetails.postedBy?.image} alt={collectionDetails.postedBy?.username} />
                    </div>
                   <h1 className=" pt-1 pl-1"> {collectionDetails.postedBy?.userName}</h1>
                </div>
              {collection.postedBy._id === userID && <div className="form-control">
  <span htmlFor='privacy' className="label">
          <label className=" mx-2">{collection.isPrivate ? 'Private' : 'Public'}</label>
          <input id='privacy' type="checkbox" onChange={changePrivacy} className="checkbox" defaultChecked={collectionDetails.isPrivate}/>
  </span>
</div>} 
                <h2>{collectionDetails.pins?.length} pins</h2>
            </div>
            <Feed pins={pins}/>
        </div>
    );
}


export default CollectionDetails;

export async function getServerSideProps(context,) {
    const session = await getSession({ req: context.req });
    const requesterId = session? session.user.id:null;
    const { collectionId } = context.params;
    const query = collectionDetailQuery(collectionId,requesterId);
   
    const data = await client.fetch(`${query}`);
    let collectionData = data[0];
    if (!collectionData) collectionData = {error:'Not Allowed'};

    console.log({ collectionData });
    return {
      props: {
            collectionDetails: collectionData,
            userID:requesterId
      }
    }
}