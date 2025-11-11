import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function BookService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [error,setError] = useState(null);

  useEffect(() => {
    api.get('/services/all')
      .then(res => setService(res.data.find(s => s._id === id)))
      .catch(console.error);
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    if(!user || user.role !== 'user') {
      setError('You must be logged in as User to book');
      return;
    }
    try {
      await api.post('/bookings', { service_id: id, date, address });
      navigate('/user/orders');
    } catch(err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  }

  if(!service) return <p className="p-4">Loading service...</p>;

  return (
    <div className="max-w-md mx-auto p-6 border rounded mt-10 bg-white">
      <h1 className="text-2xl mb-4 font-bold">Book Service: {service.title}</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          Date and Time
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="border p-2 rounded w-full" />
        </label>
        <label className="block">
          Address
          <textarea value={address} onChange={e => setAddress(e.target.value)} required className="border p-2 rounded w-full" rows={3} />
        </label>
        <button type="submit" className="bg-green-600 text-white py-2 rounded">Book Now</button>
      </form>
    </div>
  );
}
