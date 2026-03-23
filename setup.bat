@echo off
REM AI Dev Team Labs - Complete Setup Script (Windows)
REM This script verifies all files are in place and provides next steps

setlocal enabledelayedexpansion

echo.
echo ==================================
echo 🚀 AI Dev Team Labs Setup
echo ==================================
echo.

REM Step 1: Verify files
echo [1/4] Verifying repository files...
if exist "AGENTS.md" if exist ".gitlab\duo\chat-rules.md" if exist "landing-page\index.html" (
    echo ✓ All files present
) else (
    echo ⚠ Missing some files. Please ensure you're in the AI-Dev-Team-Labs directory
    pause
    exit /b 1
)
echo.

REM Step 2: Check git status
echo [2/4] Checking git status...
git status | findstr "nothing to commit" >nul
if %errorlevel% equ 0 (
    echo ✓ All changes committed
) else (
    echo ⚠ Uncommitted changes found. Committing...
    git add -A
    git commit -m "Auto-commit remaining changes before setup"
)
echo.

REM Step 3: Display setup instructions
echo [3/4] Generating GitLab setup instructions...
echo.
echo NEXT STEPS - Follow these in your browser:
echo.
echo 1️⃣  CREATE 4 AGENTS (8 minutes):
echo    Go to: https://gitlab.com/your-project/-/ai/agents
echo    (Replace 'your-project' with your actual GitLab project path)
echo.
echo    For each agent, go to Automate ^> Agents ^> New Agent
echo    Copy the system prompts from QUICK_SETUP.md
echo    • Onboarding Copilot
echo    • Feature Planner
echo    • Test Generator
echo    • Security Patch Agent
echo.
echo 2️⃣  CREATE 3 FLOWS (6 minutes):
echo    Go to: https://gitlab.com/your-project/-/ai/flows
echo    Create flows (also in QUICK_SETUP.md):
echo    • New Contributor Onboarding
echo    • Feature to Delivery
echo    • Secure MR Review
echo.
echo 3️⃣  DEPLOY LANDING PAGE (5 minutes):
echo    Option A - Auto Deploy:
echo      Go to: https://netlify.com
echo      New site from Git ^> Select your GitHub repo
echo      Netlify auto-detects landing-page folder
echo      Click Deploy
echo.
echo    Option B - Manual Deploy:
echo      npm install -g netlify-cli
echo      netlify deploy --prod --dir=landing-page
echo.

REM Step 4: Summary
echo.
echo ==================================
echo ✅ Setup Complete!
echo ==================================
echo.
echo 📝 What's ready:
echo    ✓ Repository files (AGENTS.md, .gitlab/duo/*, landing-page/*)
echo    ✓ Setup guides (QUICK_SETUP.md, README.md)
echo    ✓ Landing page code (ready to deploy)
echo.
echo ⏭️  What you need to do:
echo    1. Create 4 agents in GitLab UI (~8 min)
echo    2. Create 3 flows in GitLab UI (~6 min)
echo    3. Deploy landing page to Netlify (~5 min)
echo    4. Record 3-minute demo video (~20 min)
echo.
echo ⏱️  Total time: ~45 minutes
echo.
echo 🎯 Next action: Read QUICK_SETUP.md and start creating agents
echo.
pause
