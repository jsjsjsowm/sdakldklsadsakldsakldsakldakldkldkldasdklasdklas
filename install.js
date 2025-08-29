#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Driver License App - React Version Installation');
console.log('='.repeat(60));

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js 16+ is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create environment file
console.log('\n⚙️ Setting up environment configuration...');

const envPath = path.join(__dirname, 'backend', '.env');
const envExamplePath = path.join(__dirname, 'backend', 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Environment file created from template');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
  }
} else {
  console.log('⚠️ Environment file already exists or template not found');
}

// Build backend
console.log('\n🔨 Building backend...');

try {
  execSync('cd backend && npm run build', { stdio: 'inherit' });
  console.log('✅ Backend built successfully!');
} catch (error) {
  console.error('❌ Error building backend:', error.message);
  console.log('ℹ️ You can build manually later with: cd backend && npm run build');
}

// Create necessary directories
console.log('\n📁 Creating necessary directories...');

const directories = [
  'backend/uploads',
  'backend/uploads/signatures',
  'backend/uploads/photos',
  'backend/uploads/certificates',
  'backend/applications',
  'backend/backups'
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Final instructions
console.log('\n🎉 Installation completed successfully!');
console.log('='.repeat(60));
console.log('\n📋 Next steps:');
console.log('1. Configure environment variables in backend/.env');
console.log('2. Start development servers:');
console.log('   • Option A: npm run dev (both servers)');
console.log('   • Option B: cd backend && npm run dev (backend only)');
console.log('               cd frontend && npm start (frontend only)');
console.log('\n🌐 Access URLs:');
console.log('• Frontend: http://localhost:3000');
console.log('• Admin Panel: http://localhost:3000/admin');
console.log('• Backend API: http://localhost:5000');
console.log('\n📖 See README.md for detailed configuration instructions');
console.log('='.repeat(60));
