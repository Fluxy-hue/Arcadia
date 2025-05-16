import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

const games = [
  { id: 1, name: 'Super Mario', thumbnail: 'https://via.placeholder.com/300/FF5733', rom: '/roms/super_mario.nes' },
  { id: 2, name: 'Zelda', thumbnail: 'https://via.placeholder.com/300/33FF57', rom: '/roms/zelda.nes' },
  { id: 3, name: 'Pac-Man', thumbnail: 'https://via.placeholder.com/300/3357FF', rom: '/roms/pacman.nes' },
  { id: 4, name: 'Metroid', thumbnail: 'https://via.placeholder.com/300/FF33A1', rom: '/roms/metroid.nes' },
];

const getGlowColor = (thumbnail) => {
  if (thumbnail.includes('FF5733')) return 'shadow-orange-500';
  if (thumbnail.includes('33FF57')) return 'shadow-green-500';
  if (thumbnail.includes('3357FF')) return 'shadow-blue-500';
  if (thumbnail.includes('FF33A1')) return 'shadow-pink-500';
  return 'shadow-gray-500';
};

function GameGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10">
      {games.map((game) => (
        <Link key={game.id} to={`/games/${game.id}`}>
          <Card className={`hover:${getGlowColor(game.thumbnail)} transform hover:scale-105 transition duration-300 shadow-lg`}>
            <img src={game.thumbnail} alt={game.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-white">{game.name}</h3>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default GameGrid;