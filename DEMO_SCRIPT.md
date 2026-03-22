# 3-Minute Demo Video Script

**For Hackathon Submission**

Use this script to record a professional 3-minute demo of your AI Dev Team Labs system.

---

## 📹 Recording Setup

### Equipment Needed
- Screen recording software (OBS, ScreenFlow, Camtasia, etc.)
- Microphone (can use built-in)
- Terminal (zoom in text for visibility)

### Before Recording

1. **Close distractions**
   - Notifications off
   - Only needed terminals visible
   - Clean desktop

2. **Test audio**
   - Record 5 seconds
   - Check volume and clarity

3. **Prepare terminals**
   - Terminal 1: Ready to run `npm run dev`
   - Terminal 2: Ready to run `npm run cli`
   - Terminal 3: Ready to run `npm run demo`

4. **Optionally: Font size**
   - Make terminal font larger (Ctrl++ or Cmd++
)
   - Make text readable on video

---

## ⏱️ Script Timeline (3 Minutes)

### [0:00-0:30] Introduction (30 seconds)

**What to say:**
```
"Hello, I'm presenting AI Dev Team Labs, a production-ready 
multi-agent system for GitLab automation.

In the next 3 minutes, I'll show you:
1. The complete system architecture
2. A live end-to-end demo
3. How it works with real GitLab projects

Let's dive in!"
```

**What to show:**
- Open the project folder
- Show README.md briefly (scroll through)
- Show project structure (ls -la or file explorer)

**Visual cues:**
- Keep text on screen
- Point to key files
- Use cursor to highlight

---

### [0:30-1:00] System Overview (30 seconds)

**What to say:**
```
"The system works like this:
1. GitLab sends a webhook when you push code
2. The webhook server receives and queues the event
3. The orchestrator polls every 5 seconds
4. An intelligent agent analyzes your repository
5. Claude AI generates an onboarding guide
6. A GitLab issue is created automatically
7. Everything is saved to the database

All in 10 seconds or less, async processing!"
```

**What to show:**
- Show architecture diagram (open README.md)
- Highlight the event flow
- Show file structure: backend/, cli/, prisma/

**Visual cues:**
- Read key points from screen
- Let architecture sink in
- Build excitement for demo

---

### [1:00-2:00] Live Demo (60 seconds)

**What to do - Terminal 1:**

```bash
npm run dev
```

Wait for output:
```
🚀 AI Dev Team Labs - Webhook Server
Listening on http://localhost:3000
Webhook endpoint: POST http://localhost:3000/webhooks/gitlab
```

**What to say:**
```
"First, I'm starting the webhook server. 
It's now listening for events on port 3000.
This validates webhook signatures and queues events to our database."
```

---

**What to do - Terminal 2:**

```bash
npm run cli
```

Wait for output:
```
🤖 AI Dev Team Labs - Event Orchestrator
Polling for queued events every 5 seconds...
```

**What to say:**
```
"Next, I start the event orchestrator.
It polls the database every 5 seconds looking for queued events.
When it finds one, it dispatches it to our agent."
```

---

**What to do - Terminal 3:**

```bash
npm run demo
```

**What to say as it runs:**
```
"Now let's trigger the demo. This simulates a real GitLab webhook.

[As output appears]

You can see the system in action:
- Webhook received (HTTP 202 - Accepted)
- Event queued to database (Event ID 2)
- Waiting for orchestrator...

[After processing]

Look at that! In just 8 seconds:
✓ Webhook received
✓ Event queued
✓ Orchestrator processed
✓ Agent executed
✓ Guide generated
✓ Saved to database

The agent analyzed the repository, called Claude AI to generate 
an intelligent onboarding guide, and saved everything to the database.
All automatically!"
```

---

### [2:00-2:50] Real Integration (50 seconds)

**What to show:**

```bash
npm run studio
```

**What to say:**
```
"Now let's look at the database. 
This is Prisma Studio - a browser-based database viewer.

[Show the events table]

Here you can see:
- Event ID 2 (from our demo)
- Status: complete (it succeeded!)
- All the event details

[Click to Agent Runs tab]

And here are the agent runs:
- Agent: onboarding-copilot
- Status: complete
- Output shows the guide was generated

[Click to OnboardingGuides tab]

And here's the generated guide itself:
- Guide ID: cmn2c0par0000tqltwarad500
- Content: Full markdown onboarding guide
- Starter issues: 2 generated
- Would be posted as a GitLab issue

This is what it looks like in production with a real GitLab project.
The only difference is the issue actually appears in GitLab!"
```

---

### [2:50-3:00] Closing (10 seconds)

**What to say:**
```
"To recap:

✓ Event-driven architecture
✓ Intelligent AI agent
✓ Real API integration (GitLab + Claude)
✓ Async processing with database persistence
✓ Production-ready code
✓ Built in 4 days

The complete source code is available on GitHub.
Thanks for watching!"
```

**What to show:**
- Show GitHub/GitLab link (if applicable)
- Show project stats (1,586 lines of code)
- Optional: Show one of the feature files

---

## 🎬 Recording Checklist

- [ ] Microphone working
- [ ] Screen recording software ready
- [ ] Terminals prepared with correct commands
- [ ] Font size increased for readability
- [ ] No notifications or pop-ups
- [ ] Workspace clean
- [ ] Background blur or professional background
- [ ] Good lighting
- [ ] Test recording first

---

## ✂️ Editing (Optional)

### Audio
- Remove "umm" and "uh" filler words
- Normalize volume
- Add intro music (5 seconds, low volume)
- Add outro music (5 seconds)

### Video
- Add title slide (0-2 sec)
- Transitions between sections (subtle fades)
- Highlight important output (green border, color key)
- Add captions for key points
- Ending slide with contact/links (last 5 sec)

### Format
- **Resolution:** 1080p or 4K
- **Frame rate:** 30fps
- **Bitrate:** 5Mbps
- **Format:** MP4 or WebM

---

## 📤 Submission

### File Name
```
YourName_AIDevTeamLabs_Demo.mp4
```

### Video Description
```
AI Dev Team Labs - Hackathon Demo

Production-ready multi-agent system for GitLab automation.

Watch as the system:
✓ Receives a GitLab webhook
✓ Queues the event
✓ Analyzes the repository
✓ Generates an intelligent onboarding guide using Claude AI
✓ Creates a GitLab issue automatically
✓ Saves everything to the database

All in 10 seconds!

Technologies:
- Node.js + Express
- GitLab API
- Claude AI (Anthropic)
- SQLite + Prisma
- Event-driven architecture

Code: [link to repo]
Docs: [link to setup guide]
```

---

## 🎥 Pro Tips

1. **Speak clearly** - Important for understanding
2. **Pause between points** - Let each feature sink in
3. **Point to text** - Use cursor/mouse to highlight
4. **Show actual code** - Open a file to show architecture
5. **Keep pace** - Not too fast, not too slow
6. **Practice once** - Do a test run before final recording
7. **Background** - Clean, professional environment
8. **Energy** - Be enthusiastic about your project!

---

## ⏰ Timing Breakdown

- Intro: 30 sec
- Overview: 30 sec
- Demo: 60 sec (the main event!)
- Database: 40 sec (show proof)
- Closing: 20 sec
- **Total: 3:00 minutes**

---

**Ready to record? You've got this! 🚀**
