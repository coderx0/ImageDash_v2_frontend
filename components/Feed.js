import Masonry from "react-masonry-css";
import Pin from "./Pin";
import { useState } from "react";
import PinDetailsModal from "./PinDetailsModal";
import { useSession } from "next-auth/react";

const breakPointObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
}

const Feed = ({pins}) => {

    const [showPinModal, setShowPinModal] = useState(null);
    const { data: session, status } = useSession();
    
    return (
        <>
            
            <Masonry
                className="px-2 md:px-4 pt-8 flex gap-2"
                columnClassName="bg-clip-padding"
                breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin
                    key={pin._key ? pin._key : pin._id}
                    userId={session?.user.id}
                    pin={pin._key ? pin.item : pin}
                    setShowPinModal={setShowPinModal} />)}
            </Masonry>
            {
                showPinModal &&
               
                        <div
                            key={"pinModal"}                  
                        >
                <PinDetailsModal session={session}  pinDetail={showPinModal} setShowPinModal={setShowPinModal} />
                </div>
            }
            
        </>
  );
};

export default Feed;