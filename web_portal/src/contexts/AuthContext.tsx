import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { UserProfile, WalletAuthData } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  
  // Wallet connection (without full auth)
  connectWallet: (address: string) => Promise<void>;
  disconnectWallet: () => void;
  
  // Full authentication with signature
  signInWithWallet: (authData: WalletAuthData) => Promise<boolean>;
  signOut: () => Promise<void>;
  
  // Profile operations
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    // Skip Firebase setup if not configured
    const isConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                         import.meta.env.VITE_FIREBASE_PROJECT_ID;
    
    if (!isConfigured) {
      console.log('ℹ️ Firebase not configured - running in demo mode');
      setLoading(false);
      return;
    }

    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Load user profile from Firestore
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user profile from Firestore
  const loadUserProfile = async (userId: string) => {
    try {
      const response = await userService.getUserProfile(userId);
      if (response.success && response.data) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Connect wallet (light connection, no full auth)
  const connectWallet = async (address: string) => {
    setWalletAddress(address);
    localStorage.setItem('walletAddress', address);
    
    // Sign in anonymously to Firebase if not already authenticated
    if (!user) {
      const result = await authService.signInAnonymous();
      if (result.success && result.data) {
        console.log('✅ Auto signed in to Firebase for wallet:', address);
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
  };

  // Sign in with wallet signature
  const signInWithWallet = async (authData: WalletAuthData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.signInWithWallet(authData);
      
      if (response.success) {
        setWalletAddress(authData.walletAddress);
        localStorage.setItem('walletAddress', authData.walletAddress);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setUserProfile(null);
      disconnectWallet();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (!walletAddress) return;
    
    try {
      const response = await userService.getUserProfile(walletAddress);
      if (response.success && response.data) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const response = await userService.updateUserProfile(walletAddress, updates);
      if (response.success && response.data) {
        setUserProfile(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Check wallet connection on mount
  useEffect(() => {
    const savedWalletAddress = localStorage.getItem('walletAddress');
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
    }
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: user !== null,
    walletConnected: walletAddress !== null,
    walletAddress,
    connectWallet,
    disconnectWallet,
    signInWithWallet,
    signOut,
    refreshProfile,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#fff'
        }}>
          Loading...
        </div>
      )}
    </AuthContext.Provider>
  );
};
