import type { Contract } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import type { GameSession, GameAction, GameState, Inventory, ApiResponse } from '../types';
import { GAME_CONSTANTS, EMPTY_INVENTORY } from '../config/gameConstants';
import { contractService } from './contractService';
import { inventoryService } from './inventoryService';
import { famePointService } from './famePointService';
import { caseService } from './caseService';

/**
 * Game State Service
 * Manages daily game loop, sessions, and player progress
 */

class GameStateService {
  private gameSessionsCollection = collection(db, 'gameSessions');
  private usersCollection = collection(db, 'users');

  /**
   * Initialize game state for new user
   */
  createInitialGameState(): GameState {
    return {
      currentDay: 0,
      totalDaysPlayed: 0,
      famePoints: 0,
      treasureChestsOpened: 0,
      totalContractsCompleted: 0,
      totalSuiEarned: 0,
      totalStaminaUsed: 0,
      basicContractsCompleted: 0,
      advancedContractsCompleted: 0,
      expertContractsCompleted: 0,
      // Gacha Case Stats
      totalCasesOpened: 0,
      commonCasesOpened: 0,
      advancedCasesOpened: 0,
      epicCasesOpened: 0,
      totalFreeSpinsReceived: 0,
      lastCaseResetTime: undefined,
      casesOpenedToday: 0,
      canStartNewDay: true
    };
  }

  /**
   * Start a new day (create new game session)
   */
  async startNewDay(walletAddress: string): Promise<ApiResponse<GameSession>> {
    try {
      // Get or create user data
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);
      
      let userData;
      let gameState;
      
      if (!userDoc.exists()) {
        // Auto-create new user on first play
        console.log('Creating new user:', walletAddress);
        gameState = this.createInitialGameState();
        userData = {
          walletAddress,
          role: 'user', // User role for regular players
          gameState,
          stamina: GAME_CONSTANTS.MAX_STAMINA,
          maxStamina: GAME_CONSTANTS.MAX_STAMINA,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Create user document
        await setDoc(userRef, userData);
        console.log('New user created successfully with role: user');
      } else {
        userData = userDoc.data();
        gameState = userData.gameState || this.createInitialGameState();
      }
      
      // Check if can start new day
      if (!gameState.canStartNewDay) {
        return {
          success: false,
          error: 'Hãy hoàn thành hoặc kết thúc ngày hiện tại trước'
        };
      }
      
      const now = new Date().toISOString();
      const newDay = gameState.currentDay + 1;
      
      // Preserve contract and inventory from previous session
      let previousContract: Contract | null = null;
      let previousInventory: Inventory = { ...EMPTY_INVENTORY };
      
      if (gameState.lastSessionId) {
        const prevSessionRef = doc(this.gameSessionsCollection, gameState.lastSessionId);
        const prevSessionDoc = await getDoc(prevSessionRef);
        if (prevSessionDoc.exists()) {
          const prevSession = prevSessionDoc.data() as GameSession;
          
          // Only keep contract if it wasn't submitted yet
          if (prevSession.contract && !prevSession.contractSubmitted) {
            previousContract = prevSession.contract;
          }
          
          // Always preserve inventory from previous day (already burned in endDay)
          if (prevSession.inventory) {
            previousInventory = prevSession.inventory;
          }
        }
      }
      
      // Create game session - preserve contract & inventory to continue mission
      const session: Omit<GameSession, 'id'> = {
        userId: walletAddress,
        walletAddress,
        day: newDay,
        startedAt: now,
        contract: previousContract as any, // Preserved from prev day or null (set by openCaseForSession)
        currentStamina: GAME_CONSTANTS.MAX_STAMINA,
        maxStamina: GAME_CONSTANTS.MAX_STAMINA,
        inventory: previousInventory, // Carry over items from previous day (after 30-50% burn)
        actions: [],
        completed: false,
        contractSubmitted: false,
        dailyFeePaid: false,
        // Gacha fields
        casesOpened: 0,
        hasFreeSpinAvailable: false
      };
      
      const sessionRef = await addDoc(this.gameSessionsCollection, session);
      
      // Update user game state
      await updateDoc(userRef, {
        'gameState.currentDay': newDay,
        'gameState.lastSessionId': sessionRef.id,
        'gameState.lastPlayedAt': now,
        'gameState.canStartNewDay': false,
        stamina: GAME_CONSTANTS.MAX_STAMINA,
        maxStamina: GAME_CONSTANTS.MAX_STAMINA,
        updatedAt: now
      });
      
      const createdSession: GameSession = {
        id: sessionRef.id,
        ...session
      };
      
      const message = previousContract 
        ? `☀️ Ngày ${newDay} bắt đầu! Tiếp tục nhiệm vụ của bạn`
        : `Ngày ${newDay} bắt đầu! Hãy mở Case để nhận nhiệm vụ`;
      
      return {
        success: true,
        data: createdSession,
        message
      };
    } catch (error: any) {
      console.error('Error starting new day:', error);
      return {
        success: false,
        error: error.message || 'Failed to start new day'
      };
    }
  }

  /**
   * Open case and assign contract to session
   * Integrated with gacha system
   */
  async openCaseForSession(
    walletAddress: string, 
    sessionId: string,
    isFreeSpin: boolean = false
  ): Promise<ApiResponse<{
    contract: any;
    rarity: any;
    grantedFreeSpin: boolean;
  }>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      
      const [userDoc, sessionDoc] = await Promise.all([
        getDoc(userRef),
        getDoc(sessionRef)
      ]);
      
      if (!userDoc.exists() || !sessionDoc.exists()) {
        return {
          success: false,
          error: 'User or session not found'
        };
      }
      
      const userData = userDoc.data();
      const sessionData = sessionDoc.data() as GameSession;
      const gameState = userData.gameState || this.createInitialGameState();
      
      // Check if 24 hours passed since last reset (real-time, not game day)
      const now = new Date();
      const lastResetTime = gameState.lastCaseResetTime ? new Date(gameState.lastCaseResetTime) : null;
      const hoursSinceReset = lastResetTime ? (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60) : 999;
      
      // Reset if 24+ hours passed or first time
      const casesOpenedToday = hoursSinceReset >= 24 ? 0 : (gameState.casesOpenedToday || 0);
      
      // Validate can open case
      const canOpenResult = caseService.canOpenCase(
        casesOpenedToday,
        sessionData.hasFreeSpinAvailable || false,
        sessionData.contractSubmitted
      );
      
      if (!canOpenResult.success || !canOpenResult.data?.canOpen) {
        return {
          success: false,
          error: canOpenResult.data?.reason || 'Cannot open case'
        };
      }
      
      // Open the case
      const openingResult = caseService.openCase(walletAddress, isFreeSpin);
      const { contract, grantedFreeSpin } = openingResult;
      const rarity = openingResult.case.rarity;
      
      // Update session with new contract
      await updateDoc(sessionRef, {
        contract,
        currentCaseRarity: rarity,
        casesOpened: (sessionData.casesOpened || 0) + 1,
        hasFreeSpinAvailable: grantedFreeSpin,
        contractSubmitted: false
      });
      
      // Update user stats
      const updates: any = {
        'gameState.totalCasesOpened': (gameState.totalCasesOpened || 0) + 1,
        'gameState.casesOpenedToday': casesOpenedToday + 1,
        updatedAt: new Date().toISOString()
      };
      
      // Set reset time if this is first case in new 24h cycle
      if (casesOpenedToday === 0) {
        updates['gameState.lastCaseResetTime'] = now.toISOString();
      }
      
      // Increment rarity-specific counter
      if (rarity === 'common') {
        updates['gameState.commonCasesOpened'] = (gameState.commonCasesOpened || 0) + 1;
      } else if (rarity === 'advanced') {
        updates['gameState.advancedCasesOpened'] = (gameState.advancedCasesOpened || 0) + 1;
      } else if (rarity === 'epic') {
        updates['gameState.epicCasesOpened'] = (gameState.epicCasesOpened || 0) + 1;
        if (grantedFreeSpin) {
          updates['gameState.totalFreeSpinsReceived'] = (gameState.totalFreeSpinsReceived || 0) + 1;
        }
      }
      
      await updateDoc(userRef, updates);
      
      const rarityInfo = caseService.getRarityInfo(rarity);
      
      return {
        success: true,
        data: {
          contract,
          rarity,
          grantedFreeSpin
        },
        message: `${rarityInfo.name} Case! ${contract.description}${grantedFreeSpin ? ' + FREE SPIN 🎉' : ''}`
      };
    } catch (error: any) {
      console.error('Error opening case:', error);
      return {
        success: false,
        error: error.message || 'Failed to open case'
      };
    }
  }

  /**
   * Get current active session
   */
  async getCurrentSession(walletAddress: string): Promise<ApiResponse<GameSession | null>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      const userData = userDoc.data();
      const lastSessionId = userData.gameState?.lastSessionId;
      
      if (!lastSessionId) {
        return {
          success: true,
          data: null,
          message: 'No active session'
        };
      }
      
      const sessionRef = doc(this.gameSessionsCollection, lastSessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        return {
          success: true,
          data: null,
          message: 'Session not found'
        };
      }
      
      const session: GameSession = {
        id: sessionDoc.id,
        ...sessionDoc.data()
      } as GameSession;
      
      // If session is completed, return null (no active session)
      if (session.completed) {
        return {
          success: true,
          data: null,
          message: 'No active session'
        };
      }
      
      return {
        success: true,
        data: session
      };
    } catch (error: any) {
      console.error('Error getting current session:', error);
      return {
        success: false,
        error: error.message || 'Failed to get session'
      };
    }
  }

  /**
   * Use stamina for an action
   */
  async useStamina(sessionId: string, amount: number, action: GameAction): Promise<ApiResponse<{
    currentStamina: number;
    action: GameAction;
  }>> {
    try {
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        return {
          success: false,
          error: 'Session not found'
        };
      }
      
      const session = sessionDoc.data() as GameSession;
      
      if (session.currentStamina < amount) {
        return {
          success: false,
          error: `Không đủ Stamina! Cần: ${amount}, Còn: ${session.currentStamina}`
        };
      }
      
      const newStamina = session.currentStamina - amount;
      const updatedActions = [...session.actions, action];
      
      await updateDoc(sessionRef, {
        currentStamina: newStamina,
        actions: updatedActions
      });
      
      // Update user stamina
      const userRef = doc(this.usersCollection, session.walletAddress);
      await updateDoc(userRef, {
        stamina: newStamina
      });
      
      return {
        success: true,
        data: {
          currentStamina: newStamina,
          action
        },
        message: `Sử dụng ${amount} Stamina. Còn lại: ${newStamina}`
      };
    } catch (error: any) {
      console.error('Error using stamina:', error);
      return {
        success: false,
        error: error.message || 'Failed to use stamina'
      };
    }
  }

  /**
   * Update session after case opening (without calling caseService again)
   * Used when UI component already opened the case
   */
  async updateSessionAfterCaseOpening(
    walletAddress: string,
    sessionId: string,
    contract: any,
    rarity: any,
    grantedFreeSpin: boolean
  ): Promise<ApiResponse<void>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      
      const [userDoc, sessionDoc] = await Promise.all([
        getDoc(userRef),
        getDoc(sessionRef)
      ]);
      
      if (!userDoc.exists() || !sessionDoc.exists()) {
        return {
          success: false,
          error: 'User or session not found'
        };
      }
      
      const userData = userDoc.data();
      const sessionData = sessionDoc.data() as GameSession;
      const gameState = userData.gameState || this.createInitialGameState();
      
      // Check if 24 hours passed since last reset (real-time, not game day)
      const now = new Date();
      const lastResetTime = gameState.lastCaseResetTime ? new Date(gameState.lastCaseResetTime) : null;
      const hoursSinceReset = lastResetTime ? (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60) : 999;
      
      // Reset if 24+ hours passed or first time
      const casesOpenedToday = hoursSinceReset >= 24 ? 0 : (gameState.casesOpenedToday || 0);
      
      // Update session with new contract
      await updateDoc(sessionRef, {
        contract,
        currentCaseRarity: rarity,
        casesOpened: (sessionData.casesOpened || 0) + 1,
        hasFreeSpinAvailable: grantedFreeSpin,
        contractSubmitted: false
      });
      
      // Update user stats
      const updates: any = {
        'gameState.totalCasesOpened': (gameState.totalCasesOpened || 0) + 1,
        'gameState.casesOpenedToday': casesOpenedToday + 1,
        updatedAt: new Date().toISOString()
      };
      
      // Set reset time if this is first case in new 24h cycle
      if (casesOpenedToday === 0) {
        updates['gameState.lastCaseResetTime'] = now.toISOString();
      }
      
      // Increment rarity-specific counter
      if (rarity === 'common') {
        updates['gameState.commonCasesOpened'] = (gameState.commonCasesOpened || 0) + 1;
      } else if (rarity === 'advanced') {
        updates['gameState.advancedCasesOpened'] = (gameState.advancedCasesOpened || 0) + 1;
      } else if (rarity === 'epic') {
        updates['gameState.epicCasesOpened'] = (gameState.epicCasesOpened || 0) + 1;
        if (grantedFreeSpin) {
          updates['gameState.totalFreeSpinsReceived'] = (gameState.totalFreeSpinsReceived || 0) + 1;
        }
      }
      
      await updateDoc(userRef, updates);
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error updating case opening:', error);
      return {
        success: false,
        error: error.message || 'Failed to update case opening'
      };
    }
  }

  /**
   * Update inventory in session
   */
  async updateSessionInventory(sessionId: string, inventory: Inventory): Promise<ApiResponse<void>> {
    try {
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      await updateDoc(sessionRef, {
        inventory
      });
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error updating inventory:', error);
      return {
        success: false,
        error: error.message || 'Failed to update inventory'
      };
    }
  }

  /**
   * Submit contract (complete daily objective)
   */
  async submitContract(
    sessionId: string,
    signAndExecuteTransaction?: any
  ): Promise<ApiResponse<{
    suiReward: number;
    famePoints: number;
  }>> {
    try {
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        return {
          success: false,
          error: 'Session not found'
        };
      }
      
      const session = sessionDoc.data() as GameSession;
      
      if (session.contractSubmitted) {
        return {
          success: false,
          error: 'Hợp đồng đã được nộp rồi'
        };
      }
      
      // Validate inventory meets contract requirements
      const validation = contractService.validateContract(session.inventory, session.contract.requirements);
      if (!validation.success) {
        return {
          success: false,
          error: validation.message || 'Không đủ vật phẩm'
        };
      }
      
      // Remove items from inventory
      const removeResult = inventoryService.removeItems(session.inventory, session.contract.requirements);
      if (!removeResult.success) {
        return {
          success: false,
          error: removeResult.error
        };
      }
      
      // Burn ALL remaining items after submitting contract (Roguelike mechanic)
      const emptyInventory = inventoryService.burnInventory();
      
      // Update session
      await updateDoc(sessionRef, {
        contractSubmitted: true,
        inventory: emptyInventory
      });
      
      // Add fame points
      await famePointService.addFamePoints(session.walletAddress, session.contract.rewards.famePoints);
      
      // Transfer SUI reward from treasury to player on-chain
      if (signAndExecuteTransaction) {
        console.log('💰 Claiming SUI reward from treasury...');
        const { claimTreasureReward } = await import('./suiBlockchainService');
        const claimResult = await claimTreasureReward(
          signAndExecuteTransaction,
          session.contract.rewards.sui
        );
        
        if (!claimResult.success) {
          console.error('Failed to claim SUI reward:', claimResult.error);
          // Don't fail the whole submission, just log the error
          console.warn('⚠️ SUI reward recorded in Firebase but not transferred on-chain');
        } else {
          console.log('✅ SUI reward transferred successfully!', claimResult.digest);
        }
      } else {
        console.warn('⚠️ No signAndExecuteTransaction provided, SUI reward not transferred on-chain');
      }
      
      // Update user stats
      const userRef = doc(this.usersCollection, session.walletAddress);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data()!;
      const gameState = userData.gameState || this.createInitialGameState();
      
      const difficultyField = `${session.contract.difficulty}ContractsCompleted` as keyof GameState;
      
      await updateDoc(userRef, {
        'gameState.totalContractsCompleted': gameState.totalContractsCompleted + 1,
        'gameState.totalSuiEarned': gameState.totalSuiEarned + session.contract.rewards.sui,
        [`gameState.${difficultyField}`]: (gameState[difficultyField] as number) + 1,
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        data: {
          suiReward: session.contract.rewards.sui,
          famePoints: session.contract.rewards.famePoints
        },
        message: `🎉 Hoàn thành! Nhận ${session.contract.rewards.sui} SUI + ${session.contract.rewards.famePoints} FP`
      };
    } catch (error: any) {
      console.error('Error submitting contract:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit contract'
      };
    }
  }

  /**
   * End day and burn remaining inventory (Roguelike mechanic)
   */
  async endDay(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        return {
          success: false,
          error: 'Session not found'
        };
      }
      
      const session = sessionDoc.data() as GameSession;
      const now = new Date().toISOString();
      
      // Burn random items (30-50% of each type)
      const remainingInventory = inventoryService.burnRandomItems(session.inventory);
      
      // Update session
      await updateDoc(sessionRef, {
        completed: true,
        endedAt: now,
        inventory: remainingInventory
      });
      
      // Update user
      const userRef = doc(this.usersCollection, session.walletAddress);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data()!;
      const gameState = userData.gameState || this.createInitialGameState();
      
      await updateDoc(userRef, {
        'gameState.totalDaysPlayed': gameState.totalDaysPlayed + 1,
        'gameState.canStartNewDay': true,
        updatedAt: now
      });
      
      return {
        success: true,
        message: '🌙 Ngày kết thúc. Một số items bị mất (30-50% mỗi loại). Hẹn gặp lại ngày mai!'
      };
    } catch (error: any) {
      console.error('Error ending day:', error);
      return {
        success: false,
        error: error.message || 'Failed to end day'
      };
    }
  }

  /**
   * Reset claimed SUI after player successfully claims to wallet
   */
  async resetClaimedSui(walletAddress: string): Promise<ApiResponse<void>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      await updateDoc(userRef, {
        'gameState.totalSuiEarned': 0,
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        message: 'SUI claimed amount reset'
      };
    } catch (error: any) {
      console.error('Error resetting claimed SUI:', error);
      return {
        success: false,
        error: error.message || 'Failed to reset claimed SUI'
      };
    }
  }

  /**
   * Get game statistics for user
   */
  async getGameStats(walletAddress: string): Promise<ApiResponse<GameState>> {
    try {
      const userRef = doc(this.usersCollection, walletAddress);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      const userData = userDoc.data();
      const gameState = userData.gameState || this.createInitialGameState();
      
      return {
        success: true,
        data: gameState
      };
    } catch (error: any) {
      console.error('Error getting game stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to get stats'
      };
    }
  }

  /**
   * Update inventory: add resource to current session
   */
  async addResourceToInventory(
    sessionId: string,
    resourceType: string,
    quantity: number
  ): Promise<ApiResponse<GameSession>> {
    try {
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      const sessionSnap = await getDoc(sessionRef);

      if (!sessionSnap.exists()) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      const session = sessionSnap.data() as GameSession;
      const updatedInventory = { ...session.inventory };

      // Add resource to inventory
      const resourceKey = resourceType.toLowerCase() as keyof Inventory;
      if (resourceKey in updatedInventory) {
        updatedInventory[resourceKey] = (updatedInventory[resourceKey] || 0) + quantity;
      }

      // Update Firestore
      await updateDoc(sessionRef, {
        inventory: updatedInventory,
        updatedAt: new Date().toISOString()
      });

      const updatedSession: GameSession = {
        ...session,
        inventory: updatedInventory
      };

      return {
        success: true,
        data: updatedSession,
        message: `Added ${quantity} ${resourceType} to inventory`
      };
    } catch (error: any) {
      console.error('Error adding resource to inventory:', error);
      return {
        success: false,
        error: error.message || 'Failed to add resource'
      };
    }
  }

  /**
   * Update stamina in current session
   */
  async updateStamina(
    sessionId: string,
    currentStamina: number
  ): Promise<ApiResponse<GameSession>> {
    try {
      const sessionRef = doc(this.gameSessionsCollection, sessionId);
      
      await updateDoc(sessionRef, {
        currentStamina: currentStamina,
        updatedAt: new Date().toISOString()
      });

      const sessionSnap = await getDoc(sessionRef);
      const session = sessionSnap.data() as GameSession;

      return {
        success: true,
        data: session,
        message: 'Stamina updated'
      };
    } catch (error: any) {
      console.error('Error updating stamina:', error);
      return {
        success: false,
        error: error.message || 'Failed to update stamina'
      };
    }
  }
}

export const gameStateService = new GameStateService();
