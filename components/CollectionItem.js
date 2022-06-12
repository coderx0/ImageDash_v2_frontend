import React,{useState} from 'react'

const CollectionItem = ({ collection:collectionData, pinId, userId }) => {
  const [collection, setCollection] = useState(collectionData);
    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isRemoveButton, setIsRemoveButton] = useState(collection.pins?.filter(pin => pin.item._id === pinId).length === 1);

    const addPinToSelectedCollection = async (collectionItem, pinId) => {
        if (userId) {
          setIsAdding(true);
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
              setIsAdding(false);
              setIsRemoveButton(true);
          }
   }
      };
      
      const removePinFromCollection = async (collectionItem, pinId) => {
          if (userId) {
              setIsRemoving(true);
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
                  setIsRemoving(false);
                  setIsRemoveButton(false);
          }
    }
  };
  const changePrivacy = async(e) => {
    setCollection(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
    const response = await fetch(`/api/utils/collection/changePrivacy`, {
      method: "POST",
      body: JSON.stringify({
        collection,
        isPrivate:!collection.isPrivate
      }),
      headers: { "Content-Type": 'application/json' }
    });
  }

  return (
    <div className='flex items-center bg-stone-800 p-1'>
          <div className="form-control">
  <span htmlFor='privacy' className="label">
          <label className=" mx-2">{collection.isPrivate ? 'Private' : 'Public'}</label>
          <input id='privacy' type="checkbox" onChange={changePrivacy} className="checkbox" defaultChecked={collection.isPrivate}/>
  </span>
</div>    
      <span className='flex-1 p-2 text-lg'>
              {collection.title}
      </span>
          
          {(isRemoveButton && !isRemoving ) && <button
                            onClick={()=>removePinFromCollection(collection,pinId)}
                            className='btn btn-error font-bold p-2 px-3'>
                        Remove
          </button>}

          {(isRemoveButton && isRemoving) && <button className='btn btn-error loading'></button>}
          
          {(!isRemoveButton && !isAdding) && <button
                        onClick={()=>{addPinToSelectedCollection(collection,pinId)}}
                        className='btn btn-success font-bold p-2 px-3'>
                        Add
          </button>}
          
          {(!isRemoveButton && isAdding) && <button className='btn btn-success loading'></button>}
         
                      </div>
  )
}

export default CollectionItem