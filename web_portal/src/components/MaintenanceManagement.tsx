import { useState } from 'react';
import styles from './MaintenanceManagement.module.css';

/**
 * Maintenance Management Page - System Controls
 */
export function MaintenanceManagement() {
  const [isGameEnabled, setIsGameEnabled] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleGame = () => {
    setShowConfirm(true);
  };

  const confirmToggle = () => {
    setIsGameEnabled(!isGameEnabled);
    setShowConfirm(false);
    // TODO: Update Firebase game state
  };

  const cancelToggle = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Game Maintenance</h1>
        <p>Control system availability and manage maintenance windows</p>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <h2>Confirm Action</h2>
            <p>
              Are you sure you want to {isGameEnabled ? 'disable' : 'enable'} the game?
              {isGameEnabled && ' Players will not be able to start new game sessions.'}
            </p>
            <div className={styles.confirmButtons}>
              <button className={styles.confirmCancel} onClick={cancelToggle}>
                Cancel
              </button>
              <button className={styles.confirmOk} onClick={confirmToggle}>
                {isGameEnabled ? 'Disable Game' : 'Enable Game'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {/* Game Status Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Game Status</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statusDisplay}>
              <div className={styles.statusInfo}>
                <h3>Current Status</h3>
                <p className={isGameEnabled ? styles.statusEnabled : styles.statusDisabled}>
                  {isGameEnabled ? 'ENABLED - Game is Active' : 'DISABLED - Maintenance Mode'}
                </p>
              </div>
            </div>

            <button
              className={isGameEnabled ? styles.disableButton : styles.enableButton}
              onClick={handleToggleGame}
            >
              {isGameEnabled ? 'Disable Game' : 'Enable Game'}
            </button>

            <div className={styles.statusNote}>
              {isGameEnabled ? (
                <>
                  <strong>Disabling the game will:</strong>
                  <ul>
                    <li>Prevent new players from starting sessions</li>
                    <li>Display maintenance message to users</li>
                    <li>Keep existing sessions active until completion</li>
                  </ul>
                </>
              ) : (
                <>
                  <strong>Enabling the game will:</strong>
                  <ul>
                    <li>Allow players to start new game sessions</li>
                    <li>Resume normal blockchain transactions</li>
                    <li>Remove maintenance message</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Maintenance Message */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Maintenance Message</h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              Configure the message shown to users when game is disabled
            </p>
            <div className={styles.inputGroup}>
              <label>Message Text</label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="e.g., The game is temporarily down for maintenance. We'll be back online shortly!"
                rows={4}
              />
            </div>
            <button className={styles.saveButton}>
              Save Message
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>System Health</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.healthItem}>
              <div className={styles.healthDetails}>
                <strong>Blockchain Connection</strong>
                <p>Connected to Sui Testnet</p>
              </div>
              <div className={styles.healthStatus}>
                <span className={styles.statusGood}>Healthy</span>
              </div>
            </div>

            <div className={styles.healthItem}>
              <div className={styles.healthDetails}>
                <strong>Firebase Database</strong>
                <p>All services operational</p>
              </div>
              <div className={styles.healthStatus}>
                <span className={styles.statusGood}>Healthy</span>
              </div>
            </div>

            <div className={styles.healthItem}>
              <div className={styles.healthDetails}>
                <strong>Smart Contract</strong>
                <p>Treasury functional</p>
              </div>
              <div className={styles.healthStatus}>
                <span className={styles.statusGood}>Healthy</span>
              </div>
            </div>

            <div className={styles.healthItem}>
              <div className={styles.healthDetails}>
                <strong>API Response Time</strong>
                <p>Slightly elevated</p>
              </div>
              <div className={styles.healthStatus}>
                <span className={styles.statusWarning}>Warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>System Actions</h2>
          </div>
          <div className={styles.cardContent}>
            <button className={styles.actionButton}>
              <div>
                <strong>Clear Cache</strong>
                <p>Reset application cache</p>
              </div>
            </button>

            <button className={styles.actionButton}>
              <div>
                <strong>View Logs</strong>
                <p>Access system error logs</p>
              </div>
            </button>

            <button className={styles.actionButton}>
              <div>
                <strong>Performance Report</strong>
                <p>Generate system metrics</p>
              </div>
            </button>

            <button className={styles.actionButton}>
              <div>
                <strong>Test Notifications</strong>
                <p>Send test broadcast</p>
              </div>
            </button>
          </div>
        </div>

        {/* Scheduled Maintenance */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Scheduled Maintenance</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.noSchedule}>
              <p>No maintenance scheduled</p>
              <button className={styles.scheduleButton}>
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Emergency Controls</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.emergencyWarning}>
              <strong>Use with caution</strong>
              <p>These actions should only be used in emergency situations</p>
            </div>

            <button className={styles.emergencyButton}>
              <div>
                <strong>Force Stop All Sessions</strong>
                <p>Immediately halt all active game sessions</p>
              </div>
            </button>

            <button className={styles.emergencyButton}>
              <div>
                <strong>Lock Treasury</strong>
                <p>Prevent all blockchain transactions</p>
              </div>
            </button>

            <button className={styles.emergencyButton}>
              <div>
                <strong>Contact Support</strong>
                <p>Escalate to technical team</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
