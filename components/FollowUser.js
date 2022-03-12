import React,{useState} from 'react'

const FollowUser = ({userFollowers,id,userId}) => {
    const [loading, setLoading] = useState(false);
    const [followers, setFollowers] = useState(userFollowers);
    const [followSuccess, setFollowSuccess] = useState(false);

    let alreadyFollowed = followers?.filter((item) => item?.followedBy._id === userId);
    alreadyFollowed = alreadyFollowed?.length > 0 ? alreadyFollowed : [];
    
    const followUser = async() => {
      if (alreadyFollowed?.length === 0 && id !== userId) {
        setLoading(true);
        const response = await fetch(`/api/utils/follow/${id}/${userId}`);
          const data = await response.json();
          if (data.message === "success") {
              setFollowSuccess(true);
       }
        setLoading(false);
        
      }
    }

  return (
      <>
          {
              followSuccess ?
                  <button className='btn btn-primary btn-outline font-bold'>Following</button> :
                  loading ?
                      <button className='btn btn-primary btn-outline font-bold loading'>Loading</button> :
                      alreadyFollowed.length === 0 ?
                          <button className='btn btn-primary btn-outline font-bold' onClick={followUser}>Follow</button> :
                          <button className='btn btn-primary btn-outline font-bold'>Following</button>
          }
        
    </>
  )
}

export default FollowUser;