# Google Authentication Setup Guide

## Firebase Console Configuration

### 1. Enable Google Sign-In Provider
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`neofi-5e481`)
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** to ON
6. Add your **support email** (required)
7. Click **Save**

### 2. Configure Authorized Domains
1. In the same **Authentication** → **Sign-in method** page
2. Scroll down to **Authorized domains**
3. Add your production domain: `neo-fi-xi.vercel.app`
4. Add localhost for development: `localhost`
5. Click **Add domain** for each

### 3. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 client ID
5. Add authorized origins:
   - `https://neo-fi-xi.vercel.app`
   - `http://localhost:3000` (for development)
6. Add authorized redirect URIs:
   - `https://neo-fi-xi.vercel.app/__/auth/handler`
   - `http://localhost:3000/__/auth/handler`

## Troubleshooting Common Issues

### Error: "unauthorized-domain"
- Ensure your domain is added to Firebase authorized domains
- Check Google Cloud Console authorized origins
- Wait 5-10 minutes after adding domains

### Error: "popup-blocked"
- User's browser is blocking popups
- Ask users to allow popups for your site
- Consider using redirect method instead of popup

### Error: "popup-closed-by-user"
- User closed the Google sign-in popup
- This is normal user behavior, no action needed

## Testing
1. Test on localhost first
2. Deploy to Vercel and test on production domain
3. Check browser console for detailed error messages
4. Verify Firebase project settings match your domain

## Current Configuration
- Domain: `neo-fi-xi.vercel.app`
- Firebase Project: `neofi-5e481`
- Auth Domain: `neofi-5e481.firebaseapp.com`