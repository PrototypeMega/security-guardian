# AI Dev Team - Demo Video Instructions (4-5 minutes)

**Record a compelling demo of your browser-enabled agent platform for the hackathon.**

---

## Pre-Recording Checklist

- [ ] MCP Server running: `npm run mcp`
- [ ] Dashboard open: http://localhost:3001
- [ ] Landing page bookmark ready: https://ai-dev-team-labs.netlify.app
- [ ] Screen recording software ready (OBS, ScreenFlow, QuickTime, etc.)
- [ ] Clear microphone for narration
- [ ] No distracting notifications on screen
- [ ] Browser zoomed to 125% for better visibility on video

---

## Demo Script (4-5 Minutes Total)

### SECTION 1: Introduction (0:00-0:20) - 20 seconds

**What to show:**
- Screen with project title: "AI Dev Team Labs - Browser-Enabled Agents for Claude Code"
- Show the landing page (https://ai-dev-team-labs.netlify.app) scrolling quickly

**Narration:**
"Introducing AI Dev Team - a complete platform of intelligent agents that can control the browser, integrate with Claude Code, and automate your development workflow.

We have 4 specialized agents: Onboarding Copilot, Feature Planner, Test Generator, and Security Patch Agent.

Today I'm showing you how these agents work and how easy they are to use."

---

### SECTION 2: Dashboard Overview (0:20-1:00) - 40 seconds

**What to show:**
1. Open http://localhost:3001 (the dashboard)
2. Point to the header: "Agent Dashboard"
3. Show the left panel with all 4 agents listed:
   - Onboarding Copilot
   - Feature Planner
   - Test Generator
   - Security Patch Agent

**Narration:**
"This is the Agent Dashboard - a simple interface where you can manage and test your agents.

On the left, you see our 4 intelligent agents. Each one is specialized for a specific task.

Let me demonstrate the Feature Planner agent, which converts feature requirements into detailed implementation plans."

---

### SECTION 3: Select & Configure Agent (1:00-2:00) - 60 seconds

**What to show:**
1. Click on "Feature Planner" agent
2. Show the right panel with:
   - Agent title and description
   - Browser Steps section (empty initially)
   - Agent Input textarea
3. Click "Add Step" button to show the modal
4. Add a browser step example:
   - Action: Navigate
   - URL: https://example.com/docs
5. Click "Add Step" to add it
6. Show the step appears in the list
7. Click "+Add Step" again
8. Add another step:
   - Action: Extract Text
   - Selector: .design-patterns

**Narration:**
"First, I'll select the Feature Planner agent. Notice the description - it converts feature requests into execution-ready implementation plans.

The key innovation here is that agents can now use browser automation. I can add browser steps that run before the agent reasons.

Let me add a step to navigate to the design documentation. [Click Add Step, fill in form, show step added]

Now I'll add another step to extract the current design patterns. [Repeat]

These browser steps allow the agent to gather real-world context - like design systems, API docs, or live examples - before creating the implementation plan."

---

### SECTION 4: Test the Agent (2:00-3:00) - 60 seconds

**What to show:**
1. In the "Agent Input" textarea, enter text:
   "Add dark mode toggle to the app following our design system guidelines"
2. Click "Test Agent" button
3. Show loading state
4. Show agent response appearing in results box (you can paste sample output if API call is slow)
5. Highlight interesting parts of the response

**Narration:**
"Now let's test the agent. I'll provide a feature request.

[Type feature request]

With the browser steps I set up, the agent will:
1. Navigate to our design documentation
2. Extract the current design patterns
3. Use that information to create an informed implementation plan

[Click Test Agent and show results]

Look at how detailed and specific the plan is. The agent understood our design system constraints and created a plan that fits our architecture."

---

### SECTION 5: Show Browser Step Details (3:00-3:45) - 45 seconds

**What to show:**
1. Scroll to see full agent response in results
2. Point out specific details like:
   - Implementation steps
   - Affected areas
   - Acceptance criteria
   - Test plan

**Narration:**
"Notice the comprehensive output. The agent provides:
- Clear implementation steps
- Files and components it will affect
- Acceptance criteria to verify it's complete
- A full test plan

All of this was generated while considering the real-world design constraints the agent gathered from browsing our docs.

This is exactly the kind of information developers need to start coding immediately."

---

### SECTION 6: Show Setup for Claude Code (3:45-4:30) - 45 seconds

**What to show:**
1. Scroll down to "Use in Claude Code" section
2. Click "Copy Setup Instructions" button
3. Show the modal with setup code
4. Point out the key commands:
   - `@mcp http://localhost:3001` (connect to server)
   - `@run_agent agent_id=feature-planner input="..."` (use agent)

**Narration:**
"Integration with Claude Code is simple. Just three steps:

1. Start the MCP server with one command
2. Connect to it in Claude Code
3. Use any agent with a simple mention

[Show the setup instructions]

For advanced use cases, you can even pass browser steps directly in the command. The agent will execute those steps before reasoning."

---

### SECTION 7: Closing Call-to-Action (4:30-5:00) - 30 seconds

**What to show:**
1. Go back to landing page
2. Show email signup section
3. Or show GitHub repo link

**Narration:**
"AI Dev Team brings sophisticated automation to your development workflow.

The agents are intelligent, the browser automation is powerful, and the integration with Claude Code is seamless.

Whether you're onboarding new contributors, planning features, ensuring test coverage, or managing security - we have an agent for that.

Get started today at https://ai-dev-team-labs.netlify.app

All the code is open source on GitHub. Try it out!"

---

## Recording Tips

1. **Audio Quality**: Use a good microphone, speak clearly and confidently
2. **Pacing**: Don't rush - give viewers time to read what's on screen
3. **Mouse Movement**: Move deliberately, avoid jerky movements
4. **Zoom**: Make sure text is readable at 1080p (consider zoom to 125%)
5. **No Errors**: Test the entire flow first without recording
6. **Background**: Keep desktop clean, no distracting notifications
7. **Music**: Optional - use royalty-free background music (keep volume low)

---

## Editing Tips (Post-Recording)

1. **Transitions**: Add 0.5s fade transitions between sections
2. **Text Overlays**: Add agent names as they're discussed
3. **Zoom**: Optionally zoom in on important UI elements
4. **Subtitles**: Add subtitles for accessibility (optional but impressive)
5. **Intro/Outro**: 2-second intro slate, 2-second outro with "Get Started"

---

## Upload to YouTube

1. Upload as "Unlisted" video (so only people with link can watch)
2. Title: "AI Dev Team - Browser-Enabled Agents for Claude Code"
3. Description:
```
AI Dev Team brings intelligent agents with browser automation to Claude Code.

🤖 Four Specialized Agents:
- Onboarding Copilot
- Feature Planner
- Test Generator
- Security Patch Agent

🌐 Browser Automation:
- Navigate websites
- Click, type, extract data
- Screenshot for context

⚡ Easy Integration:
- Start MCP server
- Connect in Claude Code
- Use agents with simple mentions

📱 Live Demo:
Dashboard: http://localhost:3001
Landing Page: https://ai-dev-team-labs.netlify.app
GitHub: https://github.com/yourusername/ai-dev-team-labs

🚀 Get Started:
npm install
npm run mcp
```

---

## Devpost Submission

When submitting to Devpost, use:
- **Video URL**: Your YouTube video link (unlisted)
- **Tagline**: "Browser-Enabled AI Agents for Claude Code"
- **Description**: Full product description (see README.md)
- **Demo Video**: Link to the video above
- **Try It**: Link to http://localhost:3001 OR https://ai-dev-team-labs.netlify.app
- **Code**: GitHub repo link
- **Tech Stack**: Node.js, Claude API, Puppeteer, Express, React

---

## Timing Guide

- Intro: 0:00-0:20 (20s)
- Dashboard: 0:20-1:00 (40s)
- Configure: 1:00-2:00 (60s)
- Test: 2:00-3:00 (60s)
- Details: 3:00-3:45 (45s)
- Setup: 3:45-4:30 (45s)
- Closing: 4:30-5:00 (30s)

**Total: 5 minutes**

---

Good luck! Your demo will be impressive! 🎬
