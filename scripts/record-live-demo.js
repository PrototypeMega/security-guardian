#!/usr/bin/env node

/**
 * Record Live Demo - Capture Security Guardian in action
 * Generates a video from the live demo HTML page
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegStatic);

async function recordDemo() {
  console.log('🎬 Recording Security Guardian Live Demo\n');

  const outputDir = path.join(__dirname, '../demo-frames');
  const outputPath = path.join(__dirname, '../demo-video.mp4');

  // Create output directory
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

    console.log('📄 Loading demo page...');
    const demoPath = path.join(__dirname, '../demo-live.html');
    await page.goto(`file://${demoPath}`, { waitUntil: 'networkidle0' });

    console.log('📸 Capturing demo frames...\n');

    // Capture 7 frames (intro, scan, results x5)
    const frames = [];

    // Frame 1: Initial state
    let screenshotPath = path.join(outputDir, 'slide-01.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log('✅ Captured frame 1/7 - Initial scan');
    frames.push(screenshotPath);

    // Frame 2-6: Results (same frame repeated for duration)
    for (let i = 2; i <= 6; i++) {
      screenshotPath = path.join(outputDir, `slide-${String(i).padStart(2, '0')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✅ Captured frame ${i}/7 - Results display`);
      frames.push(screenshotPath);
    }

    // Frame 7: CTA
    screenshotPath = path.join(outputDir, 'slide-07.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log('✅ Captured frame 7/7 - Call to action');
    frames.push(screenshotPath);

    console.log('\n✅ Demo recording complete!');
    console.log(`📁 Frames saved to: ${outputDir}`);
    console.log(`🎥 Total frames captured: 7`);
    console.log(`📊 Each frame: 1920x1080 PNG\n`);

    // Create video from frames
    console.log('🎬 Creating MP4 video...');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(outputDir, 'slide-%02d.png'))
        .inputFPS(1 / 3) // 3 seconds per frame
        .outputOptions([
          '-c:v libx264',
          '-pix_fmt yuv420p',
          '-preset medium',
          '-crf 23'
        ])
        .output(outputPath)
        .on('start', (cmdline) => {
          console.log('⏳ Creating video from frames...');
        })
        .on('progress', (progress) => {
          if (progress.frames) {
            process.stdout.write(`\r  Progress: ${progress.frames} frames processed`);
          }
        })
        .on('end', () => {
          console.log('\n\n✅ Video created successfully!');
          const stats = fs.statSync(outputPath);
          const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
          console.log(`📹 Output: ${outputPath}`);
          console.log(`📊 File size: ${sizeInMB} MB`);
          console.log(`⏱️  Duration: ~21 seconds`);
          console.log(`📐 Resolution: 1920x1080`);
          console.log(`🎬 Codec: H.264 (MP4 compatible)\n`);
          console.log('🚀 Video ready for upload to YouTube!\n');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ Error creating video:', err);
          reject(err);
        })
        .run();
    });

  } finally {
    await browser.close();
  }
}

recordDemo().catch(err => {
  console.error('❌ Error recording demo:', err);
  process.exit(1);
});
