# 🎯 FINAL STEPS - Copy & Paste Commands

These are the **exact commands and steps** you need to finish. Copy-paste format for speed.

---

## Step 1: Deploy Landing Page to Netlify (5 min)

**Option A - Easiest (Recommended)**
```
1. Go to: https://netlify.com/drop
2. Drag and drop the "landing-page" folder
3. Get live URL in 10 seconds
```

**Option B - CLI (if you have npm/node)**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=landing-page
# When prompted: Authorize in browser, link site, deploy
```

**Option C - GitHub integration (fastest)**
```
1. Go to: https://netlify.com
2. Click: New site from Git
3. Select repo: perfectra1n/claude-code-sync
4. Netlify auto-detects landing-page folder
5. Click Deploy
6. Done in 60 seconds ✓
```

**You'll get URL like**: `ai-dev-team-labs.netlify.app`

---

## Step 2: Create 4 Agents in GitLab (8 min)

**Go to**: Your GitLab project → **Automate** → **Agents** → **New agent**

**For EACH agent, copy and paste this info:**

### Agent 1: Onboarding Copilot
```
Display name: Onboarding Copilot
Description: Personalized onboarding for new contributors, including repo map, checklist, and starter issues.

System prompt:
(Copy from QUICK_SETUP.md section "Onboarding Copilot")
```

### Agent 2: Feature Planner
```
Display name: Feature Planner
Description: Converts issues into execution-ready implementation plans.

System prompt:
(Copy from QUICK_SETUP.md section "Feature Planner")
```

### Agent 3: Test Generator
```
Display name: Test Generator
Description: Generates missing tests and improves confidence in merge requests.

System prompt:
(Copy from QUICK_SETUP.md section "Test Generator")
```

### Agent 4: Security Patch Agent
```
Display name: Security Patch Agent
Description: Reviews vulnerabilities and proposes low-risk fixes with rationale.

System prompt:
(Copy from QUICK_SETUP.md section "Security Patch Agent")
```

**Expected outcome**: 4 agents in your Agents list ✓

---

## Step 3: Create 3 Flows in GitLab (6 min)

**Go to**: Your GitLab project → **Automate** → **Flows** → **New flow**

**For EACH flow, copy and paste this info:**

### Flow 1: New Contributor Onboarding
```
Name: New Contributor Onboarding
Description: Help new contributors become productive fast with personalized onboarding.
Trigger: Mention or Assign
Agents: Onboarding Copilot
Output: Post checklist and starter tasks as issue comment
```

### Flow 2: Feature to Delivery
```
Name: Feature to Delivery
Description: Convert feature issues into implementation plans with test coverage.
Trigger: Mention or Assign
Agents: Feature Planner → Test Generator
Output: Post implementation plan + test plan as issue comment
```

### Flow 3: Secure MR Review
```
Name: Secure MR Review
Description: Review merge requests for test coverage and security risks.
Trigger: Assign reviewer or Mention
Agents: Test Generator → Security Patch Agent
Output: Post review summary as MR comment
```

**Expected outcome**: 3 flows in your Flows list ✓

---

## Step 4: Test Everything (2 min)

### Test Agent 1 (Onboarding Copilot)
```
1. Go to any GitLab issue in your project
2. Type: @Onboarding-Copilot (or actual agent name)
3. Wait 30 seconds
4. Should see personalized onboarding checklist ✓
```

### Test Agent 2 (Feature Planner)
```
1. Go to a feature request issue
2. Type: @Feature-Planner
3. Wait 30 seconds
4. Should see implementation plan ✓
```

### Test Landing Page
```
1. Go to: (your Netlify URL)
2. Should see: Hero section, 4 agent cards, email form
3. Try submitting email (should work locally)
```

---

## Step 5: Record Demo Video (15-20 min)

**What to record** (in a 3-minute video):

```
0:00-0:30 - Landing Page
  • Show hero "AI Dev Team Labs"
  • Scroll through 4 agent cards
  • Show email signup

0:30-1:00 - Onboarding Agent Demo
  • Show GitLab issue
  • Mention @Onboarding-Copilot
  • Wait for response
  • Show checklist output

1:00-1:30 - Security Agent Demo (or Feature Planner)
  • Go to MR or issue
  • Mention agent
  • Show security findings or plan

1:30-2:00 - All Agents Overview
  • Show agents list
  • Show flows list

2:00-3:00 - Closing Statement
  • Say something like:
    "AI Dev Team Labs automates developer workflows on GitLab.
     Agents for onboarding, planning, testing, and security.
     Ship faster. Ship safer. Build with AI."
```

**Tools to record**:
- **Windows**: Win+G (built-in) → Record
- **Mac**: Cmd+Shift+5
- **Free**: OBS Studio
- **Easy**: QuickTime (Mac) or Screen Recorder (Windows)

**Export as**: MP4, 1080p, 30fps

**Where to upload**:
- YouTube (unlisted)
- Vimeo
- Devpost directly

---

## Step 6: Submit to Hackathon (2 min)

**Go to**: Your Devpost project (https://devpost.com/software/YOUR-PROJECT)

**Fill in**:
```
Project Name: AI Dev Team Labs
Tagline: Multi-agent AI automation for GitLab development workflows

Description:
AI Dev Team Labs is a complete product featuring 4 intelligent AI agents
and 3 automation flows that integrate directly with GitLab. Agents handle
onboarding, feature planning, test generation, and security reviews.

Also includes a professional marketing landing page and 3-minute demo video.

Technologies: GitLab Duo Agent Platform, Claude AI, Node.js, HTML/CSS/JS

GitHub: https://github.com/perfectra1n/claude-code-sync
Landing Page: (your Netlify URL)
Video: (your YouTube/Vimeo URL)
```

**Upload video** and click **Submit** ✓

---

## ✅ Final Checklist

- [ ] Landing page deployed to Netlify (have URL)
- [ ] 4 agents created in GitLab
- [ ] 3 flows created in GitLab
- [ ] Tested agent responses (got checklist/plan)
- [ ] Recorded 3-minute demo video
- [ ] Uploaded video to YouTube or Vimeo
- [ ] Submitted Devpost project
- [ ] Shared GitHub link in submission

---

## 🎬 You're Done!

Everything you need:
- ✅ Code (in git)
- ✅ Landing page (ready to deploy)
- ✅ Configuration files (AGENTS.md, .gitlab/duo/*)
- ✅ Step-by-step guides (this file)
- ✅ Copy-paste commands (above)

**Time left**:
- Netlify: 5 min
- Agents: 8 min
- Flows: 6 min
- Test: 2 min
- Video: 20 min
- Submit: 2 min
= **43 minutes total**

**You got this!** 🚀
