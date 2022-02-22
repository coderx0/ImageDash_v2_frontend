import { client,cdnClient } from "../lib/sanityClient";
import { feedQuery } from "../lib/Data";
import Feed from "../components/Feed";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";

export default function Home({ pins }) { 

  const { data: session, status } = useSession();

  const user = session?.user;
  
  useEffect(() => {
    const newUser = localStorage.getItem('new_user');

    if (newUser === '1' && user) {
      const doc = {
        _id:nanoid(),
        _type:'user',
        userName: user.name,
        image: user.image,
        email: user.email,
      };
      
    client.createIfNotExists(doc).then(msg=>console.log(msg));
    }
  }, [user?.id]);
  
  return (
  <>
        <div className="bg-fixed bg-center bg-no-repeat bg-cover h-96 flex justify-center items-center"
      style={{backgroundImage:`url("https://i.pinimg.com/originals/ed/e1/d6/ede1d669ed75699be57f39d14bb4306b.jpg")`}}>
        
          <div className="p-8 font-bold text-2xl md:text-4xl">
            Share Images and connect with people
          </div>
      </div>
      <div className="bg-center bg-no-repeat bg-cover bg-fixed">
      <Feed pins={pins}/>
      </div>
  </>
  )
}

export async function getStaticProps() {
    
  const data = await cdnClient.fetch(feedQuery);

  return {
      props: {
          pins:data
      },
      revalidate: 3600
  }
}
