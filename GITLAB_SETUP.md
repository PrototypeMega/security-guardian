# Setting Up Real GitLab Integration

This guide shows how to test the AI Dev Team Labs system with a real GitLab project.

## Option 1: Quick Test (Recommended)

Use the webhook simulator to test the complete flow WITHOUT needing ngrok or a real GitLab project:

```bash
# Terminal 1: Start webhook server
npm run dev

# Terminal 2: Start orchestrator
npm run cli

# Terminal 3: Run the demo
npm run demo
```

You'll see the complete workflow in action with simulated GitLab webhooks!

---

## Option 2: Real GitLab Project (Advanced)

To use a real GitLab project, you need:

### Prerequisites
1. GitLab account (gitlab.com or self-hosted)
2. Personal access token (with api, read_repository, write_repository scopes)
3. Public URL or ngrok tunnel for webhooks
4. Valid Claude API key

### Step-by-Step Setup

#### 1. Create GitLab Project

```bash
# Option A: Use existing project
- Go to gitlab.com
- Navigate to your project
- Skip to Step 2

# Option B: Create new project
- Go to gitlab.com/projects/new
- Name: "ai-dev-team-test"
- Description: "Test project for AI Dev Team Labs"
- Visibility: Private or Public (your choice)
- Click Create
```

#### 2. Get Your Project ID

```bash
# In GitLab:
- Go to your project
- Click Settings → General
- Copy the "Project ID" (e.g., 12345678)
```

#### 3. Set Up Public URL

Your webhook server needs a public URL. Choose one:

**Option A: Use ngrok (Easiest)**
```bash
# Download from https://ngrok.com
# Then run:
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
# Save this URL
```

**Option B: Use local tunnel**
```bash
npm install -g localtunnel
lt --port 3000 --subdomain mydevteam

# You'll get: https://mydevteam.loca.lt
# Save this URL
```

**Option C: Use cloud hosting**
- Deploy to Railway, Render, or Heroku
- Use the provided public URL

#### 4. Configure Webhook in GitLab

```bash
# In GitLab project:
1. Settings → Webhooks
2. URL: https://your-public-url.com/webhooks/gitlab
3. Secret token: (copy from your .env GITLAB_WEBHOOK_SECRET)
4. Events to trigger:
   - [✓] Push events
   - [ ] Issues
   - [ ] Merge requests
5. SSL verification: [✓] Enabled (or disable if using localhost)
6. Click "Add webhook"
```

#### 5. Test the Webhook

```bash
# In GitLab webhook settings:
1. Find your webhook in the list
2. Click "Test" → "Push events"
3. You should see a green checkmark
```

#### 6. Update Your .env

```bash
# Edit .env with:
GITLAB_BASE_URL=https://gitlab.com
GITLAB_API_TOKEN=glpat-your-real-token
GITLAB_WEBHOOK_SECRET=your-webhook-secret
CLAUDE_API_KEY=sk-ant-your-real-key
```

#### 7. Start the System

```bash
# Terminal 1: Webhook server
npm run dev

# Terminal 2: Orchestrator
npm run cli

# Terminal 3: Push code to your repo
git push origin main

# Watch the agent run in Terminal 2!
# Check your GitLab project for the new issue
```

---

## Testing the System

### Local Test (No ngrok needed)

```bash
npm run demo
```

This simulates a complete GitLab webhook without needing a real project or ngrok!

### Real GitLab Test

1. Push code to your GitLab project
2. Webhook fires automatically
3. Check Terminal 2 for agent output
4. Check your GitLab project for the new "Onboarding Guide" issue

### Database Inspection

```bash
npm run studio
```

Opens browser UI showing all events and agent runs.

---

## Troubleshooting

### "Connection refused" error

Make sure both servers are running:
```bash
# Check if port 3000 is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### "Webhook test failed" in GitLab

1. Check your public URL is correct
2. Check firewall allows inbound traffic
3. Verify GITLAB_WEBHOOK_SECRET matches

### "Invalid API key" error

1. Verify GITLAB_API_TOKEN in .env is correct
2. Check token has required scopes: api, read_repository, write_repository
3. Verify token hasn't expired

### "401 Unauthorized" from Claude

1. Verify CLAUDE_API_KEY in .env is correct
2. System will fallback to default guide automatically

### Agent doesn't run

1. Check orchestrator is running (`npm run cli`)
2. Check server logs for webhook receipt
3. Check database with `npm run studio`

---

## Monitoring & Debugging

### View Real-Time Logs

**Terminal 1 (Webhook Server):**
```bash
npm run dev
# Shows all incoming webhooks
```

**Terminal 2 (Orchestrator):**
```bash
npm run cli
# Shows agent execution in real-time
```

### Check Database

```bash
npm run studio
# Open browser to inspect all events and runs
```

### Manual Webhook Test

```bash
curl -X POST https://your-url.com/webhooks/gitlab \
  -H "Content-Type: application/json" \
  -H "X-Gitlab-Token: your-secret" \
  -d '{
    "event_name": "push",
    "project_id": 12345,
    "ref": "refs/heads/main"
  }'
```

---

## Demo Mode vs Real Integration

| Feature | Demo Mode | Real GitLab |
|---------|-----------|------------|
| Webhook simulation | ✅ | - |
| Local testing | ✅ | - |
| No ngrok/tunnel needed | ✅ | ❌ |
| Real project | ❌ | ✅ |
| Creates real issues | ❌ | ✅ |
| Uses real GitLab API | ❌ | ✅ |
| Perfect for hackathon demo | ✅ | ✅ |

---

## For the Hackathon

**Recommended approach:**

1. **Use demo mode** for your presentation
   ```bash
   npm run demo
   ```
   Shows complete workflow in 15 seconds!

2. **Also set up real GitLab** as backup
   - More impressive to judges
   - Proves real integration

3. **Record both** in your demo video
   - Local demo (reliable, no network issues)
   - Real integration (shows it works with real APIs)

---

## Next Steps

- [ ] Choose Option 1 (demo) or Option 2 (real GitLab)
- [ ] If real GitLab: Get project ID and API token
- [ ] If using ngrok: Download and set up tunnel
- [ ] Update .env with correct values
- [ ] Test with webhook
- [ ] Watch agent create issues!

Good luck! 🚀
