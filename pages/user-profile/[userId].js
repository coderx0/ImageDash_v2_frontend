import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import Pin from '../../components/Pin';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../../lib/Data';
import { client } from '../../lib/sanityClient';
import Masonry from "react-masonry-css";
import { useSession,signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const breakPointObj = {
    default: 3,
    1500: 3,
    1000: 2,
    700:1
}


const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = ({user}) => {
  // const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const [uploadCount, setUploadCount] = useState(0);
  
  const router = useRouter();

  const { userId } = router.query;

  const { data: session, status } = useSession();

  // useEffect(() => {
  //   const query = userQuery(userId);
  //   client.fetch(query).then((data) => {
  //     setUser(data[0]);
  //   });
  // }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      // const createdPinsQuery = userCreatedPinsQuery(userId);
      fetch(`/api/data/createdPins/${userId}`).then(response => response.json()).then(data => {
        setPins(data.pins);
        setUploadCount(data.pins.length);
      });

      // client.fetch(createdPinsQuery).then((data) => {
      //   setPins(data);
      //   setUploadCount(data.length);
      // });
    } else {
      // const savedPinsQuery = userSavedPinsQuery(userId);
      fetch(`/api/data/savedPins/${userId}`).then(response => response.json()).then(data => {
        setPins(data.pins);
      });

      // client.fetch(savedPinsQuery).then((data) => {
      //   setPins(data);
      // });
    }
  }, [text, userId]);

  if (!user) return <h1>Loading Profile</h1>;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-48 md:h-96 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <div className='w-32 h-32 -mt-12'>
            <img
              className="rounded-full w-full h-full shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            </div>
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className='flex justify-center gap-6 mt-6 md:text-lg'>
            <h1>{uploadCount} Images</h1>
            <h1>{user?.followers? user.followers.length:0} Followers</h1>
            <h1>{user?.following? user.following.length:0} Following</h1>
          </div>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === session?.user?.id && (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={()=>signOut({redirect:false})}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
        </div>

        <div className="px-2">
        <Masonry className="flex animate-slide-fwd" breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin key={pin._id} pin={pin}/>)}
            </Masonry>
        </div>

        {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Pins Found!
        </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const query = userQuery(userId);

  const data = await client.fetch(query);
  return {
    props: {
      user:data[0]
    }
  }
}