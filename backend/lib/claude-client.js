const { Anthropic } = require('@anthropic-ai/sdk');
const chalk = require('chalk');

class ClaudeClient {
  constructor(apiKey = process.env.CLAUDE_API_KEY) {
    this.client = new Anthropic({ apiKey });
    this.model = 'claude-3-5-sonnet-20241022';
  }

  async generateOnboardingGuide(repoAnalysis) {
    try {
      console.log(chalk.cyan(`  🤖 Calling Claude to generate guide`));

      const prompt = `You are an expert onboarding guide writer for software developers.

A new contributor is joining this project. Generate a comprehensive onboarding guide.

**Project Information:**
- Name: ${repoAnalysis.name}
- Description: ${repoAnalysis.description || 'No description'}
- Primary Languages: ${repoAnalysis.languages.join(', ') || 'Unknown'}
- Key Files: ${repoAnalysis.keyFiles.join(', ') || 'None detected'}

**Repository Structure Summary:**
${repoAnalysis.structureSummary}

**README Content:**
${repoAnalysis.readme ? repoAnalysis.readme.substring(0, 500) : 'No README found'}

Please generate a JSON response with this structure:
{
  "guide": "# Welcome to ${repoAnalysis.name}! 🚀\n\n[A detailed markdown guide with 5-10 sections covering setup, architecture, development workflow, common tasks, and resources]",
  "starterIssues": [
    {
      "title": "Issue title",
      "description": "Issue description",
      "labels": ["good-first-issue", "documentation"]
    }
  ]
}

Make the guide practical, friendly, and specific to this project. Suggest 3-5 starter issues for a new developer.`;

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const responseText = message.content[0].text;
      
      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn(chalk.yellow(`  ⚠️  Could not extract JSON from response`));
        return this.createDefaultGuide(repoAnalysis);
      }

      const result = JSON.parse(jsonMatch[0]);
      console.log(chalk.green(`  ✓ Guide generated successfully`));
      return result;

    } catch (error) {
      console.error(chalk.red(`  ✗ Claude API error: ${error.message}`));
      console.log(chalk.yellow(`  ⚠️  Falling back to default guide`));
      return this.createDefaultGuide(repoAnalysis);
    }
  }

  createDefaultGuide(repoAnalysis) {
    return {
      guide: `# Welcome to ${repoAnalysis.name}! 🚀

## Getting Started

1. **Clone the repository**
2. **Install dependencies** (see README)
3. **Read the documentation**
4. **Check out starter issues**

## Project Structure
${repoAnalysis.structureSummary}

## Technologies
${repoAnalysis.languages.join(', ')}

## Next Steps
- Review the main README
- Set up your development environment
- Check open issues marked with "good-first-issue"
- Ask questions in discussions!

Good luck! Welcome to the team! 👋`,
      starterIssues: [
        {
          title: 'Review and improve documentation',
          description: 'Help us improve the README and getting started guide',
          labels: ['documentation', 'good-first-issue']
        },
        {
          title: 'Add helpful comments to codebase',
          description: 'Help improve code clarity by adding comments',
          labels: ['documentation', 'good-first-issue']
        }
      ]
    };
  }
}

module.exports = ClaudeClient;
