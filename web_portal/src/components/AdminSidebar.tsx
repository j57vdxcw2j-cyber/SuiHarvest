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
        {/* Admin Profile */}
        <div className={styles.adminProfile}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              {adminUsername ? adminUsername.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>{adminUsername || 'Admin'}</p>
              <span className={`${styles.roleBadge} ${styles[`role${adminRole?.toLowerCase() || 'viewer'}`]}`}>
                {adminRole || 'Viewer'}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        <div className={styles.walletStatus}>
          <div className={styles.walletLabel}>Connected Wallet</div>
          {walletAddress ? (
            <div className={styles.walletAddress}>
              <span className={styles.walletDot}></span>
              <code>{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</code>
            </div>
          ) : (
            <div className={styles.walletDisconnected}>
              <span className={styles.walletDotOff}></span>
              No wallet connected
            </div>
          )}
        </div>

        <button className={styles.logoutButton} onClick={onLogout}>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
