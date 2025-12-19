import { useState } from 'react';
import styles from './Features.module.css';

export function Features() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const coreFeatures = [
    {
      icon: '🎮',
      title: 'Roguelike Farming',
      desc: 'Experience unique daily challenges with procedural generation. Every 24 hours brings a fresh start and new opportunities.',
      color: 'rgba(239, 68, 68, 0.2)'
    },
    {
      icon: '⛓️',
      title: 'True Blockchain Ownership',
      desc: 'All in-game assets are NFTs on Sui blockchain. You own what you earn with complete control and portability.',
      color: 'rgba(59, 130, 246, 0.2)'
    },
    {
      icon: '💰',
      title: 'Play-to-Earn',
      desc: 'Earn real SUI tokens by completing daily contracts. Skilled players can generate consistent profits.',
      color: 'rgba(34, 197, 94, 0.2)'
    },
    {
      icon: '⚖️',
      title: 'Fair Economy',
      desc: 'Daily item burns prevent inflation. No pay-to-win mechanics ensure skill-based competition.',
      color: 'rgba(168, 85, 247, 0.2)'
    },
    {
      icon: '🚀',
      title: 'Sui Network Power',
      desc: 'Lightning-fast transactions with 297,000 TPS. Low fees and instant finality enhance gameplay.',
      color: 'rgba(236, 72, 153, 0.2)'
    },
    {
      icon: '🎯',
      title: 'Skill-Based Gameplay',
      desc: 'Strategy and resource management determine success. Learn, adapt, and master daily challenges.',
      color: 'rgba(245, 158, 11, 0.2)'
    },
    {
      icon: '👥',
      title: 'Community Driven',
      desc: 'Future DAO governance allows players to vote on game mechanics and development direction.',
      color: 'rgba(20, 184, 166, 0.2)'
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      desc: 'Play on web today, mobile tomorrow. Seamless experience across all devices.',
      color: 'rgba(99, 102, 241, 0.2)'
    }
  ];

  const detailedFeatures = [
    {
      title: 'Daily Reset System',
      image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=500&fit=crop',
      description: 'SuiHarvest operates on a unique 24-hour cycle that creates a dynamic, ever-changing game economy.',
      points: [
        'Every player starts fresh at midnight UTC',
        'Resources gathered today don\'t carry to tomorrow',
        'Completed contracts convert to SUI rewards',
        'Unused items are automatically burned',
        'Prevents resource hoarding and inflation',
        'Creates daily competitive seasons'
      ]
    },
    {
      title: 'Smart Contract Integration',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop',
      description: 'Built on Sui blockchain with Move smart contracts ensuring transparency and security.',
      points: [
        'Immutable game rules enforced by blockchain',
        'Provably fair random number generation',
        'Transparent token distribution',
        'Automated contract execution',
        'No single point of failure',
        'Open-source code for verification'
      ]
    },
    {
      title: 'Economic Model',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop',
      description: 'Sustainable tokenomics designed for long-term player value and game health.',
      points: [
        'Entry fee: 0.75 SUI per daily contract',
        'Potential rewards: 1.0 - 2.5 SUI per completion',
        'House fee funds game development',
        'Daily burns maintain token value',
        'Fame points for achievements',
        'Future staking and governance'
      ]
    },
    {
      title: 'Gameplay Progression',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop',
      description: 'Master the game through skill development and strategic decision-making.',
      points: [
        'Learn resource gathering efficiency',
        'Optimize stamina usage patterns',
        'Study contract requirements',
        'Develop daily strategies',
        'Track market conditions',
        'Join community for tips'
      ]
    }
  ];

  return (
    <div className={styles.featuresContainer} onMouseMove={handleMouseMove}>
      {/* Mouse Light */}
      <div 
        className={styles.mouseLight}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />

      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1>Revolutionary Blockchain Gaming</h1>
          <p>SuiHarvest combines the best of roguelike mechanics, farming simulation, and blockchain technology to create a unique play-to-earn experience on Sui Network.</p>
        </div>

        {/* Core Features Grid */}
        <section className={styles.coreSection}>
          <h2 className={styles.sectionTitle}>Core Features</h2>
          <div className={styles.featuresGrid}>
            {coreFeatures.map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Features */}
        <section className={styles.detailedSection}>
          <h2 className={styles.sectionTitle}>Feature Deep Dive</h2>
          {detailedFeatures.map((feature, i) => (
            <div key={i} className={`${styles.detailCard} ${i % 2 === 1 ? styles.reverse : ''}`}>
              <div className={styles.detailImage}>
                <img src={feature.image} alt={feature.title} />
              </div>
              <div className={styles.detailContent}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className={styles.pointsList}>
                  {feature.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Technology Stack */}
        <section className={styles.techSection}>
          <h2 className={styles.sectionTitle}>Powered by Sui Network</h2>
          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <div className={styles.techNumber}>297,000</div>
              <div className={styles.techLabel}>TPS Capacity</div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techNumber}>~400ms</div>
              <div className={styles.techLabel}>Time to Finality</div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techNumber}>$0.001</div>
              <div className={styles.techLabel}>Avg Gas Fee</div>
            </div>
            <div className={styles.techCard}>
              <div className={styles.techNumber}>100%</div>
              <div className={styles.techLabel}>Uptime</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Ready to Start Farming?</h2>
          <p>Join thousands of players earning real SUI tokens through strategic gameplay</p>
          <button className={styles.ctaButton}>Start Playing Now</button>
        </section>
      </div>
    </div>
  );
}
