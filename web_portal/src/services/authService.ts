import { auth } from '../config/firebase';
import { 
  signOut as firebaseSignOut,
  signInAnonymously,
  type User 
} from 'firebase/auth';
import type { WalletAuthData, ApiResponse } from '../types';

/**
 * Authentication Service for Sui Wallet Integration
 * Handles wallet signature verification and Firebase custom token authentication
 */

class AuthService {
  /**
   * Generate a message for the user to sign with their wallet
   * This proves ownership of the wallet address
   */
  generateSignMessage(walletAddress: string): string {
    const timestamp = Date.now();
    const message = `SuiHarvest Login\n\nWallet Address: ${walletAddress}\nTimestamp: ${timestamp}\n\nSign this message to authenticate your wallet.`;
    return message;
  }

  /**
   * Verify wallet signature and authenticate with Firebase
   * In production, this should call your backend API to verify the signature
   * and get a custom Firebase token
   */
  async signInWithWallet(authData: WalletAuthData): Promise<ApiResponse<User>> {
    try {
      // TODO: Call backend API to verify signature
      // const response = await fetch('/api/auth/wallet-login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(authData)
      // });
      // const { customToken } = await response.json();

      // For now, simulate backend verification
      // In production, backend will:
      // 1. Verify the signature matches the message and wallet address
      // 2. Create/update user in Firestore
      // 3. Generate Firebase custom token
      // 4. Return the custom token

      console.log('Authenticating wallet:', authData.walletAddress);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, use the custom token from backend:
      // const userCredential = await signInWithCustomToken(auth, customToken);
      
      // For development, we'll create a mock authentication
      // Note: This won't actually work without a backend generating custom tokens
      throw new Error('Backend API not implemented yet. Please set up your backend to generate custom tokens.');

      // return {
      //   success: true,
      //   data: userCredential.user,
      //   message: 'Successfully authenticated'
      // };

    } catch (error: any) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Sign in anonymously (for wallet-based authentication)
   * This creates a Firebase user that can be linked to wallet address
   */
  async signInAnonymous(): Promise<ApiResponse<User>> {
    try {
      const userCredential = await signInAnonymously(auth);
      console.log('✅ Anonymous sign in successful:', userCredential.user.uid);
      return {
        success: true,
        data: userCredential.user,
        message: 'Successfully signed in anonymously'
      };
    } catch (error: any) {
      console.error('❌ Anonymous sign in error:', error);
      return {
        success: false,
        error: error.message || 'Anonymous sign in failed'
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      await firebaseSignOut(auth);
      return {
        success: true,
        message: 'Successfully signed out'
      };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message || 'Sign out failed'
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth.onAuthStateChanged(callback);
  }
}

export const authService = new AuthService();
