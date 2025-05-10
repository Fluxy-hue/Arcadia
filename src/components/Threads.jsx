import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Threads = () => {
  const [name, setName] = useState('');
  const [threadInput, setThreadInput] = useState('');
  const [threads, setThreads] = useState([]);

  const fetchThreads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/threads');
      setThreads(res.data || []);
    } catch (err) {
      console.error('Error fetching threads:', err.message);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const postThread = async () => {
    if (!name.trim() || !threadInput.trim()) return alert('Enter both name and content');

    try {
      await axios.post('http://localhost:5000/api/threads', {
        name,
        content: threadInput
      });

      setThreadInput('');
      fetchThreads(); // Refresh immediately
    } catch (err) {
      console.error('Error posting thread:', err.message);
      alert('Failed to post thread');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Anonymous Threads</h2>

      <input
        placeholder="Your anonymous name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 rounded text-black"
      />

      <textarea
        placeholder="What's on your mind?"
        value={threadInput}
        onChange={(e) => setThreadInput(e.target.value)}
        className="w-full p-2 h-24 rounded text-black"
      />

      <button
        onClick={postThread}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post
      </button>

      <div className="mt-8 space-y-4">
        {threads.length > 0 ? (
          threads.map((t, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded shadow text-white">
              <div className="text-sm text-yellow-300 font-semibold">{t.name}</div>
              <div className="mt-1">{t.content}</div>
              <div className="text-xs text-gray-400 mt-2">{new Date(t.timestamp).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No threads yet.</p>
        )}
      </div>
    </div>
  );
};

export default Threads;
