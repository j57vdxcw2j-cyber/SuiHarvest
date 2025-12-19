import styles from './Legal.module.css';

export function CookiePolicy() {
  return (
    <div className={styles.legalContainer}>
      <div className="container">
        <div className={styles.legalContent}>
          <h1>Cookie Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: December 17, 2024</p>

          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help websites remember 
              your preferences, improve functionality, and analyze usage patterns. Cookies are widely used to make websites 
              work more efficiently and provide a better user experience.
            </p>
          </section>

          <section>
            <h2>2. How We Use Cookies</h2>
            <p>SuiHarvest uses cookies for the following purposes:</p>
            
            <h3>2.1 Essential Cookies (Required)</h3>
            <p>These cookies are necessary for the platform to function properly:</p>
            <ul>
              <li><strong>Wallet Connection:</strong> Remembering your connected Sui wallet across sessions</li>
              <li><strong>Session Management:</strong> Maintaining your login state and gameplay session</li>
              <li><strong>Security:</strong> Preventing fraud and ensuring secure transactions</li>
              <li><strong>Load Balancing:</strong> Distributing traffic efficiently across our infrastructure</li>
            </ul>
            <p>You cannot disable essential cookies as they are required for platform operation.</p>

            <h3>2.2 Performance Cookies (Optional)</h3>
            <p>These cookies help us understand how users interact with the platform:</p>
            <ul>
              <li>Tracking page views and navigation patterns</li>
              <li>Measuring loading times and performance metrics</li>
              <li>Identifying technical errors and crashes</li>
              <li>Analyzing which features are most popular</li>
            </ul>
            <p>We use this data to improve gameplay experience and fix bugs.</p>

            <h3>2.3 Functionality Cookies (Optional)</h3>
            <p>These cookies enhance your experience with personalized features:</p>
            <ul>
              <li>Remembering your display preferences (theme, language)</li>
              <li>Storing UI customizations and layout settings</li>
              <li>Recalling notification preferences</li>
              <li>Maintaining game-specific settings</li>
            </ul>

            <h3>2.4 Analytics Cookies (Optional)</h3>
            <p>We use third-party analytics tools to understand user behavior:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Website traffic and user demographics</li>
              <li><strong>Amplitude:</strong> In-game event tracking and player journeys</li>
              <li><strong>Mixpanel:</strong> Feature usage and conversion funnels</li>
            </ul>
            <p>Analytics data is anonymized and aggregated. We do not share personally identifiable information.</p>
          </section>

          <section>
            <h2>3. Third-Party Cookies</h2>
            <p>Some cookies are set by third-party services we use:</p>
            
            <h3>3.1 Sui Wallet Providers</h3>
            <p>
              Wallet extensions (Sui Wallet, Suiet, Ethos, Martian) may set their own cookies to manage wallet 
              connectivity and authentication. These are governed by their respective privacy policies.
            </p>

            <h3>3.2 Infrastructure Providers</h3>
            <p>
              Our hosting and CDN providers (Vercel, Cloudflare) use cookies for performance optimization and 
              security. These cookies are essential for platform delivery.
            </p>

            <h3>3.3 Social Media</h3>
            <p>
              If you interact with social sharing buttons (Twitter, Discord), those platforms may set cookies. 
              We do not control these third-party cookies.
            </p>
          </section>

          <section>
            <h2>4. Cookie Duration</h2>
            <p>Cookies have different lifespans:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 1 year)</li>
              <li><strong>Long-Term Cookies:</strong> Stay for up to 2 years for essential functionality</li>
            </ul>
          </section>

          <section>
            <h2>5. Managing Cookies</h2>
            <h3>5.1 Browser Settings</h3>
            <p>You can control cookies through your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>

            <h3>5.2 Opt-Out Options</h3>
            <p>For analytics cookies, you can opt out through these tools:</p>
            <ul>
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Browser Add-on</a></li>
              <li><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Opt-Out Page</a></li>
              <li><strong>Digital Advertising Alliance:</strong> <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Consumer Choice Tool</a></li>
            </ul>

            <h3>5.3 Impact of Disabling Cookies</h3>
            <p>Disabling certain cookies may affect platform functionality:</p>
            <ul>
              <li>You may need to reconnect your wallet frequently</li>
              <li>UI preferences and settings won't be saved</li>
              <li>Performance may degrade</li>
              <li>Some features may not work properly</li>
            </ul>
          </section>

          <section>
            <h2>6. Local Storage and Similar Technologies</h2>
            <p>
              In addition to cookies, we use browser local storage and session storage to cache game data and improve 
              performance. This includes:
            </p>
            <ul>
              <li>Cached blockchain data to reduce network calls</li>
              <li>Temporary gameplay state</li>
              <li>UI state and preferences</li>
              <li>Recently viewed content</li>
            </ul>
            <p>You can clear local storage through your browser's developer tools or privacy settings.</p>
          </section>

          <section>
            <h2>7. Updates to Cookie Policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in technology, regulations, or our practices. 
              Updates will be posted on this page with a new "Last Updated" date. Continued use of the platform 
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>For questions about our use of cookies, contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:privacy@suiharvest.com">privacy@suiharvest.com</a></li>
              <li>GitHub: <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer">github.com/j57vdxcw2j-cyber/SuiHarvest</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
