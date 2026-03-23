#!/bin/bash

echo "🚀 Starting AI Dev Team Labs"
echo "============================"
echo ""
echo "✅ Making sure dependencies are installed..."
npm install --silent > /dev/null 2>&1

echo "✅ Checking environment setup..."
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo "   Create .env with: echo 'CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx' > .env"
    exit 1
fi

echo "✅ Environment configured"
echo ""
echo "🎨 Starting Dashboard Server (http://localhost:3002)..."
npm run dashboard &
DASHBOARD_PID=$!
sleep 2

echo "🔧 Starting MCP Server (http://localhost:3001)..."
npm run mcp &
MCP_PID=$!
sleep 2

echo ""
echo "=========================================="
echo "✨ AI Dev Team Labs is running!"
echo "=========================================="
echo ""
echo "🌐 Landing Page: http://localhost:3002/"
echo "🤖 Dashboard:    http://localhost:3002/dashboard"
echo "📊 Analytics:    Displayed on landing page"
echo ""
echo "To stop: Press Ctrl+C"
echo "=========================================="
echo ""

# Keep scripts running
wait
