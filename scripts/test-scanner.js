#!/usr/bin/env node

/**
 * Test Script: Demonstrate Security Guardian Scanner in Action
 *
 * This script tests the vulnerability scanner on the example vulnerable code
 * and shows how Security Guardian detects and reports issues.
 */

import fs from 'fs';
import path from 'path';
import VulnerabilityScanner from '../lib/vulnerability-scanner.js';

console.log('🔒 Security Guardian - Vulnerability Scanner Test\n');
console.log('=' .repeat(60));

// Read the vulnerable code file
const vulnerableCodePath = path.resolve('examples/vulnerable-code.js');
const vulnerableCode = fs.readFileSync(vulnerableCodePath, 'utf-8');

console.log(`📂 Scanning: ${vulnerableCodePath}\n`);

// Create scanner and run scan
const scanner = new VulnerabilityScanner();
const result = scanner.scanDiff(vulnerableCode);

// Display summary
console.log('📊 SCAN SUMMARY');
console.log('=' .repeat(60));
console.log(`Total Issues Found: ${result.summary.total}`);
console.log(`  🔴 Critical:  ${result.summary.critical}`);
console.log(`  🟠 High:      ${result.summary.high}`);
console.log(`  🟡 Medium:    ${result.summary.medium}`);
console.log(`  🟢 Low:       ${result.summary.low}`);
console.log('\n');

// Display findings
console.log('🔍 DETAILED FINDINGS');
console.log('=' .repeat(60));

const severityEmoji = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢'
};

result.findings.forEach((finding, index) => {
  console.log(`\n${index + 1}. ${severityEmoji[finding.severity]} ${finding.name}`);
  console.log(`   Severity: ${finding.severity.toUpperCase()}`);
  console.log(`   Type:     ${finding.type}`);
  console.log(`   Message:  ${finding.message}`);
  if (finding.cve) console.log(`   CVE:      ${finding.cve}`);
  console.log(`   Fix:      ${finding.fix_suggestion}`);
});

console.log('\n' + '=' .repeat(60));
console.log('\n✅ TEST COMPLETE\n');

// Generate MR comment
console.log('📝 GENERATED MR COMMENT:');
console.log('=' .repeat(60));
console.log(generateMRComment(result));
console.log('=' .repeat(60) + '\n');

/**
 * Generate a formatted MR comment
 */
function generateMRComment(scanResult) {
  let comment = `## 🔒 Security Guardian Review\n\n`;

  comment += `### Summary\n`;
  comment += `| Severity | Count |\n`;
  comment += `|----------|-------|\n`;
  comment += `| 🔴 Critical | ${scanResult.summary.critical} |\n`;
  comment += `| 🟠 High | ${scanResult.summary.high} |\n`;
  comment += `| 🟡 Medium | ${scanResult.summary.medium} |\n`;
  comment += `| 🟢 Low | ${scanResult.summary.low} |\n`;
  comment += `| **Total** | **${scanResult.summary.total}** |\n\n`;

  if (scanResult.summary.total === 0) {
    comment += `✅ **No security issues found!**\n\n`;
  } else {
    comment += `### Findings\n\n`;
    scanResult.findings.forEach((finding, idx) => {
      const emoji = severityEmoji[finding.severity];
      comment += `#### ${idx + 1}. ${emoji} ${finding.name}\n`;
      comment += `**Severity:** ${finding.severity.toUpperCase()}\n`;
      comment += `**Message:** ${finding.message}\n`;
      if (finding.cve) comment += `**CVE:** ${finding.cve}\n`;
      comment += `**Suggestion:** ${finding.fix_suggestion}\n\n`;
    });
  }

  comment += `### Actions Taken\n`;
  comment += `✅ Vulnerabilities scanned and reported\n`;
  comment += `💡 Fixes can be generated using Claude AI\n`;
  comment += `📝 Review changes before merging\n\n`;

  comment += `---\n`;
  comment += `*Automated security review by Security Guardian | Powered by GitLab Duo Agent Platform*\n`;

  return comment;
}
