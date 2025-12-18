import styles from './AdminSidebar.module.css';
import logoImage from '../assets/SuiHarvest.png';

interface AdminSidebarProps {
  currentPage: 'sui' | 'account' | 'maintenance';
  onNavigate: (page: 'sui' | 'account' | 'maintenance') => void;
  adminUsername: string;
  adminRole: string;
  walletAddress: string;
  onLogout: () => void;
}

export function AdminSidebar({ currentPage, onNavigate, adminUsername, adminRole, walletAddress, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { id: 'sui' as const, label: 'Sui Management', description: 'Treasury & Transactions' },
    { id: 'account' as const, label: 'Account Management', description: 'Users & Activity' },
    { id: 'maintenance' as const, label: 'Game Maintenance', description: 'System Controls' },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <img src={logoImage} alt="SuiHarvest" className={styles.logoImage} />
        <p className={styles.logoSubtext}>Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${currentPage === item.id ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <div className={styles.navContent}>
              <div className={styles.navLabel}>{item.label}</div>
              <div className={styles.navDescription}>{item.description}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* Account Section */}
      <div className={styles.accountSection}>
        <div className={styles.accountInfo}>
          <div className={styles.accountDetails}>
            <p className={styles.accountLabel}>👤 {adminUsername || 'Admin'}</p>
            <p className={styles.accountAddress}>
              {adminRole && <span style={{ 
                fontSize: '10px', 
                padding: '2px 8px', 
                borderRadius: '10px', 
                backgroundColor: adminRole.toLowerCase() === 'admin' ? '#dc354580' : '#3b82f680',
                color: 'white',
                marginRight: '6px',
                textTransform: 'uppercase',
                fontWeight: 600
              }}>{adminRole}</span>}
              {walletAddress ? (
                <span style={{ fontSize: '11px', opacity: 0.7 }}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              ) : (
                <span style={{ fontSize: '11px', opacity: 0.5, color: '#ff6b6b' }}>No wallet connected</span>
              )}
            </p>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={onLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
