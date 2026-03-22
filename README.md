# AI Dev Team Labs 🤖

**Multi-agent system for GitLab that automates the software development lifecycle.**

An intelligent team of AI agents that handle onboarding, feature planning, test generation, security remediation, and deployment workflows — all triggered by GitLab events.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (or use `node --version` to check)
- npm 8+
- Git

### Setup (5 minutes)

1. **Clone the repo**
   ```bash
   cd AI-Dev-Team-Labs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment** (already done)
   ```bash
   # .env file should already have your credentials
   cat .env
   ```

4. **Create database**
   ```bash
   npx prisma migrate dev
   ```

### Run

**Terminal 1 - Start the webhook server:**
```bash
npm run dev
```

Expected output:
```
🚀 AI Dev Team Labs - Webhook Server
Listening on http://localhost:3000
Webhook endpoint: POST http://localhost:3000/webhooks/gitlab
```

**Terminal 2 - Start the event orchestrator:**
```bash
npm run cli
```

Expected output:
```
🤖 AI Dev Team Labs - Event Orchestrator
Polling for queued events every 5 seconds...
Press Ctrl+C to stop
```

---

## 🧪 Testing

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

Expected: `{"status":"healthy",...}`

### Test 2: Send a Webhook
```bash
curl -X POST http://localhost:3000/webhooks/gitlab \
  -H "Content-Type: application/json" \
  -H "X-Gitlab-Token: test-webhook-secret" \
  -d '{
    "event_name": "push",
    "project_id": 123,
    "ref": "refs/heads/main"
  }'
```

Expected: `{"message":"Event received and queued for processing","event_id":1}`

### Test 3: View Events
```bash
curl http://localhost:3000/events
```

Watch the CLI output - you should see:
```
⏰ Found 1 queued event(s)
📦 Processing event 1...
✓ Event 1 completed
```

### Test 4: View Database
```bash
npm run studio
```

Opens Prisma Studio in your browser - see all events and agent runs.

---

## 📋 Architecture

```
GitLab (Push Event)
    ↓
[Webhook] POST /webhooks/gitlab
    ↓
[SQLite] Event Queue (status: queued)
    ↓
[CLI Orchestrator] Polls every 5 seconds
    ↓
[Agent] Processes event
    ↓
[SQLite] Update event (status: complete)
    ↓
[GitLab] Create issue with results
```

---

## 📁 Project Structure

```
AI-Dev-Team-Labs/
├── backend/
│   ├── server.js              # Express webhook server
│   ├── lib/
│   │   ├── gitlab-client.js   # GitLab API wrapper (Day 2)
│   │   ├── claude-client.js   # Claude API wrapper (Day 2)
│   │   └── repo-analyzer.js   # Tech stack detection (Day 2)
│   └── agents/
│       └── onboarding-copilot.js  # Agent logic (Day 2)
├── cli/
│   └── orchestrator.js        # Event processor
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # DB migration history
├── .db/
│   └── dev.sqlite             # SQLite database
├── package.json
├── .env                       # Configuration (git-ignored)
└── README.md
```

---

## 🎯 Day-by-Day Progress

### ✅ Day 1 (COMPLETE)
- [x] Webhook listener
- [x] Event queuing (SQLite)
- [x] CLI orchestrator
- [x] Basic health checks
- [x] Manual webhook testing

### ⏳ Day 2 (Next)
- [ ] GitLab API client (read repo structure)
- [ ] Claude API client (generate guides)
- [ ] Repo analyzer (detect tech stack)
- [ ] Onboarding Copilot Agent (full logic)
- [ ] Unit tests with fixtures

### ⏳ Day 3
- [ ] Real GitLab webhook integration
- [ ] Create test GitLab repo
- [ ] Configure webhook in GitLab
- [ ] End-to-end test (push → issue)

### ⏳ Day 4
- [ ] Polish and error handling
- [ ] Comprehensive README
- [ ] Record 3-minute demo video
- [ ] Final review and submission

---

## 🛠️ Environment Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `GITLAB_BASE_URL` | `https://gitlab.com` | GitLab instance |
| `GITLAB_API_TOKEN` | `glpat-xxx` | GitLab personal access token |
| `GITLAB_WEBHOOK_SECRET` | `secret123` | Webhook validation |
| `CLAUDE_API_KEY` | `sk-ant-xxx` | Anthropic Claude API |
| `PORT` | `3000` | Webhook server port |
| `DATABASE_URL` | `file:./.db/dev.sqlite` | SQLite location |

---

## 🔧 Troubleshooting

**Q: Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Q: Database errors?**
```bash
npx prisma migrate reset
```

**Q: Want to see database contents?**
```bash
npm run studio
```

---

## 📝 Next Steps

1. **Implement Day 2**: GitLab client + Claude client + Agent logic
2. **Test with real repo**: Create a test GitLab project
3. **Configure webhook**: Add webhook URL to GitLab project settings
4. **Record demo**: Show push event → agent processes → issue created

---

## 📚 Resources

- [GitLab API Docs](https://docs.gitlab.com/ee/api/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Claude API Reference](https://docs.anthropic.com/)

---

**Happy coding! 🎉**
