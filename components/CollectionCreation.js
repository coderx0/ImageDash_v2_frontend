import React,{useState,useRef} from 'react'
import { BiImageAdd } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";

const CollectionCreation = ({ userId,pinId }) => {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [collection, setCollection] = useState(null);
    const collectionInputRef = useRef();

    const collectionModal = async() => {
      if (userId) {
        const response = await fetch(`/api/utils/collection/${userId}`);
        const data = await response.json();
        setCollection(data?.collectionData);
        setShowCollectionModal(true);
        console.log(data.collectionData);
      }
      }
      
      const createCollection = async (event) => {
        event.preventDefault();
        if (userId) {
          const collectionName = collectionInputRef.current.value;
          const response = await fetch(`/api/utils/collection/create/${userId}/${collectionName}`);
          const data = await response.json();
          const createdId = data?.collectionData._id;
          const title = data?.collectionData.title;
      
          setCollection(prev=>[{_id:createdId,title,pins:null},...prev]);
       
        }
      }
    
      const addPinToSelectedCollection = async (collectionItem, pinId) => {
        if (userId) {
          const response = await fetch(`/api/utils/collection/addPin`, {
            method: "POST",
            body: JSON.stringify({
              collectionItem,
              pinId,
              uId: userId
            }),
            headers: { "Content-Type": 'application/json' }
          });
          const data = await response.json();
          if (data) {
            console.log("added to collection " + collectionItem.title);
            setShowCollectionModal(false);
          }
   }
      };
      
      const removePinFromCollection = async (collectionItem, pinId) => {
        if (userId) {
          const response = await fetch(`/api/utils/collection/removePin`, {
            method: "POST",
            body: JSON.stringify({
              collectionItem,
              pinId,
              uId: userId
            }),
            headers: { "Content-Type": 'application/json' }
          });
          const data = await response.json();
          if (data) {
            console.log("removed from collection " + collectionItem.title);
          }
    }
      };
  return (
      <>
           <button className='btn btn-outline p-2 hover:bg-sky-600'
                  onClick={collectionModal}>
        <BiImageAdd className='w-5 h-5'/>
        <span className='mx-2'>Collect</span>
      </button>


                {showCollectionModal &&
        <div
          className='fixed top-12 bottom-0 left-0 right-0 flex justify-center items-center z-20 bg-[#434646b1]' >
          <div className='bg-stone-900 w-72 rounded-box'>
          <button className=''
                      onClick={() => setShowCollectionModal(false)}>
                 <AiFillCloseCircle className='w-7 h-7'/>
            </button>
            {collection.length === 0 && <div>
              No collections found
            </div>}
            <div className='flex flex-col pb-4 px-2 gap-1 h-64 overflow-auto'>
                    {collection?.map(item =>
                      <div className='flex bg-stone-800 p-1' key={item.title}>
                        <span className='flex-1 p-2 text-lg'>{item.title}</span>
                        
                    {item.pins?.filter(pin=>pin.item._id===pinId).length===1 ?
                          <button
                            onClick={()=>removePinFromCollection(item,pinId)}
                            className='btn btn-error font-bold p-2 px-3'>
                        Remove
                      </button> :
                      <button
                        onClick={()=>{addPinToSelectedCollection(item,pinId)}}
                        className='btn btn-success font-bold p-2 px-3'>
                        Add
                          </button>}
                        
                      </div>)}
            </div>
            <div className="dropdown dropdown-top w-full py-2 px-2">
                  <button tabIndex="0" className="btn btn-info w-full font-bold">Create New Collection</button>
                      <form tabIndex="0" onSubmit={createCollection}
                          className="py-2 dropdown-content bg-stone-700 px-2 flex gap-2">
                  <input type="text" ref={collectionInputRef} placeholder="collection name" className="input input-bordered bg-stone-900 w-full max-w-xs"/>
                      <button className='btn btn-success font-bold'>Create</button>
                  </form>
                  </div>
          </div>     
          </div>}
    </>
  )
}

export default CollectionCreation;