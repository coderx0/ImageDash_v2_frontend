import {React, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";
import Sidebar from "./Sidebar";
import { AiOutlineSearch } from "react-icons/ai"
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const searchInputRef = useRef();
  const [sideBar, setSideBar] = useState(false);
  const router = useRouter();

  useEffect(() => {
      if(session?.user?.id)
      {
        if (localStorage.getItem('authType') === 'signup') {
          if (session?.user) {
            
            fetch('/api/auth/googleSignup', {
                method: 'POST',
                body: JSON.stringify({
                    email: session.user.email,
                    userName: session.user.name,
                    id:session.user.id
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => response.json())
                .then(data => {
                    if (data.errorMessage) {
                        toast.error(data.errorMessage,{
                            duration: 4000,
                            position: 'top-right',
                            // Styling
                            style: {
                                background: '#f25f4c',
                                color: '#fff',
                                fontWeight:'bold'
                              },
                            className: 'bg-red-200',
                         
                            // Aria
                            ariaProps: {
                              role: 'status',
                              'aria-live': 'polite',
                            },
                          });  
                          
              signOut({redirect:false});  
                    return;
                    }
                    if (data.successMessage.length>0)
                    {
                      setUserData(data.userData);
                        toast.success(data.successMessage,{
                            duration: 4000,
                            position: 'top-right',
                            // Styling
                            style: {
                                background: '#2ecc71',
                                color: '#fff',
                                fontWeight:'bold'
                                },
                            className: 'bg-red-200',
                            
                            // Aria
                            ariaProps: {
                                role: 'status',
                                'aria-live': 'polite',
                            },
                            });
                    }
                });
                
          }
          localStorage.clear();
        }
        else
        fetch(`/api/data/user/${session.user.id}`)
          .then(response => response.json())
          .then(data => {
            if (!data.sanityData)
            {
              signOut({redirect:false,});
              toast.error("You don't have any account please signup.",{
                            duration: 4000,
                            position: 'top-right',
                            // Styling
                            style: {
                                background: '#f25f4c',
                                color: '#fff',
                                fontWeight:'bold'
                              },
                            className: 'bg-red-200',
                         
                            // Aria
                            ariaProps: {
                              role: 'status',
                              'aria-live': 'polite',
                            },
                          }); 
              router.push('/authentication');
            }
            setUserData(data.sanityData)
          });
      } 
  }, [session]);


  const submitSearch = (event) => {
    event.preventDefault();
    const searchTerm = searchInputRef.current.value;
    router.push(`/search/${searchTerm}`);
  }

  const openSideBar = () => {
    setSideBar(prev=>!prev);
}
    return (
      <>
      <Toaster/>
         {/* {authAlert && <div className="shadow-lg flex justify-around p-6 rounded-box absolute m-8 text-[20px] right-0 w-72 z-30 bg-red-500">
    <span>{authAlert}</span>
        </div>} */}
        <Sidebar userId={session?.user.id} sideBar={sideBar} setSideBar={setSideBar}/>
        <div className="bg-stone-900 border-b-2 border-sky-500 font-bold h-16 relative sticky top-0 z-10 text-3xl flex items-center gap-2">
          <button className="btn btn-square relative" onClick={openSideBar}>
            <AiOutlineMenu className="h-4 w-4" />
          </button>
         
        <span className="px-1 md:px-2 text-xl md:text-3xl">
            <Link href="/">IDash</Link>
          </span>
          <form className="flex flex-1 relative md:mx-12 lg:mx-[20vw]" onSubmit={submitSearch}>
            <input ref={searchInputRef}
              type="text"
              placeholder="search for images"
              className="input input-bordered w-full" />
            <button className="bg-base-100 my-1 mr-1 absolute right-0 p-2 rounded-lg">
          <AiOutlineSearch className="h-6 w-6"/>
            </button>
          </form>

          {userData &&
            <div className="mx-1 relative dropdown">
              <div className="mt-1" tabIndex="0">
                <Image src={userData.image}
                  height={50}
                  width={50}
                  className="object-cover rounded-full"
                  alt={userData.username} />
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
              <Link href="/login">Login</Link></button>
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