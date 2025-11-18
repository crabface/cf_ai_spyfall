import { useState } from 'react';

function VotingPanel({ gameState, currentPlayer, gameId, apiBase }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [voting, setVoting] = useState(false);

  const hasVoted = gameState.votes && gameState.votes[currentPlayer.id];

  const submitVote = async () => {
    if (!selectedPlayer || voting) return;

    setVoting(true);
    try {
      await fetch(`${apiBase}/game/${gameId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentPlayer.id,
          votedForId: selectedPlayer,
        }),
      });
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  const votedPlayers = gameState.votes ? Object.keys(gameState.votes).length : 0;
  const totalPlayers = gameState.players.length;

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Vote for the Spy
      </h3>

      {hasVoted ? (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6 text-center">
          <div className="text-4xl mb-2">✓</div>
          <p className="text-lg font-semibold text-green-800 mb-2">Vote Submitted!</p>
          <p className="text-gray-600">
            Waiting for other players... ({votedPlayers}/{totalPlayers} voted)
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-center">
            Select the player you think is the spy:
          </p>
          <div className="space-y-2 mb-6">
            {gameState.players
              .filter((p) => p.id !== currentPlayer.id)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition ${
                    selectedPlayer === player.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {player.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 text-lg">{player.name}</span>
                  </div>
                  {selectedPlayer === player.id && (
                    <div className="text-purple-600 text-2xl">✓</div>
                  )}
                </button>
              ))}
          </div>

          <button
            onClick={submitVote}
            disabled={!selectedPlayer || voting}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {voting ? 'Submitting Vote...' : 'Submit Vote'}
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Voting Progress:</strong> {votedPlayers} out of {totalPlayers} players have
          voted.
        </p>
      </div>
    </div>
  );
}

export default VotingPanel;
