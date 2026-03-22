const Anthropic = require('@anthropic-ai/sdk');
const chalk = require('chalk');

/**
 * Claude API Client
 * Wrapper around Anthropic's Claude API
 */
class ClaudeClient {
  constructor(apiKey) {
    this.client = new Anthropic({
      apiKey: apiKey
    });
    this.model = 'claude-3-5-sonnet-20241022';
    this.maxTokens = 2048;
  }

  /**
   * Generate onboarding guide for a repository
   * Takes repo analysis and returns structured guide + starter issues
   */
  async generateOnboardingGuide(repoAnalysis) {
    try {
      const { name, description, stack, languages, projectType, structure, readmeExcerpt } = repoAnalysis;

      const systemPrompt = `You are an expert software engineer and technical documentation writer specializing in contributor onboarding.

Your task is to generate welcoming, actionable onboarding guides for new contributors to projects.

Guidelines:
- Focus on practical next steps, not abstract concepts
- Include file/directory explanations with specific paths
- Suggest 3-5 starter issues that are low-complexity but educational
- Use clear, encouraging tone
- Keep the guide to 400-600 words maximum
- Format as markdown
- Return valid JSON with no markdown code fences`;

      const userPrompt = `Generate an onboarding guide for a new contributor to this project.

**Project Details:**
- Name: ${name}
- Description: ${description}
- Primary Language(s): ${languages.join(', ')}
- Tech Stack: ${stack.join(', ')}
- Project Type: ${projectType}

**Repository Structure:**
\`\`\`
${structure}
\`\`\`

**README Excerpt:**
${readmeExcerpt || '(No README found)'}

**Response Format (valid JSON):**
{
  "guide": "# Welcome to ${name}! 🚀\\n\\n[Your 5-step onboarding checklist in markdown]",
  "starterIssues": [
    {
      "title": "Issue title",
      "description": "Brief description suitable for a new contributor",
      "labels": ["good-first-issue", "documentation"]
    }
  ],
  "keyDirectories": [
    {
      "path": "src/",
      "description": "Main source code"
    }
  ]
}`;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt
      });

      // Extract text from response
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Parse JSON response
      let result;
      try {
        result = JSON.parse(content.text);
      } catch (e) {
        // Try to extract JSON from markdown code fences if present
        const jsonMatch = content.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('Failed to parse Claude response as JSON');
        }
      }

      return {
        success: true,
        guide: result.guide,
        starterIssues: result.starterIssues || [],
        keyDirectories: result.keyDirectories || [],
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens
      };
    } catch (error) {
      console.error(
        chalk.red('[Claude] Error generating guide:'),
        error.message
      );
      throw error;
    }
  }

  /**
   * Generic message to Claude
   * For custom prompts beyond onboarding
   */
  async message(systemPrompt, userPrompt) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      return {
        success: true,
        text: content.text,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens
      };
    } catch (error) {
      console.error(
        chalk.red('[Claude] Error in message:'),
        error.message
      );
      throw error;
    }
  }

  /**
   * Test connection - make a simple API call
   */
  async testConnection() {
    try {
      await this.message('You are a helpful assistant.', 'Say "ready" if you can hear me.');
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = ClaudeClient;
