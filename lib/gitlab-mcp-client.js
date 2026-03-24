/**
 * GitLab MCP Client
 *
 * Bridge between Security Guardian agent and GitLab's API.
 * Handles merge request operations, comments, commits, and webhooks.
 */

import axios from 'axios';

/**
 * GitLabClient - Main client for GitLab API interactions
 */
export class GitLabClient {
  constructor(projectId, accessToken, gitlabUrl = 'https://gitlab.com') {
    this.projectId = projectId;
    this.accessToken = accessToken;
    this.gitlabUrl = gitlabUrl;
    this.baseUrl = `${gitlabUrl}/api/v4/projects/${projectId}`;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'PRIVATE-TOKEN': accessToken,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get merge request details
   */
  async getMergeRequest(mrIid) {
    try {
      const response = await this.client.get(`/merge_requests/${mrIid}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching MR ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Get merge request diff
   */
  async getMergeRequestDiff(mrIid) {
    try {
      const response = await this.client.get(`/merge_requests/${mrIid}/diffs`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching MR diff ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Get merge request changes (full diff content)
   */
  async getMergeRequestChanges(mrIid) {
    try {
      const response = await this.client.get(`/merge_requests/${mrIid}/changes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching MR changes ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Post a comment on merge request
   */
  async postMergeRequestComment(mrIid, body) {
    try {
      const response = await this.client.post(`/merge_requests/${mrIid}/notes`, {
        body
      });
      return response.data;
    } catch (error) {
      console.error(`Error posting comment on MR ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Post a discussion comment on specific line of MR
   */
  async postMergeRequestDiffComment(mrIid, body, commitId, filePath, lineNum) {
    try {
      const response = await this.client.post(`/merge_requests/${mrIid}/discussions`, {
        body,
        commit_id: commitId,
        in_reply_to_discussion_id: null,
        position: {
          position_type: 'text',
          base_sha: 'base_sha',
          start_sha: 'start_sha',
          head_sha: 'head_sha',
          old_path: filePath,
          new_path: filePath,
          old_line: null,
          new_line: lineNum
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error posting diff comment on MR ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Add labels to merge request
   */
  async addMergeRequestLabels(mrIid, labels) {
    try {
      const response = await this.client.put(`/merge_requests/${mrIid}`, {
        labels
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding labels to MR ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a commit on a branch
   */
  async createCommit(branch, message, actions) {
    try {
      const response = await this.client.post('/commits', {
        branch,
        commit_message: message,
        actions: actions.map(action => ({
          action: action.action, // 'create', 'delete', 'move', 'update'
          file_path: action.filePath,
          content: action.content
        }))
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating commit on branch ${branch}:`, error.message);
      throw error;
    }
  }

  /**
   * Push changes to a branch via commit
   */
  async pushChanges(branch, commitMessage, fileChanges) {
    try {
      const actions = Object.entries(fileChanges).map(([filePath, content]) => ({
        action: 'update',
        filePath,
        content
      }));

      const commit = await this.createCommit(branch, commitMessage, actions);
      return {
        success: true,
        commit_sha: commit.id,
        commit_message: commit.message,
        commit_url: `${this.gitlabUrl}/${this.projectId}/-/commit/${commit.id}`
      };
    } catch (error) {
      console.error('Error pushing changes:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get list of files changed in MR
   */
  async getChangedFiles(mrIid) {
    try {
      const changes = await this.getMergeRequestChanges(mrIid);
      return changes.changes.map(change => ({
        old_path: change.old_path,
        new_path: change.new_path,
        diff: change.diff
      }));
    } catch (error) {
      console.error(`Error getting changed files for MR ${mrIid}:`, error.message);
      throw error;
    }
  }

  /**
   * Get project details
   */
  async getProject() {
    try {
      const response = await this.client.get('');
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error.message);
      throw error;
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(filePath, branch = 'main') {
    try {
      const response = await this.client.get(`/repository/files/${encodeURIComponent(filePath)}`, {
        params: { ref: branch }
      });
      // GitLab returns base64 encoded content
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.error(`Error fetching file ${filePath}:`, error.message);
      throw error;
    }
  }

  /**
   * Add reaction to MR
   */
  async addMergeRequestReaction(mrIid, emoji) {
    try {
      const response = await this.client.post(`/merge_requests/${mrIid}/award_emoji`, {
        name: emoji
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding reaction to MR ${mrIid}:`, error.message);
      throw error;
    }
  }
}

/**
 * WebhookProcessor - Handles GitLab webhook events
 */
export class WebhookProcessor {
  static parseMergeRequestWebhook(payload) {
    if (payload.object_kind !== 'merge_request') {
      throw new Error('Not a merge request webhook');
    }

    const mr = payload.object_attributes;
    return {
      event: payload.object_kind,
      action: payload.object_attributes.action,
      mr_iid: mr.iid,
      project_id: mr.project_id,
      title: mr.title,
      description: mr.description,
      source_branch: mr.source_branch,
      target_branch: mr.target_branch,
      author: payload.user.username,
      url: mr.url,
      state: mr.state,
      created_at: mr.created_at,
      updated_at: mr.updated_at,
      diff_head_sha: mr.head_commit_sha,
      base_sha: mr.base_commit_sha
    };
  }

  static shouldTriggerSecurityReview(action) {
    return ['opened', 'updated', 'reopened'].includes(action);
  }
}

/**
 * MRCommentBuilder - Builds formatted comments for merge requests
 */
export class MRCommentBuilder {
  static buildSecurityReviewComment(findings, fixes, commitUrl = null) {
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const highCount = findings.filter(f => f.severity === 'high').length;
    const mediumCount = findings.filter(f => f.severity === 'medium').length;

    let comment = `## 🔒 Security Guardian Review\n\n`;

    // Summary
    comment += `### Summary\n`;
    comment += `| Severity | Count |\n`;
    comment += `|----------|-------|\n`;
    comment += `| 🔴 Critical | ${criticalCount} |\n`;
    comment += `| 🟠 High | ${highCount} |\n`;
    comment += `| 🟡 Medium | ${mediumCount} |\n`;
    comment += `| **Total** | **${findings.length}** |\n\n`;

    if (findings.length === 0) {
      comment += `✅ **No security issues found!**\n\n`;
    } else {
      // Findings details
      comment += `### Findings\n\n`;
      findings.forEach((finding, idx) => {
        const severityEmoji = {
          critical: '🔴',
          high: '🟠',
          medium: '🟡',
          low: '🟢'
        }[finding.severity];

        comment += `#### ${idx + 1}. ${severityEmoji} ${finding.name}\n`;
        comment += `**Severity:** ${finding.severity.toUpperCase()}\n`;
        comment += `**Message:** ${finding.message}\n`;
        if (finding.cve) comment += `**CVE:** ${finding.cve}\n`;
        comment += `**Suggestion:** ${finding.fix_suggestion}\n\n`;
      });
    }

    // Actions taken
    comment += `### Actions Taken\n`;
    if (fixes && fixes.length > 0) {
      comment += `✅ **${fixes.length} fixes generated**\n`;
      if (commitUrl) {
        comment += `📝 [View fixes](${commitUrl})\n`;
      }
    } else if (findings.length > 0) {
      comment += `⏳ Manual review required\n`;
    }

    // Footer
    comment += `\n---\n`;
    comment += `*Automated security review by [Security Guardian](https://gitlab.com/ai-dev-team-labs/security-guardian) | Powered by [GitLab Duo Agent Platform](https://docs.gitlab.com/user/duo_agent_platform/)*\n`;

    return comment;
  }

  static buildFixCommitMessage(findings) {
    const critical = findings.filter(f => f.severity === 'critical').length;
    const high = findings.filter(f => f.severity === 'high').length;

    let message = 'security: Auto-fix vulnerabilities detected by Security Guardian\n\n';
    message += `Fixed ${findings.length} security issues:\n`;
    message += `- Critical: ${critical}\n`;
    message += `- High: ${high}\n`;

    return message;
  }
}

export default GitLabClient;
