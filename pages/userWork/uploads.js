import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import UserWorks from '../../components/UserWork';

const UserUploads = () => {
  const router = useRouter();
    const { uId } = router.query;
    
    return (
    <UserWorks userId={uId} work='uploads' />
  )
}

export default UserUploads;