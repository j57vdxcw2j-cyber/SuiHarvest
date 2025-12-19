import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { gameStateService } from '../services/gameStateService';
import { resourceService } from '../services/resourceService';
import { inventoryService } from '../services/inventoryService';
import { famePointService } from '../services/famePointService';
import { payDailyEntryFee, claimTreasureReward } from '../services/suiBlockchainService';
import { transactionService } from '../services/transactionService';
import { CaseOpening } from './CaseOpening';
import type { GameSession, Inventory, GameState, Contract, CaseRarity } from '../types';
import { GAME_CONSTANTS } from '../config/gameConstants';
import styles from './Game.module.css';

export function Game() {
  const { walletAddress } = useAuth();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [gameStats, setGameStats] = useState<GameState | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [showCaseOpening, setShowCaseOpening] = useState(false);
  const [isOpeningCase, setIsOpeningCase] = useState(false);
  const [isProcessingBlockchain, setIsProcessingBlockchain] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showOpenCaseConfirm, setShowOpenCaseConfirm] = useState(false);
  const [caseResetCountdown, setCaseResetCountdown] = useState<string>('');

  // Calculate time until case limit resets
  useEffect(() => {
    if (!gameStats?.lastCaseResetTime || !gameStats?.casesOpenedToday || gameStats.casesOpenedToday < 3) {
      setCaseResetCountdown('');
      return;
    }

    const updateCountdown = () => {
      const resetTime = new Date(gameStats.lastCaseResetTime!);
      const resetEnd = new Date(resetTime.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = resetEnd.getTime() - now.getTime();

      if (diff <= 0) {
        setCaseResetCountdown('Sẵn sàng!');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCaseResetCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [gameStats?.lastCaseResetTime, gameStats?.casesOpenedToday]);

  // Load current session and game stats
  useEffect(() => {
    const loadGameData = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        // Get current active session
        const sessionResponse = await gameStateService.getCurrentSession(walletAddress);
        if (sessionResponse.success && sessionResponse.data) {
          setActiveSession(sessionResponse.data);
        }

        // Get game stats
        const statsResponse = await gameStateService.getGameStats(walletAddress);
        if (statsResponse.success && statsResponse.data) {
          setGameStats(statsResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading game data:', error);
        setLoading(false);
      }
    };

    loadGameData();
  }, [walletAddress]);

  const addLog = (message: string) => {
    setActionLog(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
  };

  const handleStartDay = async () => {
    if (!walletAddress) {
      addLog('❌ Please connect wallet first');
      return;
    }

    try {
      setIsProcessingBlockchain(true);
      
      // No upfront payment - players pay 0.75 SUI per case opened
      addLog('📝 Starting new day...');
      const response = await gameStateService.startNewDay(walletAddress);
      
      if (response.success && response.data) {
        setActiveSession(response.data);
        addLog(`✅ ${response.message}`);
        
        // Refresh game stats
        const statsResponse = await gameStateService.getGameStats(walletAddress);
        if (statsResponse.success) {
          setGameStats(statsResponse.data!);
        }

        // Auto-open case selection ONLY if no contract (first time or after submit)
        if (!response.data.contract) {
          setTimeout(() => {
            setShowCaseOpening(true);
          }, 500);
        }
      } else {
        addLog(`❌ ${response.error || 'Failed to start day'}`);
      }
      
      setIsProcessingBlockchain(false);
    } catch (error: any) {
      console.error('Error starting day:', error);
      addLog(`❌ Error: ${error.message}`);
      setIsProcessingBlockchain(false);
    }
  };

  const handleOpenCase = () => {
    if (!activeSession || !activeSession.id) {
      addLog('❌ No active session');
      return;
    }

    if (activeSession.casesOpened >= GAME_CONSTANTS.MAX_CASES_PER_DAY) {
      addLog('❌ Daily case limit reached (3/3)');
      return;
    }

    // Show confirmation popup if not using free spin
    if (!activeSession.hasFreeSpinAvailable) {
      setShowOpenCaseConfirm(true);
    } else {
      addLog('🎁 Sử dụng lượt quay miễn phí!');
      setShowCaseOpening(true);
    }
  };

  const handleConfirmOpenCase = () => {
    setShowOpenCaseConfirm(false);
    setShowCaseOpening(true);
  };

  const handleCancelOpenCase = () => {
    setShowOpenCaseConfirm(false);
    addLog('❌ Đã hủy mở rương');
  };

  const handleCaseComplete = async (contract: Contract, rarity: CaseRarity, grantedFreeSpin: boolean) => {
    if (!walletAddress || !activeSession || !activeSession.id) {
      addLog('❌ Invalid session');
      setShowCaseOpening(false);
      return;
    }

    try {
      setIsOpeningCase(true);
      
      // Pay 0.75 SUI to open case (unless using free spin)
      if (!grantedFreeSpin && !activeSession.hasFreeSpinAvailable) {
        addLog('💳 Paying 0.75 SUI to open case...');
        const txResult = await payDailyEntryFee(signAndExecuteTransaction, walletAddress);
        
        if (!txResult.success) {
          addLog(`❌ Payment failed: ${txResult.error}`);
          setIsOpeningCase(false);
          setShowCaseOpening(false);
          return;
        }
        
        addLog(`✅ Payment successful! TX: ${txResult.digest?.slice(0, 12)}...`);
        
        // Log transaction to Firebase
        await transactionService.logOpenCase(
          walletAddress,
          0.75,
          rarity,
          txResult.digest
        );
      } else {
        addLog('🎁 Using free spin!');
      }
      
      // Update Firestore with case opening results
      const response = await gameStateService.updateSessionAfterCaseOpening(
        walletAddress,
        activeSession.id,
        contract,
        rarity,
        grantedFreeSpin
      );

      if (!response.success) {
        addLog(`❌ ${response.error || 'Failed to save case opening'}`);
        setShowCaseOpening(false);
        setIsOpeningCase(false);
        return;
      }
      
      // Update local session state
      const updatedSession = {
        ...activeSession,
        contract: contract,
        currentCaseRarity: rarity,
        casesOpened: (activeSession.casesOpened || 0) + 1,
        hasFreeSpinAvailable: grantedFreeSpin,
        contractSubmitted: false
      };
      
      setActiveSession(updatedSession);
      
      // Log case opening result
      const rarityEmoji = rarity === 'epic' ? '🌟' : rarity === 'advanced' ? '💎' : '📦';
      addLog(`${rarityEmoji} Opened ${rarity.toUpperCase()} case!`);
      if (grantedFreeSpin) {
        addLog(`🎁 FREE SPIN awarded!`);
      }

      // Refresh game stats
      const statsResponse = await gameStateService.getGameStats(walletAddress);
      if (statsResponse.success) {
        setGameStats(statsResponse.data!);
      }

      setShowCaseOpening(false);
      setIsOpeningCase(false);
    } catch (error: any) {
      console.error('Error opening case:', error);
      addLog(`❌ Error: ${error.message}`);
      setShowCaseOpening(false);
      setIsOpeningCase(false);
    }
  };

  const handleAction = async (actionType: 'water_crop' | 'chop_tree' | 'mine_stone', cropType?: string) => {
    if (!activeSession) {
      addLog('❌ No active session. Start a new day first!');
      return;
    }

    try {
      // Get stamina cost
      const staminaCost = resourceService.getStaminaCost(actionType);
      
      if (activeSession.currentStamina < staminaCost) {
        addLog(`❌ Not enough stamina! Need ${staminaCost}, have ${activeSession.currentStamina}`);
        return;
      }

      addLog(`⚡ Using ${staminaCost} stamina...`);

      // Perform resource action
      const actionResponse = resourceService.performAction(actionType, { cropType: cropType as any });
      
      if (!actionResponse.success || !actionResponse.data) {
        addLog(`❌ Action failed: ${actionResponse.error}`);
        return;
      }

      const { itemType, quantity, staminaCost: cost } = actionResponse.data;

      // Create action record
      const action = {
        id: `action_${Date.now()}`,
        type: actionType,
        location: actionType === 'water_crop' ? 'farm' : actionType === 'chop_tree' ? 'forest' : 'mountain',
        staminaCost: cost,
        result: {
          itemType,
          quantity,
          success: true
        },
        timestamp: new Date().toISOString()
      } as any;

      // Use stamina
      const staminaResponse = await gameStateService.useStamina(activeSession.id, cost, action);
      
      if (!staminaResponse.success) {
        addLog(`❌ Failed to use stamina: ${staminaResponse.error}`);
        return;
      }

      // Update inventory
      const newInventory = inventoryService.addItem(activeSession.inventory, itemType as any, quantity);
      await gameStateService.updateSessionInventory(activeSession.id, newInventory);

      // Update local state
      setActiveSession({
        ...activeSession,
        currentStamina: staminaResponse.data!.currentStamina,
        inventory: newInventory,
        actions: [...activeSession.actions, action]
      });

      addLog(`✅ ${actionResponse.message}`);
    } catch (error: any) {
      console.error('Error performing action:', error);
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const handleSubmitContract = async () => {
    if (!activeSession) {
      addLog('❌ No active session');
      return;
    }

    try {
      addLog('📦 Submitting contract...');
      
      const response = await gameStateService.submitContract(
        activeSession.id,
        signAndExecuteTransaction
      );
      
      if (response.success && response.data) {
        addLog(`✅ ${response.message}`);
        
        // Update session state
        setActiveSession({
          ...activeSession,
          contractSubmitted: true,
          inventory: inventoryService.createEmptyInventory()
        });
        
        // Refresh stats
        const statsResponse = await gameStateService.getGameStats(walletAddress!);
        if (statsResponse.success) {
          setGameStats(statsResponse.data!);
        }
      } else {
        addLog(`❌ ${response.error || 'Failed to submit contract'}`);
      }
    } catch (error: any) {
      console.error('Error submitting contract:', error);
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const handleEndDay = async () => {
    if (!activeSession) {
      addLog('❌ No active session');
      return;
    }

    if (!window.confirm('🌙 Kết thúc ngày? Một số items sẽ bị mất ngẫu nhiên (30-50% mỗi loại)!')) {
      return;
    }

    try {
      addLog('🌙 Ending day...');
      
      const response = await gameStateService.endDay(activeSession.id);
      
      if (response.success) {
        addLog(`✅ ${response.message}`);
        setActiveSession(null);
        
        // Refresh stats
        const statsResponse = await gameStateService.getGameStats(walletAddress!);
        if (statsResponse.success) {
          setGameStats(statsResponse.data!);
        }
      } else {
        addLog(`❌ ${response.error}`);
      }
    } catch (error: any) {
      console.error('Error ending day:', error);
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const handleClaimSui = async () => {
    if (!walletAddress || !gameStats) {
      addLog('❌ Please connect wallet');
      return;
    }

    if (gameStats.totalSuiEarned <= 0) {
      addLog('❌ No SUI to claim');
      return;
    }

    try {
      setIsClaiming(true);
      addLog(`💰 Claiming ${gameStats.totalSuiEarned.toFixed(2)} SUI...`);
      addLog(`🔑 Wallet: ${walletAddress}`);
      
      // Call blockchain to transfer SUI from treasury to player
      const claimResult = await claimTreasureReward(
        signAndExecuteTransaction,
        gameStats.totalSuiEarned
      );
      
      if (claimResult.success) {
        addLog(`✅ Successfully claimed ${gameStats.totalSuiEarned.toFixed(2)} SUI!`);
        addLog(`📝 Transaction: ${claimResult.digest}`);
        
        // Log transaction to Firebase
        await transactionService.logClaimReward(
          walletAddress,
          gameStats.totalSuiEarned,
          claimResult.digest
        );
        
        // Update Firebase to reset totalSuiEarned (already claimed)
        await gameStateService.resetClaimedSui(walletAddress);
        
        // Refresh stats
        const statsResponse = await gameStateService.getGameStats(walletAddress);
        if (statsResponse.success) {
          setGameStats(statsResponse.data!);
        }
      } else {
        addLog(`❌ Claim failed: ${claimResult.error}`);
      }
    } catch (error: any) {
      console.error('Error claiming SUI:', error);
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimChest = async () => {
    addLog('📢 Coming soon in next version');
  };

  // Helper functions for display
  const getContractDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '#4CAF50';
      case 'advanced': return '#2196F3';
      case 'expert': return '#FF9800';
      default: return '#9CA3AF';
    }
  };

  const getRarityColor = (rarity: CaseRarity) => {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'advanced': return '#3B82F6';
      case 'epic': return '#A855F7';
      default: return '#9CA3AF';
    }
  };

  const canClaimChest = gameStats && gameStats.famePoints >= GAME_CONSTANTS.FAME_POINTS_FOR_CHEST;
  const caseLimitReached = gameStats && gameStats.casesOpenedToday >= GAME_CONSTANTS.MAX_CASES_PER_DAY;
  const canOpenAnotherCase = activeSession && 
    !caseLimitReached &&
    (activeSession.contractSubmitted || activeSession.hasFreeSpinAvailable);

  if (!walletAddress) {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.noWallet}>
          <h2>🎮 Game Simulator</h2>
          <p>Please connect your wallet to play</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.loading}>Loading game...</div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameLayout}>
        {/* Left Panel - Game Stats & Contract */}
        <div className={styles.leftPanel}>
          <div className={styles.statsCard}>
            <h3>📊 Game Stats</h3>
            {gameStats && (
              <>
                <div className={styles.statRow}>
                  <span>Current Day:</span>
                  <strong>{gameStats.currentDay}</strong>
                </div>
                <div className={styles.statRow}>
                  <span>Fame Points:</span>
                  <strong style={{ color: canClaimChest ? '#FFD700' : 'inherit' }}>
                    {gameStats.famePoints} FP
                  </strong>
                </div>
                <div className={styles.statRow}>
                  <span>Contracts Done:</span>
                  <strong>{gameStats.totalContractsCompleted}</strong>
                </div>
                <div className={styles.statRow}>
                  <span>SUI Earned:</span>
                  <strong>{gameStats.totalSuiEarned.toFixed(2)} SUI</strong>
                </div>
                {gameStats.totalSuiEarned > 0 && (
                  <button
                    onClick={handleClaimSui}
                    disabled={isClaiming}
                    className={styles.claimSuiButton}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      backgroundColor: isClaiming ? '#666' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isClaiming ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    {isClaiming ? '⏳ Claiming...' : `💰 Claim ${gameStats.totalSuiEarned.toFixed(2)} SUI`}
                  </button>
                )}
                {canClaimChest && (
                  <button 
                    className={styles.claimButton} 
                    onClick={handleClaimChest}
                    disabled={isProcessingBlockchain}
                  >
                    {isProcessingBlockchain ? '⏳ Processing...' : '🎁 Claim Treasure Chest'}
                  </button>
                )}
              </>
            )}
          </div>

          {activeSession && activeSession.contract && (
            <div className={styles.contractCard}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  color: getContractDifficultyColor(activeSession.contract.difficulty),
                  margin: 0 
                }}>
                  📜 Contract {gameStats?.casesOpenedToday || 1}/3
                </h3>
                {activeSession.currentCaseRarity && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: getRarityColor(activeSession.currentCaseRarity),
                    color: 'white'
                  }}>
                    {activeSession.currentCaseRarity.toUpperCase()}
                  </span>
                )}
              </div>
              <div className={styles.contractDifficulty}>
                {activeSession.contract.difficulty.toUpperCase()}
              </div>
              <p className={styles.contractDesc}>{activeSession.contract.description}</p>
              
              <div className={styles.contractSection}>
                <h4>Requirements:</h4>
                {Object.entries(activeSession.contract.requirements).map(([item, qty]) => (
                  <div key={item} className={styles.requirement}>
                    <span>{item}: {qty}</span>
                    <span className={styles.inventoryCheck}>
                      ({activeSession.inventory[item as keyof Inventory] || 0}/{qty})
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.contractSection}>
                <h4>Rewards:</h4>
                <div>{activeSession.contract.rewards.sui} SUI</div>
                <div>{activeSession.contract.rewards.famePoints} FP</div>
              </div>

              <div className={styles.contractActions}>
                <button
                  className={styles.submitButton}
                  onClick={handleSubmitContract}
                  disabled={activeSession.contractSubmitted}
                >
                  {activeSession.contractSubmitted ? '✅ Submitted' : '📦 Submit Contract'}
                </button>

                {(canOpenAnotherCase || caseLimitReached) && (
                  <button
                    className={styles.openCaseButton}
                    onClick={handleOpenCase}
                    disabled={isOpeningCase || !!caseLimitReached}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      padding: '12px',
                      background: caseLimitReached 
                        ? '#4B5563'
                        : activeSession.hasFreeSpinAvailable 
                        ? 'linear-gradient(135deg, #A855F7 0%, #7c3aed 100%)'
                        : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '700',
                      cursor: caseLimitReached ? 'not-allowed' : 'pointer',
                      opacity: caseLimitReached ? 0.6 : 1
                    }}
                  >
                    {caseLimitReached 
                      ? `⏰ Reset in ${caseResetCountdown}`
                      : activeSession.hasFreeSpinAvailable 
                        ? '🎁 FREE CASE' 
                        : '📦 Open Next Case'
                    }
                    {!caseLimitReached && ` (${gameStats?.casesOpenedToday || 0}/3)`}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeSession && !activeSession.contract && (
            <div className={styles.contractCard}>
              <h3>📦 Case Opening</h3>
              <p className={styles.contractDesc}>
                {caseLimitReached
                  ? 'Đã đạt giới hạn 3 case/24h'
                  : gameStats && gameStats.casesOpenedToday === 0 
                    ? 'Open your first case to get today\'s contract!'
                    : `Case ${(gameStats?.casesOpenedToday || 0) + 1}/3`
                }
              </p>
              <div style={{ 
                textAlign: 'center',
                padding: '40px 20px',
                fontSize: '80px'
              }}>
                {caseLimitReached ? '⏰' : '📦'}
              </div>
              <button
                className={styles.openButton}
                onClick={handleOpenCase}
                disabled={isOpeningCase || !!caseLimitReached}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: caseLimitReached 
                    ? '#4B5563'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '18px',
                  cursor: caseLimitReached ? 'not-allowed' : 'pointer',
                  opacity: caseLimitReached ? 0.6 : 1
                }}
              >
                {caseLimitReached ? `⏰ Reset in ${caseResetCountdown}` : '🎲 Open Case'}
              </button>
            </div>
          )}
        </div>

        {/* Center Panel - Game Actions */}
        <div className={styles.centerPanel}>
          <div className={styles.staminaCard}>
            <h3>⚡ Stamina</h3>
            <div className={styles.staminaBar}>
              <div
                className={styles.staminaFill}
                style={{
                  width: `${activeSession ? (activeSession.currentStamina / activeSession.maxStamina) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className={styles.staminaText}>
              {activeSession ? `${activeSession.currentStamina} / ${activeSession.maxStamina}` : '0 / 50'}
            </div>
          </div>

          {!activeSession && gameStats?.canStartNewDay && (
            <div className={styles.startDayCard}>
              <h2>🌅 Bắt đầu ngày mới</h2>
              <p style={{ color: '#10b981', fontWeight: 600 }}>✨ Miễn phí - Hồi đầy stamina</p>
              <button 
                className={styles.startButton} 
                onClick={handleStartDay}
                disabled={isProcessingBlockchain}
              >
                {isProcessingBlockchain ? '⏳ Đang xử lý...' : 'Bắt đầu ngày mới'}
              </button>
            </div>
          )}

          {activeSession && activeSession.contract && (
            <>
              <div className={styles.actionsGrid}>
                <div className={styles.actionCard}>
                  <h4>🌱 Farm</h4>
                  <p>Cost: 2 Stamina</p>
                  <div className={styles.cropButtons}>
                    <button onClick={() => handleAction('water_crop', 'carrot')}>🥕 Carrot</button>
                    <button onClick={() => handleAction('water_crop', 'potato')}>🥔 Potato</button>
                    <button onClick={() => handleAction('water_crop', 'wheat')}>🌾 Wheat</button>
                  </div>
                </div>

                <div className={styles.actionCard}>
                  <h4>🌲 Forest</h4>
                  <p>Cost: 6 Stamina</p>
                  <button onClick={() => handleAction('chop_tree')}>🪓 Chop Wood</button>
                </div>

                <div className={styles.actionCard}>
                  <h4>⛰️ Mountain</h4>
                  <p>Cost: 8 Stamina</p>
                  <button onClick={() => handleAction('mine_stone')}>⛏️ Mine Stone</button>
                  <small style={{ fontSize: '11px', color: '#888' }}>
                    Stone 70% | Coal 20% | Iron 10%
                  </small>
                </div>
              </div>

              <div className={styles.endDayCard}>
                <button className={styles.endButton} onClick={handleEndDay}>
                  🌙 Sleep (End Day & Burn Items)
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Inventory & Log */}
        <div className={styles.rightPanel}>
          <div className={styles.inventoryCard}>
            <h3>🎒 Inventory</h3>
            {activeSession ? (
              <div className={styles.inventoryGrid}>
                {Object.entries(activeSession.inventory).map(([item, qty]) => (
                  qty > 0 && (
                    <div key={item} className={styles.inventoryItem}>
                      <span>{item}:</span>
                      <strong>{qty}</strong>
                    </div>
                  )
                ))}
                {inventoryService.isEmpty(activeSession.inventory) && (
                  <div style={{ color: '#888', fontSize: '14px' }}>Empty</div>
                )}
              </div>
            ) : (
              <div style={{ color: '#888', fontSize: '14px' }}>No active session</div>
            )}
          </div>

          <div className={styles.logCard}>
            <h3>📋 Action Log</h3>
            <div className={styles.logContent}>
              {actionLog.length === 0 ? (
                <div style={{ color: '#888', fontSize: '14px' }}>No actions yet</div>
              ) : (
                actionLog.map((log, i) => (
                  <div key={i} className={styles.logEntry}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Case Opening Modal */}
      {showCaseOpening && (
        <CaseOpening
          onComplete={handleCaseComplete}
          onCancel={() => setShowCaseOpening(false)}
        />
      )}

      {/* Open Case Confirmation Popup */}
      {showOpenCaseConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '16px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)'
            }}>
              💰 Mở Rương Nhiệm Vụ
            </h2>
            
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '20px', fontWeight: '700', color: '#FF6B6B', margin: 0 }}>
                Chi phí: 0.75 SUI
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>
                📦 Tỷ lệ nhận thưởng:
              </p>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#B0B0B0' }}>📦 Common (75%)</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B6B' }}>0.30-0.50 SUI (lỗ)</span>
              </div>
              
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#7DD3FC' }}>💎 Advanced (22%)</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFA500' }}>0.60-0.70 SUI (hòa)</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#FFD700' }}>🌟 Epic (3%)</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ADE80' }}>1.50-2.50 SUI (lời!) + Free</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCancelOpenCase}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ❌ Hủy
              </button>
              
              <button
                onClick={handleConfirmOpenCase}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                }}
              >
                ✅ Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
