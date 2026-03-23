#!/bin/bash

# AI Dev Team Labs - Complete Setup Script
# This script automates as much as possible. Some GitLab UI steps still require manual clicks.

set -e

echo "=================================="
echo "🚀 AI Dev Team Labs Setup"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify files
echo -e "${BLUE}[1/4] Verifying repository files...${NC}"
if [ -f "AGENTS.md" ] && [ -f ".gitlab/duo/chat-rules.md" ] && [ -f "landing-page/index.html" ]; then
    echo -e "${GREEN}✓ All files present${NC}"
else
    echo -e "${YELLOW}⚠ Missing some files. Please ensure you're in the AI-Dev-Team-Labs directory${NC}"
    exit 1
fi
echo ""

# Step 2: Check git status
echo -e "${BLUE}[2/4] Checking git status...${NC}"
if git status | grep -q "nothing to commit"; then
    echo -e "${GREEN}✓ All changes committed${NC}"
else
    echo -e "${YELLOW}⚠ Uncommitted changes found. Committing...${NC}"
    git add -A
    git commit -m "Auto-commit remaining changes before setup"
fi
echo ""

# Step 3: Create agent and flow setup instructions
echo -e "${BLUE}[3/4] Generating GitLab setup URLs...${NC}"
echo ""
echo "📋 NEXT STEPS - Follow these in your browser:"
echo ""
echo "1️⃣  CREATE 4 AGENTS (8 minutes):"
echo "    Go to: https://gitlab.com/your-project/-/ai/agents"
echo "    (Replace 'your-project' with your actual GitLab project path)"
echo ""
echo "    For each agent, go to Automate > Agents > New Agent"
echo "    Copy the system prompts from QUICK_SETUP.md"
echo "    • Onboarding Copilot"
echo "    • Feature Planner"
echo "    • Test Generator"
echo "    • Security Patch Agent"
echo ""
echo "2️⃣  CREATE 3 FLOWS (6 minutes):"
echo "    Go to: https://gitlab.com/your-project/-/ai/flows"
echo "    Create flows (also in QUICK_SETUP.md):"
echo "    • New Contributor Onboarding"
echo "    • Feature to Delivery"
echo "    • Secure MR Review"
echo ""
echo "3️⃣  DEPLOY LANDING PAGE (5 minutes):"
echo "    Option A - Auto Deploy:"
echo "      Go to: https://netlify.com"
echo "      New site from Git > Select your GitHub repo"
echo "      Netlify auto-detects landing-page folder"
echo "      Click Deploy"
echo ""
echo "    Option B - Manual Deploy:"
echo "      npm install -g netlify-cli"
echo "      netlify deploy --prod --dir=landing-page"
echo ""

# Step 4: Summary
echo ""
echo -e "${GREEN}=================================="
echo "✅ Setup Complete!"
echo "==================================${NC}"
echo ""
echo "📝 What's ready:"
echo "   ✓ Repository files (AGENTS.md, .gitlab/duo/*, landing-page/*)"
echo "   ✓ Setup guides (QUICK_SETUP.md, README.md)"
echo "   ✓ Landing page code (ready to deploy)"
echo ""
echo "⏭️  What you need to do:"
echo "   1. Create 4 agents in GitLab UI (~8 min)"
echo "   2. Create 3 flows in GitLab UI (~6 min)"
echo "   3. Deploy landing page to Netlify (~5 min)"
echo "   4. Record 3-minute demo video (~20 min)"
echo ""
echo "⏱️  Total time: ~45 minutes"
echo ""
echo "🎯 Next action: Read QUICK_SETUP.md and start creating agents"
echo ""
