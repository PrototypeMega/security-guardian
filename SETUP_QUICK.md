# AI Dev Team - 5-Minute Setup Guide

**Browser-Enabled Agents for Claude Code**

## What You Get
- 4 AI Agents (Onboarding Copilot, Feature Planner, Test Generator, Security Patch Agent)
- Browser automation capabilities (navigate, click, type, screenshot, extract data)
- Interactive dashboard to test agents
- Full integration with Claude Code via MCP

## Prerequisites
- Node.js 16+ installed
- Claude API key (get one at https://console.anthropic.com)
- Chrome/Chromium browser for automated browser actions

## Quick Start (5 minutes)

### Step 1: Install Dependencies (1 min)
```bash
cd AI-Dev-Team-Labs
npm install
```

### Step 2: Set Environment Variables (1 min)
Create or update `.env` file:
```bash
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx   # Your Claude API key
MCP_PORT=3001
```

### Step 3: Start the MCP Server (1 min)
```bash
npm run mcp
```

You should see:
```
🚀 AI Dev Team - MCP Server
✓ Browser launched successfully
✓ Loaded 4 agents
✓ MCP Server running on http://localhost:3001
```

### Step 4: Open Dashboard (1 min)
Open browser to: **http://localhost:3001**

You should see:
- 4 agents listed (Onboarding Copilot, Feature Planner, Test Generator, Security Patch Agent)
- Dashboard for testing agents
- Browser step editor

### Step 5: Test an Agent (1 min)
1. Click "Onboarding Copilot"
2. Enter input: "Help me get started with this repository"
3. Click "Test Agent"
4. See the agent response!

## Integration with Claude Code

### In Claude Code IDE
1. Connect to MCP server:
```
@mcp http://localhost:3001
```

2. Use an agent:
```
@run_agent agent_id=feature-planner input="Add dark mode toggle"
```

3. With browser automation:
```
@run_agent agent_id=feature-planner input="Plan this feature" browser_steps=[
  {"action": "navigate", "url": "https://design.example.com"},
  {"action": "screenshot"}
]
```

## Available Tools

### Agent Tools
- `run_agent` - Execute any of the 4 agents
- `list_agents` - See available agents

### Browser Tools
- `browser_navigate(url)` - Navigate to URL
- `browser_click(selector)` - Click element
- `browser_type(selector, text)` - Type text
- `browser_extractText(selector)` - Get page content
- `browser_screenshot()` - Capture page
- `browser_waitFor(selector, timeout)` - Wait for element
- `browser_submit(selector)` - Submit form
- `browser_scroll(direction, amount)` - Scroll page

## Troubleshooting

### "Failed to connect to MCP server"
- Make sure `npm run mcp` is running
- Check that `MCP_PORT=3001` is set in `.env`
- Verify no other process is using port 3001

### "Browser failed to initialize"
- Make sure Chrome/Chromium is installed
- Try: `npm run mcp` will show more details
- Browser features work but you won't see the browser window

### "Claude API error"
- Verify your `CLAUDE_API_KEY` in `.env`
- Key should start with `sk-ant-`
- Get a new key at https://console.anthropic.com

## Next Steps

- **Dashboard**: Test agents visually, add browser steps
- **Claude Code**: Use agents in your development workflow
- **Customize**: Create your own agents by editing `backend/agents-config.js`
- **Documentation**: See `AGENT_INTEGRATION.md` for advanced usage

## Support

- MCP Server: http://localhost:3001
- Dashboard: http://localhost:3001 (will open automatically when you visit the server URL)
- GitHub: https://github.com/yourusername/ai-dev-team-labs
- Docs: Check README.md and other markdown files

---

**Happy automating!** 🤖
