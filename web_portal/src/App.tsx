import { useState, useEffect } from 'react';
import { 
  Navigation, 
  Home, 
  Wiki, 
  Game, 
  Contact,
  Profile,
  Features,
  Gameplay,
  Tokenomics,
  Roadmap,
  Support,
  Blog,
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  License,
  Footer,
  AdminDashboard,
  PreLoader
} from './components';
import { CaseOpeningDemo } from './components/CaseOpeningDemo';
import './styles/globals.css';
import './App.css';

type PageType = 'home' | 'wiki' | 'game' | 'contact' | 'profile' | 'features' | 'gameplay' | 'tokenomics' | 'roadmap' | 'support' | 'blog' | 'privacy' | 'terms' | 'cookies' | 'license' | 'demo' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [showPreLoader, setShowPreLoader] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as PageType;
      const validPages: PageType[] = ['home', 'wiki', 'game', 'contact', 'profile', 'features', 'gameplay', 'tokenomics', 'roadmap', 'support', 'blog', 'privacy', 'terms', 'cookies', 'license', 'demo', 'admin'];
      
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
        window.scrollTo(0, 0);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleWalletDisconnect = () => {
    setWalletConnected(false);
  };

  const handlePreLoaderComplete = () => {
    setShowPreLoader(false);
    // Delay content appearance for smooth transition
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  // Show preloader every time
  if (showPreLoader) {
    return <PreLoader onComplete={handlePreLoaderComplete} />;
  }

  return (
    <div className={`app-content ${contentVisible ? 'visible' : ''}`}>
      {currentPage !== 'admin' && (
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          walletConnected={walletConnected}
          onWalletConnect={handleWalletConnect}
          onWalletDisconnect={handleWalletDisconnect}
        />
      )}

      {currentPage === 'home' && <Home />}
      {currentPage === 'wiki' && <Wiki />}
      {currentPage === 'game' && <Game />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'profile' && <Profile />}
      {currentPage === 'features' && <Features />}
      {currentPage === 'gameplay' && <Gameplay />}
      {currentPage === 'tokenomics' && <Tokenomics />}
      {currentPage === 'roadmap' && <Roadmap />}
      {currentPage === 'support' && <Support />}
      {currentPage === 'blog' && <Blog />}
      {currentPage === 'privacy' && <PrivacyPolicy />}
      {currentPage === 'terms' && <TermsOfService />}
      {currentPage === 'cookies' && <CookiePolicy />}
      {currentPage === 'license' && <License />}
      {currentPage === 'demo' && <CaseOpeningDemo />}
      {currentPage === 'admin' && <AdminDashboard />}

      {currentPage !== 'demo' && currentPage !== 'admin' && <Footer />}
    </div>
  );
}

export default App;