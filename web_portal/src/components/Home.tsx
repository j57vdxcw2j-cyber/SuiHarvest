import { useState } from 'react';
import styles from './Home.module.css';
import SuiLogo from '../assets/Sui_Symbol_Sea.png';
import VanLangLogo from '../assets/VanLangLogo.webp';
import VanLangCampus from '../assets/VanLangUnivercityCampus.jpg';
import HeroImage from '../assets/SuiHarvest.png';
import SuiSymbol from '../assets/Sui_Symbol_Sea.png';
import SuiHarvestLogo2 from '../assets/SuiHarvestLogo2.png';
import BlockChainGamingImg from '../assets/BlockChainGamingImg.webp';
import SmartContractImg from '../assets/SmartContract.webp';
import NFTImg from '../assets/NFT.webp';

export function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Generate dots positions once
  const [dots] = useState(() => 
    Array.from({ length: 80 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 6 + Math.random() * 6
    }))
  );

  return (
    <>
      {/* Global Mouse Light - Outside main container */}
      <div 
        className={styles.globalMouseLight}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />

      <div className={styles.pageSection} onMouseMove={handleMouseMove}>
        {/* Global Background Effects */}
        <div className={styles.globalBgDots}>
          {dots.map((dot, i) => (
            <div 
              key={i} 
              className={styles.globalDot}
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
      <div className="section-block">
        <div className="container">
          <div className={styles.heroContentWrapper}>
            <div className={styles.heroText}>
              <div className={styles.hero}>
                <h1>Daily Harvest.<br /><span style={{ color: 'var(--sui-blue)' }}>Daily Rewards.</span></h1>
                <p>The first Roguelike Farming game on Sui Network. Farm resources, complete contracts, and reset every 24h.</p>
                <button className="btn btn-large btn-orange" onClick={() => window.location.hash = '#game'}>
                  START FARMING
                </button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img src={HeroImage} alt="SuiHarvest Game" />
            </div>
          </div>

          {/* Marquee */}
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
              <div className={styles.partnerLogo}>
                <img src={SuiLogo} alt="Sui Network" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={VanLangLogo} alt="Van Lang University" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={SuiLogo} alt="Sui Network" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={VanLangLogo} alt="Van Lang University" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={SuiLogo} alt="Sui Network" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={VanLangLogo} alt="Van Lang University" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={SuiLogo} alt="Sui Network" />
              </div>
              <div className={styles.partnerLogo}>
                <img src={VanLangLogo} alt="Van Lang University" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's new for Research */}
      <div className="section-block" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>What's New for Research</h2>
          <div className={styles.cardsGrid}>
            {[
              { 
                title: 'Blockchain Gaming Analytics', 
                desc: 'Explore comprehensive data analysis on player behavior patterns, token economics, and gameplay metrics within decentralized gaming ecosystems.',
                date: 'Dec 15, 2024',
                link: 'https://docs.sui.io/concepts/gaming',
                image: BlockChainGamingImg
              },
              { 
                title: 'Smart Contract Optimization', 
                desc: 'Deep dive into gas efficiency improvements and best practices for Move language development on the Sui blockchain platform.',
                date: 'Dec 12, 2024',
                link: 'https://docs.sui.io/guides/developer/nft/nft-rental#smart-contract-design',
                image: SmartContractImg
              },
              { 
                title: 'NFT Integration Strategies', 
                desc: 'Research findings on implementing non-fungible tokens as in-game assets with real ownership and trading capabilities.',
                date: 'Dec 10, 2024',
                link: 'https://docs.sui.io/guides/developer/nft-index',
                image: NFTImg
              },
            ].map((item, i) => (
              <a 
                key={i} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.researchCard}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.cardImagePlaceholder}>
                  <img src={item.image} alt={item.title} className={styles.cardImage} />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardDate}>{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* SuiHarvest at a Glance */}
      <div className="section-block" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>SuiHarvest at a Glance</h2>
          <div className={styles.glanceSection}>
            <div className={styles.glargeImagePlaceholder}>
              <img src={SuiHarvestLogo2} alt="SuiHarvest Logo" className={styles.glanceLogo} />
            </div>
            <p className={styles.glanceDescription} style={{ color: 'rgba(255,255,255,0.9)' }}>
              SuiHarvest is a pioneering roguelike farming game built on the Sui blockchain. 
              It combines traditional farming mechanics with blockchain technology to create 
              a unique gaming experience where every day brings new challenges and opportunities. 
              Players engage in resource gathering, contract fulfillment, and strategic decision-making 
              in a constantly evolving ecosystem. The game's innovative daily reset mechanism ensures 
              a balanced economy while maintaining engaging gameplay.
            </p>
          </div>
        </div>
      </div>

      {/* Scalability & Innovation - Sui Carousel */}
      <div className="section-block" style={{ background: '#0A1929', padding: '0' }}>
        <SuiScalabilityCarousel />
      </div>

      {/* Who Says You Can't */}
      <div className="section-block" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>Who Says You Can't Have It All?</h2>
          <div className={styles.benefitsGrid}>
            {[
              { 
                image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=400&fit=crop',
                title: 'Engaging Gameplay', 
                desc: 'Experience addictive roguelike mechanics combined with relaxing farming simulation. Every session offers unique challenges.'
              },
              { 
                image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop',
                title: 'Earn Real Value', 
                desc: 'Complete contracts to earn SUI tokens. Your time and skill are rewarded with real cryptocurrency.'
              },
              { 
                image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
                title: 'True Ownership', 
                desc: 'Your resources and achievements are stored as blockchain assets. You have full control and ownership.'
              },
              { 
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
                title: 'Fair Economy', 
                desc: 'Daily resets and item burns prevent inflation. The game economy stays healthy and balanced.'
              },
            ].map((item, i) => (
              <div key={i} className={styles.benefitCard}>
                <div className={styles.benefitImageContainer}>
                  <img src={item.image} alt={item.title} className={styles.benefitImage} />
                </div>
                <div className={styles.benefitContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Us */}
      <div className="section-block" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>Why Choose SuiHarvest?</h2>
          <div className={styles.comparisonTable}>
            <div className={styles.tableRow}>
              <div className={styles.tableHeader}>Features</div>
              <div className={styles.tableHeader}>Traditional Games</div>
              <div className={styles.tableHeader}>SuiHarvest</div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>True Asset Ownership</div>
              <div className={styles.tableCell}>
                <span className={styles.crossIcon}>✕</span>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.checkIcon}>✓</span>
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Earn Real Money</div>
              <div className={styles.tableCell}>
                <span className={styles.crossIcon}>✕</span>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.checkIcon}>✓</span>
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Transparent Economics</div>
              <div className={styles.tableCell}>
                <span className={styles.crossIcon}>✕</span>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.checkIcon}>✓</span>
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>No Pay-to-Win</div>
              <div className={styles.tableCell}>
                <span className={styles.crossIcon}>✕</span>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.checkIcon}>✓</span>
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Daily Fresh Start</div>
              <div className={styles.tableCell}>
                <span className={styles.crossIcon}>✕</span>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.checkIcon}>✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Bring More */}
      <div className="section-block" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>What Can We Bring More</h2>
          <div className={styles.moreSection}>
            <div className={styles.largeImageContainer}>
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop" 
                alt="Blockchain Future" 
                className={styles.largeImage}
              />
            </div>
            <div className={styles.moreContent}>
              <ul className={styles.featuresList}>
                <li><strong>Community Governance:</strong> Future DAO implementation allowing players to vote on game mechanics and updates</li>
                <li><strong>Seasonal Events:</strong> Special limited-time challenges with exclusive rewards and rare collectibles</li>
                <li><strong>Multiplayer Features:</strong> Cooperative farming, trading marketplaces, and competitive leaderboards</li>
                <li><strong>Expanded Ecosystem:</strong> New crops, tools, and resources to discover with each major update</li>
                <li><strong>Mobile Experience:</strong> Cross-platform compatibility bringing blockchain gaming to mobile devices</li>
                <li><strong>Educational Content:</strong> Learn about blockchain, DeFi, and web3 while playing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SuiHarvest Works for Businesses */}
      <div className="section-block" style={{ background: 'transparent' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>SuiHarvest Works for Businesses</h2>
          <div className={styles.businessGrid}>
            {[
              { 
                title: 'Blockchain Developers', 
                desc: 'Use SuiHarvest as a reference implementation for Move smart contracts and Sui blockchain integration. Study our open-source code to accelerate your development.',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'
              },
              { 
                title: 'Educational Institutions', 
                desc: 'Partner with us to create blockchain gaming curriculum. SuiHarvest serves as a practical case study for web3 development and tokenomics.',
                image: VanLangCampus
              },
              { 
                title: 'Marketing & Brands', 
                desc: 'Integrate your brand into SuiHarvest through sponsored events, NFT collaborations, and in-game advertising opportunities.',
                image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop'
              },
            ].map((item, i) => (
              <div key={i} className={styles.businessCard}>
                <div className={styles.businessImageContainer}>
                  <img src={item.image} alt={item.title} className={styles.businessImage} />
                </div>
                <div className={styles.businessContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// Sui Scalability Carousel Component
function SuiScalabilityCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate dots positions once and keep them fixed
  const [dots] = useState(() => 
    Array.from({ length: 60 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 5
    }))
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const slides = [
    {
      title: 'Scalable infrastructure that\'s fast, secure, and affordable',
      subtitle: 'Unrivaled speed coupled with low, predictable fees means cost stays down when demand goes up',
      mainMetric: '297,000 TPS',
      mainLabel: 'TRANSACTIONS PER SECOND',
      mainLink: 'https://blog.sui.io/sui-performance-update/',
      secondMetric: '~400ms (avg)',
      secondLabel: 'TIME TO FINALITY',
      chartType: 'performance',
      chartTitle: 'Transactions per epoch',
      chartSubtitle: 'Average cost of transactions in SUI'
    },
    {
      title: 'Scalable infrastructure that\'s fast, secure, and affordable',
      subtitle: 'A growing ecosystem, building across industries',
      mainMetric: '221.7M',
      mainLabel: 'TOTAL ACTIVE ACCOUNTS',
      mainLink: 'https://suivision.xyz/',
      secondMetric: '12.8B',
      secondLabel: 'TOTAL TRANSACTIONS',
      secondLink: 'https://suiscan.xyz/',
      chartType: 'tvl',
      chartTitle: 'Total Value Locked',
      tvlValue: '$922M'
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const slide = slides[currentSlide];

  return (
    <div className={styles.suiCarousel} onMouseMove={handleMouseMove}>
      {/* Mouse Light Effect */}
      <div 
        className={styles.mouseLight}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />
      
      {/* Animated Background Dots */}
      <div className={styles.bgDots}>
        {dots.map((dot, i) => (
          <div 
            key={i} 
            className={styles.dot}
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className={styles.carouselInner}>
        <div className={styles.carouselHeader}>
        <img src={SuiSymbol} alt="Sui" className={styles.suiHeaderLogo} />
        <h2 style={{ color: 'white', fontSize: '48px', fontWeight: '800', marginBottom: '15px' }}>
          {slide.title}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '50px' }}>
          {slide.subtitle}
        </p>
      </div>

      <div className={`${styles.carouselContent} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
        <div className={styles.metricsContainer}>
          {/* Main Chart Area */}
          <div className={styles.mainChart}>
            {slide.chartType === 'performance' ? (
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#3b82f6' }}></span>
                    <span className={styles.legendText}>Transactions per epoch</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#ef4444' }}></span>
                    <span className={styles.legendText}>Average cost of transactions in SUI</span>
                  </div>
                </div>
                <div className={styles.lineChart}>
                  <svg viewBox="0 0 700 240" className={styles.chartSvg}>
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Y-axis labels */}
                    <text x="10" y="50" fill="rgba(255,255,255,0.4)" fontSize="10">70,000,000</text>
                    <text x="10" y="100" fill="rgba(255,255,255,0.4)" fontSize="10">60,000,000</text>
                    <text x="10" y="150" fill="rgba(255,255,255,0.4)" fontSize="10">50,000,000</text>
                    <text x="10" y="200" fill="rgba(255,255,255,0.4)" fontSize="10">40,000,000</text>
                    <text x="10" y="250" fill="rgba(255,255,255,0.4)" fontSize="10">20,000,000</text>
                    
                    {/* X-axis labels - Epochs */}
                    <text x="100" y="290" fill="rgba(255,255,255,0.4)" fontSize="10">85</text>
                    <text x="200" y="290" fill="rgba(255,255,255,0.4)" fontSize="10">90</text>
                    <text x="350" y="290" fill="rgba(255,255,255,0.4)" fontSize="10">95</text>
                    <text x="500" y="290" fill="rgba(255,255,255,0.4)" fontSize="10">100</text>
                    
                    {/* Grid lines */}
                    <line x1="80" y1="50" x2="680" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="80" y1="100" x2="680" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="80" y1="150" x2="680" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="80" y1="200" x2="680" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="80" y1="250" x2="680" y2="250" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Blue line - Transactions increasing */}
                    <path
                      d="M 80,240 L 120,230 L 180,220 L 240,210 L 300,190 L 360,170 L 420,150 L 480,120 L 540,90 L 600,70 L 660,55"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                    <path
                      d="M 80,240 L 120,230 L 180,220 L 240,210 L 300,190 L 360,170 L 420,150 L 480,120 L 540,90 L 600,70 L 660,55 L 660,270 L 80,270 Z"
                      fill="url(#blueGradient)"
                    />
                    
                    {/* Red line - Cost stable */}
                    <line x1="80" y1="180" x2="660" y2="175" stroke="#ef4444" strokeWidth="2.5" />
                    
                    {/* Epoch label at bottom center */}
                    <text x="370" y="315" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500" textAnchor="middle">Epoch</text>
                  </svg>
                </div>
              </div>
            ) : (
              <div className={styles.chartPlaceholder}>
                <div className={styles.tvlHeader}>
                  <span className={styles.tvlDate}>DEC 2025</span>
                  <div className={styles.chartTitle}>{slide.chartTitle}</div>
                </div>
                <div className={styles.tvlChart}>
                  <div className={styles.tvlAmount}>{slide.tvlValue}</div>
                  <svg viewBox="0 0 700 200" className={styles.chartSvg}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.6 }} />
                        <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.05 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Dates */}
                    <text x="100" y="240" fill="rgba(255,255,255,0.4)" fontSize="10">11/26</text>
                    <text x="250" y="240" fill="rgba(255,255,255,0.4)" fontSize="10">11/30</text>
                    <text x="400" y="240" fill="rgba(255,255,255,0.4)" fontSize="10">12/05</text>
                    <text x="550" y="240" fill="rgba(255,255,255,0.4)" fontSize="10">12/08</text>
                    
                    {/* Area chart */}
                    <path
                      d="M 50,180 Q 100,170 130,160 T 200,140 T 280,130 T 350,110 T 430,120 T 510,105 T 580,95 T 650,75 L 650,220 L 50,220 Z"
                      fill="url(#purpleGradient)"
                    />
                    {/* Line */}
                    <path
                      d="M 50,180 Q 100,170 130,160 T 200,140 T 280,130 T 350,110 T 430,120 T 510,105 T 580,95 T 650,75"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                    />
                    {/* Dot at the end */}
                    <circle cx="650" cy="75" r="4" fill="#a855f7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Cards */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <div className={styles.metricLabel}>{slide.mainLabel}</div>
                {slide.mainLink && (
                  <a href={slide.mainLink} target="_blank" rel="noopener noreferrer" className={styles.metricLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
              <div className={styles.metricValue}>{slide.mainMetric}</div>
              <div className={styles.miniChart}>
                <div className={styles.barChart}>
                  <div className={styles.bar} style={{ height: '100%', background: '#3b82f6' }}></div>
                  <div className={styles.bar} style={{ height: '60%', background: '#64748b' }}></div>
                  <div className={styles.bar} style={{ height: '70%', background: '#64748b' }}></div>
                  <div className={styles.bar} style={{ height: '50%', background: '#64748b' }}></div>
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <div className={styles.metricLabel}>{slide.secondLabel}</div>
                {slide.secondLink && (
                  <a href={slide.secondLink} target="_blank" rel="noopener noreferrer" className={styles.metricLink}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
              <div className={styles.metricValue}>{slide.secondMetric}</div>
              <div className={styles.miniChart}>
                <div className={styles.horizontalBars}>
                  <div className={styles.hBar} style={{ width: '95%', background: '#3b82f6' }}></div>
                  <div className={styles.hBar} style={{ width: '75%', background: '#64748b' }}></div>
                  <div className={styles.hBar} style={{ width: '85%', background: '#64748b' }}></div>
                  <div className={styles.hBar} style={{ width: '90%', background: '#64748b' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className={styles.carouselArrow} style={{ left: '20px' }} onClick={prevSlide}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className={styles.carouselArrow} style={{ right: '20px' }} onClick={nextSlide}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className={styles.slideIndicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${currentSlide === index ? styles.activeIndicator : ''}`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsTransitioning(false);
                }, 300);
              }
            }}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
