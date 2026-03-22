# 📹 How to Record Your Demo Video (15 Minutes)

**Step-by-step guide to record a professional 3-minute demo**

---

## 📋 Before You Start (2 Minutes)

### 1. Download Screen Recorder
Choose ONE:
- **Windows**: Use built-in Xbox Game Bar (Windows Key + G)
- **Windows**: Download OBS Studio (free)
- **Mac**: QuickTime (built-in)
- **Any**: Camtasia (paid, easy)

### 2. Test Audio
- Plug in mic (or use built-in)
- Record 5 seconds of silence
- Check volume level (not too quiet, not too loud)

### 3. Prepare Workspace
- Close all notifications
- Close all browser tabs
- Only Terminal visible
- Font size: Ctrl++ to enlarge
- Clean desktop background

### 4. Start 3 Terminals
```bash
# Terminal 1 - Ready for: npm run dev
# Terminal 2 - Ready for: npm run cli
# Terminal 3 - Ready for: npm run demo
```

---

## 🎬 Recording (3 Minutes)

### SEGMENT 1: Introduction (0:00-0:30)

**What to do:**
1. Open README.md
2. Show project title and description
3. Point to key sections

**What to say (read naturally):**
```
"Hello, I'm presenting AI Dev Team Labs,
a production-ready multi-agent system for GitLab automation.

In the next 3 minutes, I'll show you:
1. How the system works
2. A live end-to-end demo
3. Real results from the database

Let's dive in!"
```

**Timing:** 30 seconds exactly

---

### SEGMENT 2: Architecture Overview (0:30-1:00)

**What to do:**
1. Show file structure (ls -la or file explorer)
2. Point to: backend/, cli/, prisma/
3. Show README architecture section

**What to say:**
```
"The system works like this:

1. GitLab sends a webhook when you push code
2. The webhook server receives it instantly
3. The event gets queued to our database
4. The orchestrator polls every 5 seconds
5. An intelligent agent analyzes the repository
6. Claude AI generates an onboarding guide
7. The system creates a GitLab issue
8. Everything is saved to the database

All automatically in about 10 seconds!"
```

**Timing:** 30 seconds exactly

---

### SEGMENT 3: Live Demo (1:00-2:00)

**STEP A: Start Webhook Server (0:10)**

Terminal 1:
```bash
npm run dev
```

Wait for output, then say:
```
"First, I'm starting the webhook server.
It's now listening on port 3000 for events.
Notice the green output - everything is ready."
```

**STEP B: Start Orchestrator (0:20)**

Terminal 2:
```bash
npm run cli
```

Wait for output, then say:
```
"Next, I start the orchestrator.
It will poll the database every 5 seconds
looking for events to process."
```

**STEP C: Run Demo (0:30)**

Terminal 3:
```bash
npm run demo
```

**As it runs, narrate:**

When you see "Sending webhook":
```
"Now I'm triggering a demo.
This simulates a real GitLab webhook.
Watch what happens..."
```

When you see "Webhook sent successfully":
```
"Event received! The webhook server
accepted it with HTTP 202 - Accepted."
```

When you see "Event queued":
```
"The event is now queued in our database.
Event ID 2 is ready for processing."
```

When you see "Waiting 8 seconds":
```
"Now we wait for the orchestrator
to pick it up and process it..."
```

When processing completes:
```
"Look at that! In just 8 seconds, the entire workflow completed:

✓ Webhook received
✓ Event queued
✓ Orchestrator found it
✓ Agent executed
✓ Guide was generated
✓ Saved to database

All automatically!"
```

**Timing:** 60 seconds total

---

### SEGMENT 4: Database Verification (2:00-2:50)

**What to do:**

Terminal 3:
```bash
npm run studio
```

(This opens Prisma Studio in your browser)

**In browser, show:**
1. Click "Event" table - show Event ID 2
2. Click "AgentRun" - show the agent execution
3. Click "OnboardingGuide" - show generated guide

**What to say:**
```
"Now let's look at the evidence in the database.
This is Prisma Studio - a database viewer.

[Show Events table]
Here's Event 2 from our demo.
Status: complete ✓

[Show AgentRun]
Here's the agent execution:
Agent: onboarding-copilot
Status: complete

[Show OnboardingGuide]
And here's the generated guide itself.
Full markdown content, ready to be posted as a GitLab issue.

In production, this automatically creates an issue
in your GitLab project."
```

**Timing:** 50 seconds exactly

---

### SEGMENT 5: Closing (2:50-3:00)

**What to do:**
- Show project stats (ls)
- Show GitHub/repo info
- Thank you

**What to say:**
```
"To summarize what you just saw:

✓ Event-driven architecture - instant response
✓ Intelligent AI agent - 6-step workflow
✓ Real API integration - GitLab + Claude
✓ Async processing - non-blocking
✓ Database persistence - all tracked
✓ Production-ready - built in 4 days

The complete source code is available on GitHub.
1,586 lines of production code.
All tested and documented.

Thanks for watching!"
```

**Timing:** 10 seconds exactly

---

## ⏱️ TIMING CHECKLIST

- [ ] Segment 1: 0:00-0:30 (30 sec) ✅
- [ ] Segment 2: 0:30-1:00 (30 sec) ✅
- [ ] Segment 3: 1:00-2:00 (60 sec) ✅
- [ ] Segment 4: 2:00-2:50 (50 sec) ✅
- [ ] Segment 5: 2:50-3:00 (10 sec) ✅
- [ ] **TOTAL: 3:00 minutes** ✅

---

## 🎥 Recording Tips

### Audio
- Speak clearly and naturally
- Pause between points
- Let important info sink in
- No rushing

### Video
- Point with mouse to highlight
- Keep text visible
- Show actual working code
- Demonstrate real output

### Pacing
- Not too fast (people need to understand)
- Not too slow (keep engagement)
- Practice once before final recording

---

## ✂️ OPTIONAL: Edit Your Video

### Audio Editing
- Remove long pauses
- Normalize volume
- Add intro music (5 sec, low volume)
- Add outro music (5 sec)

### Video Editing
- Add title slide (2 sec)
- Add transitions between segments
- Highlight important text (yellow border)
- Add final slide with links

### Export Settings
- Resolution: 1080p (or higher)
- Frame rate: 30fps
- Bitrate: 5Mbps
- Format: MP4 or WebM

---

## 📤 SAVING YOUR VIDEO

### File Format
```
FirstName_LastName_AIDevTeamLabs_Demo.mp4
```

### Quality Checklist
- [ ] Audio is clear
- [ ] Video is sharp
- [ ] Timing is exactly 3:00
- [ ] All segments visible
- [ ] No background noise
- [ ] Professional appearance

---

## 🎬 ACTUAL RECORDING WORKFLOW

### Quick Test Run (5 minutes)
1. Start all 3 terminals
2. Run through once without recording
3. Check that everything works
4. Fix any issues

### Final Recording (10 minutes)
1. Start screen recorder
2. Run through entire script (3:00)
3. Stop recording
4. Save file
5. Review (looks good? keep it. No? re-record)

### Total Time: ~15 minutes

---

## 💡 Pro Tips

✅ **Practice once** - Do a dry run first
✅ **Speak naturally** - Don't read robotically
✅ **Point and pause** - Let people see things
✅ **Show actual output** - Real working system
✅ **Stay energetic** - Enthusiasm matters
✅ **Good lighting** - Camera sees what you do
✅ **Clean background** - Professional appearance
✅ **Test mic** - Audio quality is important

---

## 🔧 TROUBLESHOOTING

**If demo hangs:**
- Press Ctrl+C
- Make sure servers are running
- Run npm run demo again

**If screen recorder crashes:**
- Use simpler software (OBS is stable)
- Lower resolution
- Close other programs

**If you mess up:**
- Stop recording
- Start over (no big deal!)
- Do as many takes as needed

**If timing is off:**
- Pause naturally between sections
- Speed up narration slightly
- Don't worry about being exact

---

## ✅ YOU'VE GOT THIS!

**Everything is ready:**
- Code: ✅ Working
- Demo: ✅ Tested
- Script: ✅ Here
- Timing: ✅ Planned
- Equipment: ✅ Prepared

**Now just record it! Takes 15 minutes total.**

---

## 📝 CHECKLIST BEFORE RECORDING

- [ ] Screen recorder installed/ready
- [ ] Microphone tested
- [ ] Background clean
- [ ] Font size enlarged
- [ ] All notifications disabled
- [ ] 3 terminals ready
- [ ] README open and visible
- [ ] npm run demo tested
- [ ] npm run studio tested
- [ ] Water nearby (don't dry out!)

**Ready? Hit record! 🎬**

---

**Questions? Re-read the section above.**
**Got this? Let's go record!** 🚀
