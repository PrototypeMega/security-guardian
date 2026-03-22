const axios = require('axios');
const chalk = require('chalk');

/**
 * GitLab API Client
 * Wrapper around GitLab REST API for repository operations
 */
class GitLabClient {
  constructor(baseUrl = 'https://gitlab.com', token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.client = axios.create({
      baseURL: baseUrl,
      defaultHeaders: {
        'PRIVATE-TOKEN': token,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  /**
   * Get repository tree structure (files and directories)
   * Returns recursive structure of files/folders
   */
  async getRepoTree(projectId, options = {}) {
    try {
      const { recursive = true, path = '/' } = options;

      const response = await this.client.get(`/projects/${projectId}/repository/tree`, {
        params: {
          recursive: recursive,
          per_page: 100
        }
      });

      return response.data || [];
    } catch (error) {
      console.warn(
        chalk.yellow('[GitLab] Warning fetching repo tree:'),
        error.message
      );
      return [];
    }
  }

  /**
   * Get file content from repository
   * Returns file content (automatically decoded from base64 if needed)
   */
  async getFileContent(projectId, filePath) {
    try {
      const response = await this.client.get(
        `/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
        {
          params: { ref: 'HEAD' }
        }
      );

      if (response.data && response.data.content) {
        // GitLab returns base64-encoded content
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      return null;
    } catch (error) {
      // File might not exist, which is okay
      return null;
    }
  }

  /**
   * Get project metadata
   */
  async getProjectInfo(projectId) {
    try {
      const response = await this.client.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.warn(
        chalk.yellow('[GitLab] Warning fetching project info:'),
        error.message
      );
      return null;
    }
  }

  /**
   * Create an issue in a project
   */
  async createIssue(projectId, { title, description, labels = [] }) {
    try {
      const response = await this.client.post(`/projects/${projectId}/issues`, {
        title,
        description,
        labels: labels.join(',')
      });

      return {
        success: true,
        id: response.data.id,
        iid: response.data.iid,
        web_url: response.data.web_url,
        title: response.data.title
      };
    } catch (error) {
      console.error(
        chalk.red('[GitLab] Error creating issue:'),
        error.message
      );
      throw error;
    }
  }

  /**
   * Add a comment/note to an issue
   */
  async addIssueComment(projectId, issueIid, body) {
    try {
      const response = await this.client.post(
        `/projects/${projectId}/issues/${issueIid}/notes`,
        { body }
      );

      return {
        success: true,
        id: response.data.id,
        created_at: response.data.created_at
      };
    } catch (error) {
      console.error(
        chalk.red('[GitLab] Error adding issue comment:'),
        error.message
      );
      throw error;
    }
  }

  /**
   * Get commit history
   */
  async getCommits(projectId, options = {}) {
    try {
      const { ref = 'HEAD', per_page = 20 } = options;

      const response = await this.client.get(`/projects/${projectId}/repository/commits`, {
        params: {
          ref,
          per_page,
          order: 'topo'
        }
      });

      return response.data || [];
    } catch (error) {
      console.warn(
        chalk.yellow('[GitLab] Warning fetching commits:'),
        error.message
      );
      return [];
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    try {
      const response = await this.client.get('/user');
      return response.data;
    } catch (error) {
      console.error(
        chalk.red('[GitLab] Error fetching current user:'),
        error.message
      );
      return null;
    }
  }

  /**
   * Test connection - verify token works
   */
  async testConnection() {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch {
      return false;
    }
  }
}

module.exports = GitLabClient;
