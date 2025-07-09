# Security Guidelines

## Environment Variables Security

### ✅ What We Fixed

- **Removed hardcoded Firebase secrets** from `scripts/ensure-env.js`
- **Removed hardcoded fallback values** from `lib/firebase.ts`
- **Implemented secure environment variable validation** in both scripts and Firebase config
- **Added runtime validation** that fails fast if secrets are missing
- **Added proper error handling** for missing or invalid configurations

### 🔒 Security Best Practices

#### 1. Environment Variables
- Never commit `.env.local` or `.env.production` files
- Use `.env.template` for documentation only
- Set actual secrets in your deployment platform (Vercel, Netlify, etc.)

#### 2. Firebase Configuration
```bash
# ✅ Good - Use environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

# ❌ Bad - Never hardcode in scripts or config files
const config = { apiKey: "AIzaSyB3KTh7DiKvw3Mrwr6VtGutnqfIOeNpEdA" }
```

**Firebase Config Security:**
- The app now validates Firebase configuration at runtime
- Missing or placeholder environment variables will cause the app to fail immediately
- No fallback to hardcoded values - this prevents accidental exposure

#### 3. Deployment Security
- **Vercel**: Set environment variables in dashboard
- **Netlify**: Use site settings > environment variables
- **GitHub Actions**: Use repository secrets

### 🛡️ Updated Script Behavior

The `scripts/ensure-env.js` now:
1. Validates required environment variables exist
2. Checks that placeholder values are replaced
3. Creates env files from template if missing
4. Provides clear error messages for missing configuration

### 🚨 Migration Steps

If you're updating from the old version:

1. **Remove any hardcoded secrets** from your local files
2. **Update your environment variables** with actual values
3. **Run the build script** to validate configuration:
   ```bash
   npm run build
   ```

### 📋 Required Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 🔍 Validation

**Automated Validation:**
Run the validation script to check your environment setup:
```bash
npm run validate-env
```

**Build-time Validation:**
The build process will fail if:
- Environment variables are missing
- Values still contain placeholder text (e.g., "your-api-key")
- Required configuration files don't exist

**Runtime Validation:**
The Firebase configuration validates at app startup and will throw clear error messages for missing or invalid values.

This multi-layer approach ensures your application only runs with proper, secure configuration.