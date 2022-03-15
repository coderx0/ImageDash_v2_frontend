import Masonry from "react-masonry-css";
import Pin from "./Pin";
import { useState } from "react";
import PinDetailsModal from "./PinDetailsModal";
import { useSession } from "next-auth/react";
import LoginModal from "./LoginModal";

const breakPointObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
}

const Feed = ({pins}) => {

    const [showPinModal, setShowPinModal] = useState(null);
    const { data: session, status } = useSession();
    const [loginMessage, setLoginMessage] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginImage, setLoginImage] = useState(null);

    return (
        <>
            {showLoginModal && <LoginModal loginImage={loginImage} setShowLoginModal={setShowLoginModal}
                loginMessage={loginMessage}
            />}
            <Masonry
                className="px-2 md:px-4 pt-8 flex gap-2"
                columnClassName="bg-clip-padding"
                breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin
                    key={pin._key ? pin._key : pin._id}
                    setLoginMessage={setLoginMessage}
                    setShowLoginModal={setShowLoginModal}
                    userId={session?.user.id}
                    pin={pin._key ? pin.item : pin}
                    setLoginImage={setLoginImage}
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