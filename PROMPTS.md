# AI Prompts Used in Development

This document contains all AI prompts used to assist in building this project, as required by the Cloudflare assignment.

## Initial Project Planning

### Prompt 1: Project Structure
```
I need to build an AI-powered Spyfall game on Cloudflare for an internship assignment. 
It needs:
- LLM (Llama 3.3 on Workers AI)
- Workflow coordination (Durable Objects or Workflows)
- Chat interface (Pages)
- Memory/state management

Can you help me plan the architecture and project structure?
```

**Response Summary**: Suggested using Durable Objects for game state, Workers AI for the LLM, Pages for frontend, and KV for persistent memory. Recommended React for the UI.

---

## Core Implementation Prompts

### Prompt 2: Workers AI Integration
```
How do I integrate Llama 3.3 70B from Workers AI in a Cloudflare Worker? 
I need to send prompts based on whether the player is a spy or not, and get contextual responses.
```

**Used for**: `workers/ai-handler.js` - Setting up the AI binding and creating role-specific prompts.

### Prompt 3: Durable Objects Setup
```
I need to create a Durable Object to manage game state for a Spyfall game. 
It should track:
- Player list with roles
- Current location
- Conversation history
- Game phase (lobby, playing, voting, ended)

Can you show me the boilerplate and key methods?
```

**Used for**: `workers/game-state.js` - Implementing the GameSession Durable Object class.

### Prompt 4: React Chat Interface
```
Create a React component for a chat interface that:
- Displays messages from multiple players
- Shows AI responses differently from player messages
- Has an input field for new messages
- Auto-scrolls to latest message
- Uses Tailwind CSS for styling
```

**Used for**: `src/components/ChatInterface.jsx`

### Prompt 5: Game Location Generator
```
Generate a list of 50 diverse Spyfall locations that would work well for the game. 
Include a mix of:
- Public places (park, library, airport)
- Workplaces (office, restaurant kitchen, hospital)
- Entertainment venues (movie theater, casino, circus)
- Unusual locations (submarine, space station, pirate ship)

Return as a JavaScript array.
```

**Used for**: `workers/locations.js` - Creating the location database.

---

## Frontend Development Prompts

### Prompt 6: Game Lobby Component
```
Create a React component for a game lobby where:
- Host can see a shareable game code
- Players can see who has joined
- Shows player count (need 3-8 players)
- Host has a "Start Game" button
- Clean, modern UI with Tailwind
```

**Used for**: `src/components/GameLobby.jsx`

### Prompt 7: Voting System UI
```
Design a voting panel component where players can:
- See all players in the game
- Click to vote for who they think is the spy
- See vote counts after everyone votes
- Display results dramatically

Style it like a game show with animations.
```

**Used for**: `src/components/VotingPanel.jsx`

### Prompt 8: Role Reveal Animation
```
Create a React component that reveals the player's role with a nice animation:
- Fade in effect
- Show location name (or "SPY" in red)
- Include flavor text about the location
- Add a "Got it" button to dismiss
```

**Used for**: `src/components/RoleReveal.jsx`

---

## Backend Logic Prompts

### Prompt 9: AI Prompt Engineering
```
I need to create system prompts for an AI in a Spyfall game. The AI should:

For NON-SPY players:
- Give subtle hints about the location
- Not reveal the location directly
- Answer questions in-character

For SPY players:
- Give vague, general responses
- Help them blend in without revealing they don't know the location
- Be helpful but not too obvious

Write two distinct system prompts for these roles.
```

**Used for**: `workers/ai-handler.js` - Creating role-specific AI personas.

### Prompt 10: Memory Management
```
How should I structure conversation memory in Workers KV for a Spyfall game?
I want to store:
- Last 10 messages per game session
- Player statistics (games played, spy wins, etc.)
- Recent game outcomes

What's the best key structure and data format?
```

**Used for**: `workers/memory.js` - Implementing KV storage patterns.

---

## Configuration & Deployment Prompts

### Prompt 11: Wrangler Configuration
```
Create a wrangler.toml configuration file for a project that uses:
- Workers AI with Llama 3.3
- Durable Objects for game state
- KV namespace for memory
- Pages for frontend hosting
- Compatibility date 2024-01-01 or later
```

**Used for**: `wrangler.toml` setup.

### Prompt 12: Package.json Scripts
```
What npm scripts should I include in package.json for a Cloudflare Workers + Pages project?
I need scripts for:
- Local development
- Building the frontend
- Deploying Workers
- Deploying Pages
- Running tests
```

**Used for**: `package.json` scripts section.

---

## Debugging Prompts

### Prompt 13: WebSocket Connection Issues
```
My Durable Object WebSocket connections are closing unexpectedly. 
The error is "WebSocket is closed" when trying to broadcast messages.
How do I properly handle WebSocket lifecycle in Durable Objects?
```

**Used for**: Debugging `workers/game-state.js` WebSocket implementation.

### Prompt 14: CORS Configuration
```
I'm getting CORS errors when my Pages frontend tries to call my Worker API.
How do I properly configure CORS headers in a Cloudflare Worker?
```

**Used for**: Adding CORS middleware in `workers/index.js`.

---

## Testing Prompts

### Prompt 15: Test Game Scenarios
```
Create a test suite for a Spyfall game that covers:
- Creating a game
- Players joining
- Role assignment (ensuring 1 spy)
- Chat functionality
- Voting logic
- Win conditions

Use Vitest or similar testing framework.
```

**Used for**: Creating test files (if time permits).

---

## Documentation Prompts

### Prompt 16: README Structure
```
Create a comprehensive README.md for a Cloudflare internship project that includes:
- Clear project description
- Architecture overview
- Setup instructions
- Local development guide
- Deployment steps
- Project structure
- Tech stack

Make it professional and easy to follow.
```

**Used for**: This README.md file.

### Prompt 17: Code Comments
```
Add clear, concise comments to this JavaScript code explaining:
- What each function does
- Parameter types and return values
- Any non-obvious logic
- Edge cases handled

[Code snippet provided]
```

**Used for**: Adding documentation throughout the codebase.

---

## Optimization Prompts

### Prompt 18: Performance Optimization
```
My Worker is taking 200ms+ to respond. How can I optimize:
- AI inference calls to Llama 3.3
- Durable Object read/write operations
- KV access patterns

What are Cloudflare-specific best practices?
```

**Used for**: Performance improvements in various files.

### Prompt 19: Bundle Size Reduction
```
My React frontend bundle is 500KB. How can I:
- Code-split components
- Lazy load routes
- Optimize dependencies
- Use Vite's build optimizations

Give me specific configuration changes.
```

**Used for**: Optimizing Vite configuration and component loading.

---

## UI/UX Prompts

### Prompt 20: Responsive Design
```
Make this React component responsive for:
- Mobile (320px+)
- Tablet (768px+)  
- Desktop (1024px+)

Use Tailwind's responsive classes and mobile-first approach.
```

**Used for**: Making all components mobile-friendly.

---

## Notes on AI Usage

- **AI Tool Used**: Claude 3.5 Sonnet (Anthropic)
- **Coding Approach**: AI-assisted development with human oversight
- **Code Review**: All AI-generated code was reviewed, tested, and modified as needed
- **Learning**: Used AI to learn Cloudflare-specific APIs and best practices
- **Originality**: Project concept and architecture designed by human developer

## Development Timeline

1. **Day 1**: Project planning and architecture design (Prompts 1-2)
2. **Day 2**: Backend implementation - Workers and Durable Objects (Prompts 3, 9-11)
3. **Day 3**: Frontend development - React components (Prompts 4, 6-8)
4. **Day 4**: Integration, testing, and debugging (Prompts 13-14)
5. **Day 5**: Optimization and documentation (Prompts 16-20)

---

**Total Prompts Used**: 20+
**Development Time**: ~5 days
**AI Assistance Level**: Medium - used for boilerplate, debugging, and best practices
