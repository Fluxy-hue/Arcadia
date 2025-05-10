import React, { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/button';
import GoLive from './components/GoLive';
import ThreadPost from './components/Threads';

const games = [
  { id: 1, name: 'Game One', thumbnail: 'https://via.placeholder.com/300/FF5733' },
  { id: 2, name: 'Game Two', thumbnail: 'https://via.placeholder.com/300/33FF57' },
  { id: 3, name: 'Game Three', thumbnail: 'https://via.placeholder.com/300/3357FF' },
  { id: 4, name: 'Game Four', thumbnail: 'https://via.placeholder.com/300/FF33A1' },
];

function App() {
  const [activeTab, setActiveTab] = useState('Go Live');
  const tabs = ['Go Live', 'Games', 'Thread'];

  const getButtonColor = (tab) => {
    switch (tab) {
      case 'Go Live': return 'bg-red-600 hover:bg-red-800';
      case 'Games': return 'bg-blue-600 hover:bg-blue-800';
      case 'Thread': return 'bg-orange-600 hover:bg-orange-800';
      default: return 'bg-gray-600 hover:bg-gray-800';
    }
  };

  const getGlowColor = (thumbnail) => {
    if (thumbnail.includes('FF5733')) return 'shadow-orange-500';
    if (thumbnail.includes('33FF57')) return 'shadow-green-500';
    if (thumbnail.includes('3357FF')) return 'shadow-blue-500';
    if (thumbnail.includes('FF33A1')) return 'shadow-pink-500';
    return 'shadow-gray-500';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Games':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10">
            {games.map((game) => (
              <Card
                key={game.id}
                className={`hover:${getGlowColor(game.thumbnail)} transform hover:scale-105 transition duration-300 shadow-lg`}
              >
                <img src={game.thumbnail} alt={game.name} className="w-full h-48 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-white">{game.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'Thread':
        return (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Write anything you want!</h2>
            <ThreadPost />
          </div>
        );
      case 'Go Live':
        return <GoLive />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/assets/bg.jpeg')" }}
    >
      <div className="flex justify-center space-x-6 pt-8">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${getButtonColor(tab)} text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
              activeTab === tab ? 'ring-2 ring-white scale-105' : ''
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
