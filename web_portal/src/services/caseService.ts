import type { CaseRarity, Contract, ContractCase, CaseOpeningResult, ApiResponse } from '../types';
import { GAME_CONSTANTS, CASE_CONTRACT_TEMPLATES } from '../config/gameConstants';

/**
 * Case Service - Gacha System for Contract Generation
 * Implements CS2-style case opening with 3 rarity tiers
 */

class CaseService {
  /**
   * Determine case rarity based on drop rates
   * 70% Common, 25% Advanced, 5% Epic
   */
  rollCaseRarity(): CaseRarity {
    const roll = Math.random() * 100;
    
    if (roll < GAME_CONSTANTS.CASE_RARITY_RATES.EPIC) {
      return 'epic'; // 0-5%
    } else if (roll < GAME_CONSTANTS.CASE_RARITY_RATES.EPIC + GAME_CONSTANTS.CASE_RARITY_RATES.ADVANCED) {
      return 'advanced'; // 5-30%
    } else {
      return 'common'; // 30-100%
    }
  }
  
  /**
   * Generate contract based on case rarity
   */
  generateContractForRarity(rarity: CaseRarity): Contract {
    let templates: Contract[];
    
    switch (rarity) {
      case 'common':
        templates = CASE_CONTRACT_TEMPLATES.common;
        break;
      case 'advanced':
        templates = CASE_CONTRACT_TEMPLATES.advanced;
        break;
      case 'epic':
        templates = CASE_CONTRACT_TEMPLATES.epic;
        break;
      default:
        templates = CASE_CONTRACT_TEMPLATES.common;
    }
    
    // Weighted random selection
    const totalWeight = templates.reduce((sum, t) => sum + t.spawnRate, 0);
    let roll = Math.random() * totalWeight;
    
    for (const template of templates) {
      roll -= template.spawnRate;
      if (roll <= 0) {
        return { ...template };
      }
    }
    
    // Fallback to first template
    return { ...templates[0] };
  }
  
  /**
   * Open a case and get contract + rarity
   * Returns case opening result with free spin status
   */
  openCase(userId: string, isFreeSpin: boolean = false): CaseOpeningResult {
    // Roll rarity
    const rarity = this.rollCaseRarity();
    
    // Generate contract for this rarity
    const contract = this.generateContractForRarity(rarity);
    
    // Create case record
    const caseRecord: ContractCase = {
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      rarity,
      contract,
      isFreeSpin,
      openedAt: new Date().toISOString(),
      animationSeed: Math.random() // For consistent replay
    };
    
    // Epic grants free spin
    const grantedFreeSpin = rarity === 'epic';
    
    return {
      case: caseRecord,
      contract,
      grantedFreeSpin
    };
  }
  
  /**
   * Get rarity display info
   */
  getRarityInfo(rarity: CaseRarity): {
    name: string;
    color: string;
    description: string;
    dropRate: number;
  } {
    switch (rarity) {
      case 'common':
        return {
          name: 'Common',
          color: '#9CA3AF', // Gray
          description: 'Nhiệm vụ cơ bản với phần thưởng tiêu chuẩn',
          dropRate: GAME_CONSTANTS.CASE_RARITY_RATES.COMMON
        };
      case 'advanced':
        return {
          name: 'Advanced',
          color: '#3B82F6', // Blue
          description: 'Nhiệm vụ trung bình với phần thưởng tốt hơn',
          dropRate: GAME_CONSTANTS.CASE_RARITY_RATES.ADVANCED
        };
      case 'epic':
        return {
          name: '🌟 EPIC',
          color: '#A855F7', // Purple
          description: 'Nhiệm vụ DỄ + Phần thưởng CAO + FREE SPIN',
          dropRate: GAME_CONSTANTS.CASE_RARITY_RATES.EPIC
        };
    }
  }
  
  /**
   * Generate animation sequence for case opening
   * Returns array of fake contracts for scrolling effect
   */
  generateAnimationSequence(finalRarity: CaseRarity, seed: number): Contract[] {
    const sequence: Contract[] = [];
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    // Generate 50 contracts for animation
    for (let i = 0; i < 50; i++) {
      const roll = seededRandom() * 100;
      let rarity: CaseRarity;
      
      if (roll < 5) rarity = 'epic';
      else if (roll < 30) rarity = 'advanced';
      else rarity = 'common';
      
      sequence.push(this.generateContractForRarity(rarity));
    }
    
    // Replace middle item with actual result
    const middleIndex = 25;
    sequence[middleIndex] = this.generateContractForRarity(finalRarity);
    
    return sequence;
  }
  
  /**
   * Check if player can open case
   */
  canOpenCase(
    casesOpenedToday: number, 
    hasFreeSpinAvailable: boolean,
    contractCompleted: boolean
  ): ApiResponse<{
    canOpen: boolean;
    reason?: string;
    requiresPayment: boolean;
  }> {
    // Check daily limit first (3 cases max per 24h real-time) - applies to ALL cases including free spins
    if (casesOpenedToday >= GAME_CONSTANTS.MAX_CASES_PER_DAY) {
      return {
        success: false,
        data: {
          canOpen: false,
          reason: 'Đã đạt giới hạn 3 case/24h (thời gian thực)',
          requiresPayment: false
        }
      };
    }
    
    // First case of the day - always available
    if (casesOpenedToday === 0) {
      return {
        success: true,
        data: {
          canOpen: true,
          requiresPayment: true
        }
      };
    }
    
    // Free spin available - no payment required but still counts toward 3/day limit
    if (hasFreeSpinAvailable) {
      return {
        success: true,
        data: {
          canOpen: true,
          requiresPayment: false
        }
      };
    }
    
    // Must complete previous contract before next case
    if (!contractCompleted) {
      return {
        success: false,
        data: {
          canOpen: false,
          reason: 'Phải hoàn thành nhiệm vụ hiện tại trước',
          requiresPayment: false
        }
      };
    }
    
    // Can open next case with payment
    return {
      success: true,
      data: {
        canOpen: true,
        requiresPayment: true
      }
    };
  }
}

export const caseService = new CaseService();
