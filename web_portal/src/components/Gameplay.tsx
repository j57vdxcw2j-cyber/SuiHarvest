import { useState } from 'react';
import styles from './Gameplay.module.css';

export function Gameplay() {
  const [activeStep, setActiveStep] = useState(0);

  const dailyCycle = [
    {
      time: 'Morning',
      title: 'Purchase Daily Contract',
      icon: '🌅',
      description: 'Start your day by purchasing a contract for 0.75 SUI. Each contract specifies resource requirements and potential rewards.',
      details: [
        'Browse available contracts',
        'Select based on difficulty and rewards',
        'Pay 0.75 SUI entry fee',
        'Contract is stored on-chain',
        'Valid for 24 hours only'
      ],
      color: 'rgba(251, 191, 36, 0.2)'
    },
    {
      time: 'Day',
      title: 'Gather Resources',
      icon: '⚒️',
      description: 'Use your 50 stamina points strategically to farm, mine, and collect resources across different locations.',
      details: [
        'Visit Farm for crops (1-2 stamina)',
        'Mine Stone at Quarry (3-4 stamina)',
        'Chop Wood in Forest (2-3 stamina)',
        'Extract Iron from Deep Mines (4-5 stamina)',
        'Craft items and tools',
        'Trade with NPCs for better rates'
      ],
      color: 'rgba(59, 130, 246, 0.2)'
    },
    {
      time: 'Evening',
      title: 'Complete Contract',
      icon: '📦',
      description: 'Submit your gathered resources to fulfill contract requirements and claim your rewards.',
      details: [
        'Check contract progress',
        'Ensure all requirements met',
        'Submit resources on-chain',
        'Receive SUI rewards instantly',
        'Earn Fame points for completion',
        'View transaction on block explorer'
      ],
      color: 'rgba(168, 85, 247, 0.2)'
    },
    {
      time: 'Night',
      title: 'Daily Reset',
      icon: '🌙',
      description: 'At midnight UTC, all items reset. Completed contracts pay out, unclaimed items are burned.',
      details: [
        'Automatic reset at 00:00 UTC',
        'All inventory items burned',
        'Rewards credited to wallet',
        'Stamina restored to 50',
        'New contracts available',
        'Leaderboard updated'
      ],
      color: 'rgba(99, 102, 241, 0.2)'
    }
  ];

  const resources = [
    {
      name: 'Crops',
      icon: '🌾',
      location: 'Farm',
      stamina: '1-2',
      value: 'Low',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'
    },
    {
      name: 'Wood',
      icon: '🌲',
      location: 'Forest',
      stamina: '2-3',
      value: 'Medium',
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=300&fit=crop'
    },
    {
      name: 'Stone',
      icon: '🪨',
      location: 'Quarry',
      stamina: '3-4',
      value: 'Medium',
      image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=300&fit=crop'
    },
    {
      name: 'Iron',
      icon: '⚒️',
      location: 'Mine',
      stamina: '4-5',
      value: 'High',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop'
    }
  ];

  const tips = [
    {
      title: 'Plan Before Acting',
      icon: '📋',
      description: 'Calculate your stamina usage before starting. Map out the most efficient path to meet contract requirements.'
    },
    {
      title: 'Time Management',
      icon: '⏰',
      description: 'Complete contracts early in the day. This gives you time to gather extra resources for bonus rewards.'
    },
    {
      title: 'Resource Priority',
      icon: '🎯',
      description: 'Focus on high-value resources when you have stamina to spare. Iron and rare crops yield better profits.'
    },
    {
      title: 'Contract Selection',
      icon: '📜',
      description: 'Match contracts to your playstyle. Beginners should start with simple crop-focused contracts.'
    },
    {
      title: 'Track Patterns',
      icon: '📊',
      description: 'Observe resource spawn rates and market prices. Patterns emerge that skilled players can exploit.'
    },
    {
      title: 'Community Learning',
      icon: '👥',
      description: 'Join Discord to share strategies. Top players often reveal tactics after competition ends.'
    }
  ];

  return (
    <div className={styles.gameplayContainer}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          <h1>How to Play SuiHarvest</h1>
          <p>Master the 24-hour cycle, optimize your strategy, and earn real SUI tokens through skilled gameplay</p>
        </div>

        {/* Daily Cycle Timeline */}
        <section className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>The Daily Cycle</h2>
          <div className={styles.timeline}>
            {dailyCycle.map((step, i) => (
              <div 
                key={i} 
                className={`${styles.timelineStep} ${activeStep === i ? styles.active : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: step.color }}>
                    {step.icon}
                  </div>
                  <div className={styles.stepInfo}>
                    <div className={styles.stepTime}>{step.time}</div>
                    <div className={styles.stepTitle}>{step.title}</div>
                  </div>
                </div>
                {activeStep === i && (
                  <div className={styles.stepDetails}>
                    <p>{step.description}</p>
                    <ul>
                      {step.details.map((detail, j) => (
                        <li key={j}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Resources Guide */}
        <section className={styles.resourcesSection}>
          <h2 className={styles.sectionTitle}>Resource Guide</h2>
          <div className={styles.resourcesGrid}>
            {resources.map((resource, i) => (
              <div key={i} className={styles.resourceCard}>
                <div className={styles.resourceImage}>
                  <img src={resource.image} alt={resource.name} />
                </div>
                <div className={styles.resourceContent}>
                  <div className={styles.resourceIcon}>{resource.icon}</div>
                  <h3>{resource.name}</h3>
                  <div className={styles.resourceStats}>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Location</span>
                      <span className={styles.statValue}>{resource.location}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Stamina</span>
                      <span className={styles.statValue}>{resource.stamina}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Value</span>
                      <span className={styles.statValue}>{resource.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips & Strategies */}
        <section className={styles.tipsSection}>
          <h2 className={styles.sectionTitle}>Pro Tips & Strategies</h2>
          <div className={styles.tipsGrid}>
            {tips.map((tip, i) => (
              <div key={i} className={styles.tipCard}>
                <div className={styles.tipIcon}>{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorial Placeholder */}
        <section className={styles.videoSection}>
          <h2 className={styles.sectionTitle}>Video Tutorial</h2>
          <div className={styles.videoPlaceholder}>
            <div className={styles.playButton}>▶</div>
            <p>Coming Soon: Complete gameplay walkthrough</p>
          </div>
        </section>
      </div>
    </div>
  );
}
