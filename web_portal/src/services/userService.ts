import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import type { 
  UserProfile, 
  Transaction, 
  Activity, 
  ApiResponse
} from '../types';
import { TransactionType } from '../types';

/**
 * User Service for managing user profiles and data
 */

class UserService {
  private usersCollection = collection(db, 'users');
  private transactionsCollection = collection(db, 'transactions');
  private activitiesCollection = collection(db, 'activities');

  /**
   * Create a new user profile
   */
  async createUser(walletAddress: string, username?: string): Promise<ApiResponse<UserProfile>> {
    try {
      const userId = walletAddress; // Use wallet address as user ID
      const userRef = doc(this.usersCollection, userId);

      // Check if user already exists
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return {
          success: false,
          error: 'User already exists'
        };
      }

      const now = new Date().toISOString();
      const newUser: any = {
        id: userId,
        walletAddress,
        username: username || `Player_${walletAddress.slice(0, 6)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
        level: 1,
        experience: 0,
        maxExperience: 1000,
        joinDate: now,
        lastLogin: now,
        totalTransactions: 0,
        gachaTransactions: 0,
        questTransactions: 0,
        stamina: 50,
        maxStamina: 50,
        createdAt: now,
        updatedAt: now,
        // Game State
        gameState: {
          currentDay: 0,
          totalDaysPlayed: 0,
          famePoints: 0,
          treasureChestsOpened: 0,
          totalContractsCompleted: 0,
          totalSuiEarned: 0,
          totalStaminaUsed: 0,
          basicContractsCompleted: 0,
          advancedContractsCompleted: 0,
          expertContractsCompleted: 0,
          // Gacha Case Stats
          totalCasesOpened: 0,
          commonCasesOpened: 0,
          advancedCasesOpened: 0,
          epicCasesOpened: 0,
          totalFreeSpinsReceived: 0,
          casesOpenedToday: 0,
          canStartNewDay: true
        }
      };

      await setDoc(userRef, newUser);

      return {
        success: true,
        data: newUser,
        message: 'User created successfully'
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.message || 'Failed to create user'
      };
    }
  }

  /**
   * Get user profile by wallet address
   */
  async getUserProfile(walletAddress: string): Promise<ApiResponse<UserProfile>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const userData = userDoc.data() as UserProfile;
      
      // Update last login
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        data: userData
      };
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user profile'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    walletAddress: string, 
    updates: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userRef, updatedData);

      const updatedUser = {
        ...userDoc.data(),
        ...updatedData
      } as UserProfile;

      return {
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  /**
   * Add experience to user and handle level up
   */
  async addExperience(walletAddress: string, amount: number): Promise<ApiResponse<UserProfile>> {
    try {
      const profileResponse = await this.getUserProfile(walletAddress);
      if (!profileResponse.success || !profileResponse.data) {
        return profileResponse;
      }

      const user = profileResponse.data;
      let newExperience = user.experience + amount;
      let newLevel = user.level;
      let newMaxExperience = user.maxExperience;

      // Check for level up
      while (newExperience >= newMaxExperience) {
        newExperience -= newMaxExperience;
        newLevel++;
        newMaxExperience = Math.floor(newMaxExperience * 1.5); // Increase by 50% each level
      }

      return await this.updateUserProfile(walletAddress, {
        experience: newExperience,
        level: newLevel,
        maxExperience: newMaxExperience
      });
    } catch (error: any) {
      console.error('Error adding experience:', error);
      return {
        success: false,
        error: error.message || 'Failed to add experience'
      };
    }
  }

  /**
   * Get user transaction history
   */
  async getUserTransactions(
    walletAddress: string,
    limitCount: number = 10,
    transactionType?: TransactionType
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      // Simplified query without orderBy to avoid index requirement
      let q = query(
        this.transactionsCollection,
        where('userId', '==', walletAddress),
        limit(limitCount * 2)
      );

      if (transactionType) {
        q = query(
          this.transactionsCollection,
          where('userId', '==', walletAddress),
          where('type', '==', transactionType),
          limit(limitCount * 2)
        );
      }

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];

      // Sort by timestamp in memory (descending)
      transactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        success: true,
        data: transactions.slice(0, limitCount)
      };
    } catch (error: any) {
      console.error('Error getting transactions:', error);
      
      // Return empty array if index issue
      if (error.code === 'failed-precondition') {
        console.warn('Firestore index needed. Returning empty transactions for now.');
        return {
          success: true,
          data: []
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to get transactions'
      };
    }
  }

  /**
   * Get user recent activities
   */
  async getUserActivities(
    walletAddress: string,
    limitCount: number = 10
  ): Promise<ApiResponse<Activity[]>> {
    try {
      // Simplified query without orderBy to avoid index requirement
      // Sort will be done in memory
      const q = query(
        this.activitiesCollection,
        where('userId', '==', walletAddress),
        limit(limitCount * 2) // Get more to ensure we have enough after sorting
      );

      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];

      // Sort by timestamp in memory (descending)
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Return only the requested number
      return {
        success: true,
        data: activities.slice(0, limitCount)
      };
    } catch (error: any) {
      console.error('Error getting activities:', error);
      
      // If still no data, return empty array instead of error
      if (error.code === 'failed-precondition') {
        console.warn('Firestore index needed. Returning empty activities for now.');
        return {
          success: true,
          data: []
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to get activities'
      };
    }
  }

  /**
   * Record a new transaction
   */
  async recordTransaction(transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> {
    try {
      const transactionRef = doc(this.transactionsCollection);
      const newTransaction: Transaction = {
        id: transactionRef.id,
        ...transaction,
        timestamp: new Date().toISOString()
      };

      await setDoc(transactionRef, newTransaction);

      // Update user transaction counts
      const userRef = doc(this.usersCollection, transaction.userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const updates: any = {
          totalTransactions: (userDoc.data().totalTransactions || 0) + 1,
          updatedAt: new Date().toISOString()
        };

        if (transaction.type === TransactionType.GACHA) {
          updates.gachaTransactions = (userDoc.data().gachaTransactions || 0) + 1;
        } else if (transaction.type === TransactionType.QUEST) {
          updates.questTransactions = (userDoc.data().questTransactions || 0) + 1;
        }

        await updateDoc(userRef, updates);
      }

      return {
        success: true,
        data: newTransaction,
        message: 'Transaction recorded successfully'
      };
    } catch (error: any) {
      console.error('Error recording transaction:', error);
      return {
        success: false,
        error: error.message || 'Failed to record transaction'
      };
    }
  }

  /**
   * Record a new activity
   */
  async recordActivity(activity: Omit<Activity, 'id'>): Promise<ApiResponse<Activity>> {
    try {
      const activityRef = doc(this.activitiesCollection);
      const newActivity: Activity = {
        id: activityRef.id,
        ...activity,
        timestamp: new Date().toISOString()
      };

      await setDoc(activityRef, newActivity);

      return {
        success: true,
        data: newActivity,
        message: 'Activity recorded successfully'
      };
    } catch (error: any) {
      console.error('Error recording activity:', error);
      return {
        success: false,
        error: error.message || 'Failed to record activity'
      };
    }
  }

  /**
   * Get transaction statistics for a user
   */
  async getTransactionStats(walletAddress: string): Promise<ApiResponse<{
    total: number;
    gacha: number;
    quest: number;
    trade: number;
  }>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const userData = userDoc.data();
      
      return {
        success: true,
        data: {
          total: userData.totalTransactions || 0,
          gacha: userData.gachaTransactions || 0,
          quest: userData.questTransactions || 0,
          trade: 0 // TODO: Add trade transactions tracking
        }
      };
    } catch (error: any) {
      console.error('Error getting transaction stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to get transaction stats'
      };
    }
  }
}

export const userService = new UserService();
