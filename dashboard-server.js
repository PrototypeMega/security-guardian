/**
 * Dashboard Server
 * Express server serving:
 * - Landing page at http://localhost:3002/
 * - Dashboard at http://localhost:3002/dashboard
 * - Connects to MCP server at localhost:3001
 */

const express = require('express');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'landing-page')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Routes
// Landing page root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing-page', 'index.html'));
});

// Dashboard pages
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

app.get('/dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Catch-all for landing page SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing-page', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.cyan.bold('\n🎨 AI Dev Team - Dashboard Server'));
  console.log(chalk.gray('================================\n'));
  console.log(chalk.green(`✓ Landing page at http://localhost:${PORT}`));
  console.log(chalk.green(`✓ Dashboard at http://localhost:${PORT}/dashboard`));
  console.log(chalk.gray(`\nMake sure the MCP server is running:`));
  console.log(chalk.cyan(`  npm run mcp`));
  console.log(chalk.gray(`\nBoth servers needed for full functionality`));
  console.log(chalk.gray(`\nPress Ctrl+C to stop\n`));
});
