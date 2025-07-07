# Firebase Setup Guide

This guide will help you migrate from Supabase to Firebase for the Budget Buddy application.

## Prerequisites

- A Google account
- Node.js installed on your machine
- The Budget Buddy project cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "budget-buddy")
4. Choose whether to enable Google Analytic# Firebase Setup Guide for Budget Buddy App

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Budget Buddy")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable other providers (Google, GitHub, etc.)

## Step 3: Create Firestore Database

1. Click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for global access
4. Select "Multi-region" for worldwide availability
5. Click "Done"

**Note**: Multi-region setup ensures users from any country can access your app without restrictions.

## Step 4: Get Firebase Configuration

1. Click on the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Enter an app nickname (e.g., "budget-buddy-web")
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 6: Set Up Firestore Collections

Create the following collections in your Firestore database:

### 1. profiles
- Collection ID: `profiles`
- Document structure:
```json
{
  "id": "user-uid",
  "email": "user@example.com",
  "name": "User Name",
  "currency": "USD",
  "timezone": "UTC",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. categories
- Collection ID: `categories`
- Document structure:
```json
{
  "id": "category-id",
  "name": "Food & Dining",
  "icon": "🍽️",
  "userId": "user-uid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. transactions
- Collection ID: `transactions`
- Document structure:
```json
{
  "id": "transaction-id",
  "userId": "user-uid",
  "amount": 25.50,
  "type": "expense",
  "categoryId": "category-id",
  "description": "Lunch at restaurant",
  "date": "2024-01-01",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. budgets
- Collection ID: `budgets`
- Document structure:
```json
{
  "id": "budget-id",
  "userId": "user-uid",
  "categoryId": "category-id",
  "amount": 500.00,
  "period": "monthly",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Step 7: Set Up Security Rules

1. Go to Firestore Database in your Firebase console
2. Click on the "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow global access - users can create/read/write from any country
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Specific rules for better security (optional - can be removed for full access)
    match /profiles/{userId} {
      allow read, write: if request.auth != null;
    }
    
    match /transactions/{transactionId} {
      allow read, write, create: if request.auth != null;
    }
    
    match /budgets/{budgetId} {
      allow read, write, create: if request.auth != null;
    }
    
    match /categories/{categoryId} {
      allow read, write, create: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

## Step 8: Install Dependencies and Replace Supabase Code

1. Install Firebase dependencies:

```bash
npm install firebase firebase-admin
```

2. Remove Supabase dependencies:

```bash
npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs
```

3. Replace the Supabase client file (`lib/supabase.ts`) with Firebase:

```typescript
// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

4. Update imports in your files from:
```typescript
import { supabase } from '@/lib/supabase';
```
to:
```typescript
import { auth, db } from '@/lib/firebase';
```

## Step 9: Seed Default Categories (Optional)

You can create some default categories in Firestore:

1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `categories`
4. Add documents with the following data:

```json
// Document 1
{
  "name": "Food & Dining",
  "icon": "🍽️",
  "userId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}

// Document 2
{
  "name": "Transportation",
  "icon": "🚗",
  "userId": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}

// Add more categories as needed...
```

## Step 10: Update Authentication Logic

Replace Supabase authentication with Firebase authentication:

```typescript
// Example: Converting login function from Supabase to Firebase
// Old Supabase code:
// const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// New Firebase code:
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};
```

## Step 11: Update Database Queries

Replace Supabase queries with Firestore queries:

```typescript
// Example: Converting a query from Supabase to Firestore
// Old Supabase code:
// const { data, error } = await supabase.from('transactions').select('*').eq('userId', userId);

// New Firebase code:
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const getTransactions = async (userId: string) => {
  try {
    const q = query(collection(db, 'transactions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data: transactions, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
```

## Step 12: Test the Application

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Try registering a new account
4. Test login/logout functionality
5. Create some transactions and budgets

## Migration Notes

### Key Differences from Supabase:

1. **Authentication**: Firebase Auth uses different user object structure
2. **Database**: Firestore is a NoSQL document database vs PostgreSQL
3. **Real-time**: Firestore has built-in real-time listeners
4. **Security**: Rules are defined in Firebase console vs SQL policies

### Data Migration:

If you have existing data in Supabase, you'll need to:

1. Export data from Supabase
2. Transform the data structure for Firestore
3. Import data using Firebase Admin SDK or console

### Environment Variables:

Make sure to update your deployment platform (Vercel, Netlify, etc.) with the new Firebase environment variables.

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Check Firestore security rules
2. **Auth Errors**: Verify Firebase config and enable authentication methods
3. **Build Errors**: Ensure all imports are updated from Supabase to Firebase
4. **Missing Supabase Environment Variables Error**: This indicates you still have Supabase references in your code. Search for all instances of `supabase` in your codebase and replace them with Firebase equivalents
5. **Cannot read properties of undefined**: Check that you've properly initialized Firebase before using it

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

## Next Steps

1. Set up Firebase hosting for deployment
2. Configure Firebase Functions for server-side logic
3. Set up Firebase Analytics for user tracking
4. Consider Firebase Storage for file uploads