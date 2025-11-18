# Deployment Checklist

## Before You Deploy

### 1. Test Locally First

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

Visit `http://localhost:5173` and test:
- [ ] Create a game
- [ ] Join with multiple browser tabs (simulate multiple players)
- [ ] Start the game
- [ ] Test AI assistant responses
- [ ] Test voting system
- [ ] Verify results screen

### 2. Commit Your Code

```bash
# Add all files
git add .

# Commit with a meaningful message
git commit -m "Complete AI Spyfall implementation for Cloudflare internship

- Implemented Durable Objects for game state management
- Integrated Llama 3.3 via Workers AI for contextual hints
- Built React frontend with real-time chat interface
- Added voting system and game results
- Includes 56 unique game locations
- Full documentation in README and PROMPTS.md"

# Push to GitHub
git push origin main
```

### 3. Deploy to Cloudflare

**Option A: Quick Deploy (Recommended)**
```bash
# Login to Cloudflare
npx wrangler login

# Build frontend
npm run build

# Deploy everything
npx wrangler deploy
```

Your app will be live at: `https://cf-ai-spyfall.YOUR-SUBDOMAIN.workers.dev`

**Option B: Separate Deployments**
```bash
# Deploy Worker
npx wrangler deploy

# Deploy Frontend to Pages
npx wrangler pages deploy dist --project-name=cf-ai-spyfall
```

### 4. (Optional) Add KV for Statistics

```bash
# Create KV namespaces
npx wrangler kv:namespace create "GAME_MEMORY"
npx wrangler kv:namespace create "GAME_MEMORY" --preview

# Copy the IDs and update wrangler.toml
# Uncomment the [[kv_namespaces]] section and add the IDs
```

### 5. Submit to Cloudflare

1. **Copy your GitHub repository URL**
   Example: `https://github.com/your-username/cf_ai_spyfall`

2. **Make sure your repo includes:**
   - [x] Repository name starts with `cf_ai_`
   - [x] README.md with documentation
   - [x] PROMPTS.md with AI prompts used
   - [x] Working code that can be deployed
   - [x] Clear running instructions

3. **Submit the GitHub URL** to the Cloudflare assignment portal

## Post-Deployment Testing

After deployment, test your live app:

- [ ] Visit your deployed URL
- [ ] Create a game
- [ ] Share game ID with a friend or use incognito mode
- [ ] Verify multiplayer works
- [ ] Test AI responses
- [ ] Complete a full game

## Troubleshooting Deployment

### "Durable Object not found"
- Make sure migrations ran: check wrangler.toml has the migration section
- Redeploy: `npx wrangler deploy`

### "Workers AI not available"
- Verify your account has Workers AI access
- Check billing is set up (free tier is fine)

### "Build failed"
- Clear dist: `rm -rf dist`
- Rebuild: `npm run build`
- Check for any TypeScript/build errors

### "Can't connect to game"
- Check WebSocket URL in production
- Update VITE_API_URL in .env for production builds
- CORS might need adjustment in workers/index.js

## Success Criteria

Your deployment is successful when:
- ✅ Game loads in browser
- ✅ Can create and join games
- ✅ AI assistant responds to messages
- ✅ Multiplayer works (test with 2+ people/tabs)
- ✅ Voting and results work correctly

---

**Good luck with your Cloudflare internship application! 🚀**
