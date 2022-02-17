import Masonry from "react-masonry-css";
import Pin from "./Pin";

const breakPointObj = {
    default: 3,
    1000: 2,
    700: 1,
    500: 1
}

const Feed = ({pins}) => {

    return (
        // <div className="px-2 md:px-4 pt-8 mx-auto">
        <Masonry className="px-2 md:px-4 pt-8 mx-auto flex animate-slide-fwd" breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin key={pin._id} pin={pin}/>)}
            </Masonry>
        // </div>
  );
};

export default Feed;