import { useState, useEffect } from 'react';
import GameLobby from './components/GameLobby';
import GamePlay from './components/GamePlay';
import RoleReveal from './components/RoleReveal';
import GameResults from './components/GameResults';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

function App() {
  const [gameState, setGameState] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [view, setView] = useState('home'); // home, lobby, roleReveal, playing, results
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [ws, setWs] = useState(null);
  const [showRoleReveal, setShowRoleReveal] = useState(false);

  useEffect(() => {
    if (gameId && gameState) {
      connectWebSocket();
    }
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [gameId]);

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8787/api/game/${gameId}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'gameState') {
        setGameState(message.data);
      } else if (message.type === 'playerJoined') {
        setGameState(message.gameState);
      } else if (message.type === 'gameStarted') {
        setGameState(message.gameState);
        setShowRoleReveal(true);
        setView('roleReveal');
      } else if (message.type === 'newMessage') {
        setGameState(prev => ({
          ...prev,
          messages: [...(prev?.messages || []), message.message, message.aiResponse].filter(Boolean),
        }));
      } else if (message.type === 'voteUpdate') {
        setGameState(message.gameState);
        if (message.gameState.status === 'ended') {
          setView('results');
        }
      }
    };

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);
  };

  const createGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/game/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: playerName }),
      });

      const data = await response.json();
      setGameState(data);
      setGameId(data.id);
      setCurrentPlayer(data.players[0]);
      setView('lobby');
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Make sure the backend is running.');
    }
  };

  const joinGame = async () => {
    if (!playerName.trim() || !gameId.trim()) {
      alert('Please enter your name and game ID');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/game/${gameId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      setGameState(data.gameState);
      setCurrentPlayer(data.player);
      setView('lobby');
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game. Check the game ID and try again.');
    }
  };

  const startGame = async () => {
    try {
      const response = await fetch(`${API_BASE}/game/${gameId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // Update current player with role info
      const updatedPlayer = data.players.find(p => p.id === currentPlayer.id);
      setCurrentPlayer(updatedPlayer);
      setGameState(data);
      setShowRoleReveal(true);
      setView('roleReveal');
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game');
    }
  };

  const dismissRoleReveal = () => {
    setShowRoleReveal(false);
    setView('playing');
  };

  const resetGame = () => {
    setGameState(null);
    setCurrentPlayer(null);
    setView('home');
    setGameId('');
    setPlayerName('');
    if (ws) {
      ws.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">AI Spyfall</h1>
          <p className="text-white text-lg opacity-90">Find the spy with AI assistance</p>
        </header>

        {view === 'home' && (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome!</h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={createGame}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition mb-4"
            >
              Create New Game
            </button>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Game ID</label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter game ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={joinGame}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Join Existing Game
            </button>
          </div>
        )}

        {view === 'lobby' && (
          <GameLobby
            gameState={gameState}
            currentPlayer={currentPlayer}
            onStartGame={startGame}
          />
        )}

        {view === 'roleReveal' && showRoleReveal && currentPlayer && (
          <RoleReveal
            player={currentPlayer}
            location={gameState?.location}
            onDismiss={dismissRoleReveal}
          />
        )}

        {view === 'playing' && (
          <GamePlay
            gameState={gameState}
            currentPlayer={currentPlayer}
            gameId={gameId}
            apiBase={API_BASE}
          />
        )}

        {view === 'results' && (
          <GameResults
            gameState={gameState}
            currentPlayer={currentPlayer}
            onPlayAgain={resetGame}
          />
        )}
      </div>
    </div>
  );
}

export default App;
