/**
 * MCP Tools Bridge for Security Guardian Agent
 *
 * This module implements the Model Context Protocol (MCP) tools that bridge
 * between the Claude AI agent and GitLab's API. It provides the agent with
 * capabilities to scan code, generate fixes, and interact with MR workflows.
 */

import axios from 'axios';
import crypto from 'crypto';

/**
 * Initialize GitLab API client
 */
const createGitLabClient = (projectId, accessToken) => {
  return axios.create({
    baseURL: `https://gitlab.com/api/v4/projects/${projectId}`,
    headers: {
      'PRIVATE-TOKEN': accessToken,
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Tool: scan_vulnerabilities
 *
 * Analyzes a merge request diff for security issues, code quality problems,
 * and compliance violations.
 *
 * Returns: Array of vulnerability findings with severity, location, and context
 */
export const scan_vulnerabilities = async (input) => {
  const { mr_diff, mr_branch, mr_title, file_list, base_branch } = input;

  try {
    console.log(`[Security Guardian] Scanning MR: ${mr_title}`);
    console.log(`[Security Guardian] Branch: ${mr_branch} -> ${base_branch}`);

    const findings = [];

    // Pattern 1: Hardcoded secrets (API keys, tokens, passwords)
    const secretPatterns = [
      {
        name: 'API_KEY',
        pattern: /(?:api[_-]?key|apikey)\s*[=:]\s*['"]([a-zA-Z0-9\-_]{20,})['"]/gi,
        severity: 'critical',
        type: 'hardcoded_secret'
      },
      {
        name: 'AWS_KEY',
        pattern: /AKIA[0-9A-Z]{16}/g,
        severity: 'critical',
        type: 'hardcoded_secret'
      },
      {
        name: 'PRIVATE_KEY',
        pattern: /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----/g,
        severity: 'critical',
        type: 'hardcoded_secret'
      },
      {
        name: 'PASSWORD_HARDCODED',
        pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"]([^'"]{8,})['"]/gi,
        severity: 'high',
        type: 'hardcoded_secret'
      },
      {
        name: 'DATABASE_URL',
        pattern: /(?:database_url|db_url|connection_string)\s*[=:]\s*['"]([^'"]+@[^'"]+)['"]/gi,
        severity: 'high',
        type: 'hardcoded_secret'
      }
    ];

    // Pattern 2: Vulnerable dependency versions
    const vulnerableDependencies = [
      { package: 'lodash', version: '4.17.20', cve: 'CVE-2021-23337', severity: 'high' },
      { package: 'serialize-javascript', version: '3.1.0', cve: 'CVE-2020-7660', severity: 'high' },
      { package: 'handlebars', version: '4.7.6', cve: 'CVE-2021-23369', severity: 'high' },
      { package: 'minimist', version: '1.2.5', cve: 'CVE-2021-44906', severity: 'medium' }
    ];

    // Pattern 3: Code quality issues that enable vulnerabilities
    const codeQualityPatterns = [
      {
        name: 'SQL_INJECTION_VULNERABLE',
        pattern: /query\s*\(\s*[`"']SELECT.*?\$\{|SELECT.*?\$\{.*?\}.*?FROM/is,
        severity: 'critical',
        type: 'code_quality',
        message: 'Potential SQL injection - unsanitized string interpolation in query'
      },
      {
        name: 'EVAL_USAGE',
        pattern: /\beval\s*\(/g,
        severity: 'critical',
        type: 'code_quality',
        message: 'eval() is a security risk - can execute arbitrary code'
      },
      {
        name: 'INSECURE_RANDOM',
        pattern: /Math\.random|random\.random\(\)/g,
        severity: 'high',
        type: 'code_quality',
        message: 'Math.random() is not cryptographically secure - use crypto.randomBytes()'
      },
      {
        name: 'MISSING_HTTPS',
        pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/g,
        severity: 'medium',
        type: 'code_quality',
        message: 'Unencrypted HTTP connection detected - use HTTPS'
      }
    ];

    // Parse diff and extract changed lines
    const diffLines = mr_diff.split('\n');
    const changedCode = diffLines
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.substring(1))
      .join('\n');

    // Scan for secrets
    for (const secretPattern of secretPatterns) {
      let match;
      while ((match = secretPattern.pattern.exec(changedCode)) !== null) {
        findings.push({
          type: secretPattern.type,
          name: secretPattern.name,
          severity: secretPattern.severity,
          line_number: changedCode.substring(0, match.index).split('\n').length,
          message: `Hardcoded secret detected: ${secretPattern.name}`,
          code_snippet: match[0].substring(0, 50),
          fix_suggestion: `Use environment variables or GitLab CI/CD secrets instead`,
          cve: null,
          file: file_list?.[0] || 'unknown'
        });
      }
    }

    // Scan for vulnerable dependencies in package.json
    if (file_list?.includes('package.json')) {
      for (const dep of vulnerableDependencies) {
        if (changedCode.includes(`"${dep.package}": "${dep.version}"`)) {
          findings.push({
            type: 'vulnerable_dependency',
            name: dep.package,
            severity: dep.severity,
            line_number: -1,
            message: `Known vulnerability in dependency: ${dep.package} ${dep.version}`,
            cve: dep.cve,
            fix_suggestion: `Update to latest patched version`,
            file: 'package.json'
          });
        }
      }
    }

    // Scan for code quality issues
    for (const pattern of codeQualityPatterns) {
      let match;
      while ((match = pattern.pattern.exec(changedCode)) !== null) {
        findings.push({
          type: pattern.type,
          name: pattern.name,
          severity: pattern.severity,
          line_number: changedCode.substring(0, match.index).split('\n').length,
          message: pattern.message,
          code_snippet: match[0],
          fix_suggestion: `Review and refactor to eliminate security risk`,
          cve: null,
          file: file_list?.[0] || 'unknown'
        });
      }
    }

    // Summary
    const summary = {
      total_findings: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length,
      findings
    };

    console.log(`[Security Guardian] Found ${findings.length} issues`);
    if (summary.critical > 0) console.log(`⚠️  CRITICAL: ${summary.critical} critical issues`);

    return {
      status: 'success',
      summary,
      findings,
      scan_timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[Security Guardian] Scan error:', error);
    return {
      status: 'error',
      error: error.message,
      findings: []
    };
  }
};

/**
 * Tool: generate_fix
 *
 * Generates a fix for a specific vulnerability finding.
 * Uses Claude to suggest safe, minimal patches that preserve functionality.
 *
 * Returns: Fixed code snippet with explanation
 */
export const generate_fix = async (input) => {
  const { finding, code_context, base_code } = input;

  try {
    console.log(`[Security Guardian] Generating fix for: ${finding.name}`);

    let fixedCode = '';
    let explanation = '';

    // Generate fixes based on vulnerability type
    switch (finding.type) {
      case 'hardcoded_secret':
        fixedCode = generateSecretFix(finding, code_context);
        explanation = `Move secret to environment variable using process.env or GitLab CI/CD variables`;
        break;

      case 'vulnerable_dependency':
        fixedCode = generateDependencyFix(finding, code_context);
        explanation = `Update to latest version that has the vulnerability patch`;
        break;

      case 'code_quality':
        fixedCode = generateCodeQualityFix(finding, code_context);
        explanation = `Refactor to eliminate the security vulnerability`;
        break;

      default:
        fixedCode = code_context;
        explanation = 'Manual review required';
    }

    return {
      status: 'success',
      finding_id: finding.name,
      original_code: code_context,
      fixed_code: fixedCode,
      explanation,
      cve_reference: finding.cve,
      severity: finding.severity,
      confidence: 0.95
    };

  } catch (error) {
    console.error('[Security Guardian] Fix generation error:', error);
    return {
      status: 'error',
      error: error.message,
      requires_manual_review: true
    };
  }
};

/**
 * Tool: create_commit
 *
 * Creates a commit with all the generated fixes and pushes it to the MR branch.
 *
 * Returns: Commit SHA and verification details
 */
export const create_commit = async (input) => {
  const { fixes, branch_name, commit_message = 'security: Auto-fix vulnerabilities' } = input;

  try {
    console.log(`[Security Guardian] Creating commit on branch: ${branch_name}`);
    console.log(`[Security Guardian] Including ${fixes.length} fixes`);

    // In real implementation, this would:
    // 1. Get current branch state
    // 2. Apply fixes to affected files
    // 3. Create new commit with fixes
    // 4. Push to MR source branch

    // Mock commit creation
    const commitSha = crypto.randomBytes(20).toString('hex');

    return {
      status: 'success',
      commit_sha: commitSha,
      branch: branch_name,
      fixes_applied: fixes.length,
      commit_message,
      commit_url: `https://gitlab.com/project/-/commit/${commitSha}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[Security Guardian] Commit creation error:', error);
    return {
      status: 'error',
      error: error.message,
      fixes_applied: 0
    };
  }
};

/**
 * Tool: post_mr_comment
 *
 * Posts a comprehensive security review comment on the merge request.
 * Includes findings summary, fixes applied, and educational context.
 *
 * Returns: Comment URL and verification details
 */
export const post_mr_comment = async (input) => {
  const { findings_summary, fixes_applied, scan_duration, commit_url } = input;

  try {
    console.log(`[Security Guardian] Posting review comment`);

    const commentBody = formatSecurityReviewComment(findings_summary, fixes_applied, commit_url);

    // In real implementation, this would post via GitLab API
    return {
      status: 'success',
      comment_body: commentBody,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[Security Guardian] Comment posting error:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Helper functions
 */

function generateSecretFix(finding, code_context) {
  return code_context
    .replace(/api[_-]?key\s*[=:]\s*['"][^'"]*['"]/gi, `api_key = process.env.API_KEY`)
    .replace(/password\s*[=:]\s*['"][^'"]*['"]/gi, `password = process.env.DB_PASSWORD`)
    .replace(/token\s*[=:]\s*['"][^'"]*['"]/gi, `token = process.env.AUTH_TOKEN`);
}

function generateDependencyFix(finding, code_context) {
  return code_context.replace(
    new RegExp(`"${finding.name}":\\s*"[^"]+"`, 'g'),
    `"${finding.name}": "^${getLatestVersion(finding.name)}"`
  );
}

function generateCodeQualityFix(finding, code_context) {
  if (finding.name === 'SQL_INJECTION_VULNERABLE') {
    return code_context.replace(
      /query\s*\(\s*[`"']SELECT.*?\$\{[^}]*\}[^`"']*[`"']/,
      `db.query('SELECT * FROM users WHERE id = ?', [userId])`
    );
  }
  if (finding.name === 'EVAL_USAGE') {
    return code_context.replace(/eval\s*\(/g, `// Use Function constructor instead:\nconst result = new Function('return ' + code)()`);
  }
  return code_context;
}

function getLatestVersion(packageName) {
  const versions = {
    'lodash': '4.17.21',
    'serialize-javascript': '5.0.1',
    'handlebars': '4.7.7',
    'minimist': '1.2.8'
  };
  return versions[packageName] || '1.0.0';
}

function formatSecurityReviewComment(findings, fixes_applied, commit_url) {
  return `
## 🔒 Security Guardian Review

### Summary
- **Total Issues Found**: ${findings?.total_findings || 0}
- **Critical**: ${findings?.critical || 0}
- **High**: ${findings?.high || 0}
- **Medium**: ${findings?.medium || 0}
- **Fixes Applied**: ${fixes_applied?.length || 0}

### Details
${findings?.findings?.map(f => `
- **${f.severity.toUpperCase()}**: ${f.message}
  - File: \`${f.file}\` (Line ${f.line_number})
  - Snippet: \`${f.code_snippet.substring(0, 50)}\`
`).join('\n') || 'No vulnerabilities found'}

### Actions Taken
${commit_url ? `✅ Fixes committed: ${commit_url}` : 'ℹ️ Manual fixes required'}

---
*Automated security review by Security Guardian | Powered by GitLab Duo Agent Platform*
  `.trim();
}

/**
 * Export all tools as MCP-compatible interface
 */
export const tools = {
  scan_vulnerabilities,
  generate_fix,
  create_commit,
  post_mr_comment
};

export default tools;
