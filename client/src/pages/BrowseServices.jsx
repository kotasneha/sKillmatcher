import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/services/all')
      .then(res => setServices(res.data))
      .catch(console.error);
  },[]);

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.worker_id?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-blue-100">
      <div className="text-center pt-10 pb-6">
        <h1 className="text-4xl font-extrabold text-blue-800">SkillMatcher</h1>
      </div>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for service or worker..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="w-[70%] max-w-xl px-4 py-2 border border-blue-400 rounded shadow-sm focus:outline-none"
        />
      </div>
      <div className="max-w-5xl mx-auto p-6">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No services match your search.</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-4">
            {filtered.map(s => (
              <li key={s._id} className="border p-4 rounded shadow bg-white hover:scale-[1.02] transition">
                <h2 className="text-xl font-semibold text-blue-700">{s.title}</h2>
                <p className="text-sm text-gray-600">{s.description}</p>
                <p className="mt-2 font-bold text-gray-800">${s.price}</p>
                <p className="text-xs text-gray-500">Worker: {s.worker_id?.name}</p>
                <Link
                  to={`/book/${s._id}`}
                  className="mt-3 inline-block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                >
                  Book Service
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
