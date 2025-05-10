import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveList = () => {
  const [liveUsers, setLiveUsers] = useState([]);
  const [lastSession, setLastSession] = useState(null);

  const fetchLiveUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/live');
      setLiveUsers(res.data.live);
      setLastSession(res.data.last);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiveUsers();
    const interval = setInterval(fetchLiveUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">Currently Live</h3>
      <ul className="mb-4">
        {liveUsers.length ? liveUsers.map((user, idx) => (
          <li key={idx} className="text-green-300">{user}</li>
        )) : <li className="text-gray-400">No one is live right now</li>}
      </ul>

      {lastSession && (
        <div>
          <h4 className="text-lg font-semibold">Last Live Session:</h4>
          <p className="text-blue-300">{lastSession}</p>
        </div>
      )}
    </div>
  );
};

export default LiveList;

