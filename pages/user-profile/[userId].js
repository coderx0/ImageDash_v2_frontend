import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import Pin from '../../components/Pin';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../../lib/Data';
import { client } from '../../lib/sanityClient';
import Masonry from "react-masonry-css";
import { useSession,signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from "../../components/Layout";
import Feed from "../../components/Feed";
const breakPointObj = {
  default: 4,
  1100: 3,
  900: 2,
  600: 1
}


const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = ({user}) => {
  const [pins, setPins] = useState();
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const [uploadCount, setUploadCount] = useState(0);
  const [followSuccess, setFollowSuccess] = useState(false);
  const router = useRouter();

  const { userId } = router.query;

  const { data: session, status } = useSession();

  useEffect(() => {
    if (userId) {
      if (text === 'Created') {
        fetch(`/api/data/createdPins/${userId}`).then(response => response.json()).then(data => {
          setPins(data.pins);
          setUploadCount(data.pins.length);
        });
      } else {
        fetch(`/api/data/savedPins/${userId}`).then(response => response.json()).then(data => {
          setPins(data.pins);
        });
      }
  }
  }, [text, userId]);

  let alreadyFollowed = user.followers?.filter((item) => item?.userId === session?.user?.id);
  alreadyFollowed = alreadyFollowed?.length > 0 ? alreadyFollowed : [];

 
  const followUser = (id,userId) => {
    if (alreadyFollowed?.length === 0 && user._id !== session?.user.id) {

      fetch(`/api/utils/follow/${id}/${userId}`).then(response => response.json()).then(data => {
        if (data.message === "success") {
          setFollowSuccess(true);
        }
      });
      
    }
  }

  if (!user) return <h1>Loading Profile</h1>;

  return (
    <Layout>
      <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
            <img
              className=" w-full h-48 md:h-64 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
          <div className='flex justify-around lg:justify-center lg:gap-32 p-4 '>
            <div className='flex gap-2 mr-2'>
            <img
              className="rounded-full w-12 h-12 md:w-16 md:h-16 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
              <div className='flex flex-col'>
              <h1 className="font-bold text-xl md:text-3xl">
            {user.userName}
              </h1>
            <p className='text-[12px] md:text-sm'>Just Wandering about here and there</p>
            </div>
            </div>
            <button className='btn btn-sm md:btn-md mt-2 text-[12px]' onClick={() => { followUser(user._id,session.user.id);}}>{alreadyFollowed.length>0?'Following':'Follow'}</button>
          </div>
          
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
            <Feed pins={pins}/>
        {/* <Masonry className="flex animate-slide-fwd" breakpointCols={breakPointObj}>
                {pins?.map(pin => <Pin key={pin._id} pin={pin}/>)}
            </Masonry> */}
        </div>

        {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Pins Found!
        </div>
        )}
      </div>

    </div>
    </Layout>
  );
};

export default UserProfile;

export async function getServerSideProps(context) {
  const { userId } = context?.params;
  const query = userQuery(userId);

  const data = await client.fetch(query);
  return {
    props: {
      user:data[0]
    }
  }
}