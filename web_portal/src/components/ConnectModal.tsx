import { useState, useEffect } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { useAuth } from '../contexts/AuthContext';
import { adminAccountService } from '../services/adminAccountService';
import styles from './ConnectModal.module.css';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Fallback admin credentials (backward compatibility)
const FALLBACK_ADMIN = {
  username: 'admin',
  password: 'suiharvest2025',
  wallet: '0xd68b2ce1ab0ec78338909d624ad9a467b833682a83edb21229f79bf57cb26297'
};

export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const { walletAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'wallet' | 'admin'>('wallet');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check fallback admin credentials first (backward compatibility)
      if (
        username === FALLBACK_ADMIN.username &&
        password === FALLBACK_ADMIN.password &&
        walletAddress &&
        walletAddress.toLowerCase() === FALLBACK_ADMIN.wallet.toLowerCase()
      ) {
        // Legacy admin login
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        localStorage.setItem('adminUsername', username);
        localStorage.setItem('adminRole', 'admin');
        localStorage.setItem('adminWalletAddress', FALLBACK_ADMIN.wallet);
        setIsLoading(false);
        window.location.hash = 'admin';
        onClose();
        setUsername('');
        setPassword('');
        return;
      }

      // Check Firebase admin_accounts collection
      // Note: Wallet verification happens inside Admin Hub, not during login
      const result = await adminAccountService.verifyAdminLogin(
        username,
        password,
        walletAddress || '' // Pass empty string if no wallet connected
      );

      if (!result.success) {
        setError(result.error || 'Invalid admin credentials');
        setIsLoading(false);
        return;
      }

      const matchingAccount = result.account!;

      // Success - save session and redirect
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      localStorage.setItem('adminUsername', matchingAccount.username);
      localStorage.setItem('adminRole', matchingAccount.role);
      localStorage.setItem('adminAccountId', matchingAccount.id);
      localStorage.setItem('adminWalletAddress', matchingAccount.walletAddress || '');

      // Update last login time
      await adminAccountService.updateLastLogin(matchingAccount.id);

      setIsLoading(false);
      window.location.hash = 'admin';
      onClose();
      setUsername('');
      setPassword('');
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setActiveTab('wallet');
      setError('');
      setUsername('');
      setPassword('');
    }
  };

  // Auto close when wallet connected
  if (walletAddress && activeTab === 'wallet') {
    setTimeout(() => {
      onClose();
    }, 500);
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <div className={styles.header}>
          <h2>Connect to SuiHarvest</h2>
          <p>Choose your preferred connection method</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'wallet' ? styles.tabActive : ''}`}
            onClick={() => {
              setActiveTab('wallet');
              setError('');
            }}
          >
            Connect Wallet
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'admin' ? styles.tabActive : ''}`}
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
          >
            Admin Login
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'wallet' ? (
            <div className={styles.walletTab}>
              <h3>Connect Your Sui Wallet</h3>
              <p className={styles.description}>
                Connect your Sui wallet to start playing, earning rewards, and managing your account.
              </p>

              {walletAddress ? (
                <div className={styles.connectedInfo}>
                  <p className={styles.successText}>Wallet Connected!</p>
                  <p className={styles.walletAddress}>
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </p>
                </div>
              ) : (
                <div className={styles.connectButtonWrapper}>
                  <ConnectButton />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.adminTab}>
              <h3>Admin Dashboard Access</h3>
              <p className={styles.description}>
                Sign in with your admin credentials to access the management dashboard.
              </p>

              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="admin-username">Username</label>
                  <input
                    id="admin-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="admin-password">Password</label>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
