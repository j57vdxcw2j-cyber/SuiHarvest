import type { Contract, ContractDifficulty, ContractRequirements, Inventory, ApiResponse } from '../types';
import { CONTRACT_TEMPLATES, GAME_CONSTANTS } from '../config/gameConstants';

/**
 * Contract Service
 * Handles contract generation, validation, and rewards
 */

class ContractService {
  /**
   * Generate a random contract based on spawn rates
   */
  generateDailyContract(): Contract {
    const random = Math.random() * 100;
    
    let difficulty: ContractDifficulty;
    
    // Determine difficulty based on spawn rates
    if (random < GAME_CONSTANTS.CONTRACT_SPAWN_RATES.EXPERT) {
      difficulty = 'expert';
    } else if (random < GAME_CONSTANTS.CONTRACT_SPAWN_RATES.EXPERT + GAME_CONSTANTS.CONTRACT_SPAWN_RATES.ADVANCED) {
      difficulty = 'advanced';
    } else {
      difficulty = 'basic';
    }
    
    // Get templates for this difficulty
    const templates = CONTRACT_TEMPLATES[difficulty];
    
    // Weight by spawn rate within difficulty
    const totalWeight = templates.reduce((sum, t) => sum + t.spawnRate, 0);
    const weightedRandom = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (const template of templates) {
      cumulativeWeight += template.spawnRate;
      if (weightedRandom <= cumulativeWeight) {
        // Generate unique ID with timestamp
        return {
          ...template,
          id: `${difficulty}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      }
    }
    
    // Fallback to first template
    return {
      ...templates[0],
      id: `${difficulty}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Validate if inventory meets contract requirements
   */
  validateContract(inventory: Inventory, requirements: ContractRequirements): ApiResponse<boolean> {
    const missingItems: string[] = [];
    
    // Check each requirement
    for (const [item, requiredAmount] of Object.entries(requirements)) {
      const inventoryAmount = inventory[item as keyof Inventory] || 0;
      
      if (inventoryAmount < requiredAmount) {
        missingItems.push(`${item}: ${inventoryAmount}/${requiredAmount}`);
      }
    }
    
    if (missingItems.length > 0) {
      return {
        success: false,
        data: false,
        message: `Thiếu vật phẩm: ${missingItems.join(', ')}`
      };
    }
    
    return {
      success: true,
      data: true,
      message: 'Đủ vật phẩm để nộp hợp đồng'
    };
  }

  /**
   * Calculate total stamina cost to complete a contract (optimistic estimate)
   */
  calculateMinimumStaminaCost(requirements: ContractRequirements): number {
    let totalStamina = 0;
    
    // Crops (2 stamina each)
    totalStamina += (requirements.carrot || 0) * GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP;
    totalStamina += (requirements.potato || 0) * GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP;
    totalStamina += (requirements.wheat || 0) * GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP;
    
    // Wood (6 stamina each)
    totalStamina += (requirements.wood || 0) * GAME_CONSTANTS.STAMINA_COSTS.CHOP_TREE;
    
    // Stone/Coal/Iron (8 stamina each, but with drop rates)
    // Stone: 70% drop rate
    if (requirements.stone) {
      totalStamina += Math.ceil(requirements.stone / (GAME_CONSTANTS.DROP_RATES.STONE / 100)) * GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
    }
    
    // Coal: 20% drop rate
    if (requirements.coal) {
      totalStamina += Math.ceil(requirements.coal / (GAME_CONSTANTS.DROP_RATES.COAL / 100)) * GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
    }
    
    // Iron: 10% drop rate (most expensive)
    if (requirements.iron) {
      totalStamina += Math.ceil(requirements.iron / (GAME_CONSTANTS.DROP_RATES.IRON / 100)) * GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
    }
    
    return totalStamina;
  }

  /**
   * Get contract difficulty description
   */
  getContractDifficultyInfo(difficulty: ContractDifficulty) {
    switch (difficulty) {
      case 'basic':
        return {
          name: 'Cơ Bản',
          color: '#4CAF50',
          description: 'Lỗ vốn SUI, nhưng lãi điểm FP'
        };
      case 'advanced':
        return {
          name: 'Cao Cấp',
          color: '#2196F3',
          description: 'Lãi nhẹ SUI. Đủ để duy trì vốn'
        };
      case 'expert':
        return {
          name: 'Chuyên Gia',
          color: '#FF9800',
          description: 'Lãi đậm (x2-x3 vốn). Rủi ro cao'
        };
    }
  }

  /**
   * Calculate net profit for a contract (reward - daily fee)
   */
  calculateNetProfit(contract: Contract): number {
    return contract.rewards.sui - GAME_CONSTANTS.DAILY_FEE;
  }

  /**
   * Get contract priority recommendation
   */
  getContractStrategy(contract: Contract): {
    priority: 'low' | 'medium' | 'high';
    strategy: string;
  } {
    const netProfit = this.calculateNetProfit(contract);
    
    if (contract.difficulty === 'expert') {
      return {
        priority: 'high',
        strategy: 'Dồn toàn lực vào Mỏ Đá (Mountain). Rủi ro cao nhưng phần thưởng xứng đáng.'
      };
    }
    
    if (contract.difficulty === 'advanced' && netProfit > 0) {
      return {
        priority: 'medium',
        strategy: 'Cân bằng giữa Farm và Forest. Có thể thử vận may ở Mountain nếu dư Stamina.'
      };
    }
    
    return {
      priority: 'low',
      strategy: 'Làm nhanh để lấy điểm FP. Đừng tốn Stamina đào Sắt.'
    };
  }
}

export const contractService = new ContractService();
