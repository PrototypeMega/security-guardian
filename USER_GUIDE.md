# AI Dev Team Labs - User Guide

Welcome to AI Dev Team Labs! This guide explains how to use the 4 intelligent agents to automate your development workflow.

---

## 🎯 Overview

AI Dev Team Labs provides 4 specialized AI agents that understand your codebase and can automate key development tasks:

1. **👥 Onboarding Copilot** - Help new team members get up to speed
2. **📋 Feature Planner** - Convert ideas into detailed implementation plans
3. **✅ Test Generator** - Identify missing tests and suggest test strategies
4. **🔒 Security Patch Agent** - Review vulnerabilities and propose fixes

Each agent can:
- Read and understand your code
- Browse web pages for context (design docs, tutorials, etc.)
- Generate detailed, actionable recommendations
- Integrate with Claude Code for seamless workflow

---

## 🚀 Getting Started

### Access the Product

**Local Development:**
```
Landing Page: http://localhost:3002/
Dashboard: http://localhost:3002/dashboard
```

**Production:**
```
Landing Page: https://your-site.netlify.app/
Dashboard: https://your-site.netlify.app/dashboard
```

### First Time Setup

1. **Open the Dashboard**
   - Click "Open Dashboard" on landing page, OR
   - Go directly to `/dashboard`

2. **Connect to MCP Server**
   - Click the "Connect to MCP Server" button
   - Status should change to "Connected" (green)
   - If not connected, make sure MCP server is running: `npm run mcp`

3. **Select an Agent**
   - Click any agent name in the left panel
   - See the agent's description and capabilities

4. **Test the Agent**
   - Type a request in the input field
   - Click "Test Agent"
   - Watch the agent think and respond in real-time

---

## 👥 Agent 1: Onboarding Copilot

**What it does:** Helps new contributors understand your codebase and get productive quickly.

### Use Cases

- ✅ Onboarding a new team member
- ✅ Creating an onboarding checklist
- ✅ Identifying good starter tasks
- ✅ Explaining repository structure
- ✅ Documenting development setup

### Example Requests

```
"I'm a new developer. Help me understand this codebase
and what I should work on first."

"Create an onboarding checklist for someone joining our team."

"What are the 3 best starter tasks for a new contributor?"

"Explain the architecture and how components interact."
```

### With Browser Steps

Add a browser step to make it even smarter:

1. Click "+ Add Step"
2. Choose action: "Navigate"
3. Enter URL: `https://github.com/yourusername/your-repo`
4. Add another step: "Extract Text"
5. Click "Test Agent"

The agent will now read your GitHub README while creating the onboarding plan!

### Expected Output

```
## Onboarding Plan for New Contributors

### Phase 1: Setup (1-2 hours)
- Install Node.js 16+
- Clone repository
- Run: npm install
- Set up environment variables
- Run: npm test (verify everything works)

### Phase 2: Understanding (2-3 hours)
- Read README and main docs
- Explore project structure
- Review key files (server.js, app.js, etc.)
- Understand build process

### Phase 3: First Task (4 hours)
- Good starter task: Fix typos in documentation
- Or: Add a simple feature (like a button component)
- Submit pull request and get feedback

### Resources
- Main docs: docs/README.md
- Code style guide: docs/STYLE_GUIDE.md
- Development guide: docs/DEVELOPMENT.md
```

---

## 📋 Agent 2: Feature Planner

**What it does:** Converts requirements into detailed, actionable implementation plans.

### Use Cases

- ✅ Plan a new feature
- ✅ Estimate implementation effort
- ✅ Identify affected areas
- ✅ Create test strategies
- ✅ Document design decisions

### Example Requests

```
"Plan the implementation of dark mode for our application."

"Create a detailed plan for adding user authentication (JWT-based)."

"We need a notification system. Break it down into implementation steps."

"Plan a database migration from PostgreSQL to MongoDB."
```

### With Browser Steps

Add browser steps to research best practices:

1. Add step: Navigate to `https://design.company.com/design-system`
2. Add step: Screenshot
3. Add step: Extract Text (selector: `.components`)
4. Add step: Navigate to `https://github.com/search?q=dark+mode`
5. Test agent with these steps

The agent will research design patterns before creating the plan!

### Expected Output

```
## Implementation Plan: Dark Mode Support

### Overview
This feature adds a dark color scheme that automatically adapts
to user preferences and provides a toggle for manual control.

### Affected Areas
- UI Components (buttons, cards, modals)
- Color variables (CSS)
- Styles (dark color palette)
- Settings page (theme toggle)
- Local storage (save theme preference)

### Step-by-Step Implementation

**Step 1: Add Color Variables (2 hours)**
- Define CSS variables for dark mode
- Create separate theme files
- Test color contrast accessibility
- Files: src/styles/colors.css, src/styles/dark-theme.css

**Step 2: Apply Styles (4 hours)**
- Update all components to use CSS variables
- Test in light and dark modes
- Files: src/components/**, src/pages/**

**Step 3: Add Theme Toggle (3 hours)**
- Create settings panel option
- Store preference in localStorage
- Detect system preference
- Files: src/components/Settings.jsx

**Step 4: System Integration (2 hours)**
- Load saved preference on app start
- Respond to system theme changes
- Files: src/App.jsx

### Testing Strategy
- Unit tests: Color contrast tests
- Integration: Theme switching works
- E2E: Dark mode persists across sessions
- Accessibility: WCAG AA compliance

### Estimated Effort
- Total: 11 hours
- Frontend: 11 hours
- Backend: 0 hours
- QA: 2 hours
```

---

## ✅ Agent 3: Test Generator

**What it does:** Analyzes your code changes and identifies missing tests.

### Use Cases

- ✅ Identify test coverage gaps
- ✅ Suggest test cases for new features
- ✅ Find edge cases
- ✅ Plan test strategy
- ✅ Ensure quality before merging

### Example Requests

```
"I added a login form. What tests am I missing?"

"I changed the payment processing code. What tests should I add?"

"This utility function handles edge cases. What test cases
would be good?"

"Review this component and suggest tests for full coverage."
```

### With Browser Steps

Add browser steps to test the actual feature:

1. Add step: Navigate to `https://staging.yourapp.com/login`
2. Add step: Screenshot
3. Add step: Click selector `input[name='email']`
4. Add step: Type "test@example.com"
5. Test agent with these steps

The agent will test your feature manually first, then suggest tests!

### Expected Output

```
## Test Coverage Analysis: Login Form

### Current Tests
✓ Form renders correctly
✓ Email validation works
✓ Password validation works
✓ Form submission works

### Missing Tests (Critical)
❌ Test invalid email formats
  - Missing domains
  - Multiple @ symbols
  - Special characters
  - Very long emails

❌ Test SQL injection attempts in email field
❌ Test password with HTML/script tags

### Missing Tests (Important)
❌ Test form submission with empty fields
❌ Test "Remember me" checkbox
❌ Test forgot password flow
❌ Test error message display

### Missing Tests (Nice to Have)
❌ Test loading states
❌ Test network error handling
❌ Test keyboard navigation
❌ Test mobile responsiveness

### Suggested Test Cases

**1. Email Validation Tests**
   - valid: user@example.com ✓
   - invalid: user@@example.com ✗
   - invalid: user@example ✗
   - invalid: <script>alert('xss')</script> ✗

**2. Security Tests**
   - SQL injection: ' OR '1'='1
   - XSS attempts: <img src=x onerror=alert('xss')>
   - Very long input (>1000 chars)

**3. Edge Cases**
   - Unicode characters in email
   - Case sensitivity
   - Whitespace handling
   - Browser autofill

### Recommended Test Framework
- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

### Estimated Coverage Gain
Current: 65%
After suggested tests: 95%
```

---

## 🔒 Agent 4: Security Patch Agent

**What it does:** Reviews security vulnerabilities and proposes safe, tested fixes.

### Use Cases

- ✅ Patch security vulnerabilities
- ✅ Review code for security issues
- ✅ Propose security improvements
- ✅ Validate vulnerability fixes
- ✅ Create security audit reports

### Example Requests

```
"I have a CVE-2024-1234 vulnerability in Express.js.
How should I patch it?"

"Review this authentication code for security issues."

"Our dependencies have known vulnerabilities.
What's the safest way to update?"

"This endpoint accepts user input. Is it secure?"
```

### With Browser Steps

Add steps to research the vulnerability:

1. Add step: Navigate to `https://nvd.nist.gov/vuln/detail/CVE-2024-1234`
2. Add step: Screenshot
3. Add step: Extract Text (selector: `.cvss-score`)
4. Add step: Navigate to package docs
5. Test agent with these steps

The agent will research the vulnerability before proposing a fix!

### Expected Output

```
## Security Patch Report: CVE-2024-1234

### Vulnerability Summary
CVSS Score: 7.5 (High)
Type: Remote Code Execution
Affected: express-js v4.17.0 - v4.18.1
Status: Critical - Patch immediately

### Risk Assessment
🔴 HIGH RISK
- Could allow attacker to execute arbitrary code on server
- Affects all Express.js middleware chains
- Can be exploited remotely without authentication

### Affected Code
```javascript
// VULNERABLE - Current code
app.use(express.json({ limit: '50mb' }));
// Large payloads could cause memory exhaustion
```

### Proposed Fix (Tested)
```javascript
// SAFE - Patched code
app.use(express.json({
  limit: '10mb',  // Reduce limit
  strict: true    // Validate JSON structure
}));

// Add additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
```

### Migration Steps
1. Update express.js to version 4.18.2+
   `npm update express`

2. Apply the code changes above

3. Run security audit
   `npm audit --audit-level=moderate`

4. Run test suite
   `npm test`

5. Deploy to staging
   `npm run deploy:staging`

6. Run security tests
   `npm run test:security`

7. Deploy to production
   `npm run deploy:production`

### Validation
✅ All tests pass
✅ No performance regression
✅ Vulnerability patched
✅ No breaking changes

### Rollback Plan (if needed)
If issues occur:
```bash
npm install express@4.18.1  # Revert version
git revert <commit-hash>    # Revert changes
npm run deploy:production
```

### Follow-up
- Monitor for new vulnerabilities: `npm audit`
- Schedule quarterly security reviews
- Set up automated dependency updates
```

---

## 🔄 Advanced: Using with Browser Steps

Add browser automation to make agents smarter!

### Example: Feature Planner with Design Research

1. **Create browser steps:**
   - Step 1: Navigate to your design system
   - Step 2: Screenshot (see current patterns)
   - Step 3: Extract Text from design documentation
   - Step 4: Navigate to competitor product
   - Step 5: Take another screenshot

2. **Then run the agent:**
   - Input: "Plan dark mode feature"
   - Agent reads the design system
   - Agent learns from competitors
   - Creates a more informed plan

3. **Result:**
   - Better design alignment
   - Faster implementation
   - Fewer revisions

---

## 💡 Tips & Best Practices

### For Better Results

1. **Be Specific**
   ❌ "Fix the bug"
   ✅ "Fix the login form validation bug where empty emails are accepted"

2. **Provide Context**
   ❌ "Plan the feature"
   ✅ "Plan adding dark mode to our React app that uses Tailwind CSS"

3. **Use Browser Steps**
   ✅ Add steps to let agents research your codebase
   ✅ Let them see design systems and documentation
   ✅ Help them understand real-world context

4. **Iterate**
   - First request: Get initial plan
   - Second request: "Refine step 3, add more detail"
   - Third request: "Include error handling details"

### Performance Tips

- Shorter requests = faster responses
- More specific = better results
- Browser steps = smarter agents but slower
- Test without steps first, then add if needed

---

## 🐛 Troubleshooting

### Agent Not Responding

**Problem:** Agent seems stuck after I click "Test Agent"

**Solution:**
1. Check MCP server status (should be green)
2. Verify Claude API key is set (check .env file)
3. Check browser console for errors (F12)
4. Try a simpler request first
5. Restart the servers if issues persist

### Analytics Not Updating

**Problem:** Visitor counter or agent stats aren't changing

**Solution:**
1. Check browser console:
   ```javascript
   localStorage.getItem('aiDevTeamAnalytics')
   ```
2. Clear browser cache (Ctrl+Shift+Delete)
3. Reload page
4. Analytics should update on next interaction

### Browser Steps Not Working

**Problem:** Added browser steps but nothing happens

**Solution:**
1. Make sure MCP server is running
2. Check that URLs are valid and accessible
3. Test without browser steps first
4. Try simple steps (navigate) before complex ones (extract text)
5. Check MCP server logs for errors

### Dashboard Links Broken

**Problem:** "Open Dashboard" button doesn't work

**Solution:**
1. Make sure dashboard-server.js is running
2. Try accessing `/dashboard` directly in browser
3. Check both servers are running:
   - MCP: localhost:3001
   - Dashboard: localhost:3002

---

## 📚 Examples & Scenarios

### Scenario 1: Onboarding a Contractor

1. Request to **Onboarding Copilot:**
   ```
   "We're hiring a contractor to build the payment module.
   Create a comprehensive onboarding plan including:
   - Project overview
   - Important files
   - Code review guidelines
   - Deployment steps
   - Success criteria"
   ```

2. Agent delivers:
   - Customized onboarding plan
   - Key file references
   - Architecture overview
   - First task recommendations

3. Share the output with contractor → they get productive in hours, not days

---

### Scenario 2: Planning a Big Feature

1. Request to **Feature Planner:**
   ```
   "Our users request real-time collaboration (like Google Docs).
   Plan the architecture, breaking it into phases that can be
   merged incrementally. Consider: WebSockets, database changes,
   frontend updates, conflict resolution."
   ```

2. Add browser steps:
   - Navigate to your architecture docs
   - Navigate to Google Docs
   - Screenshot to see how it works

3. Agent delivers:
   - Phased implementation plan
   - Design-aligned approach
   - Risk assessment
   - Testing strategy

---

### Scenario 3: Code Review Check

1. Request to **Test Generator:**
   ```
   "I just implemented user profile editing.
   What tests should I add before merging?"
   ```

2. Add browser steps:
   - Navigate to your app
   - Test the profile editing form manually

3. Agent suggests:
   - Form validation tests
   - Permission tests
   - Database update tests
   - UI tests

---

## 🎉 Next Steps

1. **Start Small** - Test one agent with a simple request
2. **Add Browser Steps** - See how agents can be smarter
3. **Share with Team** - Let others use the agents
4. **Integrate with Claude Code** - Use agents in your IDE
5. **Iterate** - Refine requests to get better results

---

## 📞 Need Help?

- **Check this guide** - Search for your question
- **GitHub Issues** - Report bugs or request features
- **Claude Community** - Ask for advice on using agents
- **Documentation** - See README.md for technical details

---

**Happy automating! 🚀**
