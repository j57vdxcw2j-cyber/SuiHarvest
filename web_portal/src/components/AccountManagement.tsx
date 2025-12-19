import { useState, useEffect } from 'react';
import styles from './AccountManagement.module.css';
import { 
  adminStatsService, 
  type AdminStats, 
  type RecentUser, 
  type RecentTransaction 
} from '../services/adminStatsService';
import {
  adminAccountService,
  type AdminAccount,
  type CreateAccountData
} from '../services/adminAccountService';

/**
 * Account Management Page - User & Activity Monitoring + Admin Account Management
 */
export function AccountManagement() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'activity' | 'accounts'>('activity');

  // Activity tracking state
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeToday: 0,
    totalRewardsPaid: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Account list state
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [userAccounts, setUserAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accountFilter, setAccountFilter] = useState<'admin' | 'users' | 'all'>('admin');

  // Create account form state
  const [newAccount, setNewAccount] = useState<CreateAccountData>({
    username: '',
    email: '',
    role: 'viewer',
    walletAddress: '',
    password: ''
  });
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch activity data
  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivityData();
      const interval = setInterval(fetchActivityData, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Fetch account data
  useEffect(() => {
    if (activeTab === 'accounts') {
      fetchAccountData();
    }
  }, [activeTab, accountFilter]);

  const fetchActivityData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, transactionsData] = await Promise.all([
        adminStatsService.getAdminStats(),
        adminStatsService.getRecentUsers(10),
        adminStatsService.getRecentTransactions(10)
      ]);

      setStats(statsData);
      setRecentUsers(usersData);
      setRecentTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountData = async () => {
    setIsLoadingAccounts(true);
    try {
      if (accountFilter === 'admin' || accountFilter === 'all') {
        const admins = await adminAccountService.getAllAdminAccounts();
        setAdminAccounts(admins);
      }
      
      if (accountFilter === 'users' || accountFilter === 'all') {
        const users = await adminAccountService.getAllUserAccounts();
        setUserAccounts(users);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setIsCreating(true);

    try {
      const result = await adminAccountService.createAdminAccount(
        newAccount,
        'current_admin' // TODO: Get from auth context
      );

      if (result.success) {
        setCreateSuccess('Account created successfully!');
        setNewAccount({
          username: '',
          email: '',
          role: 'viewer',
          walletAddress: '',
          password: ''
        });
        setShowCreateForm(false);
        fetchAccountData();
      } else {
        setCreateError(result.error || 'Failed to create account');
      }
    } catch (error: any) {
      setCreateError(error.message || 'Failed to create account');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleAccountStatus = async (accountId: string, currentStatus: boolean) => {
    try {
      const result = await adminAccountService.toggleAccountStatus(accountId, !currentStatus);
      if (result.success) {
        fetchAccountData();
      }
    } catch (error) {
      console.error('Error toggling account status:', error);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      const result = await adminAccountService.deleteAdminAccount(accountId);
      if (result.success) {
        fetchAccountData();
      } else {
        alert(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Account Management</h1>
        <p>Monitor activity, manage accounts, and create admin users</p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tab} ${activeTab === 'activity' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Account Activity Tracking
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'accounts' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Account List
        </button>
      </div>

      {/* Activity Tracking Tab */}
      {activeTab === 'activity' && (
        <>
          <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Total Users</h3>
            <p className={styles.statValue}>
              {isLoading ? 'Loading...' : stats.totalUsers}
            </p>
            <span className={styles.statChange}>Registered players</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Active Today</h3>
            <p className={styles.statValue}>
              {isLoading ? 'Loading...' : stats.activeToday}
            </p>
            <span className={styles.statChange}>Last 24 hours</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Total Rewards Paid</h3>
            <p className={styles.statValue}>
              {isLoading ? 'Loading...' : `${stats.totalRewardsPaid} SUI`}
            </p>
            <span className={styles.statChange}>All time</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Total Revenue</h3>
            <p className={styles.statValue}>
              {isLoading ? 'Loading...' : `${stats.totalRevenue} SUI`}
            </p>
            <span className={styles.statChange}>
              {stats.totalRevenue > 0 && stats.totalRewardsPaid > 0
                ? `${Math.round(((stats.totalRevenue - stats.totalRewardsPaid) / stats.totalRevenue) * 100)}% profit margin`
                : 'All time'
              }
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Recent Users */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Recent Active Users</h2>
          </div>
          <div className={styles.cardContent}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading users...</p>
              </div>
            ) : recentUsers.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No users found</p>
                <p className={styles.emptyHint}>Users will appear here after they join the game</p>
              </div>
            ) : (
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Wallet</div>
                  <div className={styles.tableCell}>Last Active</div>
                  <div className={styles.tableCell}>Games</div>
                  <div className={styles.tableCell}>Rewards</div>
                </div>
                {recentUsers.map(user => (
                  <div key={user.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>
                      <code>{adminStatsService.formatWalletAddress(user.wallet)}</code>
                    </div>
                    <div className={styles.tableCell}>{user.lastActive}</div>
                    <div className={styles.tableCell}>{user.gamesPlayed}</div>
                    <div className={styles.tableCell}>
                      <span className={styles.rewardBadge}>{user.totalRewards.toFixed(2)} SUI</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.cardFooter}>
              <p className={styles.cardNote}>
                {recentUsers.length > 0
                  ? `Showing ${recentUsers.length} most recent active users`
                  : 'Real-time data from Firebase'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Recent Transactions</h2>
          </div>
          <div className={styles.cardContent}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading transactions...</p>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No transactions found</p>
                <p className={styles.emptyHint}>Transactions will appear here after users play</p>
              </div>
            ) : (
              <div className={styles.transactionList}>
                {recentTransactions.map(tx => (
                  <div key={tx.id} className={styles.transaction}>
                    <div className={styles.transactionDetails}>
                      <div className={styles.transactionType}>{tx.type}</div>
                      <div className={styles.transactionWallet}>
                        <code>{adminStatsService.formatWalletAddress(tx.wallet)}</code>
                      </div>
                    </div>
                    <div className={styles.transactionRight}>
                      <div className={`${styles.transactionAmount} ${
                        tx.type === 'Entry Fee' ? styles.amountNegative : styles.amountPositive
                      }`}>
                        {tx.type === 'Entry Fee' ? '-' : '+'}{tx.amount.toFixed(2)} SUI
                      </div>
                      <div className={styles.transactionTime}>{tx.time}</div>
                    </div>
                    <div className={styles.transactionStatus}>
                      {tx.status === 'success' && (
                        <span className={styles.statusSuccess}>
                          Success
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.cardFooter}>
              <p className={styles.cardNote}>
                {recentTransactions.length > 0
                  ? `Showing ${recentTransactions.length} most recent transactions`
                  : 'Real-time data from Firebase'
                }
              </p>
            </div>
          </div>
        </div>

        {/* User Activity Chart Placeholder */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>User Activity Trends</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartPlaceholder}>
              <p>Activity chart coming soon</p>
              <span className={styles.chartNote}>Will show daily/weekly user engagement</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Quick Actions</h2>
          </div>
          <div className={styles.cardContent}>
            <button className={styles.actionButton}>
              <div>
                <strong>Search User</strong>
                <p>Find by wallet address</p>
              </div>
            </button>
            <button className={styles.actionButton}>
              <div>
                <strong>Export Data</strong>
                <p>Download user/transaction CSV</p>
              </div>
            </button>
            <button className={styles.actionButton}>
              <div>
                <strong>Send Notification</strong>
                <p>Broadcast to all users</p>
              </div>
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Account List Tab */}
      {activeTab === 'accounts' && (
        <div className={styles.accountsTab}>
          {/* Header Actions */}
          <div className={styles.accountsHeader}>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${accountFilter === 'admin' ? styles.filterActive : ''}`}
                onClick={() => setAccountFilter('admin')}
              >
                Admin Accounts
              </button>
              <button
                className={`${styles.filterButton} ${accountFilter === 'users' ? styles.filterActive : ''}`}
                onClick={() => setAccountFilter('users')}
              >
                User Accounts
              </button>
              <button
                className={`${styles.filterButton} ${accountFilter === 'all' ? styles.filterActive : ''}`}
                onClick={() => setAccountFilter('all')}
              >
                All Accounts
              </button>
            </div>
            <button
              className={styles.createAccountButton}
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setCreateError('');
                setCreateSuccess('');
              }}
            >
              {showCreateForm ? 'Cancel' : '+ Create Admin Account'}
            </button>
          </div>

          {/* Create Account Form */}
          {showCreateForm && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Create New Admin Account</h2>
              </div>
              <div className={styles.cardContent}>
                <form onSubmit={handleCreateAccount} className={styles.createForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Username *</label>
                      <input
                        type="text"
                        value={newAccount.username}
                        onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                        placeholder="Enter username"
                        required
                        minLength={3}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input
                        type="email"
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Role *</label>
                      <select
                        value={newAccount.role}
                        onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value as any })}
                        required
                      >
                        <option value="viewer">Viewer (Read Only)</option>
                        <option value="staff">Staff (Limited Access)</option>
                        <option value="admin">Admin (Full Access)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Wallet Address *</label>
                      <input
                        type="text"
                        value={newAccount.walletAddress}
                        onChange={(e) => setNewAccount({ ...newAccount, walletAddress: e.target.value })}
                        placeholder="0x..."
                        required
                        minLength={66}
                        maxLength={66}
                      />
                      <small style={{ opacity: 0.7, fontSize: '12px' }}>Admin can only use this wallet address</small>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Password (Optional)</label>
                    <input
                      type="password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                      placeholder="Leave empty for wallet-only auth"
                    />
                  </div>

                  {createError && (
                    <div className={styles.errorMessage}>
                      {createError}
                    </div>
                  )}

                  {createSuccess && (
                    <div className={styles.successMessage}>
                      {createSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Account'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Admin Accounts List */}
          {(accountFilter === 'admin' || accountFilter === 'all') && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Admin Accounts ({adminAccounts.length})</h2>
              </div>
              <div className={styles.cardContent}>
                {isLoadingAccounts ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading accounts...</p>
                  </div>
                ) : adminAccounts.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No admin accounts found</p>
                    <p className={styles.emptyHint}>Create your first admin account</p>
                  </div>
                ) : (
                  <div className={styles.accountsList}>
                    {adminAccounts.map((account) => (
                      <div key={account.id} className={styles.accountCard}>
                        <div className={styles.accountInfo}>
                          <div className={styles.accountHeader}>
                            <h3>{account.username}</h3>
                            <span className={`${styles.roleBadge} ${styles[adminAccountService.getRoleBadgeClass(account.role)]}`}>
                              {account.role}
                            </span>
                          </div>
                          <div className={styles.accountDetails}>
                            {account.email && (
                              <div className={styles.accountDetail}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span>{account.email}</span>
                              </div>
                            )}
                            {account.walletAddress && (
                              <div className={styles.accountDetail}>
                                <span className={styles.detailLabel}>Wallet:</span>
                                <code>{adminStatsService.formatWalletAddress(account.walletAddress)}</code>
                              </div>
                            )}
                            <div className={styles.accountDetail}>
                              <span className={styles.detailLabel}>Created:</span>
                              <span>{adminAccountService.formatTimeAgo(account.createdAt)}</span>
                            </div>
                            {account.lastLogin && (
                              <div className={styles.accountDetail}>
                                <span className={styles.detailLabel}>Last Login:</span>
                                <span>{adminAccountService.formatTimeAgo(account.lastLogin)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles.accountActions}>
                          <button
                            className={`${styles.actionBtn} ${account.isActive ? styles.btnDeactivate : styles.btnActivate}`}
                            onClick={() => handleToggleAccountStatus(account.id, account.isActive)}
                          >
                            {account.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.btnDelete}`}
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Accounts List */}
          {(accountFilter === 'users' || accountFilter === 'all') && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>User Accounts ({userAccounts.length})</h2>
              </div>
              <div className={styles.cardContent}>
                {isLoadingAccounts ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading accounts...</p>
                  </div>
                ) : userAccounts.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No user accounts found</p>
                    <p className={styles.emptyHint}>Users will appear here after joining the game</p>
                  </div>
                ) : (
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>
                      <div className={styles.tableCell}>Username</div>
                      <div className={styles.tableCell}>Wallet Address</div>
                      <div className={styles.tableCell}>Level</div>
                      <div className={styles.tableCell}>Games Played</div>
                      <div className={styles.tableCell}>Total Rewards</div>
                      <div className={styles.tableCell}>Joined</div>
                    </div>
                    {userAccounts.map((user) => (
                      <div key={user.id} className={styles.tableRow}>
                        <div className={styles.tableCell}>
                          {user.username || `Player_${user.id.slice(0, 6)}`}
                        </div>
                        <div className={styles.tableCell}>
                          <code>{adminStatsService.formatWalletAddress(user.walletAddress || user.id)}</code>
                        </div>
                        <div className={styles.tableCell}>
                          Level {user.level || 1}
                        </div>
                        <div className={styles.tableCell}>
                          {user.gameState?.totalDaysPlayed || 0}
                        </div>
                        <div className={styles.tableCell}>
                          <span className={styles.rewardBadge}>
                            {(user.gameState?.totalSuiEarned || 0).toFixed(2)} SUI
                          </span>
                        </div>
                        <div className={styles.tableCell}>
                          {adminAccountService.formatTimeAgo(user.joinDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
