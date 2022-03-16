import React from 'react'
import LoginModal from '../components/LoginModal'
import { getSession } from 'next-auth/react'

const Login = () => {
  return (
    <LoginModal compType='page'/>
  )
}

export default Login;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  
  if (session)
  {
      return {
          redirect: {
              destination: '/',
              permanent: false
          }
      }
  }
  
  return {
      props:{}
  }
}