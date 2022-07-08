import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../components/Navbar'
import { AnimatePresence } from 'framer-motion'
import NextNProgress from "nextjs-progressbar";

function MyApp({
  Component,router,pageProps: {session, ...pageProps } }) {
  
  const url = `http://localhost:3000/${router.route}`;

  return <SessionProvider session={session}>
    <Navbar />
    <NextNProgress/>
    <AnimatePresence
      exitBeforeEnter
      initial={false}
    >
        <Component {...pageProps} canonical={url} key={url}/>
      </AnimatePresence>
  </SessionProvider>
}

export default MyApp
