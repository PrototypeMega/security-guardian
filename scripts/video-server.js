#!/usr/bin/env node

/**
 * Video Server - Serves demo presentation and video files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8889;
const PROJECT_DIR = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle root and /video-demo routes
  if (pathname === '/' || pathname === '/video-demo') {
    const filePath = path.join(PROJECT_DIR, 'demo-video-player.html');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  // Handle /demo (original presentation)
  else if (pathname === '/demo') {
    const filePath = path.join(PROJECT_DIR, 'demo-presentation.html');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  // Handle /demo-video.mp4
  else if (pathname === '/demo-video.mp4') {
    const filePath = path.join(PROJECT_DIR, 'demo-video.mp4');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404: Video not found');
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Handle range requests for video streaming
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': 'video/mp4'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  }
  // Default: return 404
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404: Not Found\n\nAvailable routes:\n  / or /video-demo - Demo video player\n  /demo - Presentation slides\n  /demo-video.mp4 - Video file');
  }
});

server.listen(PORT, () => {
  console.log(`🎥 Video Server running at http://localhost:${PORT}/video-demo`);
  console.log(`📊 Presentation at http://localhost:${PORT}/demo`);
  console.log(`📹 Video file at http://localhost:${PORT}/demo-video.mp4\n`);
  console.log('💡 Use this URL for DevPost demo video link:');
  console.log(`   http://localhost:${PORT}/video-demo`);
});
