#!/usr/bin/env node

/**
 * Create MP4 Video from Demo Frames
 * Combines all captured slide images into an MP4 video
 */

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

async function createVideo() {
  console.log('🎥 Creating MP4 Video from Demo Frames\n');

  const framesDir = path.join(__dirname, '../demo-frames');
  const outputPath = path.join(__dirname, '../demo-video.mp4');

  // Check if frames exist
  if (!fs.existsSync(framesDir)) {
    console.error('❌ Error: demo-frames directory not found');
    console.log('💡 Run "node scripts/record-demo.js" first to capture frames');
    process.exit(1);
  }

  const frames = fs.readdirSync(framesDir)
    .filter(f => f.match(/^slide-\d+\.png$/))
    .sort();

  if (frames.length === 0) {
    console.error('❌ Error: No slide frames found');
    process.exit(1);
  }

  console.log(`📊 Found ${frames.length} frames to process`);
  console.log(`📁 Input directory: ${framesDir}`);
  console.log(`📹 Output file: ${outputPath}\n`);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(path.join(framesDir, 'slide-%02d.png'))
      .inputFPS(1 / 3) // 3 seconds per frame (1/3 FPS)
      .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-preset medium',
        '-crf 23'
      ])
      .output(outputPath)
      .on('start', (cmdline) => {
        console.log('⏳ Creating video...');
        console.log('Command:', cmdline, '\n');
      })
      .on('progress', (progress) => {
        if (progress.frames) {
          console.log(`  Progress: ${progress.frames} frames processed`);
        }
      })
      .on('end', () => {
        const stats = fs.statSync(outputPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

        console.log('\n✅ Video created successfully!');
        console.log(`📹 Output: ${outputPath}`);
        console.log(`📊 File size: ${sizeInMB} MB`);
        console.log(`⏱️  Duration: ~${frames.length * 3} seconds`);
        console.log(`📐 Resolution: 1920x1080`);
        console.log(`🎬 Codec: H.264 (MP4 compatible)\n`);

        console.log('📤 Next steps:');
        console.log('   1. Upload this MP4 to YouTube or Vimeo');
        console.log('   2. Get the video URL');
        console.log('   3. Add the URL to DevPost submission\n');

        resolve();
      })
      .on('error', (err) => {
        console.error('❌ Error creating video:', err);
        reject(err);
      })
      .run();
  });
}

createVideo().catch(err => {
  console.error('Failed to create video:', err);
  process.exit(1);
});
