import Masonry from "react-masonry-css";
import { collectionDetailQuery } from "../../lib/Data";
import { client } from "../../lib/sanityClient";
import Feed from "../../components/Feed";


const CollectionDetails = ({collectionDetails}) => {
    const pins = collectionDetails.pins.map(pin => pin.item);

    return (
        <div>
            <div className="mt-2">
                <h1 className="text-center text-4xl font-bold">{collectionDetails.title}</h1>
                <p className="text-center mt-2">{collectionDetails.about}</p>
            </div>
            <div className="flex px-4 text-xl">
                <div className="flex-1 flex">
                    <div>
                        <img
                            className="h-10 w-10 object-cover"
                            src={collectionDetails.postedBy?.image} alt={collectionDetails.postedBy?.username} />
                    </div>
                   <h1 className=" pt-1 pl-1"> {collectionDetails.postedBy?.userName}</h1>
                </div>
                <h2>{collectionDetails.pins.length} pins</h2>
            </div>
            <Feed pins={pins}/>
        </div>
    );
}


export default CollectionDetails;

export async function getServerSideProps(context) {
    const { collectionId } = context.params;
    const query = collectionDetailQuery(collectionId);
   
    const data = await client.fetch(`${query}`);
  
    return {
      props: {
            collectionDetails: data[0],
      }
    }
}