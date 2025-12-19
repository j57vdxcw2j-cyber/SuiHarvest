import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SUI_CONTRACT_CONFIG, adminDepositToTreasury } from '../services/suiBlockchainService';
import { transactionService } from '../services/transactionService';
import styles from './AdminHub.module.css';

/**
 * Admin Hub - Treasury Management
 * Only accessible by contract admin
 */
export function AdminHub() {
  const { walletAddress } = useAuth();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [depositAmount, setDepositAmount] = useState('1.0');
  const [withdrawAmount, setWithdrawAmount] = useState('0.5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  
  // Check if connected wallet is admin
  const isAdmin = walletAddress === '0xd68b2ce1ab0ec78338909d624ad9a467b833682a83edb21229f79bf57cb26297';

  // Load recent transactions
  useEffect(() => {
    const loadTransactions = async () => {
      if (!isAdmin) return;
      
      setLoadingTransactions(true);
      try {
        // Fetch real transactions from Firebase
        const transactions = await transactionService.getRecentTransactions(20);
        
        // Transform to display format
        const displayTransactions = transactions.map(tx => ({
          id: tx.id || '',
          type: tx.type,
          user: `${tx.userId.slice(0, 6)}...${tx.userId.slice(-4)}`,
          amount: tx.amount,
          rarity: tx.rarity,
          timestamp: tx.timestamp
        }));
        
        setRecentTransactions(displayTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoadingTransactions(false);
      }
    };
    
    loadTransactions();
  }, [isAdmin]);

  const showMessage = (msg: string) => {
    console.log('📢 Admin message:', msg);
    setMessage(msg);
    setTimeout(() => setMessage(''), 8000); // Increased to 8 seconds
  };

  const handleDeposit = async () => {
    if (!walletAddress || !isAdmin) {
      showMessage('Only admin can deposit');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showMessage('Invalid amount');
      return;
    }

    try {
      setIsProcessing(true);
      showMessage(`Depositing ${amount} SUI to treasury...`);
      
      const result = await adminDepositToTreasury(signAndExecuteTransaction, amount);
      
      if (result.success) {
        showMessage(`✅ Successfully deposited ${amount} SUI! TX: ${result.digest?.slice(0, 12)}...`);
        setDepositAmount('1.0');
      } else {
        showMessage(`❌ ${result.error}`);
      }
    } catch (error: any) {
      showMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletAddress || !isAdmin) {
      showMessage('Only admin can withdraw');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showMessage('Invalid amount');
      return;
    }

    try {
      setIsProcessing(true);
      showMessage(`Withdrawing ${amount} SUI from treasury...`);
      
      // TODO: Implement admin_withdraw call
      showMessage('❌ Withdraw function not implemented yet');
    } catch (error: any) {
      showMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComingSoon = (feature: string) => {
    showMessage(`📢 ${feature} - Update in next version`);
  };

  if (!walletAddress) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>🔐 Admin Hub</h2>
          <p>Please connect your wallet to access admin features.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>🔐 Admin Hub</h2>
          <p>⛔ Access Denied. Only admin can access this page.</p>
          <p className={styles.walletInfo}>
            Your wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>🏦 Admin Hub - Treasury Management</h1>
      
      {message && (
        <div className={message.startsWith('❌') ? styles.errorMessage : styles.successMessage}>
          {message}
        </div>
      )}

      <div className={styles.grid}>
        {/* Contract Info */}
        <div className={styles.card}>
          <h2>📜 Contract Information</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Package ID:</span>
            <span className={styles.value}>
              {SUI_CONTRACT_CONFIG.PACKAGE_ID.slice(0, 10)}...{SUI_CONTRACT_CONFIG.PACKAGE_ID.slice(-6)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Treasury:</span>
            <span className={styles.value}>
              {SUI_CONTRACT_CONFIG.GAME_TREASURY.slice(0, 10)}...{SUI_CONTRACT_CONFIG.GAME_TREASURY.slice(-6)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Admin Cap:</span>
            <span className={styles.value}>
              {SUI_CONTRACT_CONFIG.ADMIN_CAP.slice(0, 10)}...{SUI_CONTRACT_CONFIG.ADMIN_CAP.slice(-6)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Network:</span>
            <span className={styles.value}>Sui Testnet</span>
          </div>
        </div>

        {/* Economics Info */}
        <div className={styles.card}>
          <h2>💰 Game Economics</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Entry Fee:</span>
            <span className={styles.value}>0.75 SUI/day</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Reward Range:</span>
            <span className={styles.value}>0.4 - 0.6 SUI</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Avg Reward:</span>
            <span className={styles.value}>0.5 SUI</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Days per Chest:</span>
            <span className={styles.value}>~4 days (100 FP)</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Revenue per Chest:</span>
            <span className={styles.value}>3.0 SUI (4 × 0.75)</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Cost per Chest:</span>
            <span className={styles.value}>0.5 SUI (avg)</span>
          </div>
          <div className={styles.profitRow}>
            <span className={styles.label}>💎 Profit Margin:</span>
            <span className={styles.profitValue}>2.5 SUI (83%)</span>
          </div>
        </div>

        {/* Deposit */}
        <div className={styles.card}>
          <h2>💵 Deposit SUI to Treasury</h2>
          <p className={styles.description}>
            Add SUI to treasury to ensure there's enough balance for user rewards.
          </p>
          <div className={styles.inputGroup}>
            <label>Amount (SUI):</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              disabled={isProcessing}
              className={styles.input}
            />
          </div>
          <button
            onClick={handleDeposit}
            disabled={isProcessing}
            className={styles.depositButton}
          >
            {isProcessing ? '⏳ Processing...' : `💰 Deposit ${depositAmount} SUI`}
          </button>
        </div>

        {/* Withdraw */}
        <div className={styles.card}>
          <h2>💸 Withdraw Profits</h2>
          <p className={styles.description}>
            Withdraw accumulated profits from treasury to admin wallet.
          </p>
          <div className={styles.inputGroup}>
            <label>Amount (SUI):</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              disabled={isProcessing}
              className={styles.input}
            />
          </div>
          <button
            onClick={handleWithdraw}
            disabled={isProcessing}
            className={styles.withdrawButton}
          >
            {isProcessing ? '⏳ Processing...' : `💸 Withdraw ${withdrawAmount} SUI`}
          </button>
        </div>

        {/* Recent Transactions */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h2>📊 Recent Transactions</h2>
          {loadingTransactions ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Loading transactions...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Details</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: tx.type === 'open_case' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                            color: tx.type === 'open_case' ? '#60A5FA' : '#4ADE80'
                          }}>
                            {tx.type === 'open_case' ? '🎲 Open Case' : '💰 Claim SUI'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '13px' }}>
                          {tx.user}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: tx.type === 'open_case' ? '#FF6B6B' : '#4ADE80' }}>
                          {tx.type === 'open_case' ? '-' : '+'}{tx.amount} SUI
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#999' }}>
                          {tx.type === 'open_case' && tx.rarity && (
                            <span style={{
                              color: tx.rarity === 'epic' ? '#FFD700' : tx.rarity === 'advanced' ? '#60A5FA' : '#999'
                            }}>
                              {tx.rarity === 'epic' ? '🌟 Epic' : tx.rarity === 'advanced' ? '💎 Advanced' : '📦 Common'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#999' }}>
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Tools */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h2>🛠️ Admin Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button
              onClick={() => handleComingSoon('Search User')}
              className={styles.toolButton}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              🔍 Search User
            </button>
            
            <button
              onClick={() => handleComingSoon('Export Data')}
              className={styles.toolButton}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              📤 Export Data
            </button>
            
            <button
              onClick={() => handleComingSoon('Send Notification')}
              className={styles.toolButton}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              📢 Send Notification
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h2>📖 Admin Instructions</h2>
          <div className={styles.instructions}>
            <h3>💡 Managing Treasury:</h3>
            <ol>
              <li><strong>Monitor Balance:</strong> Keep enough SUI in treasury to pay user rewards (0.4-0.6 SUI per chest)</li>
              <li><strong>Deposit Regularly:</strong> Add 5-10 SUI to ensure smooth operations</li>
              <li><strong>Withdraw Profits:</strong> Extract accumulated profits to admin wallet</li>
              <li><strong>Expected Profit:</strong> ~83% margin (2.5 SUI profit per 3.0 SUI revenue)</li>
            </ol>
            
            <h3>⚠️ Safety Tips:</h3>
            <ul>
              <li>Only withdraw profits, keep enough balance for pending rewards</li>
              <li>Monitor daily active users to estimate required treasury balance</li>
              <li>Typical need: 0.5 SUI × number of pending treasure chests</li>
              <li>AdminCap object ID: {SUI_CONTRACT_CONFIG.ADMIN_CAP.slice(0, 10)}...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
