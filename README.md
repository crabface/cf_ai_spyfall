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

### Local Development (Quick Start)

You can run the project locally WITHOUT deploying to Cloudflare first:

1. **Terminal 1 - Start the Worker (backend)**
```bash
npm run dev
```
This starts the Cloudflare Worker at `http://localhost:8787`

2. **Terminal 2 - Start the Frontend**
```bash
npm run dev:frontend
```
This starts Vite dev server at `http://localhost:5173`

3. **Open your browser**
Navigate to `http://localhost:5173` and start playing!

**Note:** In local development mode:
- Workers AI will work if you're authenticated with Cloudflare
- Durable Objects work locally via Wrangler
- KV namespace is optional for local testing

### Production Deployment

#### Option 1: Deploy Worker + Pages (Recommended)

1. **Build the frontend**
```bash
npm run build
```

2. **Deploy the Worker with the built frontend**
```bash
wrangler deploy
```

3. **(Optional) Set up KV namespace for persistent memory**
```bash
wrangler kv:namespace create "GAME_MEMORY"
wrangler kv:namespace create "GAME_MEMORY" --preview
```

Then uncomment and update the KV section in `wrangler.toml` with the generated IDs.

Your app will be live at `https://cf-ai-spyfall.<your-subdomain>.workers.dev`

#### Option 2: Separate Deployments

**Deploy Worker:**
```bash
wrangler deploy
```

**Deploy Frontend to Cloudflare Pages:**
```bash
npm run build
npx wrangler pages deploy dist --project-name=cf-ai-spyfall
```

Update `.env` with your production Worker URL before building.

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
│   │   ├── GameLobby.jsx    # Lobby and player management
│   │   ├── ChatInterface.jsx # Chat UI with AI integration
│   │   ├── GamePlay.jsx     # Main game screen
│   │   ├── VotingPanel.jsx  # Voting interface
│   │   ├── RoleReveal.jsx   # Role reveal animation
│   │   └── GameResults.jsx  # End game results
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind styles
├── workers/
│   ├── index.js             # Main Worker entry point
│   ├── game-state.js        # Durable Object for game sessions
│   ├── ai-handler.js        # Workers AI integration (Llama 3.3)
│   ├── memory.js            # KV memory management
│   └── locations.js         # Game locations database
├── public/                   # Static assets (none required)
├── dist/                     # Build output
├── wrangler.toml            # Cloudflare configuration
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json
├── .env.example             # Environment variables template
├── .gitignore
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

## 🐛 Troubleshooting

### Workers AI not working locally
- Make sure you're logged in: `wrangler login`
- Workers AI requires authentication even for local development
- Check you have access to Workers AI in your Cloudflare account

### WebSocket connection errors
- Ensure the Worker is running on port 8787
- Check that you're using the correct WebSocket URL (ws://localhost:8787)
- Restart both dev servers if connections seem stuck

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Make sure all dependencies are installed

### CORS errors in production
- The Worker includes CORS headers for all origins in development
- For production, update the CORS policy in `workers/index.js`

### Game state not persisting
- Durable Objects maintain state during a session
- KV is optional and only needed for long-term statistics
- Refresh will lose local state (this is expected behavior)

## 🤝 Contributing

This is a demo project for Cloudflare's internship application. No collaborators.

## 📝 License

MIT License - feel free to use this code for learning and projects.

## 🙋 Questions?

Built by Neha Lazar as part of Cloudflare's 2025 Internship Application.

- GitHub: [@crabface]
- Email: nl23782@eid.utexas.edu

---

**Note**: This project demonstrates integration of Cloudflare Workers AI, Durable Objects, Workers KV, and Pages to build a full-stack AI application.

## ✅ Assignment Checklist

This project meets all Cloudflare internship assignment requirements:

- ✅ **LLM Integration**: Uses Llama 3.3 70B via Workers AI
- ✅ **Workflow/Coordination**: Durable Objects manage game sessions and state
- ✅ **User Input**: Chat interface for player communication
- ✅ **Memory/State**: Durable Objects for session state + KV for statistics
- ✅ **Repository Name**: Prefixed with `cf_ai_`
- ✅ **Documentation**: Comprehensive README.md with setup instructions
- ✅ **AI Prompts**: All prompts documented in PROMPTS.md
- ✅ **Original Work**: Built from scratch with AI assistance
