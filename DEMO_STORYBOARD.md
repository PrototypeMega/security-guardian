# 🎨 Security Guardian - Demo Video Storyboard

**Visual guide for creating your demonstration video**

---

## 📐 Storyboard Layout

Each scene includes: **Time** | **Visual** | **Audio/Text** | **Duration**

---

## Scene 1: Title Card (0:00 - 0:15)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│              🔒 SECURITY GUARDIAN                       │
│                                                         │
│        Autonomous AI Security Agent for GitLab         │
│                                                         │
│            GitLab AI Hackathon 2026                    │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘

Duration: 15 seconds
Music: Subtle tech background
Narration: "Introducing Security Guardian - an intelligent AI
           agent that automatically reviews your code for
           security vulnerabilities."
```

---

## Scene 2: Problem Statement (0:15 - 0:35)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ❌ THE SECURITY CHALLENGE                            │
│                                                         │
│  • Manual code reviews take hours                      │
│  • Vulnerabilities slip through                        │
│  • Security knowledge gaps on teams                    │
│  • Compliance violations go undetected                 │
│                                                         │
│                                                         │
│  ✅ THE SOLUTION: Security Guardian                   │
│                                                         │
│  Autonomous AI-powered security scanning              │
│  Intelligent fix generation                           │
│  Real-time merge request integration                  │
│                                                         │
└─────────────────────────────────────────────────────────┘

Duration: 20 seconds
Visual: Red X's and check marks transitioning
Narration: "Security reviews can be slow and error-prone.
           That's where Security Guardian comes in."
```

---

## Scene 3: Architecture Diagram (0:35 - 1:00)

```
┌──────────────────────────────────────────────────────────┐
│  HOW SECURITY GUARDIAN WORKS                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1️⃣  Merge Request Created                             │
│      ↓                                                   │
│  2️⃣  Agent Triggered                                   │
│      ↓                                                   │
│  3️⃣  Claude AI Analyzes Code                           │
│      ↓                                                   │
│  4️⃣  Vulnerabilities Detected                          │
│      ↓                                                   │
│  5️⃣  Fixes Generated & Posted                          │
│      ↓                                                   │
│  6️⃣  Auto-Fix Commit Created                           │
│                                                          │
└──────────────────────────────────────────────────────────┘

Duration: 25 seconds
Animation: Numbered boxes with arrows, each appearing sequentially
Narration: "Here's how it works. When a merge request is created,
           Security Guardian automatically analyzes the code using
           Claude AI, identifies vulnerabilities, generates fixes,
           and posts everything back to the merge request."
```

---

## Scene 4: Code Examples (1:00 - 1:35)

### 4A: Vulnerable Code

```
┌─────────────────────────────────────────────────────────┐
│  VULNERABLE CODE DETECTED                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  // ❌ HARDCODED API KEY                              │
│  const API_KEY = "sk-1234567890abcdefghij";           │
│                                                         │
│  // ❌ SQL INJECTION VULNERABLE                       │
│  const query = `SELECT * FROM users WHERE id = $     │
│  {userId}`;                                           │
│                                                         │
│  // ❌ INSECURE RANDOM                                │
│  const token = Math.random().toString(36);            │
│                                                         │
│  // ❌ eval() USAGE                                   │
│  const result = eval(userExpression);                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

Duration: 15 seconds
Visual: Code with red highlighting on vulnerable lines
Narration: "For example, here's code with four critical
           vulnerabilities that Security Guardian detects."
```

### 4B: Scanner Output

```
┌──────────────────────────────────────────────────────────┐
│ $ node scripts/test-scanner.js                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🔒 Security Guardian - Vulnerability Scanner Test     │
│                                                          │
│  📂 Scanning: examples/vulnerable-code.js              │
│                                                          │
│  📊 SCAN SUMMARY                                        │
│  ═══════════════════════════════════════════════════   │
│  Total Issues Found: 4                                  │
│    🔴 Critical:  2                                      │
│    🟠 High:      2                                      │
│    🟡 Medium:    0                                      │
│                                                          │
│  🔍 DETAILED FINDINGS                                   │
│  ═══════════════════════════════════════════════════   │
│                                                          │
│  1. 🔴 HARDCODED_SECRET                                │
│     Severity: CRITICAL                                  │
│     Message: Hardcoded API key detected                │
│     Fix: Move to environment variable                  │
│                                                          │
│  2. 🔴 SQL_INJECTION_VULNERABLE                        │
│     Severity: CRITICAL                                  │
│     Message: Potential SQL injection detected          │
│     Fix: Use parameterized queries                     │
│                                                          │
│  3. 🟠 INSECURE_RANDOM                                 │
│     Severity: HIGH                                      │
│     Message: Math.random() not cryptographically secure│
│     Fix: Use crypto.randomBytes()                      │
│                                                          │
│  4. 🟠 EVAL_USAGE                                      │
│     Severity: HIGH                                      │
│     Message: eval() allows arbitrary code execution    │
│     Fix: Use Function constructor                      │
│                                                          │
│  ✅ TEST COMPLETE                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘

Duration: 20 seconds
Visual: Terminal showing scanner output in real-time
Narration: "Security Guardian scans the code and instantly
           identifies all four vulnerabilities with severity
           levels and actionable fix suggestions."
```

---

## Scene 5: MR Comment Generated (1:35 - 2:10)

```
┌──────────────────────────────────────────────────────────┐
│  MERGE REQUEST - SECURITY REVIEW                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ## 🔒 Security Guardian Review                        │
│                                                          │
│  ### Summary                                            │
│  ╔════════════╦═══════╗                                 │
│  ║ Severity   ║ Count ║                                 │
│  ╠════════════╬═══════╣                                 │
│  ║ 🔴 Critical║   2   ║                                 │
│  ║ 🟠 High    ║   2   ║                                 │
│  ║ 🟡 Medium  ║   0   ║                                 │
│  ║ Total      ║ **4** ║                                 │
│  ╚════════════╩═══════╝                                 │
│                                                          │
│  ### Findings                                            │
│                                                          │
│  #### 1. 🔴 HARDCODED_SECRET                           │
│  **Severity:** CRITICAL                                 │
│  **Message:** Hardcoded API key detected               │
│  **Fix:** Move to environment variable or GitLab       │
│          CI/CD secret                                   │
│                                                          │
│  #### 2. 🔴 SQL_INJECTION_VULNERABLE                   │
│  **Severity:** CRITICAL                                 │
│  **Message:** Potential SQL injection                  │
│  **Fix:** Use parameterized queries with placeholders  │
│                                                          │
│  [... more findings ...]                               │
│                                                          │
│  ### Actions Taken                                      │
│  ✅ **3 fixes generated**                              │
│  📝 [View auto-fix commit](link)                       │
│                                                          │
│  ---                                                     │
│  *Automated security review by Security Guardian*      │
│                                                          │
└──────────────────────────────────────────────────────────┘

Duration: 35 seconds
Visual: Scrolling through the MR comment, highlighting key sections
Narration: "Security Guardian then automatically posts a detailed
           security review comment to your merge request. It shows
           all vulnerabilities organized by severity, provides
           specific fix recommendations, and can even create an
           auto-fix commit with the patches applied."
```

---

## Scene 6: Key Metrics & Benefits (2:10 - 2:35)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  🎯 KEY METRICS                                         │
│                                                          │
│  ⚡ 70% Faster Security Reviews                         │
│  🔍 8+ Vulnerability Types Detected                     │
│  🤖 Powered by Claude 3.5 Sonnet                       │
│  ✅ Production-Ready Code                              │
│  🏆 GitLab Duo Agent Platform                          │
│                                                          │
│  ═══════════════════════════════════════════════════   │
│                                                          │
│  ✨ WHY SECURITY GUARDIAN WINS                         │
│                                                          │
│  ✓ Uses Official GitLab Platform                       │
│  ✓ Intelligent AI-Powered Fixes                        │
│  ✓ Team Education & Learning                           │
│  ✓ Deployable Immediately                              │
│  ✓ Sustainable & Scalable                              │
│                                                          │
└──────────────────────────────────────────────────────────┘

Duration: 25 seconds
Visual: Animated bullet points appearing one by one
Narration: "Security Guardian delivers significant benefits:
           it's 70% faster than manual reviews, detects 8+ types
           of vulnerabilities, uses Claude's advanced AI for
           intelligent fixes, and it's production-ready right now
           using GitLab's official Duo Agent Platform."
```

---

## Scene 7: Call to Action (2:35 - 3:00)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│           🚀 READY TO SECURE YOUR CODE?                │
│                                                          │
│                                                          │
│         Deploy Security Guardian Today!                 │
│                                                          │
│                                                          │
│      🔗 github.com/ai-dev-team-labs/                   │
│           security-guardian                            │
│                                                          │
│      📊 devpost.com/software/                          │
│           security-guardian                            │
│                                                          │
│      📖 Full documentation included                    │
│      🎓 Easy setup - 5 minutes                         │
│      💡 Accelerate your team's security               │
│                                                          │
│           Security Guardian:                            │
│       Where AI Meets Application Security               │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘

Duration: 25 seconds
Visual: Animated text and icons
Music: Uplifting tech music
Narration: "Security Guardian is ready to transform your
           security review process. Deploy it to your GitLab
           today and experience security reviews reimagined
           by AI. Security Guardian - where artificial
           intelligence meets application security."
```

---

## 📊 Visual Elements Checklist

### Colors to Use:
- 🔴 **Critical Red:** #E74C3C
- 🟠 **High Orange:** #E67E22
- 🟡 **Medium Yellow:** #F39C12
- 🟢 **Low Green:** #27AE60
- 🔵 **Primary Blue:** #3498DB
- ⚫ **Background Dark:** #1E1E1E or #2C2C2C

### Font Recommendations:
- **Header:** Bold Sans Serif (e.g., Roboto Bold, Montserrat)
- **Body:** Clean Sans Serif (e.g., Inter, Segoe UI)
- **Code:** Monospace (e.g., Fira Code, Inconsolata)

### Icons to Include:
- 🔒 Lock (security)
- 🤖 Robot (AI)
- ✅ Checkmark (success)
- ⚡ Lightning (speed)
- 💡 Lightbulb (insights)
- 🎯 Target (focus)

---

## 🎬 Transitions Between Scenes

| From Scene | To Scene | Transition Type | Duration |
|-----------|----------|-----------------|----------|
| 1 → 2 | Fade to Black | Crossfade | 0.5s |
| 2 → 3 | Slide Right | Wipe | 0.5s |
| 3 → 4 | Zoom In | Zoom | 0.3s |
| 4 → 5 | Fade to Black | Crossfade | 0.5s |
| 5 → 6 | Slide Left | Wipe | 0.5s |
| 6 → 7 | Fade to Black | Crossfade | 0.5s |

---

## 🔊 Audio Mix

### Background Music:
- Tech/Startup vibe (royalty-free)
- Volume: 20-30% during narration
- Volume: 60-80% during text-only scenes

### Narration:
- Clear, professional tone
- Speed: Normal pace (not rushed)
- Volume: 100%

### Sound Effects (Optional):
- Subtle "whoosh" for transitions (10%)
- Keyboard typing sounds for code (20%)
- Success chime at end (50%)

---

## 📱 Export Settings

**For Different Platforms:**

| Platform | Resolution | Format | Duration |
|----------|-----------|--------|----------|
| DevPost | 1920x1080 | MP4 | 2-3 min |
| YouTube | 1920x1080 | MP4 | 2-3 min |
| LinkedIn | 1080x1080 | MP4 | 1-2 min |
| Twitter | 1200x675 | MP4 | <60s |

---

## 📝 Scene Timing Summary

```
Scene 1: Title Card           0:00 - 0:15  (15s)
Scene 2: Problem Statement    0:15 - 0:35  (20s)
Scene 3: Architecture          0:35 - 1:00  (25s)
Scene 4: Code Examples        1:00 - 1:35  (35s)
Scene 5: MR Comment           1:35 - 2:10  (35s)
Scene 6: Key Metrics          2:10 - 2:35  (25s)
Scene 7: Call to Action       2:35 - 3:00  (25s)
                              ─────────────────
                    Total Duration: ~3:00
```

---

## 🎥 Tools for Creating This Storyboard

### Recording Your Demo:
1. **Loom** - Easiest (loom.com)
2. **OBS Studio** - Most control (free)
3. **ScreenFlow** - Mac native
4. **Camtasia** - Professional
5. **Synthesia** - AI presenter (optional)

### Editing:
1. **DaVinci Resolve** - Free professional editor
2. **Adobe Premiere** - Industry standard
3. **Final Cut Pro** - Mac native
4. **CapCut** - Quick & easy

### Music & SFX:
1. **Epidemic Sound** - Royalty-free (paid)
2. **Bensound** - Royalty-free (free)
3. **Pixabay** - Royalty-free music
4. **Freesound** - Sound effects

---

## ✅ Production Checklist

- [ ] Record Scene 1 - Title Card
- [ ] Record Scene 2 - Problem Statement
- [ ] Record Scene 3 - Architecture Diagram
- [ ] Record Scene 4A - Vulnerable Code
- [ ] Record Scene 4B - Scanner Output
- [ ] Record Scene 5 - MR Comment
- [ ] Record Scene 6 - Key Metrics
- [ ] Record Scene 7 - Call to Action
- [ ] Record Voiceover narration
- [ ] Add background music
- [ ] Add transitions between scenes
- [ ] Add text overlays & titles
- [ ] Color correct all scenes
- [ ] Add subtitles/captions
- [ ] Export in all required formats
- [ ] Test playback on different browsers
- [ ] Upload to DevPost
- [ ] Share on social media

---

## 🎬 Quick Start Recipe

**Fastest way to create demo video (30 minutes):**

1. Open Loom (loom.com)
2. Start recording
3. Pull up the DEMO_VIDEO_GUIDE.md in your browser
4. Read each scene's narration while showing relevant content
5. Show the code examples from examples/vulnerable-code.js
6. Run `node scripts/test-scanner.js` and show output
7. Show the formatted MR comment format
8. End with key metrics
9. Export as MP4
10. Upload to DevPost

**Total time: ~30-40 minutes**

---

**Ready to create your winning demo video?** 🎬✨
