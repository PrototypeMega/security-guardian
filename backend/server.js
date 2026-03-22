require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const chalk = require('chalk');
const { validateGitlabSignature } = require('./middleware/validators');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Constants
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.GITLAB_WEBHOOK_SECRET;

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GitLab Webhook endpoint
 * Receives push/merge_request/issue events from GitLab
 * Validates signature and stores event for async processing
 */
app.post('/webhooks/gitlab', async (req, res) => {
  try {
    // 1. Validate webhook signature
    const signature = req.headers['x-gitlab-token'];
    const rawBody = JSON.stringify(req.body);

    if (!validateGitlabSignature(rawBody, WEBHOOK_SECRET, signature)) {
      console.warn(chalk.yellow('[WEBHOOK] Invalid signature - rejecting event'));
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Extract event metadata
    const { object_kind, project, user_username, push_data } = req.body;

    if (!object_kind || !project) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 3. Store event in database for async processing
    const event = await prisma.event.create({
      data: {
        event_type: object_kind, // 'push', 'merge_request', 'issue'
        project_id: project.id,
        project_name: project.name || project.path || 'unknown',
        payload: JSON.stringify(req.body),
        status: 'queued'
      }
    });

    console.log(
      chalk.green('[WEBHOOK] ✓ Event received'),
      `(${object_kind} on ${project.name})`
    );
    console.log(chalk.gray(`  Event ID: ${event.id}`));

    // 4. Return 202 Accepted immediately (async processing)
    return res.status(202).json({
      status: 'queued',
      event_id: event.id,
      message: 'Event queued for processing'
    });
  } catch (error) {
    console.error(chalk.red('[WEBHOOK] ✗ Error:'), error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Debug endpoint: List recent events
 */
app.get('/events', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await prisma.event.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: { agentRuns: true }
    });

    res.json({
      count: events.length,
      events: events
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Start server
 */
async function startServer() {
  try {
    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log(chalk.green('✓ Database connected'));

    // Start listening
    app.listen(PORT, () => {
      console.log(chalk.blue.bold('\n🚀 AI Dev Team Labs - Webhook Server\n'));
      console.log(`Listening on ${chalk.cyan(`http://localhost:${PORT}`)}`);
      console.log(`Webhook endpoint: ${chalk.cyan(`POST /webhooks/gitlab`)}`);
      console.log(`Health check: ${chalk.cyan(`GET /health`)}`);
      console.log(`Events list: ${chalk.cyan(`GET /events`)}`);
      console.log(chalk.gray('\nCtrl+C to stop\n'));
    });
  } catch (error) {
    console.error(chalk.red('✗ Failed to start server:'), error.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nShutting down gracefully...\n'));
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
