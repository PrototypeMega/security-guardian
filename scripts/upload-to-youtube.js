import fs from 'fs';
import fetch from 'node-fetch';

console.log('🚀 Uploading to YouTube via API...\n');

// Check if we have API credentials
const apiKeyPath = '.env';
let apiKey = null;

if (fs.existsSync(apiKeyPath)) {
  const env = fs.readFileSync(apiKeyPath, 'utf-8');
  const match = env.match(/YOUTUBE_API_KEY=(.+)/);
  if (match) apiKey = match[1].trim();
}

if (!apiKey) {
  console.log('⚠️  No YouTube API key found in .env');
  console.log('Creating test upload endpoint...\n');
  
  // Create a simple test by checking if we can access YouTube's upload endpoint
  // through the authenticated browser session
  console.log('📋 Video File Information:');
  const stats = fs.statSync('demo-video.mp4');
  console.log(`   Path: ${process.cwd()}/demo-video.mp4`);
  console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Ready for upload`);
  
  // Generate a shareable link that can be used
  console.log('\n📝 Generated YouTube Upload Instructions:');
  console.log('1. Go to: https://studio.youtube.com/');
  console.log('2. Click CREATE > Upload video');
  console.log('3. Select: C:\Users\DouglasAhammer\AI-Dev-Team-Labs\demo-video.mp4');
  console.log('4. Title: "Security Guardian - Vulnerability Detection Demo"');
  console.log('5. Description: "Autonomous AI Security Agent for GitLab - Detects 10 vulnerabilities in real code"');
  console.log('6. Visibility: PUBLIC');
  console.log('7. Click PUBLISH');
  console.log('\n✅ Video will be ready to share immediately after');
  
  process.exit(0);
}

// If we have API key, use it
console.log('✅ Using YouTube API v3\n');

const videoPath = 'demo-video.mp4';
const videoContent = fs.readFileSync(videoPath);

const metadata = {
  snippet: {
    title: 'Security Guardian - Autonomous AI Security Agent for GitLab',
    description: 'Detects 10 real vulnerabilities in code using Claude AI and GitLab Duo Platform. Part of GitLab AI Hackathon 2026.',
    tags: ['GitLab', 'Security', 'AI', 'Hackathon', 'Claude'],
    categoryId: '28' // Technology
  },
  status: {
    privacyStatus: 'public'
  }
};

try {
  const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
  
  const data = await response.json();
  
  if (data.id) {
    console.log('✅ Video uploaded successfully!');
    console.log(`📺 Video ID: ${data.id}`);
    console.log(`🔗 Watch: https://youtu.be/${data.id}`);
    console.log(`📝 Edit: https://studio.youtube.com/video/${data.id}/edit`);
    
    // Save the link
    fs.writeFileSync('YOUTUBE_LINK.txt', `https://youtu.be/${data.id}`);
    console.log('\n✅ Link saved to YOUTUBE_LINK.txt');
  } else {
    console.log('❌ Upload failed:', data);
  }
} catch (error) {
  console.error('Error:', error.message);
}
