import { useState, useRef, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import VotingPanel from './VotingPanel';

function GamePlay({ gameState, currentPlayer, gameId, apiBase }) {
  const [showVoting, setShowVoting] = useState(false);

  if (!gameState || !currentPlayer) {
    return <div className="text-white text-center">Loading game...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {currentPlayer.isSpy ? '🕵️ You are the Spy' : `📍 ${gameState.location?.name}`}
              </h2>
              {!currentPlayer.isSpy && (
                <p className="text-purple-100 mt-1">Role: {currentPlayer.role}</p>
              )}
            </div>
            <button
              onClick={() => setShowVoting(!showVoting)}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              {showVoting ? 'Back to Chat' : 'Vote for Spy'}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {showVoting ? (
            <VotingPanel
              gameState={gameState}
              currentPlayer={currentPlayer}
              gameId={gameId}
              apiBase={apiBase}
            />
          ) : (
            <ChatInterface
              gameState={gameState}
              currentPlayer={currentPlayer}
              gameId={gameId}
              apiBase={apiBase}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePlay;
