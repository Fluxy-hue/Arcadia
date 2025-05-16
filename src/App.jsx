import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GoLive from './components/GoLive';
import ThreadPost from './components/Threads';
import Card from './components/ui/Card';
import Button from './components/ui/button';
import EmulatorPage from './components/EmulatorPage';
const games = [
  {
    id: 1,
    name: 'Pokémon Fire Red',
    thumbnail: 'https://i.ytimg.com/vi/5D8zEi5fxBg/maxresdefault.jpg',
    route: '/emulator/pokemon-firered'
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = React.useState('Go Live');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'Games':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10">
            {games.map((game) => (
              <Card
  key={game.id}
  onClick={() => {
    
    console.log('Navigating to:', game.route);
    navigate(game.route);
  }}
  className="cursor-pointer hover:shadow-lg transform hover:scale-105 transition duration-300"
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

  const tabs = ['Go Live', 'Games', 'Thread'];

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
            className={`text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
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
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emulator/pokemon-firered" element={<EmulatorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
