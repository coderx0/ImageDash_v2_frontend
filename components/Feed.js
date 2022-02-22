import Masonry from "react-masonry-css";
import Pin from "./Pin";
import { useState } from "react";
import PinDetailsModal from "./PinDetailsModal";
import { motion,AnimatePresence } from "framer-motion";

const breakPointObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
}

const Feed = ({pins}) => {

    const [showPinModal, setShowPinModal] = useState(null);

    return (
        <>
        <Masonry className="px-2 md:px-4 pt-8 mx-auto flex animate-slide-fwd" breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin key={pin._id} pin={pin} setShowPinModal={setShowPinModal}/>)}
            </Masonry>
            <AnimatePresence exitBeforeEnter>
            {
                showPinModal &&
               
                        <motion.div
                            key={"pinModal"}
                        initial={{ opacity:0,x:200,position:"fixed",top:0,left:0,right:0,bottom:0 }}
                        animate={{ opacity:1,x: 0 }}
                        exit={{ opacity:0,y: 200,position:"fixed",top:0,left:0,right:0,bottom:0 }}
                        transition={{ type: 'linear' }}                    
                        >
                <PinDetailsModal pinDetail={showPinModal} setShowPinModal={setShowPinModal} />
                </motion.div>
            }
            </AnimatePresence>
        </>
  );
};

export default Feed;