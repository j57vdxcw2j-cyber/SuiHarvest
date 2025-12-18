import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar } from './AdminSidebar';
import { SuiManagement } from './SuiManagement';
import { AccountManagement } from './AccountManagement';
import { MaintenanceManagement } from './MaintenanceManagement';
import styles from './AdminDashboard.module.css';

/**
 * Admin Dashboard - Main Container
 * Manages authentication, navigation, and page routing
 */
export function AdminDashboard() {
  const currentAccount = useCurrentAccount(); // Real-time wallet from dapp-kit
  const { disconnectWallet } = useAuth();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<'sui' | 'account' | 'maintenance'>('sui');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminRole, setAdminRole] = useState('');

  // Check localStorage for existing admin session
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    const username = localStorage.getItem('adminUsername') || 'Admin';
    const role = localStorage.getItem('adminRole') || 'Admin';
    
    if (adminAuth === 'true' && loginTime) {
      // Check if session is still valid (24 hours)
      const currentTime = Date.now();
      const elapsed = currentTime - parseInt(loginTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (elapsed < twentyFourHours) {
        setIsAuthenticated(true);
        setAdminUsername(username);
        setAdminRole(role);
      } else {
        // Session expired, clear localStorage
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminRole');
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear localStorage
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminAccountId');
    localStorage.removeItem('adminWalletAddress');
    disconnectWallet();
    window.location.hash = 'home';
  };

  const handleNavigate = (page: 'sui' | 'account' | 'maintenance') => {
    setCurrentPage(page);
  };

  // Show login screen only if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Render dashboard with sidebar
  return (
    <div className={styles.dashboard}>
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        adminUsername={adminUsername}
        adminRole={adminRole}
        walletAddress={currentAccount?.address || ''}
        onLogout={handleLogout}
      />
      
      <main className={styles.mainContent}>
        {currentPage === 'sui' && <SuiManagement />}
        {currentPage === 'account' && <AccountManagement />}
        {currentPage === 'maintenance' && <MaintenanceManagement />}
      </main>
    </div>
  );
}
