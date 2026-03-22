/**
 * Test the Onboarding Copilot agent with mock data
 * Run: node __tests__/agent-test.js
 */

require('dotenv').config();
const chalk = require('chalk');
const OnboardingCopilot = require('../backend/agents/onboarding-copilot');
const RepoAnalyzer = require('../backend/lib/repo-analyzer');

// Mock data for a typical Node.js project
const mockProjectInfo = {
  id: 1,
  name: 'my-awesome-project',
  description: 'A powerful Node.js web framework',
  license_type: 'MIT'
};

const mockRepoTree = [
  { name: 'src', type: 'tree', path: 'src' },
  { name: 'package.json', type: 'blob', path: 'package.json' },
  { name: 'README.md', type: 'blob', path: 'README.md' },
  { name: '.gitignore', type: 'blob', path: '.gitignore' },
  { name: 'index.js', type: 'blob', path: 'index.js' },
  { name: 'server.js', type: 'blob', path: 'server.js' },
  { name: 'config.js', type: 'blob', path: 'config.js' },
  { name: 'tests', type: 'tree', path: 'tests' },
  { name: 'tsconfig.json', type: 'blob', path: 'tsconfig.json' },
  { name: 'prettier.config.js', type: 'blob', path: 'prettier.config.js' }
];

const mockReadme = `# My Awesome Project

A powerful Node.js web framework for building scalable applications.

## Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file based on \`.env.example\`
4. Start the server: \`npm run dev\`

## Development

- \`npm run dev\` - Start development server
- \`npm test\` - Run test suite
- \`npm run build\` - Build for production

## Contributing

We welcome contributions! Please read our CONTRIBUTING.md file first.

## License

MIT`;

const mockPackageJson = `{
  "name": "my-awesome-project",
  "version": "1.0.0",
  "description": "A powerful Node.js web framework",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "test": "jest",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.0"
  }
}`;

/**
 * Test agent with mock data
 */
async function testAgent() {
  console.log(chalk.blue.bold('\n🧪 Testing Onboarding Copilot Agent\n'));

  try {
    // Test 1: Repo Analyzer
    console.log(chalk.yellow('Test 1: Repository Analyzer'));
    const analysis = RepoAnalyzer.analyzeRepo(
      mockProjectInfo,
      mockRepoTree,
      mockReadme,
      mockPackageJson
    );

    console.log(chalk.green('  ✓ Analysis complete:'));
    console.log(chalk.gray(`    Project: ${analysis.name}`));
    console.log(chalk.gray(`    Languages: ${analysis.languages.join(', ')}`));
    console.log(chalk.gray(`    Stack: ${analysis.stack.join(', ')}`));
    console.log(chalk.gray(`    Type: ${analysis.projectType}`));
    console.log(chalk.gray(`    Has Tests: ${analysis.hasTests}`));
    console.log(chalk.gray(`    Test Framework: ${analysis.testFramework}`));

    // Test 2: Claude Integration
    console.log(chalk.yellow('\nTest 2: Claude API Integration'));

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey || apiKey === 'sk-ant-xxxxxxxxxxxxx') {
      console.log(
        chalk.yellow('  ⚠️  CLAUDE_API_KEY not configured'),
        '- skipping Claude test'
      );
      console.log(chalk.gray('    Set CLAUDE_API_KEY in .env to test'));
    } else {
      const ClaudeClient = require('../backend/lib/claude-client');
      const claude = new ClaudeClient(apiKey);

      console.log(chalk.gray('  Testing Claude connection...'));
      const connected = await claude.testConnection();

      if (connected) {
        console.log(chalk.green('  ✓ Claude API is working'));

        console.log(chalk.gray('  Generating onboarding guide...'));
        const result = await claude.generateOnboardingGuide(analysis);

        if (result.success) {
          console.log(chalk.green('  ✓ Guide generated:'));
          console.log(chalk.gray(`    Length: ${result.guide.length} chars`));
          console.log(chalk.gray(`    Starter Issues: ${result.starterIssues.length}`));
          console.log(chalk.gray(`    Tokens Used: ${result.tokensUsed}`));

          // Print first 200 chars of guide
          console.log(chalk.gray('\n  Guide Preview:'));
          console.log(chalk.gray('  ' + result.guide.substring(0, 200) + '...\n'));

          // Print starter issues
          if (result.starterIssues.length > 0) {
            console.log(chalk.gray('  Starter Issues:'));
            for (const issue of result.starterIssues) {
              console.log(chalk.gray(`    • ${issue.title}`));
            }
          }
        } else {
          console.log(chalk.red('  ✗ Failed to generate guide'));
        }
      } else {
        console.log(chalk.red('  ✗ Claude API connection failed'));
        console.log(chalk.gray('    Check your CLAUDE_API_KEY'));
      }
    }

    // Test 3: GitLab Integration (optional)
    console.log(chalk.yellow('\nTest 3: GitLab API Integration'));

    const gitlabToken = process.env.GITLAB_API_TOKEN;
    if (!gitlabToken || gitlabToken === 'glpat-xxxxxxxxxxxxx') {
      console.log(
        chalk.yellow('  ⚠️  GITLAB_API_TOKEN not configured'),
        '- skipping GitLab test'
      );
      console.log(chalk.gray('    Set GITLAB_API_TOKEN in .env to test'));
    } else {
      const GitLabClient = require('../backend/lib/gitlab-client');
      const gitlab = new GitLabClient(process.env.GITLAB_BASE_URL, gitlabToken);

      console.log(chalk.gray('  Testing GitLab connection...'));
      const connected = await gitlab.testConnection();

      if (connected) {
        console.log(chalk.green('  ✓ GitLab API is working'));
      } else {
        console.log(chalk.red('  ✗ GitLab API connection failed'));
        console.log(chalk.gray('    Check your GITLAB_API_TOKEN'));
      }
    }

    console.log(chalk.green.bold('\n✅ Tests complete!\n'));
  } catch (error) {
    console.error(chalk.red('✗ Test failed:'), error.message);
    process.exit(1);
  }
}

testAgent();
