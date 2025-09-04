import { Routes, Route, Navigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Suspense, useEffect } from 'react'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import WelcomeMessage from './components/WelcomeMessage'
import { fetchUser } from './utils/user/user'
const App = () => {
  const { userData, fetchUserLoading } = useSelector(state => state.user)
  const dispatch = useDispatch()
  //fetch user data
  console.log(userData)
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUser())
    }
  }, [dispatch, userData])

  if (!fetchUserLoading) {
    <div className='w-full h-screen flex items-center justify-center'>
      <span className="loading loading-ring loading-lg"></span>
    </div>
  }
  return (

    <Routes>
      <Route path='/' element={userData ? <Home /> : <Landing />} >
        <Route index element={<WelcomeMessage />} />
        <Route path=':id' element={userData ? <Chat /> : <Navigate to={'/'} />} />
      </Route>
      <Route path='/' element={<Home />} />
      <Route path='/chat/:id' element={userData ? <Chat /> : <Home />} />
      <Route path='/login' element={userData ? <Navigate to={'/'} /> : <Login />} />
      <Route path='/signup' element={userData ? <Navigate to={'/'} /> : <Signup />} />
    </Routes>

  )
}

export default App
