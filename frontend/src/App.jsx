import { Routes, Route, Navigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import WelcomeMessage from './components/WelcomeMessage';
import { fetchAllUser, fetchUser } from './utils/user/user';

const App = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // fetch user + users list
  useEffect(() => {
    const loadUser = async () => {
      await dispatch(fetchUser());
      if (userData) {
        await dispatch(fetchAllUser());
      }
      setLoading(false);
    };
    loadUser();
  }, [dispatch, userData]);

  // Loading spinner
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Large screens: Home + nested Chat */}
      <Route path="/" element={userData ? <Home /> : <Landing />}>
        <Route index element={userData ? <WelcomeMessage /> : <Navigate to="/login" />} />
        <Route path=":id" element={userData ? <Chat /> : <Navigate to="/login" />} />
      </Route>

      {/* Mobile screens: standalone Chat */}
      <Route
        path="/chat/:id"
        element={userData ? <Chat /> : <Navigate to="/login" />}
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={userData ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" /> : <Signup />}
      />
    </Routes>
  );
};

export default App;
