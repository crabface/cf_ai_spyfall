function RoleReveal({ player, location, onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full animate-fade-in">
        <div className="text-center">
          {player.isSpy ? (
            <>
              <div className="text-6xl mb-4">🕵️</div>
              <h2 className="text-4xl font-bold text-red-600 mb-4">You are the SPY!</h2>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
                <p className="text-gray-700 text-lg mb-2">
                  You don't know the location.
                </p>
                <p className="text-gray-600">
                  Your goal: Blend in by asking vague questions and figure out where you are
                  without getting caught!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-4xl font-bold text-blue-600 mb-4">Your Role</h2>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-4">
                <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Location</p>
                <p className="text-3xl font-bold text-gray-800 mb-4">{location?.name}</p>
                <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Your Role</p>
                <p className="text-2xl font-semibold text-purple-600">{player.role}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700">
                  Ask questions to find the spy without revealing the location!
                </p>
              </div>
            </>
          )}

          <button
            onClick={onDismiss}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition"
          >
            Got it! Let's Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleReveal;
