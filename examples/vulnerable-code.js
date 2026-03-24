/**
 * Example File: Intentional Vulnerabilities for Security Guardian Testing
 *
 * This file demonstrates various security issues that Security Guardian will detect.
 * DO NOT USE THIS IN PRODUCTION - IT'S FOR TESTING ONLY!
 */

// ==================== VULNERABILITY 1: HARDCODED API KEY ====================
// 🔴 CRITICAL: Hardcoded secret should never be in code
const API_KEY = "sk-1234567890abcdefghijklmnop";
const DATABASE_URL = "postgres://user:password123@db.example.com:5432/mydb";

// ==================== VULNERABILITY 2: SQL INJECTION ====================
// 🔴 CRITICAL: String interpolation in SQL queries allows injection attacks
function getUserById(userId) {
  // ❌ VULNERABLE: User input directly in query string
  const query = `SELECT * FROM users WHERE id = ${userId}`;

  // This allows: userId = "1; DROP TABLE users; --"
  return database.query(query);
}

// ==================== VULNERABILITY 3: UNSAFE RANDOM ====================
// 🟠 HIGH: Math.random() is not cryptographically secure
function generateToken() {
  const randomNum = Math.random();
  return `token_${randomNum.toString(36)}`;
  // Should use: crypto.randomBytes() instead
}

// ==================== VULNERABILITY 4: eval() USAGE ====================
// 🔴 CRITICAL: eval() allows arbitrary code execution
function processUserExpression(userExpression) {
  // ❌ DANGEROUS: eval() executes untrusted code
  const result = eval(userExpression);
  return result;
  // Should use: Function constructor with careful validation or math library
}

// ==================== VULNERABILITY 5: XSS VULNERABILITY ====================
// 🟠 HIGH: Direct HTML injection without sanitization
function displayUserComment(comment) {
  // ❌ VULNERABLE: dangerouslySetInnerHTML with unsanitized content
  document.getElementById('comments').innerHTML = comment;
  // Should use: textContent or sanitize with DOMPurify
}

// ==================== VULNERABILITY 6: DISABLED TLS VERIFICATION ====================
// 🟠 HIGH: Accepting invalid/self-signed certificates in production
const https = require('https');

const options = {
  hostname: 'api.example.com',
  port: 443,
  path: '/v1/sensitive-data',
  method: 'GET',
  rejectUnauthorized: false  // ❌ VULNERABLE: Disables certificate verification
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
});

// ==================== VULNERABILITY 7: PII LOGGING ====================
// 🔴 CRITICAL: Sensitive data being logged
function logUserData(user) {
  console.log(`User: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${user.password}`);  // ❌ LOGGING PASSWORD!
  console.log(`SSN: ${user.ssn}`);            // ❌ LOGGING SSN!
  console.log(`Credit Card: ${user.cc}`);     // ❌ LOGGING CREDIT CARD!
}

// ==================== VULNERABILITY 8: BASIC AUTH IN URL ====================
// 🟠 HIGH: Credentials in URL (visible in logs and history)
const basicAuthUrl = 'https://admin:password123@internal-api.example.com/admin';
fetch(basicAuthUrl);

// ==================== SECURE VERSIONS (EXAMPLES) ====================

/**
 * ✅ FIXED: Secure versions of vulnerable code
 */

// Fixed: Use environment variables for secrets
const API_KEY_SAFE = process.env.API_KEY;
const DATABASE_URL_SAFE = process.env.DATABASE_URL;

// Fixed: Use parameterized queries
function getUserByIdSafe(userId) {
  // ✅ SAFE: Parameterized query prevents SQL injection
  const query = 'SELECT * FROM users WHERE id = ?';
  return database.query(query, [userId]);
}

// Fixed: Use cryptographically secure random
const crypto = require('crypto');
function generateTokenSafe() {
  const randomBytes = crypto.randomBytes(16);
  return `token_${randomBytes.toString('hex')}`;
}

// Fixed: Use safer alternatives to eval
function processUserExpressionSafe(userExpression) {
  // ✅ SAFE: Parse JSON instead of eval (if that's what we need)
  try {
    const result = JSON.parse(userExpression);
    return result;
  } catch (e) {
    throw new Error('Invalid JSON expression');
  }
}

// Fixed: Sanitize HTML or use textContent
function displayUserCommentSafe(comment) {
  // ✅ SAFE: Option 1 - Use textContent for text-only
  document.getElementById('comments').textContent = comment;

  // ✅ SAFE: Option 2 - Use DOMPurify for HTML
  // import DOMPurify from 'isomorphic-dompurify';
  // document.getElementById('comments').innerHTML = DOMPurify.sanitize(comment);
}

// Fixed: Always verify TLS certificates
const optionsSafe = {
  hostname: 'api.example.com',
  port: 443,
  path: '/v1/sensitive-data',
  method: 'GET',
  rejectUnauthorized: true  // ✅ SAFE: Enforces certificate verification
};

// Fixed: Never log sensitive data
function logUserDataSafe(user) {
  console.log(`User: ${user.name}`);
  console.log(`Email: ${user.email}`);
  // ✅ SAFE: Do not log password, SSN, credit cards
}

// Fixed: Use Authorization header instead of URL auth
fetch('https://internal-api.example.com/admin', {
  headers: {
    'Authorization': `Basic ${Buffer.from('admin:password123').toString('base64')}`
  }
});

export { getUserByIdSafe, generateTokenSafe, displayUserCommentSafe };
