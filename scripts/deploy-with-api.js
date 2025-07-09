#!/usr/bin/env node

import https from 'https';

const RENDER_API_KEY = process.env.RENDER_API_KEY || process.argv[2];
const OPENAI_API_KEY = process.argv[3] || 'your-openai-key-here';

if (!RENDER_API_KEY) {
  console.error('❌ Please provide Render API key as argument or RENDER_API_KEY env var');
  console.error('Usage: node deploy-with-api.js <render-api-key> [openai-api-key]');
  process.exit(1);
}

console.log('🚀 Deploying ChatGPT-Google Dashboard to Render\n');

// API helper function
function renderAPI(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      path: `/v1${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`API Error: ${response.message || body}`));
          } else {
            resolve(response);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deploy() {
  try {
    // 1. Get owner ID
    console.log('📋 Getting account info...');
    const owners = await renderAPI('GET', '/owners');
    const owner = owners.find(o => o.owner.type === 'user') || owners[0];
    const ownerId = owner.owner.id;
    console.log(`✅ Owner ID: ${ownerId}\n`);

    // 2. Note about PostgreSQL Database
    console.log('📝 Note: Render API does not support creating databases programmatically.');
    console.log('   You will need to create a PostgreSQL database manually in the dashboard.');
    console.log('   Using placeholder DATABASE_URL for now.\n');
    
    // For now, we'll use a placeholder URL that the user will need to update
    const dbUrl = 'postgresql://user:password@host:5432/database?ssl=true';

    // 5. Create Backend Service
    console.log('🔧 Creating backend service...');
    const backendData = {
      type: 'web_service',
      name: 'chatgpt-dashboard-backend',
      ownerId: ownerId,
      plan: 'starter',
      region: 'oregon',
      branch: 'main',
      buildCommand: 'cd backend && npm install',
      startCommand: 'cd backend && npm start',
      repo: 'https://github.com/dvanosdol88/ChatGPT-Google-Dashboard',
      envVars: [
        { key: 'DATABASE_URL', value: dbUrl },
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '5000' },
        { key: 'OPENAI_API_KEY', value: OPENAI_API_KEY }
      ]
    };

    const backend = await renderAPI('POST', '/services', backendData);
    const backendUrl = `https://${backend.service.slug}.onrender.com`;
    console.log(`✅ Backend created: ${backend.service.name}`);
    console.log(`   URL: ${backendUrl}\n`);

    // 6. Create Frontend Service
    console.log('🎨 Creating frontend service...');
    const frontendData = {
      type: 'static_site',
      name: 'chatgpt-dashboard-frontend',
      ownerId: ownerId,
      plan: 'starter',
      region: 'oregon',
      branch: 'main',
      buildCommand: 'cd frontend && npm install && npm run build',
      publishPath: 'frontend/build',
      repo: 'https://github.com/dvanosdol88/ChatGPT-Google-Dashboard',
      envVars: [
        { key: 'REACT_APP_API_URL', value: `${backendUrl}/api` }
      ]
    };

    const frontend = await renderAPI('POST', '/services', frontendData);
    const frontendUrl = `https://${frontend.service.slug}.onrender.com`;
    console.log(`✅ Frontend created: ${frontend.service.name}`);
    console.log(`   URL: ${frontendUrl}\n`);

    // 7. Summary
    console.log('🎉 Deployment Complete!\n');
    console.log('📝 Summary:');
    console.log(`   Database: ⚠️  Create manually in Render dashboard`);
    console.log(`   Backend:  ${backendUrl}`);
    console.log(`   Frontend: ${frontendUrl}\n`);
    
    console.log('⏱️  Services are now building. This typically takes 5-10 minutes.');
    console.log('📊 Monitor progress at: https://dashboard.render.com\n');
    
    if (OPENAI_API_KEY === 'your-openai-key-here') {
      console.log('⚠️  IMPORTANT: Update your OpenAI API key!');
      console.log(`   1. Go to ${backendUrl} in Render dashboard`);
      console.log('   2. Update OPENAI_API_KEY environment variable\n');
    }

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();