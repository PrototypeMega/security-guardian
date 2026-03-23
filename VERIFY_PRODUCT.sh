#!/bin/bash

echo "🔍 AI Dev Team Labs - Product Verification"
echo "=========================================="
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo "   ✅ Node.js $VERSION installed"
else
    echo "   ❌ Node.js not found. Install from nodejs.org"
    exit 1
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    VERSION=$(npm --version)
    echo "   ✅ npm $VERSION installed"
else
    echo "   ❌ npm not found"
    exit 1
fi

# Check .env file
echo ""
echo "3️⃣  Checking environment..."
if [ -f .env ]; then
    if grep -q "CLAUDE_API_KEY" .env; then
        echo "   ✅ .env file with CLAUDE_API_KEY found"
    else
        echo "   ❌ .env file exists but missing CLAUDE_API_KEY"
    fi
else
    echo "   ❌ .env file not found. Create it with:"
    echo "      echo 'CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx' > .env"
fi

# Check dependencies
echo ""
echo "4️⃣  Checking npm packages..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules directory found"
else
    echo "   ⚠️  node_modules not found. Run: npm install"
fi

# Check key files
echo ""
echo "5️⃣  Checking key files..."
FILES=(
    "backend/mcp-server.js"
    "backend/agent-engine.js"
    "backend/browser-manager.js"
    "backend/agents-config.js"
    "dashboard/index.html"
    "dashboard/app.js"
    "landing-page/index.html"
    "dashboard-server.js"
    "package.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (MISSING!)"
    fi
done

# Check documentation
echo ""
echo "6️⃣  Checking documentation..."
DOCS=(
    "README.md"
    "QUICK_REFERENCE.md"
    "USER_GUIDE.md"
    "DEPLOYMENT_GUIDE.md"
    "PRODUCT_SUMMARY.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "   ✅ $doc"
    else
        echo "   ❌ $doc (MISSING!)"
    fi
done

echo ""
echo "=========================================="
echo "✅ Verification Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. npm install"
echo "2. npm start"
echo "3. Open http://localhost:3002"
echo ""
