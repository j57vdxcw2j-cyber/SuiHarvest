import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface Transaction {
  id?: string;
  type: 'open_case' | 'claim_reward';
  userId: string;
  amount: number;
  rarity?: 'common' | 'advanced' | 'epic';
  timestamp: string;
  txDigest?: string;
}

class TransactionService {
  private transactionsCollection = collection(db, 'transactions');

  /**
   * Log open case transaction
   */
  async logOpenCase(
    userId: string,
    amount: number,
    rarity: 'common' | 'advanced' | 'epic',
    txDigest?: string
  ): Promise<void> {
    try {
      await addDoc(this.transactionsCollection, {
        type: 'open_case',
        userId,
        amount,
        rarity,
        timestamp: new Date().toISOString(),
        txDigest
      });
      console.log('✅ Open case transaction logged');
    } catch (error) {
      console.error('Error logging open case transaction:', error);
    }
  }

  /**
   * Log claim reward transaction
   */
  async logClaimReward(
    userId: string,
    amount: number,
    txDigest?: string
  ): Promise<void> {
    try {
      await addDoc(this.transactionsCollection, {
        type: 'claim_reward',
        userId,
        amount,
        timestamp: new Date().toISOString(),
        txDigest
      });
      console.log('✅ Claim reward transaction logged');
    } catch (error) {
      console.error('Error logging claim reward transaction:', error);
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limitCount: number = 20): Promise<Transaction[]> {
    try {
      const q = query(
        this.transactionsCollection,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }
}

export const transactionService = new TransactionService();
