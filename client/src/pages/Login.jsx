import React, { useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { setUser, setToken } = useContext(AuthContext);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login',{email,password});
      setUser(res.data.user);
      setToken(res.data.token);
      if(res.data.user.role === 'user') navigate('/user/orders');
      else if(res.data.user.role === 'worker') navigate('/worker/services');
      else navigate('/');
    } catch(err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 shadow rounded bg-white">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="border p-2 rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      <p className="mt-2 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
    </div>
  );
}
