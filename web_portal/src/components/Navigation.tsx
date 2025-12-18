import { useState, useRef, useEffect } from 'react';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { useAuth } from '../contexts/AuthContext';
import { ConnectModal } from './ConnectModal';
import styles from './Navigation.module.css';
import SuiHarvestLogo from '../assets/SuiHarvestLogo2.png';

type PageType = 'home' | 'wiki' | 'game' | 'contact' | 'profile' | 'features' | 'gameplay' | 'tokenomics' | 'roadmap' | 'support' | 'blog' | 'privacy' | 'terms' | 'cookies' | 'license' | 'demo' | 'admin';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  walletConnected: boolean;
  onWalletConnect: () => void;
  onWalletDisconnect: () => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { connectWallet, disconnectWallet } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Sync Sui wallet with AuthContext
  useEffect(() => {
    if (currentAccount?.address) {
      connectWallet(currentAccount.address);
    } else {
      disconnectWallet();
    }
  }, [currentAccount, connectWallet, disconnectWallet]);

  const handleLogout = () => {
    disconnect();
    setDropdownOpen(false);
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const pages = ['home', 'wiki', 'game', 'contact'] as const;

  useEffect(() => {
    const activeButton = navRefs.current[currentPage];
    if (activeButton) {
      const navPill = activeButton.parentElement;
      if (navPill) {
        const navRect = navPill.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        setIndicatorStyle({
          left: buttonRect.left - navRect.left,
          width: buttonRect.width
        });
      }
    }
  }, [currentPage]);

  return (
    <>
      {/* Logo */}
      <div className={styles.fixedLogo}>
        <img src={SuiHarvestLogo} alt="SuiHarvest" className={styles.logoImage} />
      </div>

      {/* Wallet Button */}
      <div className={styles.fixedWallet}>
        {currentAccount ? (
          <div style={{ position: 'relative' }}>
            <button 
              className={styles.walletBtn} 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {formatAddress(currentAccount.address)}
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {dropdownOpen && (
              <div className={styles.walletDropdown}>
                <div className={styles.dropdownItem} onClick={() => {
                  setDropdownOpen(false);
                  window.location.hash = 'profile';
                }}>
                  Profile
                </div>
                <div className={styles.dropdownItem} onClick={() => alert('Settings coming soon!')}>
                  Settings
                </div>
                <div className={styles.dropdownItem} onClick={handleLogout}>
                  Disconnect
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.connectButtonWrapper}>
            <button 
              className={styles.walletBtn}
              onClick={() => setModalOpen(true)}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Nav Pill */}
      <nav className={styles.navPill}>
        <div 
          className={styles.navIndicator}
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`
          }}
        />
        {pages.map((page) => (
          <button
            key={page}
            ref={(el) => { navRefs.current[page] = el; }}
            className={`${styles.navLinkBtn} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </nav>

      {/* Background Grid */}
      <div className={styles.animatedGrid}></div>
    </>
  );
}
