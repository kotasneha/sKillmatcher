import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthProvider, { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import BrowseServices from './pages/BrowseServices';
import BookService from './pages/BookService';

const PrivateRoute = ({children, roles}) => {
  const { user } = useContext(AuthContext);
  if(!user) return <Navigate to="/login" />
  if(roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children;
};

const Nav = () => {
  const { user, setUser, setToken } = useContext(AuthContext);
  const logout = () => { setUser(null); setToken(null); };
  return (
    <nav className="px-4 py-3 border-b flex gap-4 items-center bg-white">
      <Link to="/" className="font-extrabold text-xl">SkillMatcher</Link>
      <div className="ml-auto flex gap-4">
        {!user && <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
        {user?.role === 'user' && <Link to="/user/orders">My Orders</Link>}
        {user?.role === 'worker' && <Link to="/worker/services">Worker</Link>}
        {user && <button onClick={logout} className="border rounded px-2 py-1">Logout</button>}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<BrowseServices/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/book/:id" element={<BookService/>} />
        <Route path="/user/orders" element={
          <PrivateRoute roles={['user']}>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/worker/services" element={
          <PrivateRoute roles={['worker']}>
            <WorkerDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
