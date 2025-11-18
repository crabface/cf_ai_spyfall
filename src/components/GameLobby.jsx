import { useState } from 'react';

function GameLobby({ gameState, currentPlayer, onStartGame }) {
  const [copied, setCopied] = useState(false);

  const copyGameId = () => {
    navigator.clipboard.writeText(gameState.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Game Lobby</h2>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
          <p className="text-gray-700 font-medium mb-2">Share this Game ID with friends:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-4 py-3 rounded text-lg font-mono text-purple-600 border-2 border-purple-300">
              {gameState.id}
            </code>
            <button
              onClick={copyGameId}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Players ({gameState.players.length}/8)
          </h3>
          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {player.name[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{player.name}</span>
                </div>
                {player.isHost && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Host
                  </span>
                )}
                {player.id === currentPlayer?.id && (
                  <span className="bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>How to Play:</strong> One player will be the spy who doesn't know the location.
            Everyone else knows the location and gets a role. Ask questions to find the spy!
          </p>
        </div>

        {currentPlayer?.isHost && (
          <button
            onClick={onStartGame}
            disabled={gameState.players.length < 3}
            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
              gameState.players.length >= 3
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {gameState.players.length >= 3
              ? 'Start Game'
              : `Waiting for players (need ${3 - gameState.players.length} more)`}
          </button>
        )}

        {!currentPlayer?.isHost && (
          <div className="text-center text-gray-600">
            <p className="text-lg">Waiting for host to start the game...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameLobby;
