import React, { useEffect, useRef, useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

const LoginModal = ({loginMessage,compType,setShowLoginModal,loginImage}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    const result = await signIn('credentials', {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });
 
    if (!result.error) {
      setIsLoading(false);
      compType !== 'page' && setShowLoginModal(false);
      compType === 'page' && router.push('/');
    }
     else
    {
      toast.error(result.error,{
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f25f4c',
          color: '#fff',
          fontWeight:'bold'
        },
        // Aria
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      setIsLoading(false);
    }

  } 
  const closeModal = (e) => {
    if (e.target.id === 'loginBackdrop')
    {
      setShowLoginModal(false);
      }
  }

  const mainComponent = <div className="flex relative w-[80%] h-[80%] mx-auto overflow-hidden rounded-lg bg-slate-800 lg:max-w-4xl">
          
    {compType !== 'page' && <button
      onClick={() => setShowLoginModal(false)}
      className="btn btn-sm  btn-circle absolute right-2 top-2">
      ✕</button> }

    <div className="hidden sm:block w-1/2">
      {loginImage && <img src ={loginImage} className='object-cover h-full'/>}
      {!loginImage && <img src ='/images/forest.jpg' className='object-cover h-full'/>}
    </div>


    <div className="w-full px-4 py-8 md:px-8 lg:w-1/2">
      <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
        ImageDash
      </h2>

      <p className="text-center py-2">
        {loginMessage}
      </p>

      <div
        onClick={() => signIn('google')}
        className="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-200 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
        <div className="px-4 py-2">
          <FcGoogle className='w-6 h-6' />
        </div>

        <span className="w-5/6 px-4 py-3 font-bold text-center">
          Sign in with Google</span>
      </div>

      <div className='divider text-stone-400 text-[12px]'>OR LOGIN WITH EMAIL</div>

      <form onSubmit={login}>
        <div className="mt-4">
          <label className="text-sm font-semibold"
            htmlFor="LoggingEmailAddress">
            Email Address</label>
          <input ref={emailRef} id="LoggingEmailAddress"
            className="input w-full bg-slate-900 mt-2" type="email" />
  
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <label className="test-sm font-semibold"
              htmlFor="loggingPassword">Password</label>
            <a href="#" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">Forget Password?</a>
          </div>

          <input ref={passwordRef} id="loggingPassword"
            className="input bg-slate-900 w-full mt-2" type="password" />
        </div>

 
        {!isLoading && <button className='mt-8 btn btn-info w-full'>
          Login
        </button>}
        {isLoading && <button className='mt-8 btn btn-info loading w-full'>
        
        </button>}
      </form>
    
      <h1 className='text-sm mt-4'>Don&lsquo;t have an account ?
        <span className='text-sky-500 font-semibold cursor-pointer'>
          <Link href='/authentication'> Register
          </Link>
        </span>
      </h1>
    
    </div>
  </div>;

  return (
    <>
      {compType !== 'page' && <div
        id='loginBackdrop'
        onClick={closeModal}
        className=' bg-[#11111194] fixed top-0 left-0 bottom-0 right-0 z-20 flex items-center'>
      
      <Toaster
  toastOptions={{
    className: 'mt-16',
  }}
/>
        {mainComponent}
      
      </div>}
      {
        compType === 'page' && <div className='flex items-center h-[90vh]'>
          <Toaster/>
          {mainComponent}
        </div>
        }
      
    </>
  )
}

export default LoginModal