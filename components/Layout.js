import Navbar from './Navbar'

export default function Layout({ children }) {

  return (
    <>
      <Navbar />
      <main className='bg-[#0f0e17]'>{children}</main>
    </>
  )
}