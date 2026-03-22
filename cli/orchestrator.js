require('dotenv').config();
const chalk = require('chalk');
const { PrismaClient } = require('@prisma/client');
const OnboardingCopilotAgent = require('../backend/agents/onboarding-copilot');

const prisma = new PrismaClient();
const agent = new OnboardingCopilotAgent();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processEvent(event) {
  console.log(chalk.blue(`\n📦 Processing event ${event.id}...`));

  try {
    // Update status to processing
    await prisma.event.update({
      where: { id: event.id },
      data: { status: 'processing' }
    });

    // Execute the agent
    console.log(chalk.cyan(`   Event type: ${event.event_type}`));
    const payload = JSON.parse(event.payload);
    console.log(chalk.cyan(`   Project ID: ${payload.project_id || event.project_id}`));

    // Call the Onboarding Copilot Agent
    const result = await agent.execute(event, prisma);

    // Create agent run record
    await prisma.agentRun.create({
      data: {
        event_id: event.id,
        agent_name: agent.name,
        status: 'complete',
        output: JSON.stringify(result)
      }
    });

    // Mark event as complete
    await prisma.event.update({
      where: { id: event.id },
      data: { status: 'complete' }
    });

    console.log(chalk.green(`✓ Event ${event.id} completed`));

  } catch (error) {
    console.error(chalk.red(`✗ Error processing event ${event.id}: ${error.message}`));

    // Create failed agent run record
    try {
      await prisma.agentRun.create({
        data: {
          event_id: event.id,
          agent_name: agent.name,
          status: 'failed',
          error_message: error.message
        }
      });
    } catch (e) {
      console.error(chalk.red(`Could not log agent run: ${e.message}`));
    }

    // Update event status
    await prisma.event.update({
      where: { id: event.id },
      data: { status: 'failed' }
    });
  }
}

async function main() {
  console.log(chalk.cyan.bold(`\n🤖 AI Dev Team Labs - Event Orchestrator`));
  console.log(chalk.gray(`Polling for queued events every 5 seconds...`));
  console.log(chalk.gray(`Press Ctrl+C to stop\n`));

  while (true) {
    try {
      // Get queued events
      const events = await prisma.event.findMany({
        where: { status: 'queued' },
        take: 5,
        orderBy: { created_at: 'asc' }
      });

      if (events.length > 0) {
        console.log(chalk.yellow(`\n⏰ Found ${events.length} queued event(s)`));
        
        for (const event of events) {
          await processEvent(event);
        }
      }

      // Poll interval
      await sleep(5000);

    } catch (error) {
      console.error(chalk.red(`✗ Orchestrator error: ${error.message}`));
      await sleep(5000);
    }
  }
}

// Start orchestrator
main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error.message}`));
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nShutting down orchestrator...'));
  await prisma.$disconnect();
  process.exit(0);
});
