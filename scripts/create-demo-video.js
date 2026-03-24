import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎬 Creating Security Guardian Demo Video...\n');

// Create a demo HTML page showing the scanner output
const demoHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background: #1a1a1a; color: #00ff00; font-family: 'Courier New'; padding: 40px; }
    .container { max-width: 1200px; }
    h1 { text-align: center; color: #00ff00; text-shadow: 0 0 10px #00ff00; }
    .output { background: #0a0a0a; padding: 20px; border: 1px solid #00ff00; margin: 20px 0; }
    .critical { color: #ff4444; }
    .high { color: #ffaa44; }
    .summary { margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 10px; border: 1px solid #00ff00; text-align: left; }
    .finding { margin: 15px 0; padding: 10px; border-left: 3px solid #ff4444; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔒 Security Guardian - Vulnerability Detection Demo</h1>
    
    <div class="output">
      <h2>Scanning: examples/vulnerable-code.js</h2>
      <div class="summary">
        <strong>SCAN SUMMARY</strong>
        <table>
          <tr>
            <th>Severity</th>
            <th>Count</th>
          </tr>
          <tr>
            <td class="critical">🔴 Critical</td>
            <td class="critical">5</td>
          </tr>
          <tr>
            <td class="high">🟠 High</td>
            <td class="high">5</td>
          </tr>
          <tr>
            <td>🟡 Medium</td>
            <td>0</td>
          </tr>
          <tr>
            <td>🟢 Low</td>
            <td>0</td>
          </tr>
          <tr>
            <td><strong>TOTAL</strong></td>
            <td><strong>10</strong></td>
          </tr>
        </table>
      </div>
      
      <h2>FINDINGS DETECTED</h2>
      
      <div class="finding">
        <strong class="critical">🔴 1. DATABASE_CONNECTION_STRING (CRITICAL)</strong>
        <p>Database connection string with embedded credentials detected</p>
        <p>Fix: Move to environment variable or GitLab CI/CD secret</p>
      </div>
      
      <div class="finding">
        <strong class="critical">🔴 2. API_KEY_GENERIC (CRITICAL)</strong>
        <p>Generic API key detected</p>
        <p>Fix: Move to environment variable or GitLab CI/CD secret</p>
      </div>
      
      <div class="finding">
        <strong class="critical">🔴 3. SQL_INJECTION_VULNERABLE (CRITICAL)</strong>
        <p>Potential SQL injection - unsanitized string interpolation</p>
        <p>Fix: Use parameterized queries with placeholders</p>
      </div>
      
      <div class="finding">
        <strong class="critical">🔴 4-5. EVAL_USAGE (CRITICAL x2)</strong>
        <p>eval() allows arbitrary code execution</p>
        <p>Fix: Use Function constructor or JSON.parse instead of eval()</p>
      </div>
      
      <div class="finding">
        <strong class="high">🟠 6-7. XSS_VULNERABLE (HIGH x2)</strong>
        <p>Potential XSS vulnerability - unsanitized HTML injection</p>
        <p>Fix: Use textContent for text or sanitize HTML with DOMPurify</p>
      </div>
      
      <div class="finding">
        <strong class="high">🟠 8. INSECURE_RANDOM (HIGH)</strong>
        <p>Math.random() is not cryptographically secure</p>
        <p>Fix: Use crypto.randomBytes() or crypto.getRandomValues()</p>
      </div>
      
      <div class="finding">
        <strong class="high">🟠 9. INSECURE_DESERIALIZATION (HIGH)</strong>
        <p>Deserializing untrusted data can lead to RCE</p>
        <p>Fix: Validate and sanitize data before deserialization</p>
      </div>
      
      <div class="finding">
        <strong class="high">🟠 10. INSECURE_TLS (HIGH)</strong>
        <p>TLS certificate verification disabled</p>
        <p>Fix: Always verify TLS certificates in production</p>
      </div>
      
      <div style="margin-top: 40px; text-align: center; color: #00ff00;">
        <strong>Security Guardian - Powered by GitLab Duo Agent Platform + Claude AI</strong>
      </div>
    </div>
  </div>
</body>
</html>`;

// Write to temp file
const tempHtml = 'demo-output.html';
fs.writeFileSync(tempHtml, demoHtml);
console.log(`✅ Created demo HTML: ${tempHtml}`);

// Use Puppeteer to take screenshot
const puppeteer = (await import('puppeteer')).default;
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

const htmlPath = `file://${path.resolve(tempHtml)}`;
await page.goto(htmlPath, { waitUntil: 'networkidle2' });

// Take screenshot
const screenshotPath = 'demo-output.png';
await page.screenshot({ path: screenshotPath, fullPage: true });
console.log(`✅ Screenshot: ${screenshotPath}`);

await browser.close();

// Create video from single screenshot (5 seconds at 30fps = 150 frames)
console.log('📹 Encoding video...');
try {
  execSync(`ffmpeg -loop 1 -i demo-output.png -c:v libx264 -t 10 -pix_fmt yuv420p -vf scale=1920:1080 demo-video.mp4 -y 2>&1 | grep -v "frame="`, 
    { stdio: 'inherit' });
  console.log('✅ Video created: demo-video.mp4');
} catch (e) {
  console.error('Error creating video');
}

// Show file info
const stats = fs.statSync('demo-video.mp4');
console.log(`\n📊 Video Info:`);
console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Duration: 10 seconds`);
console.log(`   Resolution: 1920x1080`);

console.log('\n✅ Demo video ready for upload!');
