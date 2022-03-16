import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import UserWorks from '../../components/UserWork';


const UserLikes = () => {
  const router = useRouter();
  const { uId } = router.query;
    
  return (
 <UserWorks userId={uId} work='likes'/>
  )
}

export default UserLikes;