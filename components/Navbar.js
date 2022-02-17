import {React, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [authAlert, setAuthAlert] = useState(null);
  const searchInputRef = useRef();

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
    console.log(searchTerm);
    searchInputRef.current.value = "";
      }

    return (
      <>
         {authAlert && <div className="shadow-lg flex justify-around p-6 rounded-box absolute m-8 text-[20px] right-0 w-72 z-30 bg-red-500">
    <span>{authAlert}</span>
</div>}
        <div className="bg-stone-900 font-bold h-16 relative sticky top-0 z-20 text-3xl flex justify-between">
       
        <span className="pt-3 pb-2 pl-2">
            <Link href="/">IDash</Link>
          </span>
          <form className="flex my-3 ml-6 relative" onSubmit={submitSearch}>
            <input ref={searchInputRef} type="text" placeholder="search" className="rounded-box h-full outline-none focus:border-2 focus:border-sky-500 bg-slate-700 w-36 md:w-72 lg:w-96 pb-2 pl-4 pt-2 text-[18px]" />
            <button className="h-full p-2 rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-2 right-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
            </button>
          </form>
           { userData && <div className="p-2 mx-2 relative dropdown dropdown-hover">
              <div className="m-1" tabIndex="0">
              <img src={userData.image} height="50px" width="50px" className="inline-block h-11 w-11 object-cover rounded-full border-2" alt="up" />
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
            !userData && <span className="btn  m-2"><Link href="/authentication">Login</Link></span>
          }
        </div>
        <div className="fixed rounded-full hover:animate-pulse bg-blue-100 text-gray-900 bottom-0 right-0 w-12 md:w-16 h-12 md:h-16 z-10 flex justify-center items-center m-8">
          <Link href="/createPin">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 md:h-12 w-8 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
</svg>
        </Link>
        </div>
        </>
    );
};

export default Navbar;