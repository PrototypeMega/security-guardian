# AI Dev Team Labs - Quick Reference

One-page summary of everything you need to know.

---

## 🚀 Start the Product

```bash
# Install dependencies
npm install

# Set your Claude API key
echo "CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx" > .env

# Start all services
npm start

# Open in browser
http://localhost:3002/          # Landing page + Analytics
http://localhost:3002/dashboard # Agent interface
```

---

## 4️⃣ Your Agents

| Agent | What It Does | When to Use |
|-------|-------------|------------|
| 👥 **Onboarding Copilot** | Help new team members get started | Hiring? Integrating new contractors? |
| 📋 **Feature Planner** | Convert ideas to implementation plans | Planning a new feature? |
| ✅ **Test Generator** | Identify missing tests | Before merging code changes? |
| 🔒 **Security Patch Agent** | Review and patch vulnerabilities | Security audit? Vulnerability found? |

---

## 🎯 How to Use an Agent

1. **Open Dashboard** → http://localhost:3002/dashboard
2. **Select Agent** → Click on left panel
3. **Enter Request** → Type in input field
   - ✅ "Plan a dark mode feature"
   - ✅ "What tests am I missing?"
   - ✅ "Help new developers understand our codebase"
4. **(Optional) Add Browser Steps** → Research/context gathering
5. **Click "Test Agent"** → Watch it think and respond
6. **Get Results** → Copy output and use it

---

## 🔗 Browser Steps (Make Agents Smarter)

Agent can browse the web to gather context before deciding.

### How to Add a Step

1. Click **"+ Add Step"**
2. Choose action:
   - `navigate` → Go to a URL
   - `click` → Click on something
   - `type` → Type text
   - `screenshot` → Take a picture
   - `extractText` → Get text from page
   - `scroll` → Scroll down
   - `wait` → Wait for element

3. Fill in parameters
4. Click "Test Agent"

### Example

**Feature Planner with Design Research:**
- Step 1: Navigate to `https://design.company.com/dark-mode`
- Step 2: Screenshot
- Step 3: Extract text (selector: `.guidelines`)
- Input: "Plan dark mode implementation"
- Result: Agent-aware implementation plan!

---

## 📊 What Happens Behind the Scenes

```
User Request
    ↓
Dashboard UI
    ↓
MCP Server (localhost:3001)
    ↓
Browser Automation (optional)
    ↓
Claude AI API
    ↓
Intelligent Response
    ↓
Display in Dashboard
    ↓
Track Analytics ✨
```

---

## 📈 Analytics & Metrics

**The landing page shows:**
- 👥 Site visitors count
- 🤖 Total agent interactions
- 📊 Dashboard accesses
- 🎯 Per-agent interaction stats

All tracked automatically using browser localStorage.

---

## 🛠️ Key Files

```
├── landing-page/           # Public-facing showcase
│   ├── index.html         # Landing page with analytics display
│   ├── style.css          # Professional styling
│   └── script.js          # Analytics tracking
│
├── dashboard/              # Agent interface
│   ├── index.html         # Dashboard UI
│   ├── style.css          # Dashboard styling
│   └── app.js             # Dashboard logic
│
├── backend/               # Server logic
│   ├── mcp-server.js      # MCP server (localhost:3001)
│   ├── agent-engine.js    # Agent executor
│   ├── browser-manager.js # Puppeteer wrapper
│   └── agents-config.js   # Agent definitions (4 agents)
│
├── dashboard-server.js    # Web server (localhost:3002)
├── package.json          # Dependencies & scripts
├── .env                  # API key (create this)
├── README.md             # Project overview
├── USER_GUIDE.md         # How to use agents
├── DEPLOYMENT_GUIDE.md   # How to deploy publicly
└── QUICK_REFERENCE.md    # This file
```

---

## 🚀 Scripts

```bash
npm install              # Install all dependencies
npm start               # Start dashboard (3002) + MCP (3001)
npm run mcp            # Start just MCP server (3001)
npm run dashboard      # Start just dashboard (3002)
npm run start          # Same as npm start
```

---

## 🔐 Environment Variables

Create `.env` file:
```
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
```

Get your key from: https://console.anthropic.com

---

## 🌐 Deployment Quick Links

| Platform | Command | Live At |
|----------|---------|---------|
| **Netlify** | Push to GitHub | `https://your-site.netlify.app` |
| **Heroku** | `heroku create && git push heroku` | `https://your-app.herokuapp.com` |
| **Railway** | Connect repo at railway.app | `https://your-project.railway.app` |
| **Local** | `npm start` | `http://localhost:3002` |

Full guide: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## ❓ Common Questions

### Q: Where's my data stored?
**A:** Analytics live in browser localStorage. No server storage (for now).

### Q: Can I use this offline?
**A:** No - needs internet for Claude API calls. Dashboard needs MCP server.

### Q: How much does it cost?
**A:** You pay Claude API usage only (~$0.01-0.10 per agent run).

### Q: Can I customize the agents?
**A:** Yes! Edit `backend/agents-config.js` and update the system prompts.

### Q: How do I integrate with Claude Code?
**A:** MCP Server is already compatible. See README.md for usage examples.

### Q: What if agent response is wrong?
**A:** Refine your request:
- Be more specific
- Add browser steps for context
- Ask agent to reconsider

---

## 🐛 If Something Breaks

### Dashboard not loading?
```bash
npm start           # Restart all services
# If still broken, check:
# - Is port 3002 free? (lsof -i :3002)
# - Is .env file set? (cat .env)
```

### Agents not responding?
```bash
npm run mcp          # Restart MCP server
# Check:
# - Is CLAUDE_API_KEY valid?
# - Can you curl localhost:3001?
```

### Analytics not showing?
```javascript
// Check browser console:
localStorage.getItem('aiDevTeamAnalytics')
```

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| "Connection refused" | Start servers: `npm start` |
| "API key invalid" | Check .env file, get new key from console.anthropic.com |
| "Port already in use" | Kill process: `lsof -i :3002` then `kill -9 <PID>` |
| "Dashboard blank" | Refresh page, check console for errors |
| "Agent slow" | Normal! Can take 5-10 seconds. Try simpler request. |

---

## 🎉 You're Ready!

1. ✅ Servers running
2. ✅ Dashboard accessible
3. ✅ Analytics working
4. ✅ Agents ready to use
5. ✅ Documentation complete

**Next Steps:**
- 📖 Read USER_GUIDE.md for detailed examples
- 🚀 Deploy using DEPLOYMENT_GUIDE.md
- 💡 Customize agents in backend/agents-config.js
- 🤝 Share with your team!

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **README.md** | Project overview, features, architecture |
| **QUICK_START.md** | 5-minute setup guide |
| **USER_GUIDE.md** | Complete guide to using all 4 agents |
| **DEPLOYMENT_GUIDE.md** | Deploy to Netlify, Heroku, etc. |
| **DEMO_INSTRUCTIONS.md** | How to record a demo video |
| **This file** | Quick reference for everything |

---

**Happy building! 🚀**

For questions: Check docs, GitHub Issues, or ask Claude!
