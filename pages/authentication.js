import { useEffect, useRef, useState } from "react";
import {signIn,getSession} from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [authAlert, setAuthAlert] = useState(null);
    const [loading,setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        let authAlertTimer = setTimeout(() => setAuthAlert(null), 3000);

        return () => {
            clearTimeout(authAlertTimer);
        }
    }, [authAlert]);

    const submitHandler = async (event) => {
        event.preventDefault();

        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;
        
        if (isLogin) {
            setLoading(true);
            localStorage.setItem('new_user', 0);

            const result = await signIn('credentials', {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword,
              });
           
            if (!result.error) {
                setLoading(false);
                router.replace("/");
            }
            else
                setAuthAlert({type:"error",message:result.error});
            setLoading(false);
        }

        else {
            setLoading(true);
            const confirmedPassword = confirmPasswordRef.current.value;
            const enteredUserName = userNameRef.current.value;

            if (enteredPassword !== confirmedPassword)
            {
                setAuthAlert({type:"error",message:"Password did not match!"})
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
                setAuthAlert({type:"error",message:data.errorMessage});
                return;
        }

            if (response.ok)
            {
                setAuthAlert({type:"success",message: data.successMessage});
                setLoading(false);
                const result = await signIn('credentials', {
                    redirect: false,
                    email: enteredEmail,
                    password: enteredPassword,
                    userName: enteredUserName,
                    id:data.id,
                    type:'new_user',
                });
                
                if (result.ok)
                {
                    localStorage.clear();
                    setLoading(false);
                    router.replace("/");
                } 
            }
        return data;
        }
    }
    const authModeHandler = () => {
        setIsLogin(prev => !prev);
    }
    
    const alertClass = "shadow-lg flex justify-around p-6 rounded-box absolute top-30 text-md right-0 w-72 z-20";

    
    return (
        <>
               {authAlert && <div className={`${alertClass} + ${authAlert.type==="error"?" bg-red-500":" bg-green-500"}`}>
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{authAlert.message}</span>
</div>}
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
                {!isLogin && <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">User Name</span>
                    </label> 
                    <input ref={userNameRef} type="text" placeholder="username" className="input input-lg"/>
                </div>}
                            
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">Password</span>
                    </label> 
                    <input ref={passwordRef} type="password" placeholder="password" className="input input-lg"/>
                </div>
                {!isLogin && <div className="form-control">
                    <label className="label">
                        <span className="label-text text-2xl">Confirm Password</span>
                    </label> 
                    <input ref={confirmPasswordRef} type="password" placeholder="password" className="input input-lg"/>
                </div>}
                <div className="text-center mt-4">
                    <button className="btn glass btn-wide text-lg">{isLogin ? 'Login' : 'Signup'}</button>
                </div>        
                </form>
                        
                <div className="divider text-lg">
                            OR
                </div>        
                <div className="text-center">
                            {isLogin && <button className="btn" onClick={() => { localStorage.setItem('new_user', 0); return signIn('google')}}>Sign in with Google</button>}
                            {!isLogin && <button className="btn" onClick={() => { localStorage.setItem('new_user', 1); return signIn('google')}}>Sign up with Google</button>}
                </div>
                <h1 className="text-sm text-center mt-2 cursor-pointer" onClick={authModeHandler}>{isLogin ? "Don't have an account? Signup" : "Already have an acoount? Login"}</h1>
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