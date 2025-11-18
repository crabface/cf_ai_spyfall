# Quick Start Guide

This is a simplified guide to get the AI Spyfall game running on your machine in under 5 minutes.

## Prerequisites
- Node.js 18+ installed
- A Cloudflare account (free tier is fine)

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Login to Cloudflare
```bash
npx wrangler login
```
This opens a browser window to authenticate.

## Step 3: Run the Application Locally

Open **two terminal windows** in the project directory:

**Terminal 1 - Backend (Worker):**
```bash
npm run dev
```
Wait for "Ready on http://localhost:8787"

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
Wait for "Local: http://localhost:5173"

## Step 4: Play the Game

1. Open `http://localhost:5173` in your browser
2. Enter your name
3. Click "Create New Game"
4. Share the Game ID with friends (they can join at the same URL)
5. Once you have 3+ players, click "Start Game"
6. Find the spy!

## How the Game Works

- One random player is the **spy** (doesn't know the location)
- Everyone else knows the location and has a role
- Players chat and ask questions to figure out who's the spy
- The AI assistant provides hints based on your role
- Vote to identify the spy at the end

## Tips

- Click "Ask AI Assistant" for role-specific hints
- Spies: ask vague questions to blend in
- Non-spies: give hints without revealing the location
- Pay attention to who's being vague!

## Troubleshooting

**"Workers AI not available"**
- Run `npx wrangler login` again
- Make sure your Cloudflare account has access to Workers AI

**"Port already in use"**
- Kill processes on ports 8787 and 5173
- Or change ports in wrangler.toml and vite.config.js

**Build errors**
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## Deploying to Production

```bash
npm run build
npx wrangler deploy
```

Your game will be live at: `https://cf-ai-spyfall.YOUR-SUBDOMAIN.workers.dev`

---

For full documentation, see [README.md](./README.md)
