#!/usr/bin/env node

// Force deployment script to bypass Vercel cache issues
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

console.log('🚀 Force deploying to bypass Vercel cache...');

try {
  // Update build timestamp in package.json to force cache invalidation
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  packageJson.buildTimestamp = new Date().toISOString();
  writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  // Run build locally to generate fresh artifacts
  console.log('📦 Building locally...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Commit and push everything including build artifacts
  console.log('📤 Committing and pushing...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "force deploy: ${new Date().toISOString()}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ Force deployment complete!');
  console.log('🔄 Vercel should now deploy with fresh cache in 2-3 minutes');
  
} catch (error) {
  console.error('❌ Error during force deployment:', error.message);
  process.exit(1);
}