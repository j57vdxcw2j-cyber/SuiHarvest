# Firebase Backend Setup Guide - Phase 2

This guide will walk you through setting up Firebase for SuiHarvest backend.

## 🎯 Overview

Phase 2 integrates Firebase for:
- User authentication (wallet-based)
- User profile storage
- Transaction history
- Activity logs
- Real-time data sync

## 📋 Prerequisites

- Firebase account (free tier is sufficient for development)
- Node.js 18+ installed
- Firebase CLI (optional, for advanced setup)

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `suiharvest` (or your preferred name)
4. Disable Google Analytics (optional for development)
5. Click "Create project"

## 🔧 Step 2: Configure Firebase App

### 2.1 Add Web App

1. In Firebase Console, click the **Web icon** `</>`
2. Register app name: `SuiHarvest Web Portal`
3. **Don't** check "Firebase Hosting" (we're using Vite)
4. Click "Register app"

### 2.2 Copy Configuration

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "suiharvest-xxxxx.firebaseapp.com",
  projectId: "suiharvest-xxxxx",
  storageBucket: "suiharvest-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 2.3 Create .env File

1. Copy `.env.example` to `.env` in the `web_portal` directory:
   ```bash
   cd web_portal
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=suiharvest-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=suiharvest-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=suiharvest-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

⚠️ **Important**: Never commit `.env` file to Git! It's already in `.gitignore`.

## 🔐 Step 3: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Anonymous** authentication (for development)
   - This allows users to authenticate without creating accounts
   - Later, we'll implement custom token authentication with wallet signatures

## 💾 Step 4: Set Up Firestore Database

### 4.1 Create Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose location closest to your users (e.g., `us-central` or `asia-southeast1`)
4. Start in **Test mode** (for development)
   - ⚠️ This allows read/write access for 30 days
   - We'll set up proper security rules later

### 4.2 Create Collections

Firebase will auto-create collections when you add data, but here's the structure:

**Collections:**
- `users` - User profiles
- `transactions` - Transaction history
- `activities` - Activity logs
- `quests` - Quest definitions
- `userQuests` - User quest progress

### 4.3 Add Test Data

Let's add a test user to verify everything works:

1. Go to **Firestore Database**
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: Use your wallet address (e.g., `0x1234567890abcdef`)
5. Add fields:

```json
{
  "id": "0x1234567890abcdef",
  "walletAddress": "0x1234567890abcdef",
  "username": "TestFarmer",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
  "level": 5,
  "experience": 1250,
  "maxExperience": 2000,
  "joinDate": "2024-12-18T00:00:00.000Z",
  "lastLogin": "2024-12-18T00:00:00.000Z",
  "totalTransactions": 15,
  "gachaTransactions": 8,
  "questTransactions": 7,
  "stamina": 100,
  "maxStamina": 100,
  "createdAt": "2024-12-18T00:00:00.000Z",
  "updatedAt": "2024-12-18T00:00:00.000Z"
}
```

## 🧪 Step 5: Test the Integration

### 5.1 Start Development Server

```bash
cd web_portal
npm run dev
```

### 5.2 Open Browser Console

Open your browser's developer console (F12) and check for:
- ✅ "Firebase initialized successfully" message
- ❌ No Firebase errors

### 5.3 Test Profile Page

1. Navigate to the Profile page
2. You should see "Please connect your wallet" message
3. This is expected - we need to implement wallet connection

## 🔌 Step 6: Implement Wallet Connection (Next Steps)

To fully integrate with Sui wallet, you need to:

### 6.1 Install Sui Wallet SDK

```bash
npm install @mysten/dapp-kit @mysten/sui.js @tanstack/react-query
```

### 6.2 Update Navigation Component

Replace the mock wallet connection in `Navigation.tsx` with actual Sui wallet integration using `@mysten/dapp-kit`.

**Example:**

```tsx
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

// In your Navigation component:
const account = useCurrentAccount();

// Replace the "Connect Wallet" button with:
<ConnectButton />

// Access wallet address:
const walletAddress = account?.address;
```

### 6.3 Update AuthContext

Integrate the Sui wallet with AuthContext to sync wallet state with Firebase authentication.

## 🔒 Step 7: Firestore Security Rules (Production)

Before deploying, update Firestore security rules:

1. Go to **Firestore Database > Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - users can read their own, write through backend only
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only backend can write
    }
    
    // Activities - same as transactions
    match /activities/{activityId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false;
    }
    
    // Quests - public read, admin write only
    match /quests/{questId} {
      allow read: if true;
      allow write: if false;
    }
    
    // User quests - users can read their own
    match /userQuests/{userQuestId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false;
    }
  }
}
```

## 📊 Step 8: Firebase Indexes (Optional)

For better query performance, create indexes:

1. Go to **Firestore Database > Indexes**
2. Add composite indexes:

**Index 1: User Transactions**
- Collection: `transactions`
- Fields: `userId` (Ascending), `timestamp` (Descending)

**Index 2: User Activities**
- Collection: `activities`
- Fields: `userId` (Ascending), `timestamp` (Descending)

**Index 3: Transaction Type**
- Collection: `transactions`
- Fields: `userId` (Ascending), `type` (Ascending), `timestamp` (Descending)

## 🎮 Step 9: Test User Flow

### 9.1 Connect Wallet (Mock)

For now, we can test with the mock wallet connection:

1. Update `AuthContext` to auto-connect with test wallet:
   ```tsx
   // In AuthContext, add to useEffect:
   connectWallet('0x1234567890abcdef'); // Your test wallet address
   ```

2. Navigate to Profile page
3. You should see your test user data!

### 9.2 Test Data Fetching

The Profile component should now display:
- User information from Firestore
- Transaction stats
- Recent activities (if you added test data)

## 🐛 Troubleshooting

### Firebase Initialization Failed

**Error:** "Firebase configuration missing"

**Solution:** Make sure `.env` file exists and contains all required variables.

---

### Permission Denied Error

**Error:** "Missing or insufficient permissions"

**Solution:** 
1. Check Firestore rules are in test mode
2. Verify user is authenticated
3. Check console for auth errors

---

### Data Not Loading

**Issue:** Profile shows loading forever

**Solution:**
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check Firestore has test data
4. Verify wallet address matches document ID in Firestore

---

### CORS Errors

**Error:** CORS policy blocking Firebase requests

**Solution:** 
- Firebase should handle CORS automatically
- If issues persist, check Firebase project settings
- Ensure you're using the correct auth domain

## 📱 Next Steps (Phase 3)

Once Phase 2 is working, we can implement:

1. **Real Sui Wallet Integration**
   - Connect with Sui Wallet adapter
   - Sign transactions on blockchain
   - Fetch real SUI balance

2. **Backend API (Firebase Cloud Functions)**
   - Wallet signature verification
   - Custom token generation
   - Transaction validation
   - Gacha logic
   - Quest completion logic

3. **Event Indexer**
   - Listen to Sui blockchain events
   - Sync on-chain data to Firestore
   - Real-time balance updates

4. **Caching Layer**
   - Implement React Query
   - Add Redis for backend caching
   - Optimize data fetching

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Sui Wallet Adapter](https://sui-typescript-docs.vercel.app/dapp-kit)
- [Sui TypeScript SDK](https://sui-typescript-docs.vercel.app/typescript)

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Review this guide step-by-step
4. Check Firebase Console for service status

---

**Current Status:** ✅ Phase 2 - Firebase Backend Infrastructure Complete

**Ready for:** Wallet integration and real-time data sync
