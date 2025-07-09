const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envProductionPath = path.join(process.cwd(), '.env.production');
const envTemplatePath = path.join(process.cwd(), '.env.template');

// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Function to validate environment variables
function validateEnvVars() {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] || process.env[envVar].startsWith('your-')) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing or invalid environment variables:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    console.error('\n📋 Please set these environment variables or update your .env files.');
    console.error('   Refer to .env.template for the required format.');
    return false;
  }
  
  return true;
}

// Function to copy template if env file doesn't exist
function ensureEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(envTemplatePath)) {
      console.log(`Creating ${filePath} from template...`);
      const templateContent = fs.readFileSync(envTemplatePath, 'utf8');
      fs.writeFileSync(filePath, templateContent);
      console.log(`⚠️  ${filePath} created from template. Please update with your actual values.`);
    } else {
      console.error(`❌ Template file ${envTemplatePath} not found.`);
      return false;
    }
  } else {
    console.log(`✅ ${filePath} exists.`);
  }
  return true;
}

// Main execution
function main() {
  console.log('🔍 Checking environment configuration...');
  
  // Ensure env files exist
  const localExists = ensureEnvFile(envLocalPath);
  const prodExists = ensureEnvFile(envProductionPath);
  
  if (!localExists || !prodExists) {
    process.exit(1);
  }
  
  // Load environment variables from .env.local if it exists
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
  
  // Validate environment variables
  if (!validateEnvVars()) {
    console.error('\n💡 To fix this:');
    console.error('   1. Update your .env.local file with actual Firebase config values');
    console.error('   2. Or set environment variables in your deployment platform');
    console.error('   3. Refer to FIREBASE_SETUP.md for detailed instructions');
    process.exit(1);
  }
  
  console.log('✅ Environment configuration is valid.');
}

main();