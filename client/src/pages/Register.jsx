import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch(err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 shadow rounded bg-white">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required className="border p-2 rounded"/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border p-2 rounded"/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="border p-2 rounded"/>
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded" >
          <option value="user">User</option>
          <option value="worker">Worker</option>
        </select>
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Register</button>
      </form>
      <p className="mt-2 text-sm">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  )
}
