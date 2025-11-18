/**
 * Main Cloudflare Worker entry point
 * Handles API routing and coordinates between frontend, AI, and game state
 */

import { GameSession } from './game-state.js';

export { GameSession };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers for frontend communication
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: Create new game
      if (url.pathname === '/api/game/create' && request.method === 'POST') {
        const gameId = crypto.randomUUID();
        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        const response = await gameSession.fetch(request);
        return addCorsHeaders(response, corsHeaders);
      }

      // Route: Join existing game
      if (url.pathname.startsWith('/api/game/') && url.pathname.endsWith('/join') && request.method === 'POST') {
        const gameId = url.pathname.split('/')[3];
        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        const response = await gameSession.fetch(request);
        return addCorsHeaders(response, corsHeaders);
      }

      // Route: Send chat message
      if (url.pathname.startsWith('/api/game/') && url.pathname.endsWith('/message') && request.method === 'POST') {
        const gameId = url.pathname.split('/')[3];
        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        const response = await gameSession.fetch(request);
        return addCorsHeaders(response, corsHeaders);
      }

      // Route: Start game
      if (url.pathname.startsWith('/api/game/') && url.pathname.endsWith('/start') && request.method === 'POST') {
        const gameId = url.pathname.split('/')[3];
        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        const response = await gameSession.fetch(request);
        return addCorsHeaders(response, corsHeaders);
      }

      // Route: Vote for spy
      if (url.pathname.startsWith('/api/game/') && url.pathname.endsWith('/vote') && request.method === 'POST') {
        const gameId = url.pathname.split('/')[3];
        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        const response = await gameSession.fetch(request);
        return addCorsHeaders(response, corsHeaders);
      }

      // Route: Get game state
      if (url.pathname.startsWith('/api/game/') && request.method === 'GET') {
        const pathParts = url.pathname.split('/');
        const gameId = pathParts[3];
        
        if (!gameId) {
          return jsonResponse({ error: 'Game ID required' }, 400, corsHeaders);
        }

        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        const response = await gameSession.fetch(request);
        return addCorsHeaders(response, corsHeaders);
      }

      // Route: WebSocket connection for real-time updates
      if (url.pathname.startsWith('/api/game/') && url.pathname.endsWith('/ws')) {
        const gameId = url.pathname.split('/')[3];
        const id = env.GAME_SESSIONS.idFromName(gameId);
        const gameSession = env.GAME_SESSIONS.get(id);
        
        return gameSession.fetch(request);
      }

      // Health check endpoint
      if (url.pathname === '/api/health') {
        return jsonResponse({ status: 'ok', timestamp: Date.now() }, 200, corsHeaders);
      }

      // 404 for unknown routes
      return jsonResponse({ error: 'Not found' }, 404, corsHeaders);

    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse(
        { error: 'Internal server error', message: error.message },
        500,
        corsHeaders
      );
    }
  }
};

/**
 * Helper function to create JSON responses
 */
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

/**
 * Helper function to add CORS headers to existing response
 */
function addCorsHeaders(response, corsHeaders) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
