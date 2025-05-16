import React, { useState } from 'react';

const EmulatorPage = () => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setLoading(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      {!started && (
        <img
          src="https://i.ytimg.com/vi/1MOjNA7I98g/maxresdefault.jpg"
          alt="Pokemon Fire Red"
          className="w-64 h-auto rounded-lg shadow-lg mb-6 cursor-pointer transform hover:scale-105 transition-transform duration-300"
          onClick={handleStart}
          title="Click to Start Game"
        />
      )}

      {started && (
        <>
          {loading && (
            <div className="text-white mb-4 animate-pulse">
              Loading emulator...
            </div>
          )}

          <iframe
            src="/emulator.html"
            title="Pokémon Fire Red Emulator"
            width="1000"
            height="800"
            style={{ border: 'none', opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}
            onLoad={() => setLoading(false)}
          />
        </>
      )}
    </div>
  );
};

export default EmulatorPage;
