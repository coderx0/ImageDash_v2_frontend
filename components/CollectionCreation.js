import React,{useState,useRef} from 'react'
import { BiImageAdd } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import CollectionItem from './CollectionItem';

const CollectionCreation = ({ userId,pinId,setShowLoginModal,setloginImage,pinTitle,setLoginMessage,imageUrl }) => {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [collection, setCollection] = useState(null);
    const collectionInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  
  const collectionModal = async () => {
    if (userId) {
      const response = await fetch(`/api/utils/collection/${userId}`);
      const data = await response.json();
      setCollection(data?.collectionData);
      setShowCollectionModal(true);
    }
    else {
      setShowLoginModal(true);
      setLoginMessage(`Login to collect the image '${pinTitle}'`);
      setloginImage(imageUrl);

    }
  }
      
      const createCollection = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const collectionName = collectionInputRef.current.value;
        if (collectionName.trim().length === 0)
        {
          setIsLoading(false);
          return;
        }
        if (userId) {
          setIsLoading(true);
          
          const response = await fetch(`/api/utils/collection/create/${userId}/${collectionName}`);
          const data = await response.json();
          const createdId = data?.collectionData._id;
          const title = data?.collectionData.title;
          setCollection(prev=>[{_id:createdId,title,pins:null},...prev]);
          setIsLoading(false);
          collectionInputRef.current.value = '';
        }
        setIsLoading(false);
      }
    
  return (
      <>
           <button className='btn p-2 hover:bg-sky-600'
                  onClick={collectionModal}>
        <BiImageAdd className='w-5 h-5'/>
        <span className='mx-2'>Collect</span>
      </button>
                {showCollectionModal &&
        <div
          className='fixed top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center bg-[#111111b1]'>
          <div className='bg-stone-900 w-[20rem] sm:w-[30rem] rounded-xl border-2'>
            <div className='flex items-center p-4 my-2'>
          <h1 className='flex-1 font-semibold sm:text-xl'>Add Image to collection</h1>
            <button
                      onClick={() => setShowCollectionModal(false)}>
                 <AiFillCloseCircle className='w-7 h-7'/>
            </button>
         </div>
            {collection.length === 0 && <div className='h-48 w-full text-center pt-16 text-xl'>
              No collections found
            </div>}
            {collection.length>0 && <div className='flex flex-col mb-6 px-2 gap-1 max-h-64 overflow-auto'>
                    {collection?.map(item =>
                      <CollectionItem collection={item} userId={userId} pinId= {pinId} key={item._id}/>)}
            </div>}
              <form onSubmit={createCollection}
                  className="pb-4 px-2 flex gap-2">
              <input type="text" ref={collectionInputRef}
                placeholder="collection name"
                className="input input-bordered border-2 bg-stone-900 w-48 sm:flex-1 md:flex-1" />
            {!isLoading && <button className='btn btn-success w-24 sm:w-36 text-sm md:text-md px-2 font-bold'>
                Create New
              </button>}
              {
                isLoading && <button className='btn btn-success loading font-bold'>
              </button>
              }
          </form>
          </div>     
          </div>}
    </>
  )
}

export default CollectionCreation;