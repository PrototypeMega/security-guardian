const chalk = require('chalk');
const GitLabClient = require('../lib/gitlab-client');
const ClaudeClient = require('../lib/claude-client');
const RepoAnalyzer = require('../lib/repo-analyzer');

/**
 * Onboarding Copilot Agent
 * Generates personalized onboarding guides for new contributors
 */
class OnboardingCopilot {
  constructor(gitlabToken, claudeApiKey) {
    this.gitlab = new GitLabClient(process.env.GITLAB_BASE_URL, gitlabToken);
    this.claude = new ClaudeClient(claudeApiKey);
  }

  /**
   * Execute the agent
   * Main pipeline: fetch repo → analyze → prompt Claude → generate artifacts → post to GitLab
   */
  async execute(event, prisma) {
    const startTime = Date.now();
    const { id: eventId, project_id: projectId, project_name } = event;

    try {
      console.log(
        chalk.blue(`[Onboarding Copilot]`),
        `Starting for project ${chalk.cyan(project_name)}`
      );

      // Step 1: Fetch repo data
      console.log(chalk.gray('  → Fetching repository structure...'));
      const [repoTree, projectInfo, readmeContent, packageJsonContent] = await Promise.all([
        this.gitlab.getRepoTree(projectId),
        this.gitlab.getProjectInfo(projectId),
        this.gitlab.getFileContent(projectId, 'README.md'),
        this.gitlab.getFileContent(projectId, 'package.json')
      ]);

      if (!projectInfo) {
        throw new Error('Could not fetch project info from GitLab');
      }

      // Step 2: Analyze repository
      console.log(chalk.gray('  → Analyzing repository...'));
      const analysis = RepoAnalyzer.analyzeRepo(
        projectInfo,
        repoTree,
        readmeContent,
        packageJsonContent
      );

      console.log(chalk.gray(`    Stack: ${analysis.stack.join(', ')}`));
      console.log(chalk.gray(`    Type: ${analysis.projectType}`));
      console.log(chalk.gray(`    Languages: ${analysis.languages.join(', ')}`));

      // Step 3: Generate guide with Claude
      console.log(chalk.gray('  → Calling Claude API...'));
      const claudeResult = await this.claude.generateOnboardingGuide(analysis);

      if (!claudeResult.success) {
        throw new Error('Claude API call failed');
      }

      console.log(
        chalk.gray(`    Generated guide (${claudeResult.tokensUsed} tokens)`),
        `${claudeResult.guide.length} chars`
      );

      // Step 4: Post to GitLab
      console.log(chalk.gray('  → Posting results to GitLab...'));
      const issue = await this.gitlab.createIssue(projectId, {
        title: `Welcome to ${projectInfo.name}! 🚀 Onboarding Guide`,
        description: this.formatIssueDescription(claudeResult, analysis),
        labels: ['onboarding', 'ai-generated']
      });

      if (!issue.success) {
        throw new Error('Failed to create GitLab issue');
      }

      // Step 5: Log success
      const duration = Date.now() - startTime;

      console.log(
        chalk.green(`  ✓ Complete in ${duration}ms`),
        `Issue: ${chalk.cyan(issue.web_url)}`
      );

      // Store in database
      if (prisma) {
        await prisma.onboardingGuide.create({
          data: {
            project_id: projectId,
            project_name: projectInfo.name,
            guide_content: claudeResult.guide,
            starter_issues: JSON.stringify(claudeResult.starterIssues),
            gitlab_issue_url: issue.web_url
          }
        });
      }

      return {
        success: true,
        agent: 'onboarding-copilot',
        issue_url: issue.web_url,
        issue_id: issue.id,
        guide_length: claudeResult.guide.length,
        starter_issues_count: claudeResult.starterIssues.length,
        duration_ms: duration,
        tokens_used: claudeResult.tokensUsed
      };
    } catch (error) {
      console.error(
        chalk.red(`[Onboarding Copilot] ✗ Error:`),
        error.message
      );

      return {
        success: false,
        agent: 'onboarding-copilot',
        error: error.message,
        duration_ms: Date.now() - startTime
      };
    }
  }

  /**
   * Format the complete issue description
   * Includes guide + starter issues + metadata
   */
  formatIssueDescription(claudeResult, analysis) {
    let description = claudeResult.guide;

    // Add starter issues section
    if (claudeResult.starterIssues && claudeResult.starterIssues.length > 0) {
      description += '\n\n## Suggested Starter Issues for New Contributors\n\n';

      for (const issue of claudeResult.starterIssues) {
        description += `### ${issue.title}\n`;
        description += `${issue.description}\n\n`;

        if (issue.labels && issue.labels.length > 0) {
          description += `Labels: \`${issue.labels.join('`, `')}\`\n\n`;
        }
      }
    }

    // Add metadata
    description += '\n\n---\n\n';
    description += '## Project Metadata\n\n';
    description += `- **Primary Languages**: ${analysis.languages.join(', ')}\n`;
    description += `- **Tech Stack**: ${analysis.stack.join(', ')}\n`;
    description += `- **Project Type**: ${analysis.projectType}\n`;
    description += `- **Has Tests**: ${analysis.hasTests ? '✅ Yes' : '❌ No'}\n`;

    if (analysis.testFramework) {
      description += `- **Test Framework**: ${analysis.testFramework}\n`;
    }

    if (analysis.ci) {
      description += `- **CI/CD**: ${analysis.ci}\n`;
    }

    description += `- **License**: ${analysis.license}\n`;
    description += '\n_This guide was automatically generated by the AI Dev Team Labs Onboarding Copilot._\n';

    return description;
  }
}

module.exports = OnboardingCopilot;
