import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'

function MyApp({
  Component,router,pageProps: {session, ...pageProps } }) {
  
  const url = `http://localhost:3000/${router.route}`;

  return <SessionProvider session={session}>
    
    <Navbar />
    <AnimatePresence
      exitBeforeEnter
      initial={false}
    >
        <Component {...pageProps} canonical={url} key={url}/>
      </AnimatePresence>
      
  </SessionProvider>
}

export default MyApp
