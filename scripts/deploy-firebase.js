#!/usr/bin/env node

/**
 * Firebase Deployment Script
 * This script deploys your Firestore rules and indexes
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Firebase Rules and Indexes Deployment Script\n');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  return new Promise((resolve) => {
    exec('firebase --version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Firebase CLI not found. Please install it first:');
        console.log('   npm install -g firebase-tools');
        console.log('   Then run: firebase login');
        resolve(false);
      } else {
        console.log('✅ Firebase CLI found:', stdout.trim());
        resolve(true);
      }
    });
  });
}

// Check if firebase.json exists
function checkFirebaseConfig() {
  const configPath = path.join(process.cwd(), 'firebase.json');
  if (!fs.existsSync(configPath)) {
    console.log('❌ firebase.json not found. Creating basic configuration...');
    
    const firebaseConfig = {
      "firestore": {
        "rules": "firestore.rules",
        "indexes": "firestore.indexes.json"
      }
    };
    
    fs.writeFileSync(configPath, JSON.stringify(firebaseConfig, null, 2));
    console.log('✅ Created firebase.json');
  } else {
    console.log('✅ firebase.json found');
  }
}

// Deploy rules and indexes
function deployRulesAndIndexes() {
  return new Promise((resolve, reject) => {
    console.log('\n🔄 Deploying Firestore rules and indexes...');
    
    exec('firebase deploy --only firestore', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Deployment failed:', error.message);
        console.log('stderr:', stderr);
        reject(error);
      } else {
        console.log('✅ Deployment successful!');
        console.log(stdout);
        resolve();
      }
    });
  });
}

// Validate rules syntax
function validateRules() {
  return new Promise((resolve, reject) => {
    console.log('\n🔍 Validating Firestore rules...');
    
    exec('firebase firestore:rules', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Rules validation failed:', error.message);
        reject(error);
      } else {
        console.log('✅ Rules validation successful');
        resolve();
      }
    });
  });
}

// Main deployment function
async function deploy() {
  try {
    // Check prerequisites
    const hasFirebaseCLI = await checkFirebaseCLI();
    if (!hasFirebaseCLI) {
      return;
    }

    checkFirebaseConfig();

    // Validate rules first
    await validateRules();

    // Deploy
    await deployRulesAndIndexes();

    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Check your Firebase Console to verify the deployment');
    console.log('   2. Run the test script to validate everything is working:');
    console.log('      node scripts/firebase-test.js');
    console.log('   3. Monitor your app for any permission or performance issues');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();
