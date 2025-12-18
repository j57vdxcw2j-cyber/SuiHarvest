import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

/**
 * Admin Account Management Service
 * Handles admin account creation, listing, and management
 */

export interface AdminAccount {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'staff' | 'viewer';
  walletAddress?: string;
  createdAt: string;
  createdBy: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface CreateAccountData {
  username: string;
  email?: string;
  role: 'admin' | 'staff' | 'viewer';
  walletAddress?: string;
  password?: string;
}

class AdminAccountService {
  private adminAccountsCollection = collection(db, 'admin_accounts');
  private usersCollection = collection(db, 'users');

  /**
   * Create a new admin account
   */
  async createAdminAccount(
    accountData: CreateAccountData,
    createdBy: string
  ): Promise<{ success: boolean; error?: string; data?: AdminAccount }> {
    try {
      // Validate required fields
      if (!accountData.username || accountData.username.trim().length < 3) {
        return {
          success: false,
          error: 'Username must be at least 3 characters'
        };
      }

      // Wallet address is now mandatory
      if (!accountData.walletAddress || accountData.walletAddress.trim().length === 0) {
        return {
          success: false,
          error: 'Wallet address is required'
        };
      }

      // Validate wallet address format (starts with 0x and correct length)
      if (!accountData.walletAddress.startsWith('0x') || accountData.walletAddress.length !== 66) {
        return {
          success: false,
          error: 'Invalid wallet address format (must be 0x + 64 characters)'
        };
      }

      // Check if username already exists
      const allAccounts = await this.getAllAdminAccounts();
      const existingAccount = allAccounts.find(
        acc => acc.username.toLowerCase() === accountData.username.toLowerCase()
      );

      if (existingAccount) {
        return {
          success: false,
          error: 'Username already exists'
        };
      }

      // Generate account ID
      const accountId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const accountRef = doc(this.adminAccountsCollection, accountId);

      const newAccount: AdminAccount = {
        id: accountId,
        username: accountData.username,
        email: accountData.email,
        role: accountData.role || 'viewer',
        walletAddress: accountData.walletAddress,
        createdAt: new Date().toISOString(),
        createdBy: createdBy,
        isActive: true
      };

      // Store account with password (Note: In production, hash the password!)
      const accountWithPassword: any = {
        ...newAccount,
        // TODO: Hash password before storing in production
        password: accountData.password || '' // Store temporarily for demo
      };

      await setDoc(accountRef, accountWithPassword);

      return {
        success: true,
        data: newAccount
      };
    } catch (error: any) {
      console.error('Error creating admin account:', error);
      return {
        success: false,
        error: error.message || 'Failed to create admin account'
      };
    }
  }

  /**
   * Verify admin login credentials
   */
  async verifyAdminLogin(
    username: string,
    password: string,
    walletAddress?: string
  ): Promise<{ success: boolean; error?: string; account?: AdminAccount }> {
    try {
      console.log('🔍 verifyAdminLogin called:', { username, hasPassword: !!password, walletAddress });
      
      const accountsSnapshot = await getDocs(this.adminAccountsCollection);
      const accounts = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      console.log('📊 Total accounts found:', accounts.length);
      console.log('📊 All accounts:', accounts.map(a => ({ 
        username: a.username, 
        role: a.role, 
        isActive: a.isActive,
        hasPassword: !!a.password,
        password: a.password // Temporary debug
      })));

      // Find matching account
      const matchingAccount = accounts.find(
        (account) =>
          account.username.toLowerCase() === username.toLowerCase() &&
          account.isActive === true &&
          (account.role === 'admin' || account.role === 'staff')
      );

      if (!matchingAccount) {
        console.log('❌ No matching account found');
        return {
          success: false,
          error: 'Invalid username or account is inactive'
        };
      }

      console.log('✅ Found matching account:', {
        username: matchingAccount.username,
        role: matchingAccount.role,
        hasPassword: !!matchingAccount.password,
        storedPassword: matchingAccount.password,
        inputPassword: password
      });

      // Verify password (TODO: use proper hashing in production)
      if (matchingAccount.password) {
        if (matchingAccount.password !== password) {
          console.log('❌ Password mismatch');
          return {
            success: false,
            error: 'Invalid password'
          };
        }
        console.log('✅ Password verified');
      } else {
        console.log('⚠️ No password set for this account');
      }

      // Wallet verification is optional during login
      // Wallet will be checked inside Admin Hub (Sui Management) when needed
      if (walletAddress && matchingAccount.walletAddress) {
        if (walletAddress.toLowerCase() !== matchingAccount.walletAddress.toLowerCase()) {
          console.log('⚠️ Wallet mismatch (warning only during login)');
          // Don't block login, just log the warning
        } else {
          console.log('✅ Wallet verified (optional check)');
        }
      } else {
        console.log('ℹ️ Wallet verification skipped during login');
      }

      console.log('✅ All checks passed');
      return {
        success: true,
        account: matchingAccount
      };
    } catch (error: any) {
      console.error('Error verifying admin login:', error);
      return {
        success: false,
        error: error.message || 'Login verification failed'
      };
    }
  }

  /**
   * Get all admin accounts
   */
  async getAllAdminAccounts(): Promise<AdminAccount[]> {
    try {
      const accountsSnapshot = await getDocs(this.adminAccountsCollection);
      const accounts = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminAccount[];

      // Sort by creation date (newest first)
      accounts.sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });

      return accounts;
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
      return [];
    }
  }

  /**
   * Get all user accounts (game players)
   */
  async getAllUserAccounts(): Promise<any[]> {
    try {
      const usersSnapshot = await getDocs(this.usersCollection);
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Sort by join date (newest first)
      users.sort((a, b) => {
        const aTime = a.joinDate ? new Date(a.joinDate).getTime() : 0;
        const bTime = b.joinDate ? new Date(b.joinDate).getTime() : 0;
        return bTime - aTime;
      });

      return users;
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      return [];
    }
  }

  /**
   * Update admin account status
   */
  async toggleAccountStatus(
    accountId: string,
    isActive: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accountRef = doc(this.adminAccountsCollection, accountId);
      const accountDoc = await getDoc(accountRef);

      if (!accountDoc.exists()) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      await updateDoc(accountRef, {
        isActive: isActive
      });

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error updating account status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update account'
      };
    }
  }

  /**
   * Delete admin account
   */
  async deleteAdminAccount(accountId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const accountRef = doc(this.adminAccountsCollection, accountId);
      const accountDoc = await getDoc(accountRef);

      if (!accountDoc.exists()) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      await deleteDoc(accountRef);

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting account:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete account'
      };
    }
  }

  /**
   * Update last login time
   */
  async updateLastLogin(accountId: string): Promise<void> {
    try {
      const accountRef = doc(this.adminAccountsCollection, accountId);
      const accountDoc = await getDoc(accountRef);

      if (accountDoc.exists()) {
        await updateDoc(accountRef, {
          lastLogin: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Format time ago
   */
  formatTimeAgo(dateString?: string): string {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Get role badge color
   */
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'roleBadgeAdmin';
      case 'staff':
        return 'roleBadgeStaff';
      case 'viewer':
        return 'roleBadgeViewer';
      default:
        return 'roleBadgeDefault';
    }
  }
}

export const adminAccountService = new AdminAccountService();
