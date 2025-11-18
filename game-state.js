/**
 * AI Handler - Manages Workers AI integration with Llama 3.3
 * Generates contextual responses based on player role (spy vs non-spy)
 */

/**
 * Generate AI response for a player's question
 * @param {Object} ai - Workers AI binding
 * @param {string} question - The player's question
 * @param {Object} context - Game context (location, isSpy, conversationHistory)
 * @returns {Promise<string>} AI-generated response
 */
export async function generateAIResponse(ai, question, context) {
  const { location, isSpy, conversationHistory, playerName } = context;

  // Build system prompt based on whether player is the spy
  const systemPrompt = isSpy 
    ? getSpySystemPrompt() 
    : getNonSpySystemPrompt(location);

  // Build conversation context
  const messages = [
    { role: 'system', content: systemPrompt },
    ...formatConversationHistory(conversationHistory),
    { role: 'user', content: `${playerName} asks: ${question}` }
  ];

  try {
    // Call Workers AI with Llama 3.3 70B model
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.response || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error('AI generation error:', error);
    return "The AI assistant is having trouble right now. Please try again.";
  }
}

/**
 * System prompt for non-spy players (know the location)
 */
function getNonSpySystemPrompt(location) {
  return `You are an AI game assistant for Spyfall. The current location is: ${location.name}.

Your role: Help non-spy players by providing subtle hints about the location without giving it away completely.

Rules:
- Give contextual clues about what you might see, hear, or do at ${location.name}
- Be somewhat vague but helpful
- Don't say the location name directly
- Answer questions naturally, as if you're also at this location
- Keep responses brief (2-3 sentences max)
- Use sensory details (sights, sounds, smells, feelings)
- If asked about your role, be evasive but stay in character

Example responses:
- "I notice people in uniforms walking around here"
- "The smell of fresh [location-appropriate item] fills the air"
- "I can hear [location-appropriate sound] in the background"

Remember: Be helpful but not too obvious. The spy is listening!`;
}

/**
 * System prompt for spy players (don't know the location)
 */
function getSpySystemPrompt() {
  return `You are an AI game assistant for Spyfall. You are helping THE SPY who doesn't know the location.

Your role: Help the spy blend in without revealing you don't know the location.

Rules:
- Give VERY vague, generic responses that could apply to many places
- Never commit to specific details about the location
- Ask questions back to gather information
- Be conversational and natural
- Keep responses brief (2-3 sentences max)
- Act like you're being careful about revealing information
- Deflect specific questions with your own questions

Example responses:
- "It's interesting here, isn't it? What do you think about it?"
- "I'm just taking in the atmosphere. What caught your attention first?"
- "There's definitely a unique vibe to this place. How long have you been here?"
- "I prefer to observe quietly. What's your role here usually?"

Remember: You're helping the spy blend in. Be vague, ask questions, and don't commit to details!`;
}

/**
 * Format conversation history for AI context
 */
function formatConversationHistory(history) {
  if (!history || history.length === 0) return [];
  
  // Take last 5 messages for context (to avoid token limits)
  return history.slice(-5).map(msg => ({
    role: msg.type === 'ai' ? 'assistant' : 'user',
    content: msg.type === 'ai' ? msg.text : `${msg.playerName}: ${msg.text}`
  }));
}

/**
 * Generate location hint (more direct than chat responses)
 * Used when players explicitly ask for a hint
 */
export async function generateLocationHint(ai, location, difficulty = 'medium') {
  const prompts = {
    easy: `Give a clear but not too obvious hint about ${location.name}. Mention something very characteristic of this place. One sentence only.`,
    medium: `Give a moderate hint about ${location.name}. Be somewhat vague but helpful. One sentence only.`,
    hard: `Give a subtle, cryptic hint about ${location.name}. Make them think. One sentence only.`
  };

  try {
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { 
          role: 'system', 
          content: 'You are a game master for Spyfall. Give hints that are helpful but not too obvious.' 
        },
        { role: 'user', content: prompts[difficulty] }
      ],
      max_tokens: 50,
      temperature: 0.8,
    });

    return response.response || "Think about what makes this place unique.";
  } catch (error) {
    console.error('Hint generation error:', error);
    return "Think about what you've learned so far.";
  }
}

/**
 * Analyze if a player's messages seem suspicious (potential spy behavior)
 * Returns a suspicion score from 0-10
 */
export async function analyzeSuspicion(ai, playerMessages, location) {
  if (!playerMessages || playerMessages.length < 3) {
    return { score: 0, reason: 'Not enough data' };
  }

  const messagesText = playerMessages.map(m => m.text).join('\n');
  
  const prompt = `You are analyzing a Spyfall game. The location is: ${location.name}.

Here are a player's messages:
${messagesText}

Analyze if this player seems to know the location or if they're being vague (potential spy).

Respond with a JSON object:
{
  "suspicionScore": <number 0-10>,
  "reason": "<brief explanation>"
}

Score guide:
0-3: Clearly knows the location
4-6: Neutral, hard to tell
7-10: Likely the spy (being vague, asking lots of questions, not committing to details)`;

  try {
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: 'You are a game analyzer. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const parsed = JSON.parse(response.response);
    return {
      score: parsed.suspicionScore || 0,
      reason: parsed.reason || 'Unable to analyze'
    };
  } catch (error) {
    console.error('Suspicion analysis error:', error);
    return { score: 0, reason: 'Analysis failed' };
  }
}
