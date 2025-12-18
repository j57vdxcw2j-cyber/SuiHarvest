import styles from './Roadmap.module.css';

export function Roadmap() {
  const phases = [
    {
      quarter: 'Q1 2025',
      title: 'Foundation & Launch',
      status: 'In Progress',
      progress: 75,
      color: '#3B82F6',
      milestones: [
        { title: 'Smart Contract Development', status: 'completed', icon: '✓' },
        { title: 'Core Gameplay Mechanics', status: 'completed', icon: '✓' },
        { title: 'Testnet Deployment', status: 'completed', icon: '✓' },
        { title: 'Security Audit', status: 'in-progress', icon: '⋯' },
        { title: 'Mainnet Launch', status: 'pending', icon: '○' },
      ]
    },
    {
      quarter: 'Q2 2025',
      title: 'Growth & Expansion',
      status: 'Planned',
      progress: 0,
      color: '#10B981',
      milestones: [
        { title: 'NFT Character System', status: 'pending', icon: '○' },
        { title: 'Advanced Crafting', status: 'pending', icon: '○' },
        { title: 'Seasonal Events', status: 'pending', icon: '○' },
        { title: 'Mobile App Launch', status: 'pending', icon: '○' },
        { title: 'Partnership Program', status: 'pending', icon: '○' },
      ]
    },
    {
      quarter: 'Q3 2025',
      title: 'Community & Features',
      status: 'Planned',
      progress: 0,
      color: '#8B5CF6',
      milestones: [
        { title: 'Guild System', status: 'pending', icon: '○' },
        { title: 'PvP Tournaments', status: 'pending', icon: '○' },
        { title: 'Land Ownership NFTs', status: 'pending', icon: '○' },
        { title: 'Governance Token', status: 'pending', icon: '○' },
        { title: 'DAO Launch', status: 'pending', icon: '○' },
      ]
    },
    {
      quarter: 'Q4 2025',
      title: 'Ecosystem & Scale',
      status: 'Planned',
      progress: 0,
      color: '#F59E0B',
      milestones: [
        { title: 'Cross-Chain Bridge', status: 'pending', icon: '○' },
        { title: 'Marketplace Launch', status: 'pending', icon: '○' },
        { title: 'API for Developers', status: 'pending', icon: '○' },
        { title: 'Global Tournaments', status: 'pending', icon: '○' },
        { title: 'Year 2 Planning', status: 'pending', icon: '○' },
      ]
    }
  ];

  const upcomingFeatures = [
    {
      title: 'NFT Characters',
      description: 'Unique playable characters with special abilities and visual customization.',
      icon: '🎭',
      eta: 'Q2 2025'
    },
    {
      title: 'Guild System',
      description: 'Form alliances, share resources, and compete in guild-based tournaments.',
      icon: '🛡️',
      eta: 'Q3 2025'
    },
    {
      title: 'Land Ownership',
      description: 'Own virtual land plots, earn passive income from visitors and resources.',
      icon: '🏞️',
      eta: 'Q3 2025'
    },
    {
      title: 'Mobile App',
      description: 'Play on the go with native iOS and Android applications.',
      icon: '📱',
      eta: 'Q2 2025'
    },
    {
      title: 'Governance',
      description: 'Vote on game features, economic changes, and development priorities.',
      icon: '⚖️',
      eta: 'Q3 2025'
    },
    {
      title: 'Marketplace',
      description: 'Trade items, characters, and land with other players directly.',
      icon: '🏪',
      eta: 'Q4 2025'
    }
  ];

  return (
    <div className={styles.roadmapContainer}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          <h1>Product Roadmap</h1>
          <p>Our journey to building the most engaging blockchain farming game on Sui</p>
        </div>

        {/* Timeline */}
        <section className={styles.timelineSection}>
          <div className={styles.timelineLine} />
          {phases.map((phase, i) => (
            <div key={i} className={styles.phaseContainer}>
              <div className={styles.phaseMarker} style={{ background: phase.color }} />
              <div className={styles.phaseCard}>
                <div className={styles.phaseHeader}>
                  <div>
                    <div className={styles.phaseQuarter}>{phase.quarter}</div>
                    <h2 className={styles.phaseTitle}>{phase.title}</h2>
                    <div 
                      className={styles.phaseStatus}
                      style={{ color: phase.color }}
                    >
                      {phase.status}
                    </div>
                  </div>
                  <div className={styles.phaseProgress}>
                    <div className={styles.progressCircle}>
                      <svg width="80" height="80">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="6"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke={phase.color}
                          strokeWidth="6"
                          strokeDasharray={`${phase.progress * 2.01} 201`}
                          strokeLinecap="round"
                          transform="rotate(-90 40 40)"
                        />
                      </svg>
                      <div className={styles.progressText}>{phase.progress}%</div>
                    </div>
                  </div>
                </div>

                <div className={styles.milestones}>
                  {phase.milestones.map((milestone, j) => (
                    <div 
                      key={j} 
                      className={`${styles.milestone} ${styles[milestone.status]}`}
                    >
                      <div className={styles.milestoneIcon}>{milestone.icon}</div>
                      <div className={styles.milestoneTitle}>{milestone.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Upcoming Features */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Upcoming Features</h2>
          <div className={styles.featuresGrid}>
            {upcomingFeatures.map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className={styles.featureEta}>ETA: {feature.eta}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Input */}
        <section className={styles.communitySection}>
          <div className={styles.communityCard}>
            <h2>Shape the Future</h2>
            <p>Your feedback drives our development. Join our Discord to suggest features, vote on priorities, and influence the roadmap.</p>
            <button 
              className={styles.communityButton}
              onClick={() => alert('Discord community coming soon! Follow us on social media for updates.')}
            >
              Join Community
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
