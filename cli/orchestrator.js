require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const chalk = require('chalk');
const OnboardingCopilot = require('../backend/agents/onboarding-copilot');

const prisma = new PrismaClient();

/**
 * Event Orchestrator
 * Polls database for queued events and dispatches to agents
 */
class Orchestrator {
  constructor() {
    this.isRunning = false;
    this.pollInterval = 5000; // 5 seconds
  }

  /**
   * Main orchestrator loop
   */
  async run() {
    this.isRunning = true;

    console.log(chalk.blue.bold('\n🎼 Event Orchestrator\n'));
    console.log(chalk.gray(`Polling for events every ${this.pollInterval}ms`));
    console.log(chalk.gray('Ctrl+C to stop\n'));

    while (this.isRunning) {
      try {
        await this.processQueuedEvents();
      } catch (error) {
        console.error(chalk.red('[ORCHESTRATOR] ✗ Error:'), error.message);
      }

      // Wait before next poll
      await this.sleep(this.pollInterval);
    }
  }

  /**
   * Find and process queued events
   */
  async processQueuedEvents() {
    const queuedEvents = await prisma.event.findMany({
      where: { status: 'queued' },
      orderBy: { created_at: 'asc' },
      take: 5
    });

    if (queuedEvents.length === 0) {
      return;
    }

    console.log(
      chalk.cyan(`[${new Date().toISOString().slice(11, 19)}]`),
      `Found ${queuedEvents.length} queued event(s)`
    );

    for (const event of queuedEvents) {
      await this.processEvent(event);
    }
  }

  /**
   * Process a single event
   */
  async processEvent(event) {
    const startTime = Date.now();

    try {
      // Update status to processing
      await prisma.event.update({
        where: { id: event.id },
        data: { status: 'processing' }
      });

      console.log(
        chalk.blue(`  [Event ${event.id}]`),
        `${event.event_type.toUpperCase()}`,
        `on ${chalk.cyan(event.project_name)}`
      );

      // Route to appropriate agent
      let agentResult;
      if (event.event_type === 'push') {
        console.log(chalk.gray(`    → Dispatching to onboarding-copilot...`));

        // Initialize agent
        const agent = new OnboardingCopilot(
          process.env.GITLAB_API_TOKEN,
          process.env.CLAUDE_API_KEY
        );

        // Execute agent
        agentResult = await agent.execute(event, prisma);
      } else {
        agentResult = {
          success: false,
          error: `No agent for event type: ${event.event_type}`
        };
      }

      const duration = Date.now() - startTime;

      if (agentResult.success) {
        // Mark as complete
        await prisma.event.update({
          where: { id: event.id },
          data: {
            status: 'complete',
            processed_at: new Date()
          }
        });

        // Log agent run
        await prisma.agentRun.create({
          data: {
            event_id: event.id,
            agent_name: agentResult.agent || 'unknown',
            status: 'success',
            input: event.payload,
            output: JSON.stringify(agentResult),
            duration_ms: duration
          }
        });

        console.log(
          chalk.green(`    ✓ Complete`),
          chalk.gray(`(${duration}ms)`)
        );
      } else {
        // Mark as failed
        await prisma.event.update({
          where: { id: event.id },
          data: {
            status: 'failed',
            error: agentResult.error,
            processed_at: new Date()
          }
        });

        // Log agent run
        await prisma.agentRun.create({
          data: {
            event_id: event.id,
            agent_name: 'unknown',
            status: 'failed',
            input: event.payload,
            error: agentResult.error || 'Unknown error',
            duration_ms: duration
          }
        });

        console.log(
          chalk.red(`    ✗ Failed:`),
          agentResult.error
        );
      }
    } catch (error) {
      // Mark as failed with error
      await prisma.event.update({
        where: { id: event.id },
        data: {
          status: 'failed',
          error: error.message,
          processed_at: new Date()
        }
      });

      console.log(
        chalk.red(`    ✗ Error:`),
        error.message
      );
    }
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Stop orchestrator
   */
  stop() {
    this.isRunning = false;
  }
}

/**
 * Start orchestrator
 */
async function main() {
  try {
    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log(chalk.green('✓ Database connected'));

    const orchestrator = new Orchestrator();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\n\nShutting down...\n'));
      orchestrator.stop();
      await prisma.$disconnect();
      process.exit(0);
    });

    // Start processing
    await orchestrator.run();
  } catch (error) {
    console.error(chalk.red('✗ Failed to start orchestrator:'), error.message);
    process.exit(1);
  }
}

main();
