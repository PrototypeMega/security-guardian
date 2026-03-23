# AI Dev Team Labs - Deployment Guide

This guide explains how to deploy AI Dev Team Labs so people can access and use the product.

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-dev-team-labs
cd ai-dev-team-labs
npm install
```

### 2. Set Environment Variables
```bash
# Create .env file with your Claude API key
echo "CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx" > .env
```

Get your API key from https://console.anthropic.com

### 3. Start All Services
```bash
npm start
```

This launches:
- **MCP Server** (localhost:3001) - Backend agent engine
- **Dashboard & Landing Page** (localhost:3002) - Web UI

### 4. Access the Product
Open **http://localhost:3002** in your browser:
- **Landing Page** at root (/)
- **Dashboard** at /dashboard
- **Live Analytics** showing visitor and usage metrics

---

## 🌐 Production Deployment

### Option 1: Netlify (Frontend Only)

**Best for**: Showcasing the landing page + directing to hosted backend

#### Prerequisites
- Netlify account (https://netlify.com)
- GitHub repository with code pushed

#### Steps

1. **Connect Repository**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and choose your repo

2. **Configure Build Settings**
   - Build command: `npm run build` (or leave empty for static site)
   - Publish directory: `landing-page`
   - Add environment variable: `CLAUDE_API_KEY`

3. **Set Redirect Rules**
   Create `landing-page/_redirects` file:
   ```
   /dashboard   /landing-page/index.html   200
   /*           /landing-page/index.html   200
   ```

4. **Deploy**
   - Netlify automatically deploys on every git push
   - Your landing page will be live at: `https://your-site.netlify.app`

5. **Configure Backend URL**
   - Update dashboard links to point to your hosted MCP server
   - In `landing-page/index.html`, change dashboard links if needed

#### For Production Backend

If you want the full experience with working agents:

1. **Deploy MCP Server**
   ```bash
   # Option A: Deploy to Heroku
   heroku create your-app-name
   git push heroku main

   # Option B: Deploy to Railway.app
   # Connect repo at https://railway.app

   # Option C: Deploy to Render.com
   # Connect repo at https://render.com
   ```

2. **Update Dashboard Links**
   In `landing-page/index.html` and `dashboard/index.html`:
   ```html
   <!-- Change from localhost:3001 to your production URL -->
   <a href="https://your-api.herokuapp.com/dashboard">Open Dashboard</a>
   ```

3. **Update API Endpoint**
   In `dashboard/app.js`:
   ```javascript
   // Change from localhost:3001
   const MCP_SERVER_URL = 'https://your-api.herokuapp.com';
   ```

### Option 2: Docker + Cloud Hosting

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3002
ENV NODE_ENV=production

CMD ["npm", "start"]
```

Deploy to:
- **AWS ECS/EC2**
- **Google Cloud Run**
- **Azure App Service**
- **DigitalOcean**

### Option 3: GitHub Pages (Static Site Only)

**Note**: GitHub Pages doesn't support Node.js backend, so agents won't work.
Use this for landing page showcase only.

1. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: /landing-page

2. **Your site will be live at**
   ```
   https://yourusername.github.io/ai-dev-team-labs
   ```

---

## 📊 How the System Works in Production

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Users                            │
│          (Web browsers accessing product)           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         Netlify/GitHub/Vercel                       │
│         Hosts Landing Page + Dashboard UI           │
│         (Static files + HTML)                       │
└──────────────┬──────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────┐
│         Heroku/Railway/Render                        │
│         Hosts MCP Server (Node.js Backend)          │
│         - Agent Engine                             │
│         - Browser Automation                       │
│         - Claude API Integration                   │
└──────────────────────────────────────────────────────┘
               ↓
         Claude API
     (Anthropic Cloud)
```

---

## ✅ Testing Your Deployment

### 1. Check Landing Page
```bash
# Should see:
# - Hero section
# - Features grid
# - Agents showcase
# - Live analytics section
# - Links to dashboard working
curl https://your-site.netlify.app
```

### 2. Check Dashboard Access
```bash
# Should load the interactive dashboard
curl https://your-site.netlify.app/dashboard
```

### 3. Test Agent Execution
1. Open dashboard
2. Select "Onboarding Copilot"
3. Enter test prompt
4. Verify MCP server responds
5. Watch agent reasoning in real-time

### 4. Verify Analytics
1. Visit landing page
2. Check browser console:
   ```javascript
   localStorage.getItem('aiDevTeamAnalytics')
   ```
3. Should show visitor counts and agent interactions

---

## 🔐 Security Checklist

- [ ] Claude API key stored in environment variables (never in code)
- [ ] MCP server not exposing sensitive endpoints
- [ ] CORS configured if calling from different domain
- [ ] Rate limiting on API endpoints
- [ ] HTTPS enabled on all domains
- [ ] Input validation on agent requests
- [ ] Browser automation restricted to safe domains

---

## 📈 Scaling Considerations

### For High Traffic

1. **Add CDN** (Cloudflare, CloudFront)
   - Cache static landing page
   - Reduce latency globally

2. **Load Balancing**
   - Multiple MCP server instances
   - Queue-based agent execution

3. **Database** (Optional)
   - Store analytics in database instead of localStorage
   - Track user sessions and agent usage history

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Alert on service issues

---

## 🛠️ Troubleshooting Deployment

### Landing Page Not Loading
```bash
# Check if files are in correct directory
ls -la landing-page/
# Should have: index.html, style.css, script.js
```

### Dashboard Links Broken
```bash
# Make sure dashboard-server.js serves both routes:
# "/" → landing-page/index.html
# "/dashboard" → dashboard/index.html
```

### Agents Not Working
```bash
# Check if MCP server is running
curl http://your-mcp-server:3001/health

# Verify Claude API key is set
echo $CLAUDE_API_KEY

# Check MCP server logs for errors
```

### Analytics Not Showing
```bash
# Check browser console for errors
# localStorage should contain analytics data
localStorage.getItem('aiDevTeamAnalytics')
```

---

## 📝 Deployment Checklist

### Before Going Live

- [ ] All 4 agents working in dashboard
- [ ] Landing page analytics displaying correctly
- [ ] Links between landing page and dashboard working
- [ ] MCP server responding to requests
- [ ] Claude API key configured in production
- [ ] Netlify/hosting platform configured
- [ ] GitHub repository up to date
- [ ] README has correct links and instructions
- [ ] Environment variables set in production
- [ ] Domain/URL updated in all documentation

### After Deployment

- [ ] Visit landing page URL
- [ ] Click dashboard link and verify it opens
- [ ] Test each of the 4 agents
- [ ] Check analytics counter updates
- [ ] Monitor error logs
- [ ] Share with users/team

---

## 🎉 You're Live!

Your AI Dev Team product is now accessible to users:

```
Landing Page: https://your-site.netlify.app
Dashboard: https://your-site.netlify.app/dashboard
GitHub: https://github.com/yourusername/ai-dev-team-labs
```

Users can now:
1. **Visit your landing page** to learn about the 4 agents
2. **See live analytics** showing product usage
3. **Click "Open Dashboard"** to use the agents
4. **Test agents visually** with real browser automation
5. **Integrate with Claude Code** for their development workflow

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Review MCP server logs
3. Verify environment variables are set
4. Check GitHub Issues for known problems
5. Submit new issue on GitHub

**Happy deploying! 🚀**
