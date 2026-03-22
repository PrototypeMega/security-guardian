require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const chalk = require('chalk');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.GITLAB_WEBHOOK_SECRET || 'test-secret';

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Webhook signature validation middleware
function validateGitlabSignature(req, res, next) {
  const signature = req.headers['x-gitlab-token'];
  
  if (!signature) {
    return res.status(401).json({ error: 'Missing X-Gitlab-Token header' });
  }

  if (signature !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  next();
}

// Main webhook endpoint
app.post('/webhooks/gitlab', validateGitlabSignature, async (req, res) => {
  try {
    const { project_id, event_name, ref } = req.body;

    console.log(chalk.blue(`\n📨 Webhook received:`));
    console.log(chalk.gray(`   Event: ${event_name}`));
    console.log(chalk.gray(`   Project ID: ${project_id}`));
    console.log(chalk.gray(`   Ref: ${ref}`));

    // Only process push events
    if (event_name !== 'push') {
      console.log(chalk.yellow(`⚠️  Ignoring non-push event: ${event_name}`));
      return res.status(202).json({ message: 'Event received but ignored (not a push event)' });
    }

    // Create event in database
    const event = await prisma.event.create({
      data: {
        event_type: event_name,
        project_id: project_id || 0,
        payload: JSON.stringify(req.body),
        status: 'queued'
      }
    });

    console.log(chalk.green(`✓ Event queued with ID: ${event.id}`));

    // Return 202 Accepted immediately (async processing)
    res.status(202).json({
      message: 'Event received and queued for processing',
      event_id: event.id
    });

  } catch (error) {
    console.error(chalk.red(`✗ Error processing webhook: ${error.message}`));
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get event status endpoint
app.get('/events/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { agentRuns: true }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
app.get('/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { agentRuns: true },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.cyan.bold(`\n🚀 AI Dev Team Labs - Webhook Server`));
  console.log(chalk.gray(`Listening on http://localhost:${PORT}`));
  console.log(chalk.gray(`Webhook endpoint: POST http://localhost:${PORT}/webhooks/gitlab`));
  console.log(chalk.gray(`Health check: GET http://localhost:${PORT}/health`));
  console.log(chalk.gray(`View events: GET http://localhost:${PORT}/events`));
  console.log(chalk.yellow(`\n⚠️  Make sure .env is configured with GITLAB_WEBHOOK_SECRET\n`));
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nShutting down...'));
  await prisma.$disconnect();
  process.exit(0);
});
