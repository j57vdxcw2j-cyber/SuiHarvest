import styles from './Legal.module.css';

export function TermsOfService() {
  return (
    <div className={styles.legalContainer}>
      <div className="container">
        <div className={styles.legalContent}>
          <h1>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: December 17, 2024</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using SuiHarvest ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, you must not use the Platform. These Terms constitute a legally binding 
              agreement between you and SuiHarvest.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>You must meet the following requirements to use the Platform:</p>
            <ul>
              <li>Be at least 18 years of age or the legal age of majority in your jurisdiction</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using the Platform under applicable laws</li>
              <li>Comply with all local, state, national, and international laws</li>
            </ul>
            <p>
              <strong>Important:</strong> Blockchain gaming may be subject to gambling regulations in certain jurisdictions. 
              It is your responsibility to ensure your participation is legal in your location.
            </p>
          </section>

          <section>
            <h2>3. Platform Description</h2>
            <p>
              SuiHarvest is a blockchain-based skill game where players complete daily contracts by gathering resources. 
              Players pay an entry fee in SUI tokens, and rewards are distributed based on performance. The Platform operates 
              on the Sui blockchain, and all transactions are executed through smart contracts.
            </p>
          </section>

          <section>
            <h2>4. Wallet and Account Security</h2>
            <h3>4.1 Wallet Connection</h3>
            <p>
              You must connect a compatible Sui wallet to use the Platform. You are solely responsible for maintaining the 
              security of your wallet, including private keys, seed phrases, and passwords. We never have access to your 
              private keys.
            </p>

            <h3>4.2 Account Security</h3>
            <p>You agree to:</p>
            <ul>
              <li>Keep your wallet credentials confidential</li>
              <li>Use strong, unique passwords</li>
              <li>Enable two-factor authentication when available</li>
              <li>Immediately notify us of any unauthorized access</li>
              <li>Accept full responsibility for all activities conducted through your wallet</li>
            </ul>

            <h3>4.3 Lost Credentials</h3>
            <p>
              <strong>We cannot recover lost private keys or seed phrases.</strong> If you lose access to your wallet, 
              we cannot retrieve your funds or account data. Blockchain transactions are irreversible.
            </p>
          </section>

          <section>
            <h2>5. Gameplay and Contracts</h2>
            <h3>5.1 Daily Contracts</h3>
            <p>
              Each contract costs 0.75 SUI and is valid for 24 hours (midnight to midnight UTC). Uncompleted contracts 
              expire without refund. All gathered resources are burned at daily reset.
            </p>

            <h3>5.2 Stamina System</h3>
            <p>
              Players receive 50 stamina points daily. Resource gathering consumes stamina. Stamina resets at midnight UTC. 
              No carryover or additional stamina is provided beyond daily allocation.
            </p>

            <h3>5.3 Fair Play</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use bots, scripts, or automated tools</li>
              <li>Exploit bugs or glitches for unfair advantage</li>
              <li>Manipulate smart contracts or blockchain transactions</li>
              <li>Create multiple accounts to abuse rewards</li>
              <li>Collude with other players to manipulate outcomes</li>
            </ul>
            <p>
              Violations may result in permanent ban, reward forfeiture, and legal action.
            </p>
          </section>

          <section>
            <h2>6. Fees and Payments</h2>
            <h3>6.1 Entry Fees</h3>
            <p>
              Each contract purchase requires payment of 0.75 SUI plus gas fees. Entry fees are non-refundable, 
              regardless of contract completion.
            </p>

            <h3>6.2 Platform Fee</h3>
            <p>
              10% of all entry fees are retained as platform fees for development, operations, and sustainability. 
              The remaining 90% forms the prize pool distributed to players.
            </p>

            <h3>6.3 Gas Fees</h3>
            <p>
              All blockchain transactions incur gas fees paid to network validators. Gas fees are separate from 
              entry and platform fees and vary based on network conditions.
            </p>

            <h3>6.4 Reward Distribution</h3>
            <p>
              Rewards are distributed automatically at midnight UTC based on performance rankings. Distribution 
              percentages: 1st (30%), 2nd (20%), 3rd (15%), 4th-10th (25% total), Others (10%).
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              All content, including graphics, code, designs, and text, is owned by SuiHarvest or licensed to us. 
              You may not copy, reproduce, distribute, or create derivative works without explicit permission.
            </p>
            <p>
              User-generated content (e.g., forum posts, Discord messages) remains your property, but you grant us 
              a worldwide, royalty-free license to use, display, and distribute such content.
            </p>
          </section>

          <section>
            <h2>8. Disclaimers</h2>
            <h3>8.1 No Guarantees</h3>
            <p>
              The Platform is provided "AS IS" without warranties of any kind. We do not guarantee uninterrupted access, 
              error-free operation, or specific results. Blockchain networks may experience delays or outages beyond our control.
            </p>

            <h3>8.2 Investment Risk</h3>
            <p>
              <strong>SuiHarvest is not an investment vehicle.</strong> Entry fees are payments for gameplay, not investments. 
              There is no guarantee of profit, and you may lose your entire entry fee. Cryptocurrency values fluctuate.
            </p>

            <h3>8.3 Tax Obligations</h3>
            <p>
              You are responsible for determining and paying all applicable taxes on rewards received. We do not provide 
              tax advice. Consult a tax professional in your jurisdiction.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SuiHarvest and its team members shall not be liable for:
            </p>
            <ul>
              <li>Loss of funds due to user error, wallet compromise, or phishing attacks</li>
              <li>Smart contract vulnerabilities or exploits</li>
              <li>Blockchain network failures or congestion</li>
              <li>Changes in cryptocurrency value</li>
              <li>Third-party actions or services</li>
              <li>Any indirect, consequential, or punitive damages</li>
            </ul>
            <p>
              Our total liability shall not exceed the entry fees you paid in the 30 days preceding the claim.
            </p>
          </section>

          <section>
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SuiHarvest and its team from any claims, damages, or expenses 
              arising from your use of the Platform, violation of these Terms, or infringement of third-party rights.
            </p>
          </section>

          <section>
            <h2>11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Platform at any time for violations of 
              these Terms or for any reason at our sole discretion. Upon termination, you forfeit all rights to 
              uncompleted contracts and unclaimed rewards.
            </p>
          </section>

          <section>
            <h2>12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Changes take effect upon posting. Continued use after changes 
              constitutes acceptance. We will notify users of material changes via platform announcements.
            </p>
          </section>

          <section>
            <h2>13. Dispute Resolution</h2>
            <p>
              Any disputes shall be resolved through binding arbitration in accordance with the rules of the 
              American Arbitration Association. You waive the right to participate in class actions.
            </p>
          </section>

          <section>
            <h2>14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law provisions. 
              Jurisdiction and venue shall be in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2>15. Contact Information</h2>
            <p>For questions about these Terms, contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:legal@suiharvest.com">legal@suiharvest.com</a></li>
              <li>GitHub: <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer">github.com/j57vdxcw2j-cyber/SuiHarvest</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
