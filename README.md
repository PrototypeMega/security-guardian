# AI Dev Team Labs 🤖

**Browser-Enabled Agents for Claude Code**

A complete AI agent platform that integrates with Claude Code, giving your 4 specialized agents full browser automation capabilities. Create agents visually, save them locally, and use them directly in your IDE.

---

## 📦 What's Included

### 1. **4 Intelligent AI Agents**
- **Onboarding Copilot**: Helps new contributors ramp up fast with repo context, checklists, and starter tasks
- **Feature Planner**: Converts requirements into execution-ready implementation plans
- **Test Generator**: Identifies missing tests and recommends test strategies
- **Security Patch Agent**: Reviews vulnerabilities and proposes low-risk fixes

### 2. **Browser Automation Layer**
- Full browser control via Puppeteer (navigate, click, type, screenshot, extract data)
- Agents can browse web pages to gather context for better decisions
- Real-time browser step testing in the dashboard
- Example: Feature Planner can check design docs before creating implementation plan

### 3. **MCP Server** (Model Context Protocol)
- Exposes all 4 agents + browser tools to Claude Code
- Local execution (localhost:3001)
- One-command startup (`npm run mcp`)
- Drop-in integration with Claude Code

### 4. **Interactive Dashboard**
- Beautiful UI to test agents visually
- Browser step editor (no coding required)
- Real-time execution logs
- Copy-paste setup instructions for Claude Code

### 5. **Professional Landing Page**
- Live at https://ai-dev-team-labs.netlify.app/
- Showcases all 4 agents
- Email lead capture
- One-click setup guide

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set API Key
```bash
# Create .env file
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx   # Your Claude API key from https://console.anthropic.com
```

### Step 3: Start MCP Server
```bash
npm run mcp
```
See: `✓ MCP Server running on http://localhost:3001`

### Step 4: Open Dashboard
Go to **http://localhost:3001** in your browser

### Step 5: Test an Agent
1. Click "Onboarding Copilot"
2. Enter: "Help me get started with this repository"
3. Click "Test Agent"
4. Watch the magic happen! 🎉

---

## 💡 Use Cases

### With Browser Automation
- **Feature Planner** checks design system docs before creating implementation plan
- **Security Patch Agent** reviews CVE databases for context on vulnerability
- **Test Generator** visits live app to understand current behavior before recommending tests
- **Onboarding Copilot** checks GitHub README and repo structure in real-time

### In Claude Code
```
@mcp http://localhost:3001
@run_agent agent_id=feature-planner input="Add dark mode toggle"
```

With browser steps:
```
@run_agent agent_id=feature-planner input="Plan this feature" browser_steps=[
  {"action": "navigate", "url": "https://docs.example.com/design"},
  {"action": "screenshot"}
]
```

---

## 📋 Files & Structure

```
AI-Dev-Team-Labs/
├── README.md                          # This file
├── QUICK_SETUP.md                     # ⭐ Step-by-step 15-min setup guide
├── AGENTS_SETUP_GUIDE.md              # Detailed agent creation guide
├── AGENTS.md                          # Agent context (read by GitLab)
├── .gitlab/duo/
│   ├── chat-rules.md                  # Output customization
│   └── mr-review-instructions.yaml    # MR review rules
└── landing-page/
    ├── index.html                     # Landing page (visible in preview)
    ├── style.css                      # Responsive styling
    ├── script.js                      # Form handling
    ├── netlify.toml                   # Netlify config
    └── README.md                      # Landing page setup guide
```

---

## 🎯 How It Works

### Agent Workflow
```
1. Mention Agent in Issue/MR
   ↓
2. Agent reads repository context
   ↓
3. Agent processes using Claude AI
   ↓
4. Response posted as comment
   ↓
5. Developer gets actionable guidance
```

### Flow Workflow
```
1. Flow triggered by mention or assignment
   ↓
2. Flow calls appropriate agents in sequence
   ↓
3. Results synthesized into single response
   ↓
4. Posted as issue/MR comment
   ↓
5. Developers get complete picture
```

---

## 💻 System Prompts

All agent system prompts are included in `QUICK_SETUP.md`. Each agent has:
- **Clear purpose** - What the agent does
- **Step-by-step instructions** - How to approach the task
- **Output format** - Structure for responses
- **Examples** - Show expected results

---

## 🌐 Landing Page

Professional marketing site at `landing-page/`

**Sections:**
- Hero with value proposition
- 4 agent feature cards
- How it works (3-step flow diagram)
- Benefits (impact statistics)
- Use cases (testimonials)
- Email signup form
- Responsive design (works on all devices)

**Deploy to Netlify:**
```bash
# Go to netlify.com → New site from Git
# Select: perfectra1n/claude-code-sync
# Base directory: landing-page
# Deploy
```

**Form Submissions:**
- Saved to browser localStorage by default
- View in console: `localStorage.getItem('aiDevTeamLeads')`
- Optional: Connect to GitHub Issues, email, or backend

---

## 🧪 Testing

### Test Agents
1. Create test issue
2. Mention agent: `@Onboarding-Copilot`
3. Wait 30-60 sec for response
4. Check response format and content

### Test Flows
1. Create issue → Mention flow
2. Or assign flow as MR reviewer
3. Verify flow calls correct agents
4. Check synthesized response

### Test Landing Page
1. Visit your Netlify URL
2. Fill email form → Should see success message
3. Check localStorage for submission
4. Test mobile layout (resize browser)

---

## 📊 Use Cases

### For Engineering Managers
- **Faster Onboarding**: New team members productive in hours, not days
- **Automated Insights**: Common patterns detected automatically

### For Security Teams
- **Continuous Scanning**: Every MR reviewed for security concerns
- **Automated Fixes**: Low-risk patches suggested automatically

### For Tech Leads
- **Code Quality**: Tests recommended automatically
- **Architecture Help**: Implementation plans suggest best practices

### For Developers
- **Feature Planning**: Turn requirements into implementation steps
- **Testing Guidance**: Never miss test coverage again

---

## 🚢 Deployment

### Agents & Flows
- **Where**: GitLab Duo Agent Platform (in your project)
- **Setup**: Manual clicks in GitLab UI (10 minutes)
- **Cost**: Included with GitLab Premium+
- **Scale**: Works on any size project

### Landing Page
- **Where**: Netlify (free tier)
- **Setup**: Connect GitHub → Auto-deploy
- **Cost**: Free (generous free tier)
- **Performance**: Instant (CDN, <1s load)

---

## 📱 Demo

Record a 3-minute video showing:
1. **Landing page** (0:00-0:30)
   - Show hero + agent cards
   - Show email signup form

2. **Agent in action** (0:30-1:30)
   - Mention Onboarding Copilot on issue
   - Show checklist + starter tasks response

3. **Flow in action** (1:30-2:30)
   - Assign Security Patch Agent as MR reviewer
   - Show security + test review response

4. **Closing** (2:30-3:00)
   - Show all 4 agents
   - Show landing page again
   - Pitch the product

---

## 🔧 Configuration

### Customize Agents
Edit agent system prompts in `QUICK_SETUP.md` → Update in GitLab UI

### Customize Output
Edit `.gitlab/duo/chat-rules.md` → Agents pick up changes automatically

### Customize Flows
Edit flow descriptions in GitLab UI → Affects how flows respond

### Customize Landing Page
Edit `landing-page/index.html` → Push to git → Netlify redeploys automatically

---

## 📚 Documentation

- **`QUICK_SETUP.md`** - ⭐ Start here! 15-minute setup
- **`AGENTS_SETUP_GUIDE.md`** - Detailed agent creation
- **`landing-page/README.md`** - Landing page setup
- **`AGENTS.md`** - Agent context (used by GitLab)
- **`.gitlab/duo/`** - GitLab Duo customization files

---

## 🎓 How to Use

### As a Developer
```
1. See a feature request
2. Mention @Feature-Planner
3. Get implementation plan
4. Create MR with changes
5. Assign @Security-Patch-Agent as reviewer
6. Get test + security recommendations
7. Fix and iterate
```

### As a Tech Lead
```
1. New contributor joins
2. Create "Welcome" issue
3. Mention @Onboarding-Copilot
4. Send them the checklist
5. They're productive in 30 min instead of 2 days
```

### As a Security Lead
```
1. Vulnerability scan finds issues
2. Post to MR
3. Assign @Security-Patch-Agent
4. Get risk assessment + fix recommendations
5. Propose low-risk remediation
```

---

## 💡 Key Features

✅ **Works directly in GitLab** - No new tools, no context switching
✅ **Intelligent agents** - Claude-powered reasoning
✅ **Pre-built flows** - Common patterns automated
✅ **Repository-aware** - Understands your project structure
✅ **Production-ready** - Secure, reliable, scalable
✅ **Easy to customize** - Edit prompts, not code
✅ **Professional landing page** - Capture early access interest
✅ **Mobile-responsive** - Works on all devices

---

## 🎯 Hackathon Goals

✅ **4 working agents** - All deployed and responding
✅ **3 automation flows** - Wired and tested
✅ **Professional landing page** - Live on Netlify
✅ **Demo video** - Shows complete workflow
✅ **Documentation** - Clear setup + usage guides
✅ **Production-ready** - Secure, reliable, maintainable

---

## 🔗 Links

- **Repository**: https://github.com/perfectra1n/claude-code-sync
- **Landing Page**: (deployed to Netlify)
- **GitLab Project**: (your project URL)
- **GitLab Duo Docs**: https://docs.gitlab.com/ee/user/ai_features.html

---

## 📝 Next Steps

1. **Read `QUICK_SETUP.md`** - Follow the 15-minute setup
2. **Create agents** - Copy-paste system prompts in GitLab UI
3. **Create flows** - Wire agents to automate workflows
4. **Deploy landing page** - Click "Deploy" on Netlify
5. **Test everything** - Mention agents, test flows
6. **Record demo** - Show it working end-to-end
7. **Submit** - GitHub repo + landing page URL + demo video

---

## ❓ FAQ

**Q: Do I need GitLab Premium?**
A: Yes, Duo Agent Platform requires Premium+ tier.

**Q: Can I customize agent behavior?**
A: Yes! Edit system prompts in QUICK_SETUP.md, update in GitLab UI.

**Q: Does landing page need backend?**
A: No! Form submissions save to browser localStorage by default.

**Q: How long to set everything up?**
A: ~15 minutes for agents + flows, ~5 minutes for landing page.

**Q: Can agents create merge requests?**
A: They can propose changes in comments, but pushing requires additional setup.

**Q: Is there a cost?**
A: Agents require GitLab Premium+ (your project already has this). Landing page is free (Netlify).

---

## 🙌 Credits

Built for GitLab Duo Agent Platform hackathon.

Technologies:
- GitLab Duo Agent Platform
- Claude AI (system prompts)
- Netlify (hosting)
- HTML5/CSS3/JavaScript (landing page)

---

**Ready to automate your dev team? Start with `QUICK_SETUP.md`!** 🚀
