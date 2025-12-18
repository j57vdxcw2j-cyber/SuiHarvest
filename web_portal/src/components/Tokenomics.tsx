import { useState } from 'react';
import styles from './Tokenomics.module.css';

export function Tokenomics() {
  const [selectedMetric, setSelectedMetric] = useState('fee');

  const economicFlow = [
    { step: 'Player Entry', amount: '0.75 SUI', color: '#3B82F6' },
    { step: 'Platform Fee (10%)', amount: '0.075 SUI', color: '#EF4444' },
    { step: 'Prize Pool', amount: '0.675 SUI', color: '#10B981' },
  ];

  const feeBreakdown = [
    { category: 'Development', percentage: 40, amount: '0.03 SUI', color: '#3B82F6' },
    { category: 'Marketing', percentage: 25, amount: '0.019 SUI', color: '#8B5CF6' },
    { category: 'Operations', percentage: 20, amount: '0.015 SUI', color: '#10B981' },
    { category: 'Reserves', percentage: 15, amount: '0.011 SUI', color: '#F59E0B' },
  ];

  const rewardTiers = [
    { rank: '1st Place', percentage: 30, multiplier: '2.7x', sui: '~0.202 SUI', color: '#FFD700' },
    { rank: '2nd Place', percentage: 20, multiplier: '1.8x', sui: '~0.135 SUI', color: '#C0C0C0' },
    { rank: '3rd Place', percentage: 15, multiplier: '1.35x', sui: '~0.101 SUI', color: '#CD7F32' },
    { rank: '4th-10th', percentage: 25, multiplier: '1.0x', sui: '~0.024 SUI each', color: '#6B7280' },
    { rank: 'Others', percentage: 10, multiplier: '0.5x', sui: 'Varies', color: '#9CA3AF' },
  ];

  const metrics = {
    fee: {
      title: 'Fee Structure',
      subtitle: '10% platform fee on every contract',
      data: feeBreakdown,
      type: 'pie'
    },
    rewards: {
      title: 'Reward Distribution',
      subtitle: '90% returned to players',
      data: rewardTiers,
      type: 'bar'
    }
  };

  return (
    <div className={styles.tokenomicsContainer}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          <h1>Tokenomics</h1>
          <p>Transparent, fair, and sustainable economic model powered by the Sui blockchain</p>
        </div>

        {/* Economic Flow */}
        <section className={styles.flowSection}>
          <h2 className={styles.sectionTitle}>Economic Flow</h2>
          <div className={styles.flowDiagram}>
            {economicFlow.map((item, i) => (
              <div key={i} className={styles.flowWrapper}>
                <div 
                  className={styles.flowStep}
                  style={{ borderColor: item.color }}
                >
                  <div className={styles.flowLabel}>{item.step}</div>
                  <div 
                    className={styles.flowAmount}
                    style={{ color: item.color }}
                  >
                    {item.amount}
                  </div>
                </div>
                {i < economicFlow.length - 1 && (
                  <div className={styles.flowArrow}>→</div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.flowNote}>
            <strong>90% to players</strong> • 10% platform fee • Instant payouts via smart contract
          </div>
        </section>

        {/* Metrics Tabs */}
        <section className={styles.metricsSection}>
          <div className={styles.metricsTabs}>
            <button 
              className={`${styles.tab} ${selectedMetric === 'fee' ? styles.active : ''}`}
              onClick={() => setSelectedMetric('fee')}
            >
              Fee Breakdown
            </button>
            <button 
              className={`${styles.tab} ${selectedMetric === 'rewards' ? styles.active : ''}`}
              onClick={() => setSelectedMetric('rewards')}
            >
              Reward Distribution
            </button>
          </div>

          <div className={styles.metricsContent}>
            <h2>{metrics[selectedMetric as keyof typeof metrics].title}</h2>
            <p className={styles.metricsSubtitle}>{metrics[selectedMetric as keyof typeof metrics].subtitle}</p>

            {selectedMetric === 'fee' && (
              <div className={styles.feeGrid}>
                {feeBreakdown.map((item, i) => (
                  <div key={i} className={styles.feeCard}>
                    <div 
                      className={styles.feeBar}
                      style={{ 
                        width: `${item.percentage}%`,
                        background: item.color
                      }}
                    />
                    <div className={styles.feeInfo}>
                      <div className={styles.feeCategory}>{item.category}</div>
                      <div className={styles.feeDetails}>
                        <span className={styles.feePercent}>{item.percentage}%</span>
                        <span className={styles.feeAmount}>{item.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedMetric === 'rewards' && (
              <div className={styles.rewardsTable}>
                <div className={styles.tableHeader}>
                  <div>Rank</div>
                  <div>Pool Share</div>
                  <div>Multiplier</div>
                  <div>Avg Reward</div>
                </div>
                {rewardTiers.map((tier, i) => (
                  <div key={i} className={styles.tableRow}>
                    <div className={styles.rankCell}>
                      <div 
                        className={styles.rankBadge}
                        style={{ background: tier.color }}
                      />
                      {tier.rank}
                    </div>
                    <div className={styles.percentCell}>{tier.percentage}%</div>
                    <div className={styles.multiplierCell}>{tier.multiplier}</div>
                    <div className={styles.suiCell}>{tier.sui}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Key Metrics */}
        <section className={styles.keyMetrics}>
          <h2 className={styles.sectionTitle}>Key Metrics</h2>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>💰</div>
              <div className={styles.metricValue}>0.75 SUI</div>
              <div className={styles.metricLabel}>Entry Fee</div>
              <div className={styles.metricDesc}>Daily contract cost</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📊</div>
              <div className={styles.metricValue}>10%</div>
              <div className={styles.metricLabel}>Platform Fee</div>
              <div className={styles.metricDesc}>For sustainability</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🎁</div>
              <div className={styles.metricValue}>90%</div>
              <div className={styles.metricLabel}>Player Rewards</div>
              <div className={styles.metricDesc}>Returned to winners</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>⚡</div>
              <div className={styles.metricValue}>Instant</div>
              <div className={styles.metricLabel}>Payouts</div>
              <div className={styles.metricDesc}>On-chain settlement</div>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className={styles.calculatorSection}>
          <h2 className={styles.sectionTitle}>ROI Calculator</h2>
          <div className={styles.calculator}>
            <div className={styles.calculatorNote}>
              <h3>Example Scenario</h3>
              <p>100 players, each paying 0.75 SUI</p>
              <div className={styles.calculation}>
                <div className={styles.calcRow}>
                  <span>Total Pool:</span>
                  <strong>75 SUI</strong>
                </div>
                <div className={styles.calcRow}>
                  <span>Platform Fee (10%):</span>
                  <strong>7.5 SUI</strong>
                </div>
                <div className={styles.calcRow}>
                  <span>Prize Pool:</span>
                  <strong>67.5 SUI</strong>
                </div>
                <div className={styles.calcDivider} />
                <div className={styles.calcRow}>
                  <span>1st Place (30%):</span>
                  <strong>20.25 SUI (27x ROI)</strong>
                </div>
                <div className={styles.calcRow}>
                  <span>2nd Place (20%):</span>
                  <strong>13.5 SUI (18x ROI)</strong>
                </div>
                <div className={styles.calcRow}>
                  <span>3rd Place (15%):</span>
                  <strong>10.125 SUI (13.5x ROI)</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency */}
        <section className={styles.transparencySection}>
          <h2 className={styles.sectionTitle}>Full Transparency</h2>
          <div className={styles.transparencyGrid}>
            <div className={styles.transparencyCard}>
              <div className={styles.transparencyIcon}>🔗</div>
              <h3>On-Chain Verification</h3>
              <p>All transactions recorded on Sui blockchain. Verify any contract, payment, or reward distribution via block explorer.</p>
            </div>
            <div className={styles.transparencyCard}>
              <div className={styles.transparencyIcon}>📜</div>
              <h3>Open Source Contracts</h3>
              <p>Smart contracts are public and auditable. Review the code on GitHub to understand exactly how funds flow.</p>
            </div>
            <div className={styles.transparencyCard}>
              <div className={styles.transparencyIcon}>⚖️</div>
              <h3>Fair Distribution</h3>
              <p>Automated reward calculations ensure fairness. No human intervention in payouts—pure algorithmic distribution.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
