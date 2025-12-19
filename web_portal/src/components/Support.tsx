import { useState } from 'react';
import styles from './Support.module.css';

export function Support() {
  const [activeCategory, setActiveCategory] = useState('gameplay');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'gameplay',
    subject: '',
    message: ''
  });

  const faqCategories = {
    gameplay: [
      {
        question: 'How do I start playing SuiHarvest?',
        answer: 'Connect your Sui wallet, purchase a daily contract for 0.75 SUI, then gather resources to fulfill contract requirements. Complete contracts before midnight UTC to earn rewards.'
      },
      {
        question: 'What happens if I don\'t complete my contract?',
        answer: 'Uncompleted contracts expire at midnight UTC. Your entry fee is not refunded, and any gathered resources are burned. Always plan your stamina usage carefully!'
      },
      {
        question: 'How does stamina work?',
        answer: 'You start each day with 50 stamina points. Different resources require different stamina amounts (crops: 1-2, wood: 2-3, stone: 3-4, iron: 4-5). Stamina resets daily at midnight UTC.'
      },
      {
        question: 'Can I play multiple contracts per day?',
        answer: 'Yes! You can purchase and complete as many contracts as you want in a 24-hour period. Each contract costs 0.75 SUI and has its own requirements.'
      }
    ],
    wallet: [
      {
        question: 'Which wallets are supported?',
        answer: 'We support all major Sui wallets including Sui Wallet, Suiet, Ethos Wallet, and Martian Wallet. Make sure your wallet is installed and has SUI tokens.'
      },
      {
        question: 'How do I get SUI tokens?',
        answer: 'Purchase SUI from exchanges like Binance, KuCoin, or OKX. You can also use decentralized exchanges like Cetus or Turbos on the Sui network.'
      },
      {
        question: 'Are my funds safe?',
        answer: 'Absolutely. All transactions happen on-chain through audited smart contracts. We never hold your funds—everything is managed by the Sui blockchain.'
      },
      {
        question: 'Why isn\'t my wallet connecting?',
        answer: 'Ensure your wallet extension is installed, unlocked, and connected to Sui mainnet. Try refreshing the page or switching wallet providers if issues persist.'
      }
    ],
    rewards: [
      {
        question: 'How are rewards calculated?',
        answer: '90% of all entry fees go to the prize pool. Top performers earn the largest shares: 1st place (30%), 2nd (20%), 3rd (15%), 4th-10th (25% total), others (10%).'
      },
      {
        question: 'When do I receive my rewards?',
        answer: 'Rewards are distributed automatically at midnight UTC when the daily cycle resets. Check your wallet for instant payout confirmation.'
      },
      {
        question: 'What is the Fame system?',
        answer: 'Fame points are earned by completing contracts and ranking high on leaderboards. Accumulate Fame to unlock future features like exclusive contracts and NFT rewards.'
      },
      {
        question: 'Can I withdraw my earnings immediately?',
        answer: 'Yes! All rewards are paid directly to your wallet on-chain. You have full control and can transfer or trade your SUI anytime.'
      }
    ],
    technical: [
      {
        question: 'Is the game on mobile?',
        answer: 'Not yet! Mobile apps for iOS and Android are planned for Q2 2025. For now, play via desktop browser with your wallet extension.'
      },
      {
        question: 'What are gas fees?',
        answer: 'Sui has extremely low gas fees (usually <0.001 SUI per transaction). You\'ll pay small fees for contract purchases, submissions, and other on-chain actions.'
      },
      {
        question: 'Where can I view my transactions?',
        answer: 'Visit Sui Explorer (suiscan.xyz or suivision.xyz) and search your wallet address to see all on-chain activity including contracts, rewards, and fees.'
      },
      {
        question: 'How can I report bugs?',
        answer: 'Join our Discord or email support@suiharvest.com with detailed descriptions, screenshots, and your wallet address. We actively fix issues and reward helpful reports.'
      }
    ]
  };

  const troubleshooting = [
    {
      issue: 'Wallet Won\'t Connect',
      icon: '🔌',
      steps: [
        'Ensure wallet extension is installed and unlocked',
        'Check you\'re on Sui Mainnet (not testnet)',
        'Refresh the page and try again',
        'Try a different supported wallet',
        'Clear browser cache and cookies'
      ]
    },
    {
      issue: 'Transaction Failed',
      icon: '❌',
      steps: [
        'Check you have enough SUI for gas fees',
        'Verify contract hasn\'t expired',
        'Ensure all requirements are met',
        'Wait a moment and retry',
        'Check Sui network status'
      ]
    },
    {
      issue: 'Resources Not Showing',
      icon: '📦',
      steps: [
        'Refresh the page',
        'Check transaction confirmation on explorer',
        'Verify you\'re logged into correct wallet',
        'Clear browser cache',
        'Contact support if issue persists'
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We\'ll respond within 24 hours. For urgent issues, join our Discord.');
    setFormData({
      name: '',
      email: '',
      category: 'gameplay',
      subject: '',
      message: ''
    });
  };

  return (
    <div className={styles.supportContainer}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          <h1>Support Center</h1>
          <p>Get help with gameplay, technical issues, and account management</p>
        </div>

        {/* Quick Links */}
        <section className={styles.quickLinks}>
          <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
            <div className={styles.quickIcon}>📚</div>
            <div>Documentation</div>
          </a>
          <button onClick={() => alert('Discord community coming soon!')} className={styles.quickLink}>
            <div className={styles.quickIcon}>💬</div>
            <div>Discord Community</div>
          </button>
          <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
            <div className={styles.quickIcon}>🐛</div>
            <div>Report Bug</div>
          </a>
          <a href="mailto:support@suiharvest.com" className={styles.quickLink}>
            <div className={styles.quickIcon}>📧</div>
            <div>Email Support</div>
          </a>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          
          <div className={styles.faqCategories}>
            {Object.keys(faqCategories).map((category) => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenFaq(null);
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.faqList}>
            {faqCategories[activeCategory as keyof typeof faqCategories].map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.faqIcon} ${openFaq === i ? styles.open : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className={styles.troubleshootingSection}>
          <h2 className={styles.sectionTitle}>Common Issues</h2>
          <div className={styles.troubleshootingGrid}>
            {troubleshooting.map((item, i) => (
              <div key={i} className={styles.troubleCard}>
                <div className={styles.troubleIcon}>{item.icon}</div>
                <h3>{item.issue}</h3>
                <ol className={styles.troubleSteps}>
                  {item.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Contact Support</h2>
          <div className={styles.contactCard}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="gameplay">Gameplay</option>
                    <option value="wallet">Wallet & Payments</option>
                    <option value="technical">Technical Issues</option>
                    <option value="rewards">Rewards & Payouts</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief description"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
