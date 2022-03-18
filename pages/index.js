import { cdnClient } from "../lib/sanityClient";
import { feedQuery } from "../lib/Data";
import Feed from "../components/Feed";
import { useSession } from "next-auth/react";
// import { categories } from "../lib/Data";
import { useRouter } from "next/router";
// import TopPins from "../components/TopPins";
import Image from "next/image";

export default function Home({ pins,topPins,collections }) { 

  const { data: session, status } = useSession();
  const router = useRouter();
  
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
      
      <div>
        <Feed pins={pins} />
      </div>
  </>
  )
}

export async function getStaticProps() {
    
  const data = await cdnClient.fetch(feedQuery);

  return {
      props: {
      pins: data,
      },
      revalidate: 3600
  }
}
