/**
 * Dashboard Server
 * Simple Express server to serve the dashboard UI
 * Connects to MCP server at localhost:3001
 */

const express = require('express');
const path = require('path');
const chalk = require('chalk');

const app = express();
const PORT = 3002;

// Serve static files from dashboard folder
app.use(express.static(path.join(__dirname, 'dashboard')));

// Fallback to index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.cyan.bold('\n🎨 AI Dev Team - Dashboard Server'));
  console.log(chalk.gray('================================\n'));
  console.log(chalk.green(`✓ Dashboard running on http://localhost:${PORT}`));
  console.log(chalk.gray(`\nMake sure the MCP server is running:`));
  console.log(chalk.cyan(`  npm run mcp`));
  console.log(chalk.gray(`\nThen open http://localhost:${PORT} in your browser`));
  console.log(chalk.gray(`\nPress Ctrl+C to stop\n`));
});
