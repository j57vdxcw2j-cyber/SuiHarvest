import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import type { Activity } from '../types';
import { TransactionType } from '../types';
import styles from './Profile.module.css';
import SuiLogo from '../assets/Sui.png';

export function Profile() {
  // All hooks must be called at the top level, unconditionally
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { walletAddress, userProfile, refreshProfile } = useAuth();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [suiBalance, setSuiBalance] = useState('0.00');

  // Fetch real SUI balance from blockchain
  useEffect(() => {
    const fetchBalance = async () => {
      if (!currentAccount?.address) {
        setSuiBalance('0.00');
        return;
      }

      try {
        const balance = await suiClient.getBalance({
          owner: currentAccount.address,
        });
        
        // Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
        const suiAmount = Number(balance.totalBalance) / 1_000_000_000;
        setSuiBalance(suiAmount.toLocaleString('en-US', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        }));
      } catch (error) {
        console.error('Error fetching SUI balance:', error);
        setSuiBalance('0.00');
      }
    };

    fetchBalance();
  }, [currentAccount, suiClient]);

  // Load user data
  useEffect(() => {
    const loadData = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading profile for wallet:', walletAddress);
        
        // Try to get user profile
        const profileResponse = await userService.getUserProfile(walletAddress);
        
        // If user doesn't exist, create new user
        if (!profileResponse.success || !profileResponse.data) {
          console.log('User not found, creating new user...');
          const createResponse = await userService.createUser(walletAddress);
          
          if (createResponse.success) {
            console.log('New user created successfully');
            // Refresh to load the new profile
            await refreshProfile();
          } else {
            console.error('Failed to create user:', createResponse.error);
          }
        } else {
          // User exists, refresh profile
          await refreshProfile();
        }

        // Load recent activities
        const activitiesResponse = await userService.getUserActivities(walletAddress, 4);
        if (activitiesResponse.success && activitiesResponse.data) {
          setRecentActivities(activitiesResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [walletAddress]); // Removed refreshProfile from deps to prevent infinite loop

  // If no wallet connected, show message
  if (!walletAddress) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHero}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroIcon}>👤</span> User Profile
          </h1>
          <p className={styles.heroSubtitle}>
            Please connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHero}>
          <h1 className={styles.heroTitle}>
            <span style={{ fontSize: '2rem' }}>⏳</span> Loading Profile...
          </h1>
          <p className={styles.heroSubtitle}>Please wait</p>
        </div>
      </div>
    );
  }

  // If still no profile after loading, show error
  if (!userProfile) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHero}>
          <h1 className={styles.heroTitle}>
            <span style={{ fontSize: '2rem' }}>⚠️</span> Profile Error
          </h1>
          <p className={styles.heroSubtitle}>
            Could not load user profile. Please check console for errors.
          </p>
        </div>
        <div className={styles.profileContent}>
          <section className={styles.section}>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              background: 'rgba(255, 76, 76, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 76, 76, 0.3)'
            }}>
              <p style={{ color: '#fff', marginBottom: '16px' }}>
                Wallet: {walletAddress}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #4CD1FF, #4CFFD1)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🔄 Retry
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const expPercentage = (userProfile.experience / userProfile.maxExperience) * 100;

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get icon for activity type
  const getActivityIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.GACHA: return '🎰';
      case TransactionType.QUEST: return '✅';
      case TransactionType.TRADE: return '🔄';
      default: return '📊';
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Hero Section */}
      <div className={styles.profileHero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroIcon}></span> User Profile
        </h1>
        <p className={styles.heroSubtitle}>
          Manage your wallet and view your stats
        </p>
      </div>

      <div className={styles.profileContent}>
        {/* User Info Card */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Information</h2>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              <img src={userProfile.avatar} alt={userProfile.username} className={styles.avatarImage} />
              <div className={styles.levelBadge}>Lv.{userProfile.level}</div>
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.username}>{userProfile.username}</h3>
              <p className={styles.walletAddress}>
                <span className={styles.addressLabel}>Wallet:</span> {formatAddress(userProfile.walletAddress)}
              </p>
              <p className={styles.joinDate}>
                <span className={styles.dateIcon}>📅</span> Joined: {formatDate(userProfile.joinDate)}
              </p>
              
              {/* Experience Bar */}
              <div className={styles.expSection}>
                <div className={styles.expHeader}>
                  <span className={styles.expLabel}>Experience</span>
                  <span className={styles.expValue}>{userProfile.experience} / {userProfile.maxExperience}</span>
                </div>
                <div className={styles.expBar}>
                  <div className={styles.expFill} style={{ width: `${expPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Balance Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Wallet Balance</h2>
          <div className={styles.balanceCard}>
            <div className={styles.balanceIcon}>
              <img src={SuiLogo} alt="SUI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className={styles.balanceInfo}>
              <p className={styles.balanceLabel}>Available Balance</p>
              <p className={styles.balanceAmount}>{suiBalance} SUI</p>
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Transaction History</h2>
          <div className={styles.transactionGrid}>
            {/* Total Transactions */}
            <div className={styles.transactionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>📊</span>
                <h3 className={styles.cardTitle}>Total Transactions</h3>
              </div>
              <p className={styles.cardValue}>{userProfile.totalTransactions}</p>
              <p className={styles.cardLabel}>All time transactions</p>
            </div>

            {/* Gacha Transactions */}
            <div className={styles.transactionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🎰</span>
                <h3 className={styles.cardTitle}>Gacha Pulls</h3>
              </div>
              <p className={styles.cardValue}>{userProfile.gachaTransactions}</p>
              <p className={styles.cardLabel}>Total gacha attempts</p>
              <div className={styles.cardProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${userProfile.totalTransactions > 0 ? (userProfile.gachaTransactions / userProfile.totalTransactions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {userProfile.totalTransactions > 0 ? Math.round((userProfile.gachaTransactions / userProfile.totalTransactions) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Quest Transactions */}
            <div className={styles.transactionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>✅</span>
                <h3 className={styles.cardTitle}>Quest Completed</h3>
              </div>
              <p className={styles.cardValue}>{userProfile.questTransactions}</p>
              <p className={styles.cardLabel}>Finished quests</p>
              <div className={styles.cardProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${userProfile.totalTransactions > 0 ? (userProfile.questTransactions / userProfile.totalTransactions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {userProfile.totalTransactions > 0 ? Math.round((userProfile.questTransactions / userProfile.totalTransactions) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityIcon}>{getActivityIcon(activity.type)}</span>
                  <div className={styles.activityDetails}>
                    <p className={styles.activityTitle}>{activity.title}</p>
                    <p className={styles.activityTime}>{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                  <span className={styles.activityAmount}>{activity.description}</span>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
