import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import UserWorks from '../../components/UserWork';

const UserSaves = () => {
  const router = useRouter();
    const { uId } = router.query;
    
  return (
    <UserWorks userId={uId} work='saves' />
  )
}

export default UserSaves;