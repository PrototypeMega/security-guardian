/**
 * Fix Generator
 *
 * Uses Claude API to intelligently generate fixes for vulnerabilities.
 * Provides safe, minimal patches that preserve functionality and include
 * educational context about why the fix is needed.
 */

import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * FixGenerator class - orchestrates fix generation via Claude
 */
export class FixGenerator {
  constructor() {
    this.model = 'claude-3-5-sonnet-20241022';
    this.temperature = 0.3; // Lower temp for consistent, safe fixes
  }

  /**
   * Generate a fix for a specific vulnerability
   */
  async generateFix(finding, codeContext) {
    try {
      console.log(`[FixGenerator] Generating fix for: ${finding.name}`);

      const prompt = this.buildPrompt(finding, codeContext);

      const response = await client.messages.create({
        model: this.model,
        max_tokens: 2048,
        temperature: this.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const fixedCode = response.content[0].type === 'text' ? response.content[0].text : '';

      // Extract code block if present
      const codeBlockMatch = fixedCode.match(/```(?:javascript|js|jsx|typescript|ts|tsx)?\n([\s\S]*?)\n```/);
      const extractedCode = codeBlockMatch ? codeBlockMatch[1] : fixedCode;

      return {
        status: 'success',
        finding_id: finding.name,
        original_code: codeContext,
        fixed_code: extractedCode,
        full_response: fixedCode,
        severity: finding.severity,
        confidence: 0.95,
        model: this.model
      };

    } catch (error) {
      console.error('[FixGenerator] Error:', error);
      return {
        status: 'error',
        error: error.message,
        requires_manual_review: true
      };
    }
  }

  /**
   * Generate fixes for multiple vulnerabilities in batch
   */
  async generateBatchFixes(findings, codeContext) {
    console.log(`[FixGenerator] Generating fixes for ${findings.length} vulnerabilities`);

    const fixes = [];

    for (const finding of findings) {
      // Rate limit to avoid API throttling
      await this.sleep(1000);

      const fix = await this.generateFix(finding, codeContext);
      fixes.push(fix);
    }

    return fixes;
  }

  /**
   * Build the prompt for Claude based on vulnerability type
   */
  buildPrompt(finding, codeContext) {
    const systemContext = `You are a security expert helping developers fix vulnerabilities in their code.
Your task is to provide a minimal, safe fix that:
1. Solves the security vulnerability completely
2. Preserves the original functionality
3. Follows best practices
4. Is production-ready

Always respond with ONLY the fixed code in a markdown code block. No explanation needed.`;

    const prompts = {
      'SQL_INJECTION_VULNERABLE': `
${systemContext}

Vulnerability: SQL Injection
The code uses unsanitized string interpolation in SQL queries, which allows attackers to inject SQL code.

Original vulnerable code:
\`\`\`
${codeContext}
\`\`\`

Fix this by using parameterized queries with placeholders instead. Use prepared statements or parameterized query syntax for your database.
      `,

      'XSS_VULNERABLE': `
${systemContext}

Vulnerability: Cross-Site Scripting (XSS)
The code uses innerHTML or dangerouslySetInnerHTML with unsanitized user input, which allows attackers to inject malicious JavaScript.

Original vulnerable code:
\`\`\`
${codeContext}
\`\`\`

Fix this by either:
1. Using textContent instead of innerHTML for text content
2. Using a sanitization library like DOMPurify
3. Using React's built-in escaping (don't use dangerouslySetInnerHTML)
      `,

      'EVAL_USAGE': `
${systemContext}

Vulnerability: Code Injection via eval()
The code uses eval() which can execute arbitrary code from untrusted sources.

Original vulnerable code:
\`\`\`
${codeContext}
\`\`\`

Fix this by replacing eval() with safer alternatives:
- For JSON: use JSON.parse()
- For expressions: use Function constructor with caution, or a math expression library
- For templates: use template engines instead
      `,

      'INSECURE_RANDOM': `
${systemContext}

Vulnerability: Insecure Random Number Generation
The code uses Math.random() which is not cryptographically secure.

Original vulnerable code:
\`\`\`
${codeContext}
\`\`\`

Fix this by using crypto.randomBytes() or crypto.getRandomValues() instead.
      `,

      'HARDCODED_SECRET': `
${systemContext}

Vulnerability: Hardcoded Secret/Credential
The code contains a hardcoded secret like API key, password, or token.

Original vulnerable code:
\`\`\`
${codeContext}
\`\`\`

Fix this by moving the secret to an environment variable or using GitLab CI/CD secrets.
      `,

      'INSECURE_TLS': `
${systemContext}

Vulnerability: Disabled TLS Certificate Verification
The code disables TLS certificate verification, making it vulnerable to MITM attacks.

Original vulnerable code:
\`\`\`
${codeContext}
\`\`\`

Fix this by removing rejectUnauthorized: false or verify: false settings.
      `,

      'default': `
${systemContext}

Vulnerability: ${finding.name}
Message: ${finding.message}

Original code:
\`\`\`
${codeContext}
\`\`\`

Suggestion: ${finding.fix_suggestion}

Fix this code to eliminate the vulnerability. Provide the corrected code.
      `
    };

    return prompts[finding.name] || prompts['default'];
  }

  /**
   * Helper to sleep between API calls
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Template-based fix fallback (used when Claude API is unavailable)
 */
export class TemplateFixes {
  static applyFix(finding, code) {
    console.log(`[TemplateFixes] Applying template fix for: ${finding.name}`);

    const fixes = {
      'SQL_INJECTION_VULNERABLE': (code) => {
        // Replace string interpolation with parameterized query
        return code.replace(
          /query\s*\(\s*[`"']SELECT\s+\*\s+FROM\s+\w+\s+WHERE\s+(\w+)\s*=\s*\$\{([^}]+)\}/g,
          "db.query('SELECT * FROM $1 WHERE $2 = ?', [$3])"
        );
      },

      'XSS_VULNERABLE': (code) => {
        return code
          .replace(/innerHTML\s*=\s*/g, 'textContent = ')
          .replace(/dangerouslySetInnerHTML\s*=\s*\{/g, 'children: DOMPurify.sanitize(');
      },

      'EVAL_USAGE': (code) => {
        return code.replace(/eval\s*\(/g, "JSON.parse(");
      },

      'INSECURE_RANDOM': (code) => {
        return code.replace(
          /Math\.random\(\)/g,
          "parseInt(crypto.getRandomValues(new Uint8Array(1))[0].toString()) / 256"
        );
      },

      'HARDCODED_SECRET': (code) => {
        return code
          .replace(/['"]([a-zA-Z0-9\-_]{20,})['"]/g, 'process.env.API_KEY')
          .replace(/password\s*[=:]\s*['"][^'"]*['"]/g, "password: process.env.DB_PASSWORD");
      },

      'INSECURE_TLS': (code) => {
        return code
          .replace(/rejectUnauthorized\s*[=:]\s*false/g, 'rejectUnauthorized: true')
          .replace(/verify\s*[=:]\s*false/g, 'verify: true');
      }
    };

    const fixFn = fixes[finding.name];
    return fixFn ? fixFn(code) : code;
  }

  static generateAllFixes(findings, code) {
    return findings.map(finding => ({
      finding_id: finding.name,
      original_code: code,
      fixed_code: this.applyFix(finding, code),
      is_template_fix: true,
      severity: finding.severity
    }));
  }
}

export default FixGenerator;
