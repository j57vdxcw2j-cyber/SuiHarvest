import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAccountService } from '../services/adminAccountService';
import styles from './AdminLogin.module.css';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

// Fallback admin credentials (backward compatibility)
const FALLBACK_ADMIN = {
  username: 'admin',
  password: 'suiharvest2025',
  wallet: '0xd68b2ce1ab0ec78338909d624ad9a467b833682a83edb21229f79bf57cb26297'
};

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { walletAddress } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // DEBUG: Log on component mount
  console.log('🚀 AdminLogin component loaded - NEW VERSION with Firebase integration');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate wallet connection
      if (!walletAddress) {
        setError('Please connect your wallet first');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Login attempt:', { username, hasPassword: !!password, walletAddress });
      alert(`DEBUG: Attempting login with username: ${username}`);

      // Check fallback admin credentials first (backward compatibility)
      if (
        username === FALLBACK_ADMIN.username &&
        password === FALLBACK_ADMIN.password &&
        walletAddress.toLowerCase() === FALLBACK_ADMIN.wallet.toLowerCase()
      ) {
        console.log('✅ Legacy admin login successful');
        // Legacy admin login
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        localStorage.setItem('adminUsername', username);
        localStorage.setItem('adminRole', 'admin');
        localStorage.setItem('adminWalletAddress', FALLBACK_ADMIN.wallet);
        setIsLoading(false);
        onLoginSuccess();
        return;
      }

      // Check Firebase admin_accounts collection
      // Note: Wallet verification happens inside Admin Hub, not during login
      console.log('🔍 Checking Firebase accounts...');
      const result = await adminAccountService.verifyAdminLogin(
        username,
        password,
        walletAddress || '' // Pass empty string if no wallet connected
      );

      console.log('📊 Verification result:', result);

      if (!result.success) {
        setError(result.error || 'Invalid admin credentials');
        setIsLoading(false);
        return;
      }

      const matchingAccount = result.account!;
      console.log('✅ Login successful:', matchingAccount.username);

      // Success - save session
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      localStorage.setItem('adminUsername', matchingAccount.username);
      localStorage.setItem('adminRole', matchingAccount.role);
      localStorage.setItem('adminAccountId', matchingAccount.id);
      localStorage.setItem('adminWalletAddress', matchingAccount.walletAddress || '');

      // Update last login time
      await adminAccountService.updateLastLogin(matchingAccount.id);

      setIsLoading(false);
      onLoginSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.hash = 'home';
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🌾</div>
          <h1>SuiHarvest Admin</h1>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <h2>Admin Login</h2>
          <p className={styles.subtitle}>Sign in to access the admin dashboard</p>
          <div style={{background: 'green', color: 'white', padding: '8px', fontSize: '12px', marginBottom: '10px'}}>
            ✅ NEW VERSION - Firebase Integration Active
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
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
            {isLoading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToHome}
          >
            ← Back to Home
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.hint}>
            💡 <strong>Login Info:</strong><br />
            • Use admin account from Account Management<br />
            • Default: admin / suiharvest2025 (legacy)<br />
            • Wallet connection required in Sui Management only
          </p>
        </div>
      </div>
    </div>
  );
}
