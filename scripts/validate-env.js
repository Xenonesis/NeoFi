#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates that all required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
];

console.log('🔍 Validating environment configuration...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  
  if (!value) {
    console.log(`❌ ${envVar}: Missing`);
    hasErrors = true;
  } else if (value.startsWith('your-')) {
    console.log(`⚠️  ${envVar}: Contains placeholder value`);
    hasErrors = true;
  } else {
    console.log(`✅ ${envVar}: Configured`);
  }
});

// Check optional variables
console.log('\n📋 Optional Environment Variables:');
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  
  if (!value) {
    console.log(`ℹ️  ${envVar}: Not set (optional)`);
  } else if (value.startsWith('your-')) {
    console.log(`⚠️  ${envVar}: Contains placeholder value`);
  } else {
    console.log(`✅ ${envVar}: Configured`);
  }
});

// Check file existence
console.log('\n📁 Configuration Files:');
const envFiles = ['.env.local', '.env.production', '.env.template'];

envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: Exists`);
  } else {
    console.log(`❌ ${file}: Missing`);
    if (file !== '.env.template') {
      hasErrors = true;
    }
  }
});

// Final result
console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Environment validation failed!');
  console.log('\n💡 To fix these issues:');
  console.log('   1. Copy .env.template to .env.local');
  console.log('   2. Replace placeholder values with actual Firebase config');
  console.log('   3. Refer to FIREBASE_SETUP.md for detailed instructions');
  console.log('   4. Check SECURITY.md for security best practices');
  process.exit(1);
} else {
  console.log('✅ Environment validation passed!');
  console.log('🚀 Your app is ready to run.');
}