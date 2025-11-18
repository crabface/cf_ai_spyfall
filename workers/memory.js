/**
 * Memory Management - Workers KV integration
 * Stores game statistics, player history, and conversation logs
 */

/**
 * Save game result to KV for statistics
 */
export async function saveGameResult(kv, gameId, gameResult) {
  const key = `game:${gameId}`;
  const data = {
    gameId,
    result: gameResult,
    timestamp: Date.now(),
  };

  try {
    await kv.put(key, JSON.stringify(data), {
      expirationTtl: 60 * 60 * 24 * 30, // 30 days
    });
    return true;
  } catch (error) {
    console.error('Failed to save game result:', error);
    return false;
  }
}

/**
 * Get game result from KV
 */
export async function getGameResult(kv, gameId) {
  try {
    const data = await kv.get(`game:${gameId}`, 'json');
    return data;
  } catch (error) {
    console.error('Failed to get game result:', error);
    return null;
  }
}

/**
 * Update player statistics
 */
export async function updatePlayerStats(kv, playerName, gameResult) {
  const key = `player:${playerName}`;

  try {
    // Get existing stats
    let stats = await kv.get(key, 'json');
    if (!stats) {
      stats = {
        playerName,
        gamesPlayed: 0,
        gamesWon: 0,
        timesWasSpy: 0,
        timesSpyWon: 0,
      };
    }

    // Update stats
    stats.gamesPlayed++;
    if (gameResult.won) {
      stats.gamesWon++;
    }
    if (gameResult.wasSpy) {
      stats.timesWasSpy++;
      if (gameResult.won) {
        stats.timesSpyWon++;
      }
    }

    await kv.put(key, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Failed to update player stats:', error);
    return null;
  }
}

/**
 * Get player statistics
 */
export async function getPlayerStats(kv, playerName) {
  try {
    const stats = await kv.get(`player:${playerName}`, 'json');
    return stats || {
      playerName,
      gamesPlayed: 0,
      gamesWon: 0,
      timesWasSpy: 0,
      timesSpyWon: 0,
    };
  } catch (error) {
    console.error('Failed to get player stats:', error);
    return null;
  }
}

/**
 * Store conversation snippet for analysis
 */
export async function storeConversation(kv, gameId, messages) {
  const key = `conversation:${gameId}`;

  try {
    await kv.put(key, JSON.stringify(messages), {
      expirationTtl: 60 * 60 * 24 * 7, // 7 days
    });
    return true;
  } catch (error) {
    console.error('Failed to store conversation:', error);
    return false;
  }
}

/**
 * Get recent games list
 */
export async function getRecentGames(kv, limit = 10) {
  try {
    const list = await kv.list({ prefix: 'game:', limit });
    const games = await Promise.all(
      list.keys.map(async key => {
        const data = await kv.get(key.name, 'json');
        return data;
      })
    );
    return games.filter(g => g !== null);
  } catch (error) {
    console.error('Failed to get recent games:', error);
    return [];
  }
}
