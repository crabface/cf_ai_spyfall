import { useState, useRef, useEffect } from 'react';

function ChatInterface({ gameState, currentPlayer, gameId, apiBase }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameState?.messages]);

  const sendMessage = async (withAI = false) => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await fetch(`${apiBase}/game/${gameId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentPlayer.id,
          message: message.trim(),
          requestAIResponse: withAI,
        }),
      });

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
        {(!gameState.messages || gameState.messages.length === 0) && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg">No messages yet.</p>
            <p className="text-sm">Start the conversation to find the spy!</p>
          </div>
        )}

        {gameState.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === 'ai' ? 'justify-start' : msg.playerId === currentPlayer.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md rounded-lg p-4 ${
                msg.type === 'ai'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : msg.playerId === currentPlayer.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {msg.type === 'ai' ? (
                <>
                  <p className="font-semibold text-sm mb-1">🤖 AI Assistant</p>
                  <p>{msg.text}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-sm mb-1">
                    {msg.playerName}
                    {msg.playerId === currentPlayer.id && ' (You)'}
                  </p>
                  <p>{msg.text}</p>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(false);
            }
          }}
          placeholder="Type your message or question..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows="3"
          disabled={sending}
        />
        <div className="flex gap-2">
          <button
            onClick={() => sendMessage(false)}
            disabled={!message.trim() || sending}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send to All Players'}
          </button>
          <button
            onClick={() => sendMessage(true)}
            disabled={!message.trim() || sending}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : '🤖 Ask AI Assistant'}
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Tip: Use the AI Assistant for hints based on your role!
        </p>
      </div>
    </div>
  );
}

export default ChatInterface;
