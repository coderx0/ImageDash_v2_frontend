import { useEffect, useRef, useState } from "react";
import {signIn,getSession} from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [loading,setLoading] = useState(false);

    const router = useRouter();

    const submitHandler = async (event) => {
        event.preventDefault();

        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;

            setLoading(true);
            const confirmedPassword = confirmPasswordRef.current.value;
            const enteredUserName = userNameRef.current.value;

            if (enteredPassword !== confirmedPassword)
            {
                toast.error('password did not match',{
                    duration: 4000,
                    position: 'top-right',
                    // Styling
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
                // setAuthAlert({type:"error",message:"Password did not match!"})
                setLoading(false);
                return;
            }
            
            localStorage.setItem('new_user', 1);

            const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
                userName:enteredUserName,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
        const data = await response.json();
        
            if (data.errorMessage) {
                setLoading(false);
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
                // setAuthAlert({type:"error",message:data.errorMessage});
                return;
        }

            if (data.successMessage)
            {
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
                // setAuthAlert({type:"success",message: data.successMessage});
                setLoading(false);
                const result = await signIn('credentials', {
                    redirect: false,
                    email: enteredEmail,
                    password: enteredPassword,
                });
                if (result.ok)
                {
                    setLoading(false);
                    router.replace("/");
                } 
            }
        return data;
        
    }
    

    
    return (
        <>
            <Toaster/>
        <div className="relative overflow-hidden">
            {loading && <div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50"></div>}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full object-cover relative"
                style={{height:'92vh'}}
            >
                <Image
                    src="https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero.jpg"
                    layout="fill"
                    quality={30}
                alt="bg" />
                </motion.div>
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="text-3xl flex justify-center items-center z-1 absolute top-0 right-0 bottom-0 left-0 h-screen">
                <div className="w-4/5 flex mb-16 drop-shadow-2xl">
                <div className="bg-base-300 backdrop-blur-sm  w-full p-4 md:p-8 font-bold">
                <h1 className="text-center">Welcome Back</h1>
                <form className="mt-8" onSubmit={submitHandler}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">Email</span>
                    </label> 
                    <input ref={emailRef} type="email" placeholder="Email" className="input input-lg"/>
                            </div>
                 <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">User Name</span>
                    </label> 
                    <input ref={userNameRef} type="text" placeholder="username" className="input input-lg"/>
                </div>
                            
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">Password</span>
                    </label> 
                    <input ref={passwordRef} type="password" placeholder="password" className="input input-lg"/>
                </div>
               <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">Confirm Password</span>
                    </label> 
                    <input ref={confirmPasswordRef} type="password" placeholder="password" className="input input-lg"/>
                </div>
                <div className="text-center mt-4">
                    <button className="btn glass btn-wide text-lg">Signup</button>
                </div>        
                </form>
                        
                <div className="divider text-lg">
                            OR
                </div>        
                <div className="text-center">
                                <button className="btn"
                                    onClick={() => signIn('google')}>Sign up with Google</button>
                                
                </div>
                            <h1 className="text-sm text-center mt-2 cursor-pointer">
                                Already have an acoount? Login
                            </h1>
                </div>
                <div className="hidden md:block bg-blue-700 w-full relative">
                        <Image
                            src="https://images.pexels.com/photos/2740956/pexels-photo-2740956.jpeg"
                            layout="fill"
                            alt="side"
                            className="object-cover h-full opacity-90"
                        />
                </div>
                </div>
            </motion.div>
   </div>
     </>
  );
};

export default Auth;

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    
    if (session)
    {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    
    return {
        props:{}
    }
}