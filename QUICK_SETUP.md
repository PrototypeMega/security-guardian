# 🚀 AI Dev Team - Quick Setup (15 Minutes)

Complete automation setup in 3 steps. All 4 agents + 3 flows ready in ~15 minutes.

---

## Step 1: Verify Repository Files (1 min)

Files already created and committed:
```
✅ AGENTS.md
✅ .gitlab/duo/chat-rules.md
✅ .gitlab/duo/mr-review-instructions.yaml
✅ landing-page/index.html (+ CSS, JS)
```

**Verify**:
```bash
cd AI-Dev-Team-Labs
git status  # Should show clean working tree
git log --oneline -5  # Should show "Add GitLab Duo..." commit
```

---

## Step 2: Create 4 Agents in GitLab UI (8 min)

**Navigate to**: GitLab Project → **Automate** → **Agents** → **New Agent**

### Agent 1: Onboarding Copilot (2 min)

**Display Name**: `Onboarding Copilot`

**Description**: `Personalized onboarding for new contributors, including repo map, checklist, and starter issues.`

**System Prompt** (paste entire block):
```
You are the Onboarding Copilot for this GitLab project. Your job is to help a new contributor ramp up quickly using the repository context and the current issue/MR discussion.

When invoked:
1. Summarize the purpose of the repository in 3-5 bullets
2. Explain the most important top-level folders and files
3. Generate a personalized onboarding checklist for a new contributor (5-7 steps)
4. Suggest 3 starter issues or starter tasks appropriate for a first contribution
5. Explain how to run, test, and validate changes
6. Keep responses concrete, action-oriented, and specific to this repository
7. Prefer project facts over generic advice
8. If information is missing, clearly say what is unknown and provide the safest next step

Output format:
- **Repo Summary** (3-5 bullets on what this project does)
- **Key Folders & Files** (most important directories explained)
- **Onboarding Checklist** (numbered steps to productivity)
- **Suggested Starter Tasks** (3 concrete issues to tackle first)
- **First-Day Success Path** (how to validate your first change)
```

Click **Save** → Verify it appears in agents list

---

### Agent 2: Feature Planner (2 min)

**Display Name**: `Feature Planner`

**Description**: `Converts issues into execution-ready implementation plans.`

**System Prompt** (paste):
```
You are the Feature Planner for this GitLab project. When invoked on an issue or feature request:

1. Restate the feature request clearly
2. Identify impacted files, services, modules, or layers
3. Produce an implementation plan with ordered steps (5-8 steps typical)
4. Identify risks, assumptions, and dependencies
5. Propose acceptance criteria (testable conditions)
6. Suggest what tests should be added
7. Keep the plan small enough for a hackathon prototype unless explicitly asked for full production scope

Output format:
- **Goal** (restate the feature request)
- **Affected Areas** (files, modules, layers involved)
- **Implementation Steps** (ordered, actionable steps)
- **Risks & Assumptions** (what could go wrong)
- **Acceptance Criteria** (how to verify it's done)
- **Test Plan** (what tests to add)
```

Click **Save** → Verify it appears

---

### Agent 3: Test Generator (2 min)

**Display Name**: `Test Generator`

**Description**: `Generates missing tests and improves confidence in merge requests.`

**System Prompt** (paste):
```
You are the Test Generator for this GitLab project. When invoked on a merge request, issue, or code change:

1. Detect the changed behavior or intended behavior
2. Identify missing tests for those changes
3. Generate a practical test plan
4. If appropriate, create or suggest unit/integration/E2E tests
5. Focus on high-signal tests for the modified code paths
6. Call out edge cases and failure cases
7. Keep recommendations aligned to the repository's existing testing style and frameworks

Output format:
- **Change Summary** (what code changed or what's being built)
- **Missing Test Coverage** (gaps in tests)
- **Proposed Tests** (specific test cases to add)
- **Edge Cases** (boundary conditions, error scenarios)
- **Validation Steps** (how to verify the tests work)
```

Click **Save** → Verify it appears

---

### Agent 4: Security Patch Agent (2 min)

**Display Name**: `Security Patch Agent`

**Description**: `Reviews vulnerabilities and proposes low-risk fixes with rationale.`

**System Prompt** (paste):
```
You are the Security Patch Agent for this GitLab project. When invoked on a vulnerability report, dependency finding, or merge request with security concerns:

1. Summarize the security issue clearly
2. Classify severity (critical, high, medium, low) and likely impact
3. Propose the safest practical remediation
4. Prefer small, reviewable changes
5. Explain tradeoffs, compatibility risks, and validation steps
6. If the fix is uncertain, recommend the safest temporary mitigation
7. Keep outputs concise and suitable for a merge request comment or remediation plan

Output format:
- **Finding Summary** (what's the security issue?)
- **Severity & Impact** (how bad is it? what could an attacker do?)
- **Recommended Fix** (the safest change)
- **Compatibility Notes** (what might break? version impacts?)
- **Validation Steps** (how to confirm the fix works safely)
```

Click **Save** → Verify all 4 agents are now listed

---

## Step 3: Create 3 Flows in GitLab UI (6 min)

**Navigate to**: GitLab Project → **Automate** → **Flows** → **New Flow** (or **Create Flow**)

### Flow 1: New Contributor Onboarding (2 min)

**Flow Name**: `New Contributor Onboarding`

**Trigger**: `Mention and Assign`

**Description**:
```
When triggered for a new contributor:
- Use repository context to explain the project
- Generate a first-day onboarding checklist (5-7 steps)
- Suggest 3 realistic starter tasks or issues that don't require deep knowledge
- Explain how this contributor should run, test, and validate changes
- Keep the response concise enough to be used directly in an issue comment
- Be specific to this repository, not generic advice
```

**Agents to call**: `Onboarding Copilot`

Click **Save**

---

### Flow 2: Feature to Delivery (2 min)

**Flow Name**: `Feature to Delivery`

**Trigger**: `Mention and Assign`

**Description**:
```
When triggered on a feature request:
- Analyze the issue and produce an implementation plan
- Identify likely affected files or modules
- Propose acceptance criteria
- Call the test generation step by including a concrete test plan
- Return a developer-ready execution plan suitable for a hackathon prototype
- Be specific about dependencies, risks, and assumptions
```

**Agents to call**: `Feature Planner`, then `Test Generator`

Click **Save**

---

### Flow 3: Secure MR Review (2 min)

**Flow Name**: `Secure MR Review`

**Trigger**: `Assign reviewer and Mention`

**Description**:
```
When triggered on a merge request:
- Review the proposed changes from quality and security perspectives
- Identify missing tests and risky edge cases
- Identify likely security or dependency concerns (outdated versions, unsafe patterns)
- Recommend small, reviewable fixes
- Format the response as an MR review summary with clear action items
- Be constructive; suggest solutions, not just problems
```

**Agents to call**: `Test Generator`, then `Security Patch Agent`

Click **Save**

---

## Step 4: Deploy Landing Page to Netlify (Optional - 5 min)

Landing page is ready at `landing-page/` folder.

### Option A: Auto-Deploy from Git (Recommended)

1. Go to https://netlify.com → Click **New site from Git**
2. Connect GitHub → Select `perfectra1n/claude-code-sync`
3. Netlify detects the project
4. Deploy settings:
   - **Base directory**: `landing-page`
   - **Build command**: (leave empty - it's static HTML)
   - **Publish directory**: `landing-page`
5. Click **Deploy** → Done! You get a live URL

### Option B: Manual Deploy
```bash
npm install -g netlify-cli
cd landing-page
netlify deploy --prod
```

---

## Step 5: Test Everything (2 min)

### Test Agents
1. Create a **test issue** in your GitLab project
2. In the issue, write: `@Onboarding-Copilot` (mention the agent)
3. Wait 30-60 seconds → Agent responds with onboarding checklist
4. Repeat for other agents

### Test Landing Page
1. Visit your Netlify URL
2. Fill out email form → Should see success message
3. Check browser console: `localStorage.getItem('aiDevTeamLeads')` → See your submission

### Test Flows
1. Create an issue → Mention the flow: `@New-Contributor-Onboarding`
2. Flow calls Onboarding Copilot → Posts response as comment
3. Try other flows similarly

---

## Step 6: Record Demo Video (15-20 min - You Do This!)

Record a 3-minute screen video showing:

**0:00-0:30**: Landing page
- Show hero section
- Scroll through agent cards
- Show email signup form

**0:30-1:00**: Mention Onboarding Copilot
- Create/navigate to issue
- Type: `@Onboarding-Copilot help me get started`
- Wait for response
- Show the checklist + starter tasks

**1:00-1:30**: Secure MR Review flow
- Show MR (any MR or create dummy one)
- Assign `Security Patch Agent` as reviewer
- Show security + test review comment

**1:30-2:00**: Feature Planner flow
- Show issue
- Mention `@Feature-Planner plan this feature`
- Show implementation plan response

**2:00-3:00**: Closing
- Show all 4 agents
- Show landing page again
- Pitch: "AI Dev Team automates onboarding, testing, security, and planning. Build faster, ship safer."

**Tools for recording**:
- Windows: Built-in screen recorder (Win+G) or OBS Studio (free)
- Mac: QuickTime (Cmd+Shift+5)
- Any: OBS Studio (free, best quality)

**Export as**: MP4, 1080p or higher, 30 fps

---

## Checklist

- [ ] Step 1: Files verified (git status clean)
- [ ] Step 2: All 4 agents created in GitLab
- [ ] Step 3: All 3 flows created in GitLab
- [ ] Step 4: Landing page deployed to Netlify (live URL)
- [ ] Step 5: Test agents respond to mentions
- [ ] Step 5: Test flows work end-to-end
- [ ] Step 6: Demo video recorded (3 min)
- [ ] Submit to hackathon with:
  - [ ] GitHub repo link
  - [ ] Landing page URL (Netlify)
  - [ ] Demo video link
  - [ ] Brief description (agents + flows + landing page)

---

## Support

**Agents not responding?**
- Check agent is **enabled** in the project
- Refresh the page
- Check GitLab audit log for errors

**Flow not triggering?**
- Ensure flow is **enabled**
- Ensure you're mentioning the correct service account name
- Check flow trigger is set to **Mention and Assign**

**Landing page not deploying?**
- Ensure `landing-page/` folder is in repo
- Check Netlify build logs
- Try manual deploy: `netlify deploy --prod --dir=landing-page`

**Form not submitting?**
- Check browser console (F12) for errors
- Check localStorage: `localStorage.getItem('aiDevTeamLeads')`
- Leads are saved locally by default

---

## Time Breakdown

| Step | Time | Notes |
|------|------|-------|
| 1. Verify files | 1 min | Already done |
| 2. Create 4 agents | 8 min | Copy-paste prompts |
| 3. Create 3 flows | 6 min | Point-and-click setup |
| 4. Deploy landing page | 5 min | Netlify auto-deploy |
| 5. Test | 2 min | Verify agents respond |
| 6. Record demo | 20 min | You do this |
| **Total** | **~42 min** | Most of it is waiting for agents to respond |

---

**You're all set!** 🚀 Go create those agents and flows, then record the demo video.
