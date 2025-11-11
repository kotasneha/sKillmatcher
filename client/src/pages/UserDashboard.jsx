import React, { useEffect, useState } from 'react';
import api from '../api';

export default function UserDashboard() {
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [a,h] = await Promise.all([
        api.get('/bookings/my-orders'),
        api.get('/bookings/my-history')
      ]);
      setActive(a.data); setHistory(h.data);
    } catch(e){ setError('Failed to load'); }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    try { await api.put(`/bookings/${id}/cancel`); load(); }
    catch(e){ setError(e.response?.data?.error || 'Cancel failed'); }
  };

  const renderTable = (orders, canCancel=false) => (
    <table className="w-full table-auto border border-gray-300 bg-white">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-3 py-1">Service</th>
          <th className="border px-3 py-1">Worker</th>
          <th className="border px-3 py-1">Date</th>
          <th className="border px-3 py-1">Address</th>
          <th className="border px-3 py-1">Status</th>
          {canCancel && <th className="border px-3 py-1">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o._id} className="text-center">
            <td className="border px-3 py-1">{o.service_id?.title}</td>
            <td className="border px-3 py-1">{o.worker_id?.name}</td>
            <td className="border px-3 py-1">{new Date(o.date).toLocaleString()}</td>
            <td className="border px-3 py-1">{o.address}</td>
            <td className="border px-3 py-1 capitalize">{o.status}</td>
            {canCancel && <td className="border px-3 py-1">
              {(o.status==='pending' || o.status==='accepted') && (
                <button onClick={()=>cancel(o._id)} className="bg-red-600 text-white px-2 py-1 rounded">Cancel</button>
              )}
            </td>}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <h2 className="text-xl font-semibold mb-3">Active Orders</h2>
      {active.length === 0 ? <p>No active orders.</p> : renderTable(active, true)}

      <h2 className="text-xl font-semibold mb-3 mt-10">Order History</h2>
      {history.length === 0 ? <p>No past orders.</p> : renderTable(history, false)}
    </div>
  );
}
