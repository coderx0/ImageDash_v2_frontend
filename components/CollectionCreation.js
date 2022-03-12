import React,{useState,useRef} from 'react'

const CollectionCreation = ({ userId,pinId }) => {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [collection, setCollection] = useState(null);
    const collectionInputRef = useRef();

    const collectionModal = async() => {
        const response = await fetch(`/api/utils/collection/${userId}`);
        const data = await response.json();
        setCollection(data?.collectionData);
        setShowCollectionModal(true);
        console.log(data.collectionData);
      }
      
      const createCollection = async (event) => {
        event.preventDefault();
        const collectionName = collectionInputRef.current.value;
        const response = await fetch(`/api/utils/collection/create/${userId}/${collectionName}`);
        const data = await response.json();
        const createdId = data?.collectionData._id;
        const title = data?.collectionData.title;
    
        setCollection(prev=>[{_id:createdId,title,pins:null},...prev]);
      }
    
      const addPinToSelectedCollection = async (collectionItem, pinId) => {
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
      };
      
      const removePinFromCollection = async (collectionItem, pinId) => {
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
      };
  return (
      <>
           <button className='btn btn-outline p-2 hover:bg-sky-600'
                  onClick={collectionModal}>
                  Collection
                </button>
                {showCollectionModal &&
                  <div className='w-72 p-2 absolute bottom-0 right-0 bg-stone-900 border-2 rounded-xl'>
                  <button className='bg-red-500 absolute -top-4 -left-4 p-1 border-4 rounded-full'
                      onClick={() => setShowCollectionModal(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
</svg>
                  </button>
                  <div className="dropdown w-full">
                  <button tabIndex="0" className="btn btn-info w-full font-bold">Create New Collection</button>
                      <form tabIndex="0" onSubmit={createCollection}
                          className="py-2 w-full dropdown-content bg-base-700 rounded-box flex gap-2">
                  <input type="text" ref={collectionInputRef} placeholder="collection name" className="input input-bordered bg-stone-900 w-full max-w-xs"/>
                      <button className='btn btn-success font-bold'>Create</button>
                  </form>
                  </div>
                  
                  <div className='flex flex-col pt-2 px-4 gap-1 h-52 overflow-auto'>
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
                  </div>}
    </>
  )
}

export default CollectionCreation;