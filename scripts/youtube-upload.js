#!/usr/bin/env node

/**
 * YouTube Upload Automation - Hybrid Approach
 * This script guides you through the YouTube upload process
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEO_FILE = path.join(__dirname, '../demo-video.mp4');

async function main() {
  console.log('🎥 YouTube Upload Helper\n');
  console.log('=' .repeat(60));

  if (!fs.existsSync(VIDEO_FILE)) {
    console.error('❌ Video file not found:', VIDEO_FILE);
    process.exit(1);
  }

  const stats = fs.statSync(VIDEO_FILE);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n📹 VIDEO DETAILS');
  console.log('=' .repeat(60));
  console.log(`File: ${path.basename(VIDEO_FILE)}`);
  console.log(`Size: ${fileSizeMB} MB`);
  console.log(`Path: ${VIDEO_FILE}`);

  console.log('\n📝 VIDEO METADATA');
  console.log('=' .repeat(60));
  console.log(`Title: Security Guardian - AI Security Agent for GitLab - Demo`);
  console.log(`Description: Security Guardian project for GitLab AI Hackathon 2026`);
  console.log(`Visibility: Unlisted (only accessible via link)`);

  console.log('\n✅ UPLOAD STEPS');
  console.log('=' .repeat(60));
  console.log('\n1. Go to: https://www.youtube.com/upload');
  console.log('\n2. Click "SELECT FILES" button');
  console.log('\n3. Navigate to and select:');
  console.log(`   ${VIDEO_FILE}`);
  console.log('\n4. YouTube will open the upload editor');
  console.log('\n5. Fill in these details:');
  console.log('   Title: Security Guardian - AI Security Agent for GitLab - Demo');
  console.log('   Description: ');
  console.log('   ```');
  console.log('   Security Guardian: Autonomous AI Security Agent for GitLab');
  console.log('   ');
  console.log('   Submitted to GitLab AI Hackathon 2026');
  console.log('   ');
  console.log('   Key Features:');
  console.log('   - 8+ vulnerability detection types');
  console.log('   - Claude 3.5 Sonnet powered fix generation');
  console.log('   - Autonomous merge request security scanning');
  console.log('   - Production-ready GitLab Duo Agent Platform');
  console.log('   ');
  console.log('   GitHub: https://github.com/PrototypeMega/security-guardian');
  console.log('   GitLab: https://gitlab.com/ai-dev-team-labs/security-guardian');
  console.log('   DevPost: https://devpost.com/software/security-guardian');
  console.log('   ```');
  console.log('\n6. Click "NEXT"');
  console.log('\n7. Under "Visibility" settings:');
  console.log('   - Select "UNLISTED" (not Public or Private)');
  console.log('\n8. Click "PUBLISH"');
  console.log('\n9. Copy the YouTube video URL from the address bar');
  console.log('   (Format: https://www.youtube.com/watch?v=XXXXXXX)');
  console.log('\n10. Go to DevPost and paste the URL in "Video demo link" field');

  console.log('\n📋 DEVPOST FINAL STEPS');
  console.log('=' .repeat(60));
  console.log('\n1. Navigate to: https://devpost.com/submit-to/28106-gitlab-ai-hackathon/manage/submissions/977821-security-guardian-autonomous-ai-security-agent-for-gitlab/project_details');
  console.log('\n2. Paste the YouTube URL in the "Video demo link" field');
  console.log('\n3. Click "Save & continue"');
  console.log('\n4. Review all form fields');
  console.log('\n5. Click "Submit" to finalize your submission');

  console.log('\n⏰ DEADLINE');
  console.log('=' .repeat(60));
  console.log('March 25, 2026 at 11:59 PM UTC\n');

  console.log('💡 Quick Reference');
  console.log('=' .repeat(60));
  console.log(`Video file ready at: ${VIDEO_FILE}`);
  console.log('Open browser and navigate to: https://www.youtube.com/upload');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
