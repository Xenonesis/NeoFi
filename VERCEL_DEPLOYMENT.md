# Deploying NeoFi to Vercel

This guide will help you deploy your NeoFi application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your NeoFi project with Firebase configuration

## Deployment Steps

### 1. Make sure your environment variables are set up

Your project requires Firebase environment variables to function properly. These should be defined in your `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 2. Deploy to Vercel

#### Option 1: Using the Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "New Project"
4. Import your repository
5. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
6. Add Environment Variables:
   - Copy all variables from your `.env.local` file
   - Add them to the Environment Variables section in Vercel
7. Click "Deploy"

#### Option 2: Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project
5. Make sure to add all environment variables when prompted

### 3. Verify your deployment

After deployment, Vercel will provide you with a URL to access your application. Visit this URL to ensure everything is working correctly.

## Troubleshooting

### Firebase Authentication Errors

If you see errors like `Firebase: Error (auth/invalid-api-key)`, check that:

1. Your Firebase environment variables are correctly set in Vercel
2. The API key and other credentials are valid
3. Your Firebase project has Authentication enabled

### Build Failures

If your build fails:

1. Check the build logs for specific errors
2. Ensure all required environment variables are set
3. Verify that your Firebase project is properly configured

## Using vercel.json

You can also use a `vercel.json` file in your project root to configure your deployment. This file has already been created for you with your environment variables.

## Updating Your Deployment

When you make changes to your project:

1. Push your changes to your Git repository
2. Vercel will automatically rebuild and redeploy your application

For manual deployments using the CLI:

```bash
vercel --prod
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Firebase Documentation](https://firebase.google.com/docs)