/**
 * MCP Server
 * Exposes agents and browser tools to Claude Code via MCP protocol
 *
 * This server provides:
 * - Browser automation tools (click, type, navigate, screenshot, etc.)
 * - Agent execution tools (run_agent with optional browser steps)
 */

const express = require('express');
const chalk = require('chalk');
const BrowserManager = require('./browser-manager');
const AgentEngine = require('./agent-engine');

const app = express();
const MCP_PORT = process.env.MCP_PORT || 3001;

// Initialize core components
let browserManager = null;
let agentEngine = null;

/**
 * Tool definitions exposed via MCP
 * Claude Code will have access to these tools
 */
const tools = [
  // Agent Tools
  {
    name: 'run_agent',
    description: 'Run an AI agent (Onboarding Copilot, Feature Planner, Test Generator, Security Patch Agent)',
    parameters: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'Agent ID: onboarding-copilot, feature-planner, test-generator, or security-patch-agent',
          enum: ['onboarding-copilot', 'feature-planner', 'test-generator', 'security-patch-agent']
        },
        input: {
          type: 'string',
          description: 'The request/context for the agent to process'
        },
        browser_steps: {
          type: 'array',
          description: 'Optional browser automation steps before agent reasoning',
          items: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['navigate', 'click', 'type', 'extractText', 'screenshot', 'waitFor', 'submit']
              },
              url: { type: 'string', description: 'For navigate action' },
              selector: { type: 'string', description: 'CSS selector for click, type, extract, wait, submit' },
              text: { type: 'string', description: 'Text to type' },
              timeout: { type: 'number', description: 'Timeout in ms for waitFor' }
            }
          }
        }
      },
      required: ['agent_id', 'input']
    }
  },

  // Browser Tools
  {
    name: 'browser_navigate',
    description: 'Navigate to a URL in the browser',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to navigate to' },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      },
      required: ['url']
    }
  },
  {
    name: 'browser_click',
    description: 'Click an element on the page',
    parameters: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of element to click' },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      },
      required: ['selector']
    }
  },
  {
    name: 'browser_type',
    description: 'Type text into an input element',
    parameters: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of input element' },
        text: { type: 'string', description: 'Text to type' },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      },
      required: ['selector', 'text']
    }
  },
  {
    name: 'browser_extractText',
    description: 'Extract text content from the page',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'CSS selector (default: body for entire page)',
          default: 'body'
        },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      }
    }
  },
  {
    name: 'browser_screenshot',
    description: 'Take a screenshot of the current page',
    parameters: {
      type: 'object',
      properties: {
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      }
    }
  },
  {
    name: 'browser_waitFor',
    description: 'Wait for an element to appear on the page',
    parameters: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of element to wait for' },
        timeout: { type: 'number', description: 'Timeout in milliseconds (default: 5000)' },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      },
      required: ['selector']
    }
  },
  {
    name: 'browser_submit',
    description: 'Submit a form',
    parameters: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of submit button or form' },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      },
      required: ['selector']
    }
  },
  {
    name: 'browser_scroll',
    description: 'Scroll the page',
    parameters: {
      type: 'object',
      properties: {
        direction: {
          type: 'string',
          enum: ['up', 'down'],
          description: 'Scroll direction'
        },
        amount: { type: 'number', description: 'Number of units to scroll (default: 3)' },
        session_id: { type: 'string', description: 'Browser session ID (optional)' }
      },
      required: ['direction']
    }
  },
  {
    name: 'list_agents',
    description: 'List available agents',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];

// Middleware
app.use(express.json());

// Serve static dashboard files
const path = require('path');
app.use(express.static(path.join(__dirname, '../dashboard')));

/**
 * MCP Server Endpoints
 * These follow the Model Context Protocol
 */

// Tool list endpoint - Claude Code calls this to discover available tools
app.post('/mcp/tools/list', (req, res) => {
  console.log(chalk.blue('📋 Tool list requested'));
  res.json({ tools });
});

// Tool execution endpoint - Claude Code calls this to use a tool
app.post('/mcp/tools/execute', async (req, res) => {
  const { name, input } = req.body;

  console.log(chalk.blue(`\n🔧 Tool execution: ${name}`));

  try {
    let result;

    // Agent tools
    if (name === 'run_agent') {
      const { agent_id, input: userInput, browser_steps } = input;
      result = await agentEngine.run(agent_id, userInput, browser_steps || []);
    }

    // Browser tools
    else if (name === 'browser_navigate') {
      result = await browserManager.navigate(input.url, input.session_id);
    } else if (name === 'browser_click') {
      result = await browserManager.click(input.selector, input.session_id);
    } else if (name === 'browser_type') {
      result = await browserManager.type(input.selector, input.text, input.session_id);
    } else if (name === 'browser_extractText') {
      result = await browserManager.extractText(input.selector || 'body', input.session_id);
    } else if (name === 'browser_screenshot') {
      result = await browserManager.screenshot(input.session_id);
    } else if (name === 'browser_waitFor') {
      result = await browserManager.waitFor(input.selector, input.timeout || 5000, input.session_id);
    } else if (name === 'browser_submit') {
      result = await browserManager.submit(input.selector, input.session_id);
    } else if (name === 'browser_scroll') {
      result = await browserManager.scroll(input.direction, input.amount || 3, input.session_id);
    } else if (name === 'list_agents') {
      result = { agents: agentEngine.listAgents() };
    } else {
      result = { error: `Unknown tool: ${name}` };
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error(chalk.red(`✗ Tool execution failed: ${error.message}`));
    res.status(500).json({ success: false, error: error.message });
  }
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'AI Dev Team MCP Server',
    version: '1.0.0',
    description: 'MCP server for agents with browser automation',
    tools: tools.length,
    agents: agentEngine.listAgents()
  });
});

/**
 * Initialize server
 */
async function initialize() {
  try {
    console.log(chalk.cyan.bold('\n🚀 AI Dev Team - MCP Server'));
    console.log(chalk.gray('================================\n'));

    // Initialize browser manager
    console.log(chalk.blue('Initializing browser manager...'));
    browserManager = new BrowserManager();
    const browserReady = await browserManager.init();

    if (!browserReady) {
      console.warn(chalk.yellow('⚠️  Browser failed to initialize - browser features will not work'));
      // Continue anyway for testing
    }

    // Initialize agent engine
    console.log(chalk.blue('Initializing agent engine...'));
    agentEngine = new AgentEngine(browserManager);
    const agents = agentEngine.listAgents();
    console.log(chalk.green(`✓ Loaded ${agents.length} agents`));
    agents.forEach(agent => {
      console.log(chalk.gray(`  - ${agent.name}: ${agent.description}`));
    });

    // Start server
    app.listen(MCP_PORT, () => {
      console.log(chalk.green(`\n✓ MCP Server running on http://localhost:${MCP_PORT}`));
      console.log(chalk.gray(`\nEndpoints:`));
      console.log(chalk.gray(`  POST /mcp/tools/list - List available tools`));
      console.log(chalk.gray(`  POST /mcp/tools/execute - Execute a tool`));
      console.log(chalk.gray(`  GET  / - Server info`));
      console.log(chalk.gray(`\nUsage in Claude Code:`));
      console.log(chalk.cyan(`  @mcp http://localhost:${MCP_PORT}`));
      console.log(chalk.cyan(`  @run_agent agent_id=feature-planner input="Plan dark mode"`));
      console.log(chalk.gray(`\nPress Ctrl+C to stop\n`));
    });
  } catch (error) {
    console.error(chalk.red(`✗ Initialization failed: ${error.message}`));
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nShutting down...'));
  if (browserManager) {
    await browserManager.close();
  }
  process.exit(0);
});

// Start the server
initialize();

module.exports = app;
