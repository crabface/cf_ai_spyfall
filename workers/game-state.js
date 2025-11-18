/**
 * GameSession Durable Object
 * Manages game state, players, and real-time communication for a single game session
 */

import { generateAIResponse, generateLocationHint, analyzeSuspicion } from './ai-handler.js';
import { getRandomLocation, getRandomRole } from './locations.js';

export class GameSession {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = [];
  }

  async fetch(request) {
    const url = new URL(request.url);

    // Handle WebSocket connections
    if (url.pathname.endsWith('/ws')) {
      const upgradeHeader = request.headers.get('Upgrade');
      if (upgradeHeader !== 'websocket') {
        return new Response('Expected websocket', { status: 400 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      await this.handleWebSocket(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // Regular HTTP endpoints
    if (request.method === 'POST') {
      const data = await request.json();

      if (url.pathname.endsWith('/create')) {
        return this.createGame(data);
      } else if (url.pathname.endsWith('/join')) {
        return this.joinGame(data);
      } else if (url.pathname.endsWith('/start')) {
        return this.startGame(data);
      } else if (url.pathname.endsWith('/message')) {
        return this.handleMessage(data);
      } else if (url.pathname.endsWith('/vote')) {
        return this.handleVote(data);
      }
    }

    if (request.method === 'GET') {
      return this.getGameState();
    }

    return new Response('Not found', { status: 404 });
  }

  async handleWebSocket(ws) {
    ws.accept();
    this.sessions.push(ws);

    ws.addEventListener('close', () => {
      this.sessions = this.sessions.filter(s => s !== ws);
    });

    // Send current game state to new connection
    const gameState = await this.state.storage.get('gameState');
    if (gameState) {
      ws.send(JSON.stringify({ type: 'gameState', data: gameState }));
    }
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message);
    this.sessions.forEach(ws => {
      try {
        ws.send(messageStr);
      } catch (err) {
        console.error('Failed to send message to WebSocket:', err);
      }
    });
  }

  async createGame(data) {
    const { hostName } = data;

    const gameState = {
      id: crypto.randomUUID(),
      host: hostName,
      players: [{
        id: crypto.randomUUID(),
        name: hostName,
        isHost: true,
        role: null,
        isSpy: false,
      }],
      status: 'lobby', // lobby, playing, voting, ended
      location: null,
      messages: [],
      votes: {},
      createdAt: Date.now(),
    };

    await this.state.storage.put('gameState', gameState);

    return new Response(JSON.stringify(gameState), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async joinGame(data) {
    const { playerName } = data;
    const gameState = await this.state.storage.get('gameState');

    if (!gameState) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (gameState.status !== 'lobby') {
      return new Response(JSON.stringify({ error: 'Game already started' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if player already joined
    const existingPlayer = gameState.players.find(p => p.name === playerName);
    if (existingPlayer) {
      return new Response(JSON.stringify({ player: existingPlayer, gameState }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newPlayer = {
      id: crypto.randomUUID(),
      name: playerName,
      isHost: false,
      role: null,
      isSpy: false,
    };

    gameState.players.push(newPlayer);
    await this.state.storage.put('gameState', gameState);

    // Broadcast player joined
    this.broadcast({ type: 'playerJoined', player: newPlayer, gameState });

    return new Response(JSON.stringify({ player: newPlayer, gameState }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async startGame(data) {
    const gameState = await this.state.storage.get('gameState');

    if (!gameState) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (gameState.players.length < 3) {
      return new Response(JSON.stringify({ error: 'Need at least 3 players' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Pick random location
    const location = getRandomLocation();
    gameState.location = location;

    // Randomly assign spy (1 player)
    const spyIndex = Math.floor(Math.random() * gameState.players.length);

    gameState.players.forEach((player, index) => {
      if (index === spyIndex) {
        player.isSpy = true;
        player.role = 'Spy';
      } else {
        player.isSpy = false;
        player.role = getRandomRole(location);
      }
    });

    gameState.status = 'playing';
    await this.state.storage.put('gameState', gameState);

    // Broadcast game started (without revealing roles to everyone)
    this.broadcast({ type: 'gameStarted', gameState: this.sanitizeGameState(gameState) });

    return new Response(JSON.stringify(gameState), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async handleMessage(data) {
    const { playerId, message, requestAIResponse } = data;
    const gameState = await this.state.storage.get('gameState');

    if (!gameState) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const player = gameState.players.find(p => p.id === playerId);
    if (!player) {
      return new Response(JSON.stringify({ error: 'Player not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messageObj = {
      id: crypto.randomUUID(),
      playerId,
      playerName: player.name,
      text: message,
      timestamp: Date.now(),
      type: 'player',
    };

    gameState.messages.push(messageObj);

    // Generate AI response if requested
    let aiResponse = null;
    if (requestAIResponse && this.env.AI) {
      const context = {
        location: gameState.location,
        isSpy: player.isSpy,
        conversationHistory: gameState.messages,
        playerName: player.name,
      };

      const aiText = await generateAIResponse(this.env.AI, message, context);

      aiResponse = {
        id: crypto.randomUUID(),
        text: aiText,
        timestamp: Date.now(),
        type: 'ai',
        forPlayer: playerId,
      };

      gameState.messages.push(aiResponse);
    }

    await this.state.storage.put('gameState', gameState);

    // Broadcast new messages
    this.broadcast({ type: 'newMessage', message: messageObj, aiResponse });

    return new Response(JSON.stringify({ message: messageObj, aiResponse }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async handleVote(data) {
    const { playerId, votedForId } = data;
    const gameState = await this.state.storage.get('gameState');

    if (!gameState) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    gameState.votes[playerId] = votedForId;

    // Check if all players voted
    const allVoted = gameState.players.every(p => gameState.votes[p.id]);

    if (allVoted) {
      // Count votes
      const voteCounts = {};
      Object.values(gameState.votes).forEach(votedId => {
        voteCounts[votedId] = (voteCounts[votedId] || 0) + 1;
      });

      // Find player with most votes
      let maxVotes = 0;
      let accusedId = null;
      Object.entries(voteCounts).forEach(([playerId, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          accusedId = playerId;
        }
      });

      const accusedPlayer = gameState.players.find(p => p.id === accusedId);
      const spyPlayer = gameState.players.find(p => p.isSpy);

      gameState.result = {
        accusedPlayer,
        spyPlayer,
        voteCounts,
        nonSpiesWin: accusedPlayer?.id === spyPlayer?.id,
      };

      gameState.status = 'ended';
    }

    await this.state.storage.put('gameState', gameState);

    // Broadcast vote update
    this.broadcast({ type: 'voteUpdate', gameState });

    return new Response(JSON.stringify(gameState), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getGameState() {
    const gameState = await this.state.storage.get('gameState');

    if (!gameState) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(gameState), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Remove sensitive data when broadcasting to all players
  sanitizeGameState(gameState) {
    return {
      ...gameState,
      players: gameState.players.map(p => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        // Don't reveal role or isSpy to other players
      })),
    };
  }
}
