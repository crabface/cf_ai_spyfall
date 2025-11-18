function GameResults({ gameState, currentPlayer, onPlayAgain }) {
  if (!gameState?.result) {
    return <div className="text-white text-center">Loading results...</div>;
  }

  const { result } = gameState;
  const didIWin = result.nonSpiesWin ? !currentPlayer.isSpy : currentPlayer.isSpy;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{didIWin ? '🎉' : '😔'}</div>
          <h2 className="text-4xl font-bold mb-2">
            {didIWin ? (
              <span className="text-green-600">You Won!</span>
            ) : (
              <span className="text-red-600">You Lost!</span>
            )}
          </h2>
          <p className="text-xl text-gray-600">
            {result.nonSpiesWin
              ? 'The spy was caught!'
              : 'The spy remained hidden!'}
          </p>
        </div>

        {/* Spy Reveal */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <p className="text-center text-gray-700 font-medium mb-3">The Spy Was:</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {result.spyPlayer.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{result.spyPlayer.name}</p>
              <p className="text-sm text-gray-600">🕵️ Spy</p>
            </div>
          </div>
        </div>

        {/* Accused Player */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
          <p className="text-center text-gray-700 font-medium mb-3">Players Voted For:</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {result.accusedPlayer.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{result.accusedPlayer.name}</p>
              <p className="text-sm text-gray-600">
                {result.accusedPlayer.id === result.spyPlayer.id
                  ? '✓ Correctly accused!'
                  : '✗ Wrongly accused'}
              </p>
            </div>
          </div>
        </div>

        {/* Location Reveal */}
        <div className="bg-purple-50 border border-purple-300 rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-700 font-medium mb-2">The Location Was:</p>
          <p className="text-3xl font-bold text-purple-600">{gameState.location.name}</p>
        </div>

        {/* Vote Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Vote Breakdown:</h3>
          <div className="space-y-2">
            {Object.entries(result.voteCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([playerId, count]) => {
                const player = gameState.players.find((p) => p.id === playerId);
                return (
                  <div
                    key={playerId}
                    className="flex items-center justify-between bg-white rounded p-3"
                  >
                    <span className="font-medium text-gray-800">{player?.name}</span>
                    <span className="text-gray-600">
                      {count} vote{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* All Players and Roles */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">All Players & Roles:</h3>
          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded p-3 ${
                  player.isSpy ? 'bg-red-100 border border-red-300' : 'bg-white'
                }`}
              >
                <span className="font-medium text-gray-800">
                  {player.name}
                  {player.id === currentPlayer.id && ' (You)'}
                </span>
                <span className="text-gray-600">
                  {player.isSpy ? '🕵️ Spy' : player.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameResults;
