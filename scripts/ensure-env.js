const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envProductionPath = path.join(process.cwd(), '.env.production');

// Default Firebase config values
const defaultConfig = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyB3KTh7DiKvw3Mrwr6VtGutnqfIOeNpEdA",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "neofi-5e481.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "neofi-5e481",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "neofi-5e481.firebasestorage.app",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "257578214193",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:257578214193:web:6ef9cc2808e134715e8610",
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-NJGRQPLZ7J"
};

// Function to create env file with default values if it doesn't exist
function ensureEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating ${filePath} with default values...`);
    const envContent = Object.entries(defaultConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(filePath, envContent);
    console.log(`Created ${filePath} successfully.`);
  } else {
    console.log(`${filePath} already exists.`);
  }
}

// Ensure both env files exist
ensureEnvFile(envLocalPath);
ensureEnvFile(envProductionPath);

console.log('Environment files check completed.');