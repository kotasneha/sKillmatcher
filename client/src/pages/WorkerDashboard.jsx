import React, { useEffect, useState } from 'react';
import api from '../api';

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Worker Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings assigned.</p>
      ) : (
        <table className="w-full table-auto border bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-1">Service</th>
              <th className="border px-3 py-1">User</th>
              <th className="border px-3 py-1">Date</th>
              <th className="border px-3 py-1">Status</th>
              <th className="border px-3 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="text-center">
                <td className="border px-3 py-1">{b.service_id?.title}</td>
                <td className="border px-3 py-1">{b.user_id?.name}</td>
                <td className="border px-3 py-1">{new Date(b.date).toLocaleString()}</td>
                <td className="border px-3 py-1 capitalize">{b.status}</td>
                <td className="border px-3 py-1 space-x-2">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(b._id, 'accepted')} className="bg-green-600 text-white px-2 py-1 rounded">
                        Accept
                      </button>
                      <button onClick={() => updateStatus(b._id, 'rejected')} className="bg-red-600 text-white px-2 py-1 rounded">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
