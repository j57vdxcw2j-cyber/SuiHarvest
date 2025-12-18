import styles from './Legal.module.css';

export function License() {
  return (
    <div className={styles.legalContainer}>
      <div className="container">
        <div className={styles.legalContent}>
          <h1>Open Source License</h1>
          <p className={styles.lastUpdated}>Last Updated: December 17, 2024</p>

          <section>
            <h2>1. License Overview</h2>
            <p>
              SuiHarvest smart contracts and certain components are released under the <strong>MIT License</strong>, 
              promoting transparency, community contributions, and trust in our blockchain infrastructure.
            </p>
          </section>

          <section>
            <h2>2. MIT License</h2>
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px', 
              padding: '24px', 
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '24px'
            }}>
              <p>MIT License</p>
              <p>Copyright (c) 2024 SuiHarvest</p>
              <p style={{ marginTop: '16px' }}>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>
              <p style={{ marginTop: '16px' }}>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p style={{ marginTop: '16px' }}>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </section>

          <section>
            <h2>3. What's Open Source</h2>
            <p>The following components are available under the MIT License:</p>
            
            <h3>3.1 Smart Contracts</h3>
            <ul>
              <li><strong>Inventory Contract:</strong> Manages player resources and items</li>
              <li><strong>Trader Contract:</strong> Handles contract purchases and reward distribution</li>
              <li><strong>Game Logic:</strong> Core gameplay mechanics and validation</li>
            </ul>

            <h3>3.2 SDKs and Tools</h3>
            <ul>
              <li>TypeScript SDK for contract interaction</li>
              <li>Testing frameworks and utilities</li>
              <li>Deployment scripts and documentation</li>
            </ul>

            <h3>3.3 Documentation</h3>
            <ul>
              <li>API reference and integration guides</li>
              <li>Smart contract architecture documentation</li>
              <li>Developer tutorials and examples</li>
            </ul>
          </section>

          <section>
            <h2>4. What's Not Open Source</h2>
            <p>The following remain proprietary:</p>
            <ul>
              <li><strong>Web Frontend:</strong> UI/UX design, components, and assets (copyright protected)</li>
              <li><strong>Game Assets:</strong> Graphics, characters, icons, and visual designs</li>
              <li><strong>Brand Identity:</strong> Logo, name, trademarks, and marketing materials</li>
              <li><strong>Backend Services:</strong> Off-chain infrastructure, APIs, and databases</li>
            </ul>
          </section>

          <section>
            <h2>5. Using Our Code</h2>
            <h3>5.1 Permissions</h3>
            <p>Under the MIT License, you are free to:</p>
            <ul>
              <li>Use the code for personal or commercial projects</li>
              <li>Modify and adapt the code for your needs</li>
              <li>Distribute original or modified versions</li>
              <li>Include the code in proprietary software</li>
              <li>Fork the repository and build on top</li>
            </ul>

            <h3>5.2 Requirements</h3>
            <p>You must:</p>
            <ul>
              <li>Include the original MIT License text in all copies</li>
              <li>Include the copyright notice</li>
              <li>Provide attribution to SuiHarvest</li>
            </ul>

            <h3>5.3 Limitations</h3>
            <p>The license does NOT grant:</p>
            <ul>
              <li>Rights to use SuiHarvest trademarks or branding</li>
              <li>Warranty or liability coverage (software is "AS IS")</li>
              <li>Patent rights (if applicable)</li>
              <li>Rights to proprietary components listed in Section 4</li>
            </ul>
          </section>

          <section>
            <h2>6. Contributing</h2>
            <p>We welcome community contributions! By submitting code, you agree that:</p>
            <ul>
              <li>Your contributions are licensed under the same MIT License</li>
              <li>You have the right to submit the contribution</li>
              <li>You grant SuiHarvest a perpetual, irrevocable license to use your contribution</li>
            </ul>

            <h3>6.1 How to Contribute</h3>
            <ol>
              <li>Fork the repository on GitHub</li>
              <li>Create a feature branch</li>
              <li>Make your changes with clear commit messages</li>
              <li>Submit a pull request with detailed description</li>
              <li>Respond to code review feedback</li>
            </ol>

            <h3>6.2 Contribution Guidelines</h3>
            <ul>
              <li>Follow existing code style and conventions</li>
              <li>Write comprehensive tests</li>
              <li>Update documentation as needed</li>
              <li>Ensure smart contracts pass security checks</li>
              <li>Be respectful in all interactions</li>
            </ul>
          </section>

          <section>
            <h2>7. Third-Party Licenses</h2>
            <p>SuiHarvest uses third-party open-source libraries. Major dependencies include:</p>
            <ul>
              <li><strong>Sui SDK:</strong> Apache 2.0 License</li>
              <li><strong>React:</strong> MIT License</li>
              <li><strong>TypeScript:</strong> Apache 2.0 License</li>
              <li><strong>Vite:</strong> MIT License</li>
            </ul>
            <p>
              See <code>package.json</code> and <code>Move.toml</code> for complete dependency lists. 
              All third-party licenses are respected and included in distributions.
            </p>
          </section>

          <section>
            <h2>8. Security Disclosures</h2>
            <p>
              If you discover a security vulnerability in our open-source code, please report it responsibly:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:security@suiharvest.com">security@suiharvest.com</a></li>
              <li><strong>Do not</strong> open public GitHub issues for security vulnerabilities</li>
              <li>Provide detailed reproduction steps and impact assessment</li>
              <li>Allow reasonable time for us to address the issue before public disclosure</li>
            </ul>
            <p>We may offer bug bounties for significant security findings.</p>
          </section>

          <section>
            <h2>9. Repository Links</h2>
            <p>Access our open-source code:</p>
            <ul>
              <li>
                <strong>GitHub Repository:</strong> 
                <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer"> 
                  github.com/j57vdxcw2j-cyber/SuiHarvest
                </a>
              </li>
              <li><strong>Smart Contracts:</strong> <code>/sui_contracts</code> directory</li>
              <li><strong>Documentation:</strong> <code>/docs</code> directory</li>
              <li><strong>Examples:</strong> <code>/examples</code> directory</li>
            </ul>
          </section>

          <section>
            <h2>10. Commercial Use</h2>
            <p>
              You may use our open-source code for commercial purposes under the MIT License. However:
            </p>
            <ul>
              <li>You cannot use SuiHarvest branding or imply endorsement</li>
              <li>You must clearly differentiate your project from SuiHarvest</li>
              <li>Trademark and copyright laws still apply</li>
              <li>Consider ethical implications when forking gameplay mechanics</li>
            </ul>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>For license questions or partnership inquiries:</p>
            <ul>
              <li>Email: <a href="mailto:legal@suiharvest.com">legal@suiharvest.com</a></li>
              <li>GitHub Discussions: <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest/discussions" target="_blank" rel="noopener noreferrer">Community Forum</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
