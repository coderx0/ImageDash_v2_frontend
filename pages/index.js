import { client,cdnClient } from "../lib/sanityClient";
import { feedQuery,collectionFeedQuery } from "../lib/Data";
import Feed from "../components/Feed";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import { categories } from "../lib/Data";
import CollectionFeed from "../components/CollectionFeed";
import { useRouter } from "next/router";

export default function Home({ pins,collections }) { 

  const { data: session, status } = useSession();
  const router = useRouter();
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
  
  const searchCategory = (searchTerm) => {
    router.push(`/search/${searchTerm}`);
  };

  return (
  <>
        <div className="bg-fixed bg-center bg-no-repeat bg-cover h-96 flex justify-center items-center"
      style={{backgroundImage:`url("https://i.pinimg.com/originals/ed/e1/d6/ede1d669ed75699be57f39d14bb4306b.jpg")`}}>
        
          <div className="p-8 font-bold text-2xl md:text-4xl">
            Share Images and connect with people
          </div>
      </div>
      <div className="overflow-auto whitespace-nowrap bg-slate-900">
        {categories.map(category => <div
          className="hover:bg-slate-800 inline-block p-2 text-center w-[80px] rounded-full"
          key={category.name}
        onClick={()=>searchCategory(category.name)}
        >
          <img src={category.image}
            alt={category.name} 
            className="h-14 w-14 border-2 border-sky-800 mx-auto rounded-full object-cover"
            />
          <h1>{category.name}</h1>
      </div>)}
      </div>
      <div className="">
      <h1 className="pt-2 text-center font-bold text-2xl">Pins</h1>
        <Feed pins={pins} />
      <h1 className="p-2 text-center font-bold text-2xl">Collections</h1>
        <CollectionFeed collections={collections}/>
      </div>
  </>
  )
}

export async function getStaticProps() {
    
  const data = await cdnClient.fetch(feedQuery);
  const collectionData = await cdnClient.fetch(collectionFeedQuery);
  
  return {
      props: {
      pins: data,
      collections:collectionData
      },
      revalidate: 3600
  }
}
