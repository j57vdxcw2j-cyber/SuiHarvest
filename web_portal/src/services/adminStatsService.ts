import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Admin Statistics Service
 * Fetches real data from Firebase for admin dashboard
 */

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalRewardsPaid: number;
  totalRevenue: number;
}

export interface RecentUser {
  id: string;
  wallet: string;
  lastActive: string;
  gamesPlayed: number;
  totalRewards: number;
}

export interface RecentTransaction {
  id: string;
  type: 'Entry Fee' | 'Reward Claim' | 'Other';
  wallet: string;
  amount: number;
  time: string;
  timestamp: number;
  status: 'success' | 'failed';
}

class AdminStatsService {
  private usersCollection = collection(db, 'users');
  private transactionsCollection = collection(db, 'transactions');

  /**
   * Get overall admin statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    try {
      // Get all users
      const usersSnapshot = await getDocs(this.usersCollection);
      const users = usersSnapshot.docs.map(doc => doc.data());

      const totalUsers = users.length;

      // Calculate active today (users with lastLogin within 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const activeToday = users.filter(user => {
        if (!user.lastLogin) return false;
        const lastLogin = new Date(user.lastLogin);
        return lastLogin >= oneDayAgo;
      }).length;

      // Calculate total rewards paid and revenue
      let totalRewardsPaid = 0;
      let totalRevenue = 0;

      users.forEach(user => {
        const gameState = user.gameState || {};
        totalRewardsPaid += gameState.totalSuiEarned || 0;
        // Revenue = days played * 0.75 SUI entry fee
        totalRevenue += (gameState.totalDaysPlayed || 0) * 0.75;
      });

      return {
        totalUsers,
        activeToday,
        totalRewardsPaid: parseFloat(totalRewardsPaid.toFixed(2)),
        totalRevenue: parseFloat(totalRevenue.toFixed(2))
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        totalUsers: 0,
        activeToday: 0,
        totalRewardsPaid: 0,
        totalRevenue: 0
      };
    }
  }

  /**
   * Get recent active users
   */
  async getRecentUsers(limitCount: number = 10): Promise<RecentUser[]> {
    try {
      const usersSnapshot = await getDocs(this.usersCollection);
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Sort by lastLogin
      users.sort((a, b) => {
        const aTime = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bTime = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return bTime - aTime;
      });

      // Take top users and format
      return users.slice(0, limitCount).map(user => {
        const gameState = user.gameState || {};
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date();
        const now = new Date();
        const diffMs = now.getTime() - lastLogin.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        let lastActive = 'Never';
        if (diffDays > 0) {
          lastActive = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
          lastActive = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
          const diffMins = Math.floor(diffMs / (1000 * 60));
          lastActive = diffMins > 0 ? `${diffMins} min${diffMins > 1 ? 's' : ''} ago` : 'Just now';
        }

        return {
          id: user.id,
          wallet: user.walletAddress || user.id,
          lastActive,
          gamesPlayed: gameState.totalDaysPlayed || 0,
          totalRewards: parseFloat((gameState.totalSuiEarned || 0).toFixed(2))
        };
      });
    } catch (error) {
      console.error('Error fetching recent users:', error);
      return [];
    }
  }

  /**
   * Get recent transactions from all users
   */
  async getRecentTransactions(limitCount: number = 20): Promise<RecentTransaction[]> {
    try {
      const transactionsSnapshot = await getDocs(this.transactionsCollection);
      const transactions = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by timestamp
      transactions.sort((a: any, b: any) => {
        const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return bTime - aTime;
      });

      // Format transactions
      return transactions.slice(0, limitCount).map((tx: any) => {
        const timestamp = tx.timestamp ? new Date(tx.timestamp) : new Date();
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        let timeStr = 'Just now';
        if (diffDays > 0) {
          timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
          timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
          const diffMins = Math.floor(diffMs / (1000 * 60));
          if (diffMins > 0) {
            timeStr = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
          }
        }

        // Determine transaction type
        let type: 'Entry Fee' | 'Reward Claim' | 'Other' = 'Other';
        const amount = Math.abs(parseFloat(tx.amount || '0'));

        if (tx.type === 'GACHA' || tx.description?.includes('entry') || amount === 0.75) {
          type = 'Entry Fee';
        } else if (tx.type === 'REWARD' || tx.description?.includes('reward') || tx.description?.includes('chest')) {
          type = 'Reward Claim';
        }

        return {
          id: tx.id,
          type,
          wallet: tx.userId || tx.walletAddress || 'Unknown',
          amount,
          time: timeStr,
          timestamp: timestamp.getTime(),
          status: (tx.status === 'completed' || tx.status === 'success') ? 'success' : 'failed'
        };
      });
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  /**
   * Format wallet address for display
   */
  formatWalletAddress(address: string): string {
    if (!address) return 'Unknown';
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

export const adminStatsService = new AdminStatsService();
