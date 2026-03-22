const axios = require('axios');
const chalk = require('chalk');

class GitLabClient {
  constructor(baseUrl = process.env.GITLAB_BASE_URL, token = process.env.GITLAB_API_TOKEN) {
    this.baseUrl = baseUrl || 'https://gitlab.com';
    this.token = token;
    this.client = axios.create({
      baseURL: `${this.baseUrl}/api/v4`,
      headers: {
        'PRIVATE-TOKEN': token,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  async getProjectInfo(projectId) {
    try {
      console.log(chalk.cyan(`  📦 Fetching project info for ID: ${projectId}`));
      const response = await this.client.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(chalk.red(`  ✗ Failed to fetch project: ${error.message}`));
      throw error;
    }
  }

  async getRepositoryTree(projectId, path = '', options = {}) {
    try {
      console.log(chalk.cyan(`  🌳 Fetching repository tree for: ${path || 'root'}`));
      const params = {
        recursive: true,
        per_page: 100,
        ...options
      };
      const response = await this.client.get(`/projects/${projectId}/repository/tree`, { params });
      return response.data;
    } catch (error) {
      console.error(chalk.red(`  ✗ Failed to fetch tree: ${error.message}`));
      return []; // Return empty array on error
    }
  }

  async getFileContent(projectId, filePath) {
    try {
      console.log(chalk.cyan(`  📄 Fetching file: ${filePath}`));
      const encodedPath = encodeURIComponent(filePath);
      const response = await this.client.get(`/projects/${projectId}/repository/files/${encodedPath}/raw`);
      return response.data;
    } catch (error) {
      console.warn(chalk.yellow(`  ⚠️  Could not fetch ${filePath}: ${error.message}`));
      return null;
    }
  }

  async getReadme(projectId) {
    const readmeFiles = ['README.md', 'README.txt', 'README', 'readme.md'];
    
    for (const file of readmeFiles) {
      const content = await this.getFileContent(projectId, file);
      if (content) {
        console.log(chalk.green(`  ✓ Found ${file}`));
        return content;
      }
    }
    
    console.warn(chalk.yellow(`  ⚠️  No README found`));
    return null;
  }

  async getPackageJson(projectId) {
    const content = await this.getFileContent(projectId, 'package.json');
    if (content) {
      try {
        return JSON.parse(content);
      } catch (e) {
        console.warn(chalk.yellow(`  ⚠️  Could not parse package.json`));
        return null;
      }
    }
    return null;
  }

  async createIssue(projectId, { title, description, labels = [] }) {
    try {
      console.log(chalk.cyan(`  📋 Creating issue: "${title}"`));
      const response = await this.client.post(`/projects/${projectId}/issues`, {
        title,
        description,
        labels: labels.join(',')
      });
      console.log(chalk.green(`  ✓ Issue created: ${response.data.web_url}`));
      return response.data;
    } catch (error) {
      console.error(chalk.red(`  ✗ Failed to create issue: ${error.message}`));
      throw error;
    }
  }

  async getProjectLanguages(projectId) {
    try {
      console.log(chalk.cyan(`  🔤 Fetching project languages`));
      const response = await this.client.get(`/projects/${projectId}/languages`);
      return response.data;
    } catch (error) {
      console.warn(chalk.yellow(`  ⚠️  Could not fetch languages: ${error.message}`));
      return {};
    }
  }
}

module.exports = GitLabClient;
