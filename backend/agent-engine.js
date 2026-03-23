/**
 * Agent Engine
 * Runs agents with Claude API and optional browser automation
 */

const Anthropic = require('@anthropic-ai/sdk');
const chalk = require('chalk');
const { getAgent, getSystemPrompt } = require('./agents-config');

class AgentEngine {
  constructor(browserManager) {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
    this.browserManager = browserManager;
    this.model = 'claude-3-5-sonnet-20241022';
  }

  /**
   * Run an agent with optional browser steps
   * @param {string} agentId - Agent identifier
   * @param {string} userInput - User's request/context
   * @param {Array} browserSteps - Optional steps to execute before agent reasoning
   * @param {string} sessionId - Browser session ID
   * @returns {Promise<Object>} Agent response
   */
  async run(agentId, userInput, browserSteps = [], sessionId = 'default') {
    try {
      const agent = getAgent(agentId);
      if (!agent) {
        return {
          success: false,
          error: `Agent not found: ${agentId}`,
          available_agents: Object.keys(require('./agents-config').agents)
        };
      }

      console.log(chalk.cyan.bold(`\n🤖 Running Agent: ${agent.name}`));
      console.log(chalk.gray(`   Input: ${userInput.substring(0, 100)}...`));

      // Step 1: Execute browser steps if provided
      let browserContext = '';
      if (browserSteps && browserSteps.length > 0) {
        console.log(chalk.blue(`\n🌐 Executing ${browserSteps.length} browser steps...`));
        browserContext = await this._executeBrowserSteps(browserSteps, sessionId);
      }

      // Step 2: Call Claude API with system prompt
      const messages = [
        {
          role: 'user',
          content: userInput + (browserContext ? `\n\n[Browser Context gathered from automated steps]\n${browserContext}` : '')
        }
      ];

      console.log(chalk.blue('\n🧠 Calling Claude API...'));
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system: agent.systemPrompt,
        messages
      });

      const agentResponse = response.content[0].text;

      console.log(chalk.green(`\n✓ Agent response generated (${agentResponse.length} characters)`));

      return {
        success: true,
        agent: agent.name,
        agentId,
        response: agentResponse,
        browserSteps: browserSteps.length,
        browserContext: browserContext ? `[Browser automation provided context]` : null,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(chalk.red(`\n✗ Agent execution failed: ${error.message}`));
      return {
        success: false,
        agent: agentId,
        error: error.message
      };
    }
  }

  /**
   * Execute browser steps and gather context
   * @private
   */
  async _executeBrowserSteps(steps, sessionId) {
    let context = '';

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(chalk.blue(`\n  Step ${i + 1}/${steps.length}: ${step.action}`));

      try {
        let result;
        switch (step.action) {
          case 'navigate':
            result = await this.browserManager.navigate(step.url, sessionId);
            if (result.success) {
              context += `\n[Navigation] Navigated to: ${step.url}`;
            }
            break;

          case 'click':
            result = await this.browserManager.click(step.selector, sessionId);
            if (result.success) {
              context += `\n[Action] Clicked on: ${step.selector}`;
            }
            break;

          case 'type':
            result = await this.browserManager.type(step.selector, step.text, sessionId);
            if (result.success) {
              context += `\n[Action] Typed into ${step.selector}: "${step.text}"`;
            }
            break;

          case 'extractText':
            result = await this.browserManager.extractText(step.selector, sessionId);
            if (result.success) {
              context += `\n[Content] Text extracted from ${step.selector}:\n${result.text.substring(0, 1000)}...`;
            }
            break;

          case 'screenshot':
            result = await this.browserManager.screenshot(sessionId);
            if (result.success) {
              context += `\n[Screenshot] Page screenshot captured`;
            }
            break;

          case 'waitFor':
            result = await this.browserManager.waitFor(step.selector, step.timeout || 5000, sessionId);
            if (result.success) {
              context += `\n[Wait] Element found: ${step.selector}`;
            }
            break;

          case 'submit':
            result = await this.browserManager.submit(step.selector, sessionId);
            if (result.success) {
              context += `\n[Action] Form submitted: ${step.selector}`;
            }
            break;

          default:
            console.log(chalk.yellow(`    ⚠️  Unknown action: ${step.action}`));
        }

        if (!result.success) {
          context += `\n[Error] Failed to execute ${step.action}: ${result.error}`;
        }
      } catch (error) {
        console.error(chalk.red(`    ✗ Error: ${error.message}`));
        context += `\n[Error] ${error.message}`;
      }
    }

    return context;
  }

  /**
   * List available agents
   */
  listAgents() {
    const { getAllAgents } = require('./agents-config');
    return getAllAgents().map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description
    }));
  }
}

module.exports = AgentEngine;
