import React from 'react';
import { useParams } from 'react-router-dom';

const emulatorMap = {
  1: { rom: '/roms/super_mario.nes', name: 'Super Mario' },
  2: { rom: '/roms/zelda.nes', name: 'Zelda' },
  3: { rom: '/roms/pacman.nes', name: 'Pac-Man' },
  4: { rom: '/roms/metroid.nes', name: 'Metroid' },
};

function Emulator() {
  const { id } = useParams();
  const game = emulatorMap[id];

  if (!game) {
    return <div className="text-center mt-10 text-xl text-red-400">Game not found.</div>;
  }

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className="text-3xl font-bold mb-6">{game.name}</h2>
      {/* Insert JS-based emulator like JSNES or Ruffle here */}
      <iframe
        src={`https://your-emulator.com?rom=${game.rom}`}
        title={game.name}
        className="w-[800px] h-[600px] border-4 border-white rounded-xl"
        allowFullScreen
      />
    </div>
  );
}

export default Emulator;