import { cdnClient } from "../lib/sanityClient";
import { feedQuery } from "../lib/Data";
import Feed from "../components/Feed";
import { useSession } from "next-auth/react";
import { categories } from "../lib/Data";
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
      <div className="overflow-y-hidden overflow-x-scroll whitespace-nowrap bg-slate-900">
        {categories.map(category => <div
          className="hover:bg-slate-800 inline-block p-2 text-center w-[80px] rounded-full"
          key={category.name}
        onClick={()=>searchCategory(category.name)}
        >
          <Image
            src={category.image}
            alt={category.name}
            height={100}
            width={100}
            className="mx-auto rounded-full object-cover"
            />
          <h1>{category.name}</h1>
      </div>)}
      </div>
      <div>
        {/* <div>
        <h1 className='text-center font-semibold text-xl my-4'>Top Pins</h1>
        <TopPins topPins={topPins}/>
        </div> */}
      <h1 className="pt-2 text-center font-bold text-2xl">Pins</h1>
        <Feed pins={pins} />
      </div>
  </>
  )
}

export async function getStaticProps() {
    
  const data = await cdnClient.fetch(feedQuery);
  // const topPins = data.filter(pin => pin.likes !== null).sort((a, b) => b.likes.length - a.likes.length).slice(0,3);

  return {
      props: {
      pins: data,
      },
      revalidate: 3600
  }
}
