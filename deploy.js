#!/usr/bin/env node

// Simple deployment script that always works with Vercel
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

console.log('🚀 Deploying changes...');

try {
  // Add a unique timestamp to force cache invalidation
  const timestamp = new Date().toISOString();
  
  // Update package.json with deployment timestamp
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  packageJson.deploymentTimestamp = timestamp;
  writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  console.log('📦 Building...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('📤 Pushing to Git...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "deploy: ${timestamp}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
  console.log('🔄 Changes will be live in 2-3 minutes');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}