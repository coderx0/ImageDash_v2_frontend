import React from 'react'
import { useRouter } from "next/router";
import { FaWpexplorer,FaDownload,FaUpload } from "react-icons/fa";
import { MdOutlineCollections } from 'react-icons/md';
import { FaHotjar, FaRegSave } from 'react-icons/fa';
import { AiFillLike } from "react-icons/ai";
import { motion,AnimatePresence } from "framer-motion";
import { categories } from "../lib/Data";
import Image from "next/image";

const optionsClass = 'flex gap-6 items-center p-2 cursor-pointer hover:bg-stone-800';

const Sidebar = ({ userId,sideBar, setSideBar }) => {
    const router = useRouter();
    const searchCategory = (searchTerm) => {
        setSideBar(false);
        router.push(`/search/${searchTerm}`);
    };
    const openPage = (page) => {
      setSideBar(false);
        router.push(`/${page}`);
  }

  return (
    <AnimatePresence>
      {sideBar && <div
        onClick={()=>setSideBar(false)}
          className="fixed h-[100vh] w-[100vw] flex top-16 left-0 z-50 bg-[#11111191]">
            <motion.div
          key="sidebar"
          onClick={e=>e.stopPropagation()}
          initial={{x: -300 }}
          animate={{ x: 0}}
          exit={{ x: -300 }}
          transition={{type:'linear',duration:0.2}}
              className="w-64 bg-stone-900 overflow-y-auto">
              <div className="p-1">
                <h1 className={optionsClass} onClick={()=>openPage('explore')}><FaWpexplorer className="w-6 h-6"/> Explore</h1>
                <h1 className={optionsClass} onClick={()=>openPage('collections')}><MdOutlineCollections className="w-6 h-6"/> Collections</h1>
                <h1 className={optionsClass} onClick={()=>openPage('trending')}><FaHotjar className="w-6 h-6"/>Trending</h1>
            {userId && <div>
              <span className="divider text-sm text-stone-400 my-8">My Domain</span>
                <h1 className={optionsClass} onClick={()=>openPage(`userWork/uploads/${userId}`)}><FaUpload className="w-5 h-5"/>Uploaded</h1>
                <h1 className={optionsClass} onClick={()=>openPage(`userWork/likes/${userId}`)}><AiFillLike className="w-5 h-5"/>Liked</h1>
                <h1 className={optionsClass} onClick={()=>openPage(`userWork/collections?uId=${userId}`)}><MdOutlineCollections className="w-6 h-6"/>My Collections</h1>
              </div>}   
            
               {/* <h1 className={optionsClass}><FaDownload className="w-5 h-5"/>Downloaded</h1> */}
              </div>
              <span className="divider text-stone-400 text-sm">Categories</span>
            {categories.map(category => <div
          className="hover:bg-slate-800 cursor-pointer flex gap-4 items-center w-full p-2"
          key={category.name}
              onClick={() => {
                router.push(`/explore/${category.categoryId}`);
                setSideBar(false);
        }}
        >
          <Image
            src={category.image}
            alt={category.name}
            height={40}
            width={40}
            className="rounded-full object-cover"
            />
          <h1>{category.name}</h1>
      </div>)}
            </motion.div>  
            </div>}
       </AnimatePresence>
  )
}

export default Sidebar