/**
 * AI Dev Team Dashboard - Client Side Logic
 */

const MCP_SERVER_URL = 'http://localhost:3001';
let agents = [];
let currentAgent = null;
let browserSteps = [];
let isConnected = false;

/**
 * Initialize Dashboard
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Dashboard initializing...');
  console.log('📍 MCP Server URL:', MCP_SERVER_URL);
  setupEventListeners();
  console.log('✅ Event listeners setup complete');
  console.log('🔗 Attempting to connect to MCP server...');
  connectToServer();
});

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  document.getElementById('connectBtn').addEventListener('click', connectToServer);
  document.getElementById('addStepBtn').addEventListener('click', openStepModal);
  document.getElementById('testBtn').addEventListener('click', testAgent);
  document.getElementById('setupBtn').addEventListener('click', showSetupInstructions);
}

/**
 * Connect to MCP Server
 */
async function connectToServer() {
  try {
    console.log('Connecting to MCP server at:', MCP_SERVER_URL);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${MCP_SERVER_URL}/mcp/tools/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Connected to MCP server', data);

    // Get agents list
    await fetchAgents();
    isConnected = true;
    updateConnectionStatus(true);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    updateConnectionStatus(false);

    let errorMessage = `Failed to connect to MCP server at ${MCP_SERVER_URL}\n\n`;

    if (error.name === 'AbortError') {
      errorMessage += 'Error: Request timed out (5 seconds)\n\n';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage += 'Error: Network error - Cannot reach MCP server\n\n';
      errorMessage += 'This could be due to:\n';
      errorMessage += '1. MCP server not running\n';
      errorMessage += '2. Firewall blocking localhost:3001\n';
      errorMessage += '3. Browser security restrictions\n\n';
    } else if (error.message.includes('HTTP')) {
      errorMessage += `Error: ${error.message}\n\n`;
    }

    errorMessage += `Make sure the MCP server is running:\nnpm run mcp\n\n`;
    errorMessage += `Details: ${error.message}`;

    alert(errorMessage);
  }
}

/**
 * Fetch agents from MCP server
 */
async function fetchAgents() {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/tools/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'list_agents',
        input: {}
      })
    });

    const data = await response.json();
    agents = data.result.agents || [];

    renderAgentsList();
    console.log(`Loaded ${agents.length} agents`);
  } catch (error) {
    console.error('Failed to fetch agents:', error);
  }
}

/**
 * Render agents list in UI
 */
function renderAgentsList() {
  const list = document.getElementById('agentsList');
  list.innerHTML = agents.map(agent => `
    <div class="agent-item" onclick="selectAgent('${agent.id}')">
      <div class="agent-name">${agent.name}</div>
      <div class="agent-id">${agent.id}</div>
    </div>
  `).join('');

  // Select first agent by default
  if (agents.length > 0) {
    selectAgent(agents[0].id);
  }
}

/**
 * Select an agent
 */
function selectAgent(agentId) {
  currentAgent = agents.find(a => a.id === agentId);

  // Update active state
  document.querySelectorAll('.agent-item').forEach(el => {
    el.classList.remove('active');
  });
  event.target.closest('.agent-item').classList.add('active');

  // Update editor panel
  document.getElementById('agentTitle').textContent = currentAgent.name;
  document.getElementById('agentDesc').textContent = currentAgent.description;

  // Enable controls
  document.getElementById('addStepBtn').disabled = false;
  document.getElementById('clearStepsBtn').disabled = false;
  document.getElementById('userInput').disabled = false;
  document.getElementById('testBtn').disabled = false;
  document.getElementById('setupBtn').disabled = false;

  // Reset browser steps
  browserSteps = [];
  renderStepsList();

  console.log(`Selected agent: ${currentAgent.name}`);
}

/**
 * Open step modal
 */
function openStepModal() {
  document.getElementById('stepModal').style.display = 'flex';
  document.getElementById('stepAction').value = '';
}

/**
 * Close step modal
 */
function closeStepModal() {
  document.getElementById('stepModal').style.display = 'none';
}

/**
 * Handle step action change
 */
function onStepActionChange() {
  const action = document.getElementById('stepAction').value;

  // Hide all fields
  document.getElementById('urlField').style.display = 'none';
  document.getElementById('selectorField').style.display = 'none';
  document.getElementById('textField').style.display = 'none';
  document.getElementById('timeoutField').style.display = 'none';

  // Show relevant fields
  switch (action) {
    case 'navigate':
      document.getElementById('urlField').style.display = 'block';
      break;
    case 'click':
    case 'submit':
      document.getElementById('selectorField').style.display = 'block';
      break;
    case 'type':
      document.getElementById('selectorField').style.display = 'block';
      document.getElementById('textField').style.display = 'block';
      break;
    case 'extractText':
    case 'waitFor':
      document.getElementById('selectorField').style.display = 'block';
      if (action === 'waitFor') {
        document.getElementById('timeoutField').style.display = 'block';
      }
      break;
  }
}

/**
 * Save a browser step
 */
function saveStep() {
  const action = document.getElementById('stepAction').value;
  if (!action) {
    alert('Please select an action');
    return;
  }

  const step = { action };

  switch (action) {
    case 'navigate':
      step.url = document.getElementById('stepUrl').value;
      if (!step.url) {
        alert('Please enter URL');
        return;
      }
      break;
    case 'click':
    case 'submit':
    case 'extractText':
    case 'waitFor':
      step.selector = document.getElementById('stepSelector').value;
      if (!step.selector) {
        alert('Please enter CSS selector');
        return;
      }
      if (action === 'waitFor') {
        step.timeout = parseInt(document.getElementById('stepTimeout').value) || 5000;
      }
      break;
    case 'type':
      step.selector = document.getElementById('stepSelector').value;
      step.text = document.getElementById('stepText').value;
      if (!step.selector || !step.text) {
        alert('Please enter selector and text');
        return;
      }
      break;
  }

  browserSteps.push(step);
  renderStepsList();
  closeStepModal();
  console.log('Step added:', step);
}

/**
 * Render browser steps list
 */
function renderStepsList() {
  const list = document.getElementById('stepsList');

  if (browserSteps.length === 0) {
    list.innerHTML = '<p class="placeholder">No browser steps added yet.</p>';
    return;
  }

  list.innerHTML = browserSteps.map((step, index) => {
    let params = '';
    if (step.url) params += ` → ${step.url}`;
    if (step.selector) params += ` → ${step.selector}`;
    if (step.text) params += ` → "${step.text}"`;
    if (step.timeout) params += ` (${step.timeout}ms)`;

    return `
      <div class="step-item">
        <span><span class="step-action">${step.action}</span><span class="step-params">${params}</span></span>
        <button class="step-remove" onclick="removeStep(${index})">×</button>
      </div>
    `;
  }).join('');
}

/**
 * Remove a browser step
 */
function removeStep(index) {
  browserSteps.splice(index, 1);
  renderStepsList();
}

/**
 * Test the agent
 */
async function testAgent() {
  if (!currentAgent) {
    alert('Please select an agent');
    return;
  }

  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) {
    alert('Please enter input for the agent');
    return;
  }

  try {
    document.getElementById('testBtn').disabled = true;
    document.getElementById('testBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'inline-block';

    showResults('Testing agent...', 'info');

    const response = await fetch(`${MCP_SERVER_URL}/mcp/tools/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'run_agent',
        input: {
          agent_id: currentAgent.id,
          input: userInput,
          browser_steps: browserSteps
        }
      })
    });

    const data = await response.json();

    if (data.success && data.result.success) {
      showResults(data.result.response, 'success');
    } else {
      showResults(
        `Error: ${data.result.error || 'Unknown error'}\n\nMake sure the MCP server is running and your Claude API key is configured.`,
        'error'
      );
    }

  } catch (error) {
    console.error('Test failed:', error);
    showResults(`Error: ${error.message}`, 'error');
  } finally {
    document.getElementById('testBtn').disabled = false;
    document.getElementById('testBtn').style.display = 'inline-block';
    document.getElementById('stopBtn').style.display = 'none';
  }
}

/**
 * Show results
 */
function showResults(text, type) {
  const resultsBox = document.getElementById('results');
  resultsBox.textContent = text;
  resultsBox.className = `results-box ${type}`;
  if (type === 'info') {
    resultsBox.innerHTML = `<div class="spinner"></div> ${text}`;
  }
}

/**
 * Show setup instructions
 */
function showSetupInstructions() {
  if (!currentAgent) return;

  const setupCode = document.getElementById('setupCode');
  const setupText = document.getElementById('setupText');

  const instructions = `# Use in Claude Code

1. Start the MCP Server:
   npm run mcp

2. In Claude Code, connect to the MCP server:
   @mcp http://localhost:3001

3. Use your agent:
   @run_agent agent_id=${currentAgent.id} input="Your request here"

4. With browser steps:
   @run_agent agent_id=${currentAgent.id} input="Your request" browser_steps=[
     {"action": "navigate", "url": "https://example.com"},
     {"action": "extractText", "selector": "body"}
   ]

Available Agents:
${agents.map(a => `  - ${a.id}: ${a.name}`).join('\n')}

Browser Tools:
  - browser_navigate(url)
  - browser_click(selector)
  - browser_type(selector, text)
  - browser_extractText(selector)
  - browser_screenshot()
  - browser_waitFor(selector, timeout)
  - browser_submit(selector)
  - browser_scroll(direction, amount)`;

  setupText.textContent = instructions;
  setupCode.style.display = 'block';

  // Copy to clipboard
  navigator.clipboard.writeText(instructions).then(() => {
    alert('Setup instructions copied to clipboard!');
  });
}

/**
 * Update connection status
 */
function updateConnectionStatus(connected) {
  const status = document.getElementById('status');
  const connectBtn = document.getElementById('connectBtn');

  if (connected) {
    status.textContent = '✓ Connected';
    status.className = 'status connected';
    connectBtn.textContent = 'Reconnect';
  } else {
    status.textContent = '✗ Disconnected';
    status.className = 'status disconnected';
    connectBtn.textContent = 'Connect to MCP Server';
  }
}

console.log('Dashboard initialized');
