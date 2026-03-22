const chalk = require('chalk');
const OnboardingCopilotAgent = require('./agents/onboarding-copilot');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const agent = new OnboardingCopilotAgent();

async function testAgent() {
  console.log(chalk.cyan.bold('\n🧪 Testing Onboarding Copilot Agent with Fixture Data\n'));

  // Mock event with test project
  const testEvent = {
    id: 999,
    event_type: 'push',
    project_id: 0, // Demo mode
    payload: JSON.stringify({
      event_name: 'push',
      project_id: 0, // Demo mode - won't try to create real issues
      ref: 'refs/heads/main'
    })
  };

  try {
    const result = await agent.execute(testEvent, prisma);
    
    console.log(chalk.green.bold(`\n✅ TEST PASSED!\n`));
    console.log(chalk.cyan('Agent output:'));
    console.log(JSON.stringify(result, null, 2));
    
    // Check if guide was saved
    const guides = await prisma.onboardingGuide.findMany({ take: 1 });
    if (guides.length > 0) {
      console.log(chalk.green(`\n✓ Guide saved to database`));
      console.log(chalk.gray(`  Guide ID: ${guides[0].id}`));
    }

  } catch (error) {
    console.error(chalk.red.bold(`\n❌ TEST FAILED!\n`));
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAgent();
