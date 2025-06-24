#!/usr/bin/env node

// Simple pre-deployment check script
const { execSync } = require('child_process');

console.log('🔍 Running pre-deployment checks...');

try {
  // Check TypeScript
  console.log('\n📘 Checking TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed');

  // Check ESLint
  console.log('\n🔍 Running ESLint...');
  execSync('npx next lint', { stdio: 'inherit' });
  console.log('✅ ESLint check passed');

  console.log('\n🎉 All checks passed! Ready to deploy.');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Pre-deployment checks failed!');
  process.exit(1);
}