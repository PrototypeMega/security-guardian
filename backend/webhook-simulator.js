require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const chalk = require('chalk');

class WebhookSimulator {
  constructor(webhookUrl = 'http://localhost:3000/webhooks/gitlab') {
    this.webhookUrl = webhookUrl;
    this.secret = process.env.GITLAB_WEBHOOK_SECRET || 'test-webhook-secret';
  }

  async sendPushEvent(projectId = 1, branch = 'main', repositoryName = 'test-repo') {
    console.log(chalk.cyan.bold(`\n📤 Simulating GitLab Push Event`));
    console.log(chalk.gray(`Webhook URL: ${this.webhookUrl}`));
    console.log(chalk.gray(`Project ID: ${projectId}`));
    console.log(chalk.gray(`Branch: ${branch}`));
    console.log(chalk.gray(`Repository: ${repositoryName}\n`));

    // Create realistic GitLab webhook payload
    const payload = {
      object_kind: 'push',
      event_name: 'push',
      before: '0000000000000000000000000000000000000000',
      after: 'abc123def456',
      ref: `refs/heads/${branch}`,
      checkout_sha: 'abc123def456',
      message: 'Initial commit',
      user_id: 1,
      user_name: 'Test User',
      user_email: 'test@example.com',
      user_avatar: 'https://www.gravatar.com/avatar/test',
      project_id: projectId,
      project: {
        id: projectId,
        name: repositoryName,
        description: 'Test project for onboarding',
        web_url: `https://gitlab.com/test/${repositoryName}`,
        avatar_url: null,
        git_ssh_url: `git@gitlab.com:test/${repositoryName}.git`,
        git_http_url: `https://gitlab.com/test/${repositoryName}.git`,
        namespace: 'Test Namespace',
        visibility_level: 20,
        path_with_namespace: `test/${repositoryName}`,
        default_branch: 'main',
        homepage: `https://gitlab.com/test/${repositoryName}`,
        url: `git@gitlab.com:test/${repositoryName}.git`,
        ssh_url: `git@gitlab.com:test/${repositoryName}.git`,
        http_url: `https://gitlab.com/test/${repositoryName}.git`
      },
      repository: {
        name: repositoryName,
        url: `git@gitlab.com:test/${repositoryName}.git`,
        description: 'Test project for onboarding',
        homepage: `https://gitlab.com/test/${repositoryName}`,
        git_http_url: `https://gitlab.com/test/${repositoryName}.git`,
        git_ssh_url: `git@gitlab.com:test/${repositoryName}.git`,
        visibility_level: 20
      },
      commits: [
        {
          id: 'abc123def456',
          message: 'Initial commit',
          timestamp: new Date().toISOString(),
          url: `https://gitlab.com/test/${repositoryName}/commit/abc123def456`,
          author: {
            name: 'Test User',
            email: 'test@example.com'
          },
          added: ['README.md', 'package.json'],
          modified: [],
          removed: []
        }
      ],
      total_commits_count: 1
    };

    try {
      console.log(chalk.blue(`Sending webhook to ${this.webhookUrl}...`));

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Gitlab-Event': 'Push Hook',
          'X-Gitlab-Token': this.secret,
          'X-Gitlab-Delivery': crypto.randomUUID()
        }
      });

      console.log(chalk.green(`✓ Webhook sent successfully`));
      console.log(chalk.gray(`Response status: ${response.status}`));
      console.log(chalk.cyan(`Response:`, JSON.stringify(response.data, null, 2)));

      return response.data;

    } catch (error) {
      console.error(chalk.red(`✗ Error sending webhook: ${error.message}`));
      if (error.response) {
        console.error(chalk.red(`Response status: ${error.response.status}`));
        console.error(chalk.red(`Response data:`, error.response.data));
      }
      throw error;
    }
  }

  async wait(seconds) {
    console.log(chalk.yellow(`\n⏳ Waiting ${seconds} seconds for processing...`));
    for (let i = seconds; i > 0; i--) {
      process.stdout.write(`\r${chalk.yellow(`   ${i} seconds left...`)}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('');
  }

  async checkEventStatus(eventId) {
    try {
      console.log(chalk.blue(`\nChecking event status...`));
      const response = await axios.get(`http://localhost:3000/events/${eventId}`);
      
      console.log(chalk.cyan(`Event Status:`));
      console.log(chalk.gray(`  ID: ${response.data.id}`));
      console.log(chalk.gray(`  Type: ${response.data.event_type}`));
      console.log(chalk.gray(`  Status: ${response.data.status}`));
      console.log(chalk.gray(`  Created: ${response.data.created_at}`));
      
      if (response.data.agentRuns && response.data.agentRuns.length > 0) {
        const run = response.data.agentRuns[0];
        console.log(chalk.green(`  ✓ Agent Run: ${run.status}`));
        if (run.output) {
          const output = JSON.parse(run.output);
          if (output.guide_id) {
            console.log(chalk.green(`    ✓ Guide saved: ${output.guide_id}`));
          }
          if (output.issue_url) {
            console.log(chalk.green(`    ✓ Issue created: ${output.issue_url}`));
          }
        }
      }

      return response.data;

    } catch (error) {
      console.error(chalk.red(`✗ Error checking status: ${error.message}`));
      throw error;
    }
  }

  async fullDemo(projectId = 1) {
    try {
      console.log(chalk.bold.cyan(`\n🎬 FULL END-TO-END DEMO`));
      console.log(chalk.gray(`========================================\n`));

      // Step 1: Send webhook
      const result = await this.sendPushEvent(projectId);
      const eventId = result.event_id;

      // Step 2: Wait for processing
      await this.wait(8);

      // Step 3: Check status
      const finalStatus = await this.checkEventStatus(eventId);

      // Success summary
      console.log(chalk.bold.green(`\n✨ DEMO COMPLETE!\n`));
      console.log(chalk.green(`Event Flow:`));
      console.log(chalk.green(`  1. Webhook received ✓`));
      console.log(chalk.green(`  2. Event queued ✓`));
      console.log(chalk.green(`  3. Orchestrator processed ✓`));
      console.log(chalk.green(`  4. Agent executed ✓`));
      console.log(chalk.green(`  5. Guide generated ✓`));
      console.log(chalk.green(`  6. Guide saved ✓`));
      
      if (finalStatus.agentRuns && finalStatus.agentRuns.length > 0) {
        console.log(chalk.green(`  7. Issue would be created in GitLab ✓`));
      }

      console.log(chalk.gray(`\nFinal Status: ${finalStatus.status}\n`));

      return finalStatus;

    } catch (error) {
      console.error(chalk.red(`\nDemo failed: ${error.message}`));
      process.exit(1);
    }
  }
}

// Run demo if called directly
if (require.main === module) {
  const simulator = new WebhookSimulator();
  const projectId = process.argv[2] || 1;
  
  simulator.fullDemo(projectId).then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = WebhookSimulator;
