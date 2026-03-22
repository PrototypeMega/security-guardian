require('dotenv').config();
const chalk = require('chalk');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

    // For now, just simulate processing
    // In Day 2, this will call the actual agent
    console.log(chalk.cyan(`   Event type: ${event.event_type}`));
    console.log(chalk.cyan(`   Project ID: ${event.project_id}`));
    
    // Simulate agent work
    await sleep(2000);

    // Mark as complete
    await prisma.event.update({
      where: { id: event.id },
      data: { status: 'complete' }
    });

    console.log(chalk.green(`✓ Event ${event.id} completed`));

  } catch (error) {
    console.error(chalk.red(`✗ Error processing event ${event.id}: ${error.message}`));
    
    await prisma.event.update({
      where: { id: event.id },
      data: { 
        status: 'failed',
        payload: JSON.stringify({
          ...JSON.parse(event.payload),
          error: error.message
        })
      }
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
