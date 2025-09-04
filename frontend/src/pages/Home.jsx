import ChatSidebar from '../components/Sidebar'
import { Outlet } from 'react-router'
import { useSelector } from 'react-redux'
const Home = () => {
  const { fetchUserLoading,userData } = useSelector(state => state.user)

  if(!userData){
    return null
  }
  return (
    <div className='w-full h-screen flex '>
      <div className='w-full  md:w-84 xl:w-96'>
        <ChatSidebar />
      </div>
      <div className='hidden md:block flex-1 w-full '>
        <Outlet />
      </div>
    </div>
  )
}

export default Home