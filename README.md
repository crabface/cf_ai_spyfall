# cf_ai_spyfall

An AI-powered Spyfall game built on Cloudflare's developer platform. Players receive secret roles and must identify the spy through conversation, with an AI assistant helping facilitate gameplay.

## 🎮 Features

- **AI Game Master**: Llama 3.3 powered game master that manages roles and provides contextual hints
- **Real-time Chat**: Interactive chat interface for players to ask questions and discuss
- **Persistent Game State**: Durable Objects manage game sessions and player data
- **Memory System**: Tracks conversation history and player behavior patterns
- **Beautiful Frontend**: React-based UI built with Cloudflare Pages

## 🏗️ Architecture

### Components

1. **LLM Integration** (`workers/ai-handler.js`)
   - Uses Workers AI with Llama 3.3 70B model
   - Generates location-appropriate responses
   - Maintains character consistency for spy vs non-spy roles

2. **Game State Management** (`workers/game-state.js`)
   - Durable Objects for persistent game sessions
   - Tracks: players, roles, locations, conversation history
   - Handles game logic and voting mechanics

3. **Frontend** (`src/`)
   - React application hosted on Cloudflare Pages
   - Real-time updates via WebSockets
   - Clean, responsive UI with Tailwind CSS

4. **Memory System** (`workers/memory.js`)
   - Workers KV for long-term game statistics
   - Conversation context management
   - Player history and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works!)
- Wrangler CLI: `npm install -g wrangler`

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd cf_ai_spyfall
```

2. **Install dependencies**
```bash
npm install
```

3. **Authenticate with Cloudflare**
```bash
wrangler login
```

4. **Set up environment variables**
```bash
cp .env.example .env
# No API keys needed - Workers AI is built-in!
```

5. **Create Durable Object and KV namespaces**
```bash
# These commands create the necessary Cloudflare resources
wrangler kv:namespace create "GAME_MEMORY"
wrangler kv:namespace create "GAME_MEMORY" --preview
```

Update `wrangler.toml` with the generated IDs.

### Development

**Run locally with Wrangler:**
```bash
npm run dev
```

This starts:
- Frontend dev server at `http://localhost:5173`
- Workers local environment at `http://localhost:8787`

### Deployment

**Deploy to Cloudflare:**
```bash
npm run deploy
```

Your app will be live at `https://cf-ai-spyfall.<your-subdomain>.workers.dev`

### Testing the App

1. **Start a new game**: Navigate to the homepage and click "Create Game"
2. **Invite players**: Share the game code with 3-7 friends
3. **Get your role**: Each player receives a secret location (or "spy" role)
4. **Ask questions**: Use the chat to ask questions and identify the spy
5. **Vote**: After discussion, vote on who you think is the spy

## 🎯 How It Works

### Game Flow

1. **Game Creation**: Host creates a game, AI generates a random location
2. **Player Assignment**: Players join and receive roles (1 spy, others get location)
3. **Discussion Phase**: Players chat and the AI provides contextual responses
4. **Voting Phase**: Players vote to identify the spy
5. **Results**: Reveal roles and determine winner

### AI Integration

The AI assistant:
- **For non-spies**: Provides hints about the location without being too obvious
- **For the spy**: Gives vague responses to help them blend in
- **For all**: Tracks conversation to detect suspicious behavior

### State Management

```
User Request → Workers → Durable Object (Game State)
                ↓
            Workers AI (Llama 3.3)
                ↓
            Response → Frontend
```

## 📁 Project Structure

```
cf_ai_spyfall/
├── src/                      # React frontend
│   ├── components/
│   │   ├── GameLobby.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── PlayerList.jsx
│   │   └── VotingPanel.jsx
│   ├── App.jsx
│   └── main.jsx
├── workers/
│   ├── index.js             # Main Worker entry point
│   ├── game-state.js        # Durable Object for game sessions
│   ├── ai-handler.js        # Workers AI integration
│   └── memory.js            # KV memory management
├── public/                   # Static assets
├── wrangler.toml            # Cloudflare configuration
├── package.json
├── README.md
└── PROMPTS.md               # AI prompts used in development

```

## 🔧 Configuration

### wrangler.toml

Key configuration:
- **Workers AI binding**: Enables Llama 3.3 access
- **Durable Objects**: Game session management
- **KV Namespaces**: Long-term memory storage
- **Pages integration**: Frontend hosting

## 🎨 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite
- **Backend**: Cloudflare Workers
- **AI**: Workers AI with Llama 3.3 70B
- **State**: Durable Objects
- **Storage**: Workers KV
- **Hosting**: Cloudflare Pages

## 🤝 Contributing

This is a demo project for Cloudflare's internship application. Feel free to fork and build upon it!

## 📝 License

MIT License - feel free to use this code for learning and projects.

## 🙋 Questions?

Built by [Your Name] as part of Cloudflare's 2025 Internship Application.

- GitHub: [@yourusername]
- Email: your.email@example.com

---

**Note**: This project demonstrates integration of Cloudflare Workers AI, Durable Objects, Workers KV, and Pages to build a full-stack AI application.
