import {React, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [authAlert, setAuthAlert] = useState(null);
  const searchInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
      if(session?.user?.id)
        fetch(`/api/data/user/${session.user.id}`)
          .then(response => response.json())
          .then(data => {
            if (!data.sanityData)
            {
              signOut({redirect:false});
              setAuthAlert("you dont have any account. Please signup");
            }
            setUserData(data.sanityData)
          });  
  }, [session?.user?.id]);

  useEffect(() => {
    setTimeout(() => setAuthAlert(null), 6000);
  }, [authAlert]);

  const submitSearch = (event) => {
    event.preventDefault();
    const searchTerm = searchInputRef.current.value;
    router.push(`/search/${searchTerm}`);
  }

    return (
      <>
         {authAlert && <div className="shadow-lg flex justify-around p-6 rounded-box absolute m-8 text-[20px] right-0 w-72 z-30 bg-red-500">
    <span>{authAlert}</span>
</div>}
        <div className="bg-stone-900 border-b-2 border-sky-500 font-bold h-16 relative sticky top-0 z-20 text-3xl flex justify-between items-center gap-2">
       
        <span className="px-1 md:px-2 text-xl md:text-3xl">
            <Link href="/">IDash</Link>
          </span>
          <form className="flex flex-1 relative" onSubmit={submitSearch}>
            <input ref={searchInputRef}
              type="text"
              placeholder="search for images"
              className="rounded-lg h-10 outline-none bg-slate-700 w-full pb-2 pl-4 pt-2 text-[18px]" />
            <button className="h-full bg-slate-700 absolute right-0 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
            </button>
          </form>
          <button className="btn px-1">
          <Link href="/explore">Explore</Link>
          </button>
           { userData && <div className="mx-1 relative dropdown dropdown-hover">
              <div className="" tabIndex="0">
              <img src={userData.image} className="inline-block h-9 w-9 md:h-11 md:w-11 object-cover rounded-full border-2" alt="up" />
              </div>
              <ul tabIndex="0" className="flex flex-col items-end p-4 text-[15px] dropdown-content bg-stone-800 rounded-box w-48 absolute top-15 right-0">
              <li className="flex w-full p-1 justify-around border-b-2"><img src={userData.image} alt={userData.userName} className="h-12 w-12 border-2 object-cover rounded-full inline-block"/>
                <h1 className="text-lg p-2">{userData.userName}</h1></li>
              <li className="hover:bg-stone-700 w-full text-right mt-2 pr-4 rounded-box">
              <Link href={`/user-profile/${session?.user?.id}`}>Profile</Link>      
              </li> 
              <li className="hover:bg-red-500 w-full text-right mt-2 pr-4 rounded-box cursor-pointer" onClick={() => { setUserData(null);return signOut({redirect:false})}}>
                Logout
              </li> 
            </ul>
          </div>}
          {
            !userData && <button className="btn">
              <Link href="/authentication">Login</Link></button>
          }
        </div>
        <div className="fixed rounded-full hover:animate-pulse bg-blue-100 text-gray-900 bottom-0 right-0 w-12 md:w-16 h-12 md:h-16 z-10 flex justify-center items-center m-8">
          {session && <Link href="/createPin">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-12 w-8 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
</svg>
          </Link>}
          {
            !session && <Link href="/authentication">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-12 w-8 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
</svg>
        </Link>
          }
        </div>
        </>
    );
};

export default Navbar;