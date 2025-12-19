import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Check if Firebase environment variables are configured
const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!isFirebaseConfigured) {
  console.error(
    '🔥 Firebase Configuration Missing!\n\n' +
    'Please follow these steps:\n\n' +
    '1. Create a .env file in web_portal/ directory\n' +
    '2. Copy the contents from .env.example\n' +
    '3. Fill in your Firebase credentials from Firebase Console\n' +
    '4. Restart the dev server (npm run dev)\n\n' +
    'See QUICKSTART_VN.md or FIREBASE_SETUP.md for detailed instructions.'
  );
  
  // Create mock instances to prevent crashes
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
} else {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    console.error(
      '\nPlease check:\n' +
      '1. Your Firebase credentials in .env file are correct\n' +
      '2. You have enabled Authentication and Firestore in Firebase Console\n' +
      '3. See FIREBASE_SETUP.md for troubleshooting'
    );
    throw error;
  }
}

export { app, auth, db, isFirebaseConfigured };
