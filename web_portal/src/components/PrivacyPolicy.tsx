import styles from './Legal.module.css';

export function PrivacyPolicy() {
  return (
    <div className={styles.legalContainer}>
      <div className="container">
        <div className={styles.legalContent}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: December 17, 2024</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to SuiHarvest ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our blockchain-based gaming platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Wallet Information</h3>
            <p>
              When you connect your Sui wallet to our platform, we collect your public wallet address. This information is necessary 
              to interact with our smart contracts and process game transactions. We <strong>never</strong> have access to your private keys.
            </p>

            <h3>2.2 Gameplay Data</h3>
            <p>We collect and store on-chain data related to your gameplay, including:</p>
            <ul>
              <li>Contract purchases and completions</li>
              <li>Resource gathering activities</li>
              <li>Transaction history</li>
              <li>Leaderboard rankings and Fame points</li>
              <li>Reward distributions</li>
            </ul>

            <h3>2.3 Technical Data</h3>
            <p>We automatically collect certain technical information when you use our platform:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address (anonymized)</li>
              <li>Time zone and location (approximate)</li>
              <li>Usage patterns and performance metrics</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul>
              <li><strong>Game Operations:</strong> Processing transactions, managing contracts, and distributing rewards</li>
              <li><strong>Platform Improvement:</strong> Analyzing usage patterns to enhance gameplay and fix bugs</li>
              <li><strong>Communication:</strong> Sending updates about gameplay, rewards, and platform changes</li>
              <li><strong>Security:</strong> Detecting and preventing fraud, abuse, or unauthorized access</li>
              <li><strong>Compliance:</strong> Meeting legal obligations and enforcing our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2>4. Blockchain Transparency</h2>
            <p>
              <strong>Important:</strong> All gameplay transactions are recorded on the Sui blockchain, which is public and permanent. 
              Your wallet address and transaction history are visible to anyone using blockchain explorers. This transparency is 
              fundamental to blockchain technology and cannot be altered.
            </p>
          </section>

          <section>
            <h2>5. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal data. We may share information only in the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party services that help operate our platform (hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
            </ul>
          </section>

          <section>
            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption, secure protocols, 
              and regular security audits. However, no system is 100% secure. We encourage you to use strong wallet passwords 
              and enable two-factor authentication where available.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request copies of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your off-chain data (on-chain data is immutable)</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Data Portability:</strong> Request transfer of your data in a common format</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:privacy@suiharvest.com">privacy@suiharvest.com</a></p>
          </section>

          <section>
            <h2>8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience. You can control cookies through your browser settings. 
              For more details, see our <a href="#cookies">Cookie Policy</a>.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              Our platform is not intended for users under 18 years of age. We do not knowingly collect data from children. 
              If you believe we have inadvertently collected data from a minor, please contact us immediately.
            </p>
          </section>

          <section>
            <h2>10. International Users</h2>
            <p>
              Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place 
              to protect your information in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. Significant changes will be announced on our platform and via email 
              (if you've subscribed). Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>12. Contact Us</h2>
            <p>For questions or concerns about this privacy policy, contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:privacy@suiharvest.com">privacy@suiharvest.com</a></li>
              <li>Discord: Join our community server (link in footer)</li>
              <li>GitHub: <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer">github.com/j57vdxcw2j-cyber/SuiHarvest</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
