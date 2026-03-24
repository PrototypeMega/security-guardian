#!/usr/bin/env node

/**
 * Record Demo Presentation
 * Captures screenshots of each slide and creates a video-ready sequence
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recordDemo() {
  console.log('🎬 Security Guardian - Recording Demo Presentation\n');

  // Create output directory
  const outputDir = path.join(__dirname, '../demo-frames');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📄 Loading demo presentation...');
    await page.goto('http://localhost:8888/demo', { waitUntil: 'networkidle0' });

    // Capture each slide
    console.log('\n📸 Capturing slides...\n');

    for (let i = 1; i <= 7; i++) {
      const slideNum = String(i).padStart(2, '0');
      const screenshotPath = path.join(outputDir, `slide-${slideNum}.png`);

      // Take screenshot
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✅ Captured slide ${i}/7`);

      // Wait a moment for animation
      if (i < 7) {
        await new Promise(r => setTimeout(r, 500));
        // Click next button
        await page.click('.nav-btn:nth-of-type(2)'); // Next button
        await new Promise(r => setTimeout(r, 800));
      }
    }

    console.log('\n✅ Demo recording complete!');
    console.log(`📁 Frames saved to: ${outputDir}`);
    console.log(`🎥 Total slides captured: 7`);
    console.log(`📊 Each frame: 1920x1080 PNG`);

    // Create a simple info file
    const infoPath = path.join(outputDir, 'INFO.txt');
    fs.writeFileSync(infoPath, `Security Guardian - Demo Presentation Frames
Generated: ${new Date().toISOString()}
Total Frames: 7
Resolution: 1920x1080
Frame Duration: 3-4 seconds per slide (recommended)

Slides:
1. Title Card - 3s
2. Problem Statement - 4s
3. Architecture - 4s
4. Vulnerability Examples - 4s
5. MR Comment Output - 4s
6. Key Features - 4s
7. Call to Action - 3s

To create video from these frames, use ffmpeg:
ffmpeg -framerate 1/3 -pattern_type glob -i "slide-*.png" -c:v libx264 -pix_fmt yuv420p demo-video.mp4
`);

    console.log('\n💡 To create an MP4 video from these frames, install ffmpeg and run:');
    console.log('   ffmpeg -framerate 1/3 -pattern_type glob -i "slide-*.png" -c:v libx264 -pix_fmt yuv420p demo-video.mp4');

  } finally {
    await browser.close();
  }
}

recordDemo().catch(err => {
  console.error('❌ Error recording demo:', err);
  process.exit(1);
});
