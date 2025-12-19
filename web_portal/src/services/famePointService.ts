import { db } from '../config/firebase';
import { collection, doc, getDoc, updateDoc, query, where, getDocs, addDoc } from 'firebase/firestore';
import type { TreasureChest, ApiResponse } from '../types';
import { GAME_CONSTANTS } from '../config/gameConstants';

/**
 * Fame Points Service
 * Manages Fame Points (FP) accumulation and Treasure Chest rewards
 */

class FamePointService {
  private treasureChestsCollection = collection(db, 'treasureChests');

  /**
   * Add fame points to user
   */
  async addFamePoints(walletAddress: string, points: number): Promise<ApiResponse<{
    totalFamePoints: number;
    canClaimChest: boolean;
  }>> {
    try {
      const userRef = doc(db, 'users', walletAddress);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      const userData = userDoc.data();
      const currentFP = userData.gameState?.famePoints || 0;
      const newFP = currentFP + points;
      
      await updateDoc(userRef, {
        'gameState.famePoints': newFP,
        updatedAt: new Date().toISOString()
      });
      
      const canClaimChest = newFP >= GAME_CONSTANTS.FAME_POINTS_FOR_CHEST;
      
      return {
        success: true,
        data: {
          totalFamePoints: newFP,
          canClaimChest
        },
        message: `Đã nhận ${points} Fame Points! Tổng: ${newFP} FP`
      };
    } catch (error: any) {
      console.error('Error adding fame points:', error);
      return {
        success: false,
        error: error.message || 'Failed to add fame points'
      };
    }
  }

  /**
   * Check if user can claim treasure chest
   */
  async canClaimTreasureChest(walletAddress: string): Promise<ApiResponse<{
    canClaim: boolean;
    currentFP: number;
    requiredFP: number;
  }>> {
    try {
      const userRef = doc(db, 'users', walletAddress);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      const userData = userDoc.data();
      const currentFP = userData.gameState?.famePoints || 0;
      const canClaim = currentFP >= GAME_CONSTANTS.FAME_POINTS_FOR_CHEST;
      
      return {
        success: true,
        data: {
          canClaim,
          currentFP,
          requiredFP: GAME_CONSTANTS.FAME_POINTS_FOR_CHEST
        }
      };
    } catch (error: any) {
      console.error('Error checking treasure chest eligibility:', error);
      return {
        success: false,
        error: error.message || 'Failed to check eligibility'
      };
    }
  }

  /**
   * Claim treasure chest reward
   * Deducts 100 FP and creates chest record
   */
  async claimTreasureChest(walletAddress: string): Promise<ApiResponse<TreasureChest>> {
    try {
      // Check eligibility
      const eligibility = await this.canClaimTreasureChest(walletAddress);
      if (!eligibility.success || !eligibility.data?.canClaim) {
        return {
          success: false,
          error: `Không đủ Fame Points. Cần: ${GAME_CONSTANTS.FAME_POINTS_FOR_CHEST} FP`
        };
      }
      
      const userRef = doc(db, 'users', walletAddress);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data()!;
      
      // Calculate reward (random between 0.4 - 0.6 SUI) - Balanced economics
      const suiReward = 0.4 + Math.random() * 0.2;
      
      // Create treasure chest record
      const chest: Omit<TreasureChest, 'id' | 'txHash'> = {
        userId: walletAddress,
        requiredFamePoints: GAME_CONSTANTS.FAME_POINTS_FOR_CHEST,
        suiReward: parseFloat(suiReward.toFixed(2)),
        claimedAt: new Date().toISOString()
        // txHash will be added later when blockchain transaction completes
      };
      
      const chestRef = await addDoc(this.treasureChestsCollection, chest);
      
      // Deduct fame points
      const newFP = (userData.gameState?.famePoints || 0) - GAME_CONSTANTS.FAME_POINTS_FOR_CHEST;
      const totalChests = (userData.gameState?.treasureChestsOpened || 0) + 1;
      
      await updateDoc(userRef, {
        'gameState.famePoints': newFP,
        'gameState.treasureChestsOpened': totalChests,
        updatedAt: new Date().toISOString()
      });
      
      const claimedChest: TreasureChest = {
        id: chestRef.id,
        ...chest
      };
      
      return {
        success: true,
        data: claimedChest,
        message: `🎉 Nhận được ${suiReward.toFixed(2)} SUI từ Treasure Chest!`
      };
    } catch (error: any) {
      console.error('Error claiming treasure chest:', error);
      return {
        success: false,
        error: error.message || 'Failed to claim treasure chest'
      };
    }
  }

  /**
   * Get user's treasure chest history
   */
  async getTreasureChestHistory(walletAddress: string, limit: number = 10): Promise<ApiResponse<TreasureChest[]>> {
    try {
      const q = query(
        this.treasureChestsCollection,
        where('userId', '==', walletAddress)
      );
      
      const snapshot = await getDocs(q);
      const chests: TreasureChest[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TreasureChest));
      
      // Sort by claimed date (newest first)
      chests.sort((a, b) => {
        const dateA = new Date(a.claimedAt || 0).getTime();
        const dateB = new Date(b.claimedAt || 0).getTime();
        return dateB - dateA;
      });
      
      return {
        success: true,
        data: chests.slice(0, limit)
      };
    } catch (error: any) {
      console.error('Error getting treasure chest history:', error);
      return {
        success: false,
        error: error.message || 'Failed to get history'
      };
    }
  }

  /**
   * Calculate progress to next chest
   */
  getChestProgress(currentFP: number): {
    progress: number; // 0-100
    remaining: number;
    percentage: string;
  } {
    const progress = Math.min((currentFP / GAME_CONSTANTS.FAME_POINTS_FOR_CHEST) * 100, 100);
    const remaining = Math.max(GAME_CONSTANTS.FAME_POINTS_FOR_CHEST - currentFP, 0);
    
    return {
      progress,
      remaining,
      percentage: `${progress.toFixed(1)}%`
    };
  }

  /**
   * Update treasure chest with transaction hash
   */
  async updateChestTxHash(chestId: string, txHash: string): Promise<ApiResponse<void>> {
    try {
      const chestRef = doc(this.treasureChestsCollection, chestId);
      await updateDoc(chestRef, {
        txHash
      });
      
      return {
        success: true,
        message: 'Transaction hash updated'
      };
    } catch (error: any) {
      console.error('Error updating chest tx hash:', error);
      return {
        success: false,
        error: error.message || 'Failed to update'
      };
    }
  }
}

export const famePointService = new FamePointService();
