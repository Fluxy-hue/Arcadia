import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './GoLive.css'; // Import the CSS file containing fullscreen style

const GoLive = () => {
  const [name, setName] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [liveUsers, setLiveUsers] = useState([]);
  const [lastSession, setLastSession] = useState(null);
  const [previousSessions, setPreviousSessions] = useState([]);
  const videoRef = useRef(null);
  const stream = useRef(null);

  const fetchLiveData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/live');
      setLiveUsers(res.data.live || []);
      setLastSession(res.data.lastSession || null);
      setPreviousSessions(res.data.previous || []);
    } catch (err) {
      console.error('Error fetching live data:', err.message);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStreamEnded = async () => {
    console.log('Stream ended. Triggering endLive flow.');
    await endLive(true); // Silent to avoid alert
  };

  const goLive = async () => {
    if (!name.trim()) return alert('Enter a name to go live');

    try {
      await axios.post('http://localhost:5000/api/live/start', { name });

      stream.current = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { max: 1280 },
          height: { max: 720 },
          frameRate: 15
        }
      });

      stream.current.getVideoTracks()[0].addEventListener('ended', handleStreamEnded);

      if (videoRef.current) {
        videoRef.current.srcObject = stream.current;
        videoRef.current.play();
      }

      setIsLive(true);
    } catch (err) {
      console.error('Failed to go live:', err.message);
      alert(err.response?.data?.error || 'Failed to go live');
    }
  };

  const endLive = async (silent = false) => {
    try {
      await axios.post('http://localhost:5000/api/live/end', { name });

      if (stream.current) {
        stream.current.getTracks().forEach(track => track.stop());
        stream.current = null;
      }

      setIsLive(false);
      await fetchLiveData(); // Refresh sidebar
    } catch (err) {
      console.error('Failed to end session:', err.message);
      if (!silent) alert('Failed to end session');
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      video.classList.toggle('fullscreen-simulated');
    }
  };

  const increaseVolume = () => {
    if (videoRef.current) {
      videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
    }
  };

  const decreaseVolume = () => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex gap-8">
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">Go Live (Anonymous)</h2>
        <input
          placeholder="Your anonymous name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded text-black mb-4"
        />
        <div className="space-x-4">
          <button
            onClick={goLive}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            disabled={isLive}
          >
            Go Live
          </button>
          <button
            onClick={() => endLive()}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            disabled={!isLive}
          >
            End Live
          </button>
        </div>

        <video
          ref={videoRef}
          className="w-full h-64 mt-6 bg-black rounded"
          autoPlay
          muted
          controls
        />

        {isLive && (
          <div className="mt-4 flex gap-4">
            <button onClick={toggleFullscreen} className="bg-purple-600 text-white px-3 py-1 rounded">Fullscreen</button>
            <button onClick={increaseVolume} className="bg-blue-600 text-white px-3 py-1 rounded">Vol +</button>
            <button onClick={decreaseVolume} className="bg-blue-600 text-white px-3 py-1 rounded">Vol -</button>
            <button onClick={toggleMute} className="bg-yellow-500 text-black px-3 py-1 rounded">Mute/Unmute</button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Currently Live Users:</h3>
          {liveUsers.length > 0 ? (
            <ul className="text-green-300">
              {liveUsers.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No one is live right now.</p>
          )}
        </div>

        {lastSession && lastSession.length >= 5 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Your Last Session:</h3>
            <p className="text-yellow-300">
              {lastSession[1]} (ended at: {new Date(lastSession[4]).toLocaleTimeString()} )
            </p>
          </div>
        )}
      </div>

      <div className="w-64 bg-black bg-opacity-30 p-4 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-3">Past Live Users</h3>
        {previousSessions.length > 0 ? (
          <ul className="text-white text-sm space-y-2 overflow-y-auto max-h-96">
            {previousSessions.map((s, idx) => (
              <li key={idx}>
                {s[0]} <br />
                <span className="text-gray-300">
                  ({new Date(s[1]).toLocaleTimeString()} → {new Date(s[2]).toLocaleTimeString()})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No previous sessions yet.</p>
        )}
      </div>
    </div>
  );
};

export default GoLive;
