import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SUI_CONTRACT_CONFIG, adminDepositToTreasury } from '../services/suiBlockchainService';
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
  
  // Check if connected wallet is admin
  const isAdmin = walletAddress === '0xd68b2ce1ab0ec78338909d624ad9a467b833682a83edb21229f79bf57cb26297';

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeposit = async () => {
    if (!walletAddress || !isAdmin) {
      showMessage('Only admin can deposit', true);
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showMessage('Invalid amount', true);
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
        showMessage(`❌ ${result.error}`, true);
      }
    } catch (error: any) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletAddress || !isAdmin) {
      showMessage('Only admin can withdraw', true);
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showMessage('Invalid amount', true);
      return;
    }

    try {
      setIsProcessing(true);
      showMessage(`Withdrawing ${amount} SUI from treasury...`);
      
      // TODO: Implement admin_withdraw call
      showMessage('❌ Withdraw function not implemented yet', true);
    } catch (error: any) {
      showMessage(`❌ Error: ${error.message}`, true);
    } finally {
      setIsProcessing(false);
    }
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
