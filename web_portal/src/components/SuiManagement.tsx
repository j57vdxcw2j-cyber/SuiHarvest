import { useState, useEffect } from 'react';
import { useSignAndExecuteTransaction, ConnectButton, useCurrentAccount, useSuiClient, useDisconnectWallet } from '@mysten/dapp-kit';
import { SUI_CONTRACT_CONFIG, adminDepositToTreasury, adminWithdrawFromTreasury, getTreasuryBalance, getAdminTransactions } from '../services/suiBlockchainService';
import styles from './SuiManagement.module.css';

interface Transaction {
  digest: string;
  type: 'deposit' | 'withdraw' | 'unknown';
  amount: number;
  timestamp: number;
  success: boolean;
}

/**
 * Sui Management Page - Treasury Operations with Tabs
 */
export function SuiManagement() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const suiClient = useSuiClient();
  
  const [activeTab, setActiveTab] = useState<'deposit-withdraw' | 'transactions'>('deposit-withdraw');
  const [walletError, setWalletError] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState('1.0');
  const [withdrawAmount, setWithdrawAmount] = useState('0.5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [treasuryBalance, setTreasuryBalance] = useState('0.00');
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(false);

  // Verify wallet address matches admin account
  useEffect(() => {
    const verifyWallet = () => {
      const registeredWallet = localStorage.getItem('adminWalletAddress');
      const currentWallet = currentAccount?.address;

      console.log('🔍 Wallet Verification:', {
        registeredWallet,
        currentWallet,
        match: registeredWallet && currentWallet ? registeredWallet.toLowerCase() === currentWallet.toLowerCase() : 'N/A'
      });

      // Must have registered wallet from admin account
      if (!registeredWallet) {
        console.log('⚠️ No registered wallet in localStorage');
        setWalletError('');
        return;
      }

      // Check if wallet is connected
      if (!currentWallet) {
        console.log('ℹ️ No wallet connected yet');
        setWalletError('');
        return;
      }

      // Compare wallets
      if (registeredWallet.toLowerCase() !== currentWallet.toLowerCase()) {
        console.log('❌ WALLET MISMATCH DETECTED!');
        setWalletError(
          `⚠️ Wallet Mismatch!\n\nYour connected wallet (${currentWallet.slice(0, 10)}...${currentWallet.slice(-8)}) does not match the registered wallet for this admin account (${registeredWallet.slice(0, 10)}...${registeredWallet.slice(-8)}).\n\nPlease disconnect and connect the correct wallet address.`
        );
      } else {
        console.log('✅ Wallet match - clearing error');
        setWalletError('');
      }
    };

    verifyWallet();
  }, [currentAccount]);

  // Fetch treasury balance on mount and after transactions
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoadingBalance(true);
      try {
        const balance = await getTreasuryBalance(suiClient);
        setTreasuryBalance(balance.toFixed(2));
      } catch (error) {
        console.error('Failed to fetch treasury balance:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [suiClient]);

  // Fetch transactions when switching to transactions tab
  useEffect(() => {
    if (activeTab === 'transactions' && transactions.length === 0) {
      const fetchTransactions = async () => {
        setIsLoadingTxs(true);
        try {
          const txs = await getAdminTransactions(suiClient, 10);
          setTransactions(txs);
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        } finally {
          setIsLoadingTxs(false);
        }
      };

      fetchTransactions();
    }
  }, [activeTab, suiClient, transactions.length]);

  const refreshData = async () => {
    // Refresh balance
    const balance = await getTreasuryBalance(suiClient);
    setTreasuryBalance(balance.toFixed(2));
    
    // Refresh transactions if on that tab
    if (activeTab === 'transactions') {
      const txs = await getAdminTransactions(suiClient, 10);
      setTransactions(txs);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDisconnectWallet = () => {
    try {
      disconnectWallet();
      setWalletError('');
      showMessage('Wallet disconnected successfully', 'success');
    } catch (error) {
      console.error('Disconnect error:', error);
      showMessage('Failed to disconnect wallet', 'error');
    }
  };

  const handleDeposit = async () => {
    // Check wallet mismatch before allowing transaction
    if (walletError) {
      showMessage('❌ Cannot deposit: Wallet mismatch! Connect the correct wallet.', 'error');
      return;
    }

    const registeredWallet = localStorage.getItem('adminWalletAddress');
    const currentWallet = currentAccount?.address;
    
    if (!currentWallet) {
      showMessage('❌ Please connect your wallet first', 'error');
      return;
    }

    if (registeredWallet && currentWallet.toLowerCase() !== registeredWallet.toLowerCase()) {
      showMessage('❌ Wallet mismatch! Please connect the correct wallet.', 'error');
      setWalletError(
        `⚠️ Wallet Mismatch!\n\nYour connected wallet (${currentWallet.slice(0, 10)}...${currentWallet.slice(-8)}) does not match the registered wallet for this admin account (${registeredWallet.slice(0, 10)}...${registeredWallet.slice(-8)}).\n\nPlease disconnect and connect the correct wallet address.`
      );
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showMessage('Invalid amount', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      showMessage(`Depositing ${amount} SUI to treasury...`, 'success');
      
      const result = await adminDepositToTreasury(signAndExecuteTransaction, amount);
      
      if (result.success) {
        showMessage(`Successfully deposited ${amount} SUI! TX: ${result.digest?.slice(0, 12)}...`, 'success');
        setDepositAmount('1.0');
        // Refresh data after successful transaction
        await refreshData();
      } else {
        showMessage(`${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      showMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    // Check wallet mismatch before allowing transaction
    if (walletError) {
      showMessage('❌ Cannot withdraw: Wallet mismatch! Connect the correct wallet.', 'error');
      return;
    }

    const registeredWallet = localStorage.getItem('adminWalletAddress');
    const currentWallet = currentAccount?.address;
    
    if (!currentWallet) {
      showMessage('❌ Please connect your wallet first', 'error');
      return;
    }

    if (registeredWallet && currentWallet.toLowerCase() !== registeredWallet.toLowerCase()) {
      showMessage('❌ Wallet mismatch! Please connect the correct wallet.', 'error');
      setWalletError(
        `⚠️ Wallet Mismatch!\n\nYour connected wallet (${currentWallet.slice(0, 10)}...${currentWallet.slice(-8)}) does not match the registered wallet for this admin account (${registeredWallet.slice(0, 10)}...${registeredWallet.slice(-8)}).\n\nPlease disconnect and connect the correct wallet address.`
      );
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showMessage('Invalid amount', 'error');
      return;
    }

    // Check if treasury has enough balance
    if (Number(amount) > Number(treasuryBalance)) {
      showMessage(`❌ Insufficient treasury balance. Available: ${treasuryBalance} SUI`, 'error');
      return;
    }

    // Show confirmation dialog
    const confirmWithdraw = window.confirm(
      `⚠️ Withdraw Confirmation\n\n` +
      `You are about to withdraw ${amount} SUI from the treasury to your wallet.\n\n` +
      `Current Treasury Balance: ${treasuryBalance} SUI\n` +
      `Remaining after withdrawal: ${(Number(treasuryBalance) - Number(amount)).toFixed(2)} SUI\n\n` +
      `Do you want to proceed with this withdrawal?`
    );

    if (!confirmWithdraw) {
      showMessage('Withdrawal cancelled'); 
      return;
    }

    try {
      setIsProcessing(true);
      showMessage('🔄 Processing withdrawal...');

      console.log('Withdrawing from treasury:', { amount });
      const result = await adminWithdrawFromTreasury(signAndExecuteTransaction, amount);

      if (result.success) {
        showMessage(`✅ Successfully withdrew ${amount} SUI to your wallet!`, 'success');
        setWithdrawAmount('');
        
        // Refresh treasury balance
        console.log('Refreshing treasury data...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for blockchain to update
        await refreshData();
      } else {
        const errorMsg = result.error || 'Transaction failed on blockchain';
        showMessage(`❌ Withdrawal failed: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      showMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Wallet Error Popup */}
      {walletError && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #dc3545',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(220, 53, 69, 0.3)',
        }}>
          <div style={{ 
            textAlign: 'center',
            color: 'white',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#dc3545', marginBottom: '16px', fontSize: '24px' }}>Wallet Mismatch Error</h2>
            <p style={{ 
              whiteSpace: 'pre-line', 
              lineHeight: '1.6',
              marginBottom: '24px',
              color: '#e0e0e0'
            }}>
              {walletError}
            </p>
            <button
              onClick={() => setWalletError('')}
              style={{
                padding: '12px 32px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Sui Management</h1>
          <p>Manage treasury deposits, withdrawals, and monitor contract health</p>
        </div>
        <div className={styles.headerRight}>
          {currentAccount ? (
            <div className={styles.walletInfoCard}>
              <div className={styles.walletDetails}>
                <div className={styles.walletLabel}>Connected Wallet</div>
                <div className={styles.walletAddress}>
                  {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
                </div>
              </div>
              <button
                className={styles.disconnectButton}
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className={styles.connectWalletWrapper}>
              <p className={styles.connectPrompt}>Connect wallet to manage treasury</p>
              <ConnectButton />
            </div>
          )}
        </div>
      </div>

      {/* Treasury Balance Banner */}
      <div className={styles.balanceBanner}>
        <div className={styles.balanceInfo}>
          <div className={styles.balanceLabel}>Treasury Balance</div>
          <div className={styles.balanceAmount}>
            {isLoadingBalance ? 'Loading...' : `${treasuryBalance} SUI`}
          </div>
        </div>
        <div className={styles.balanceStatus}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>
            {isLoadingBalance ? 'Checking...' : parseFloat(treasuryBalance) >= 10 ? 'Healthy' : 'Low Balance'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tab} ${activeTab === 'deposit-withdraw' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('deposit-withdraw')}
        >
          Deposit & Withdraw
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'transactions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions & Contract Info
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${messageType === 'error' ? styles.messageError : styles.messageSuccess}`}>
          {message}
        </div>
      )}

      {/* Deposit & Withdraw Tab */}
      {activeTab === 'deposit-withdraw' && (
        <div className={styles.grid}>
        {/* Deposit Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Deposit to Treasury</h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              Add SUI to the treasury to ensure sufficient liquidity for player rewards
            </p>
            <div className={styles.inputGroup}>
              <label>Amount (SUI)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isProcessing}
                placeholder="Enter amount to deposit"
              />
            </div>
            {/* Debug info */}
            {walletError && (
              <div style={{ 
                padding: '8px', 
                background: '#ff000020', 
                border: '1px solid #ff0000', 
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '12px'
              }}>
                ⚠️ Wallet Error Active: Button should be disabled
              </div>
            )}
            <button
              className={styles.depositButton}
              onClick={handleDeposit}
              disabled={isProcessing || !currentAccount || !!walletError}
            >
              {isProcessing ? 'Processing...' : 'Deposit to Treasury'}
            </button>
            {!currentAccount && (
              <p className={styles.buttonHint}>Connect wallet to deposit</p>
            )}
            {walletError && (
              <p className={styles.buttonHint} style={{ color: '#ff6b6b' }}>
                ⚠️ Wallet mismatch - button disabled
              </p>
            )}
          </div>
        </div>

        {/* Withdraw Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Withdraw from Treasury</h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              Withdraw profits from the treasury (ensure sufficient reserves remain)
            </p>
            
            {/* Withdrawal Recommendations */}
            <div className={styles.withdrawalSuggestions}>
              <div className={styles.suggestionRow}>
                <span className={styles.suggestionLabel}>Treasury Balance:</span>
                <span className={styles.suggestionValue}>{treasuryBalance} SUI</span>
              </div>
              <div className={styles.suggestionRow}>
                <span className={styles.suggestionLabel}>Minimum Reserve:</span>
                <span className={styles.suggestionValue}>10.0 SUI</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.suggestionRow}>
                <span className={styles.suggestionLabel}>Available to Withdraw:</span>
                <span className={styles.suggestionValueHighlight}>
                  {(parseFloat(treasuryBalance) - 10.0).toFixed(2)} SUI
                </span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className={styles.quickAmounts}>
              <button
                className={styles.quickAmountButton}
                onClick={() => setWithdrawAmount(((parseFloat(treasuryBalance) - 10.0) * 0.25).toFixed(2))}
                disabled={isProcessing}
              >
                25%
              </button>
              <button
                className={styles.quickAmountButton}
                onClick={() => setWithdrawAmount(((parseFloat(treasuryBalance) - 10.0) * 0.5).toFixed(2))}
                disabled={isProcessing}
              >
                50%
              </button>
              <button
                className={styles.quickAmountButton}
                onClick={() => setWithdrawAmount(((parseFloat(treasuryBalance) - 10.0) * 0.75).toFixed(2))}
                disabled={isProcessing}
              >
                75%
              </button>
              <button
                className={styles.quickAmountButton}
                onClick={() => setWithdrawAmount((parseFloat(treasuryBalance) - 10.0).toFixed(2))}
                disabled={isProcessing}
              >
                Max Safe
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label>Amount (SUI)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isProcessing}
                placeholder="Enter amount to withdraw"
              />
            </div>
            <button
              className={styles.withdrawButton}
              onClick={handleWithdraw}
              disabled={isProcessing || !currentAccount || !!walletError}
            >
              {isProcessing ? 'Processing...' : 'Withdraw Profits'}
            </button>
            {!currentAccount && (
              <p className={styles.buttonHint}>Connect wallet to withdraw</p>
            )}
            {walletError && (
              <p className={styles.buttonHint} style={{ color: '#dc3545' }}>⚠️ Wallet mismatch - please connect correct wallet</p>
            )}
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Safety Guidelines</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.guideline}>
              <div>
                <strong>Maintain Liquidity</strong>
                <p>Keep at least 10-20 SUI in treasury for reward payouts</p>
              </div>
            </div>
            <div className={styles.guideline}>
              <div>
                <strong>Monitor Economics</strong>
                <p>Track revenue vs costs to ensure 83% profit margin is maintained</p>
              </div>
            </div>
            <div className={styles.guideline}>
              <div>
                <strong>Security</strong>
                <p>All operations require AdminCap - never share your admin private key</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Transactions & Contract Info Tab */}
      {activeTab === 'transactions' && (
        <div className={styles.grid}>
          {/* Contract Information Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Contract Information</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Package ID:</span>
                <code className={styles.value}>{SUI_CONTRACT_CONFIG.PACKAGE_ID.slice(0, 20)}...</code>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Treasury:</span>
                <code className={styles.value}>{SUI_CONTRACT_CONFIG.GAME_TREASURY.slice(0, 20)}...</code>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Admin Cap:</span>
                <code className={styles.value}>{SUI_CONTRACT_CONFIG.ADMIN_CAP.slice(0, 20)}...</code>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Network:</span>
                <span className={styles.badge}>Testnet</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.infoRow}>
                <span className={styles.label}>View on Explorer:</span>
                <a 
                  href={`https://suiscan.xyz/testnet/object/${SUI_CONTRACT_CONFIG.PACKAGE_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.explorerLink}
                >
                  🔗 Open in Suiscan
                </a>
              </div>
            </div>
          </div>

          {/* Economics Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Game Economics</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.economicsRow}>
                <span className={styles.label}>Daily Entry Fee:</span>
                <span className={styles.valueHighlight}>0.75 SUI</span>
              </div>
              <div className={styles.economicsRow}>
                <span className={styles.label}>Reward Range:</span>
                <span className={styles.valueHighlight}>0.4 - 0.6 SUI</span>
              </div>
              <div className={styles.economicsRow}>
                <span className={styles.label}>Avg Reward:</span>
                <span className={styles.valueHighlight}>0.5 SUI</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.economicsRow}>
                <span className={styles.label}>Revenue per Cycle:</span>
                <span className={styles.valueSuccess}>3.0 SUI</span>
              </div>
              <div className={styles.economicsRow}>
                <span className={styles.label}>Cost per Cycle:</span>
                <span className={styles.valueDanger}>0.5 SUI</span>
              </div>
              <div className={styles.economicsRow}>
                <span className={styles.label}>Profit per Cycle:</span>
                <span className={styles.valueSuccess}>2.5 SUI (83%)</span>
              </div>
            </div>
          </div>

          {/* Admin Transaction History Card */}
          <div className={`${styles.card} ${styles.cardFullWidth}`}>
            <div className={styles.cardHeader}>
              <h2>Admin Transaction History</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.transactionList}>
                {isLoadingTxs ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading transactions from blockchain...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No transactions found</p>
                    <p className={styles.emptyHint}>Admin operations will appear here</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.digest} className={styles.transaction}>
                      <div className={styles.transactionDetails}>
                        <div className={styles.transactionType}>
                          {tx.type === 'deposit' ? 'Deposit to Treasury' : 
                           tx.type === 'withdraw' ? 'Withdraw from Treasury' : 
                           'Treasury Operation'}
                        </div>
                        <div className={styles.transactionHash}>
                          <a 
                            href={`https://suiscan.xyz/testnet/tx/${tx.digest}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            TX: {tx.digest.slice(0, 12)}...
                          </a>
                        </div>
                        <div className={styles.transactionTime}>
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className={`${styles.transactionAmount} ${
                        tx.type === 'deposit' ? styles.amountPositive : styles.amountNegative
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toFixed(2)} SUI
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className={styles.transactionFooter}>
                <p className={styles.transactionNote}>
                  {transactions.length > 0 
                    ? `Showing ${transactions.length} recent admin operations. Full history available on blockchain explorer.`
                    : 'Real-time data from Sui blockchain'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
