import type { GameActionType, CropType, ResourceType, ApiResponse } from '../types';
import { GAME_CONSTANTS, RESOURCES, CROPS } from '../config/gameConstants';

/**
 * Resource Service
 * Handles resource harvesting, drop rate calculations, and action results
 */

class ResourceService {
  /**
   * Perform a farm action (water crop)
   * Always returns 1 crop (100% drop rate)
   */
  waterCrop(cropType: CropType): ApiResponse<{
    itemType: CropType;
    quantity: number;
    staminaCost: number;
  }> {
    const crop = CROPS[cropType];
    
    return {
      success: true,
      data: {
        itemType: cropType,
        quantity: 1,
        staminaCost: crop.staminaCost
      },
      message: `Đã thu hoạch 1 ${crop.name}`
    };
  }

  /**
   * Perform a forest action (chop tree)
   * Always returns 1 wood (100% drop rate)
   */
  chopTree(): ApiResponse<{
    itemType: ResourceType;
    quantity: number;
    staminaCost: number;
  }> {
    const wood = RESOURCES.wood;
    
    return {
      success: true,
      data: {
        itemType: 'wood',
        quantity: 1,
        staminaCost: wood.staminaCost
      },
      message: `Đã chặt được 1 ${wood.name}`
    };
  }

  /**
   * Perform a mountain action (mine stone)
   * Random drop: Stone (70%), Coal (20%), Iron (10%)
   */
  mineStone(): ApiResponse<{
    itemType: ResourceType;
    quantity: number;
    staminaCost: number;
  }> {
    const random = Math.random() * 100;
    
    let resourceType: ResourceType;
    let resource;
    
    // Determine drop based on rates
    if (random < GAME_CONSTANTS.DROP_RATES.IRON) {
      // 0-10: Iron (10%)
      resourceType = 'iron';
      resource = RESOURCES.iron;
    } else if (random < GAME_CONSTANTS.DROP_RATES.IRON + GAME_CONSTANTS.DROP_RATES.COAL) {
      // 10-30: Coal (20%)
      resourceType = 'coal';
      resource = RESOURCES.coal;
    } else {
      // 30-100: Stone (70%)
      resourceType = 'stone';
      resource = RESOURCES.stone;
    }
    
    return {
      success: true,
      data: {
        itemType: resourceType,
        quantity: 1,
        staminaCost: resource.staminaCost
      },
      message: `Đã khai thác được 1 ${resource.name}${resourceType === 'iron' ? ' 🎉' : ''}`
    };
  }

  /**
   * Perform action based on type
   */
  performAction(actionType: GameActionType, params?: { cropType?: CropType }): ApiResponse<{
    itemType: CropType | ResourceType;
    quantity: number;
    staminaCost: number;
  }> {
    switch (actionType) {
      case 'water_crop':
        if (!params?.cropType) {
          return {
            success: false,
            error: 'Crop type is required for watering action'
          };
        }
        return this.waterCrop(params.cropType);
      
      case 'chop_tree':
        return this.chopTree();
      
      case 'mine_stone':
        return this.mineStone();
      
      default:
        return {
          success: false,
          error: `Unknown action type: ${actionType}`
        };
    }
  }

  /**
   * Calculate stamina cost for an action
   */
  getStaminaCost(actionType: GameActionType): number {
    switch (actionType) {
      case 'water_crop':
        return GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP;
      case 'chop_tree':
        return GAME_CONSTANTS.STAMINA_COSTS.CHOP_TREE;
      case 'mine_stone':
        return GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
      default:
        return 0;
    }
  }

  /**
   * Get action description
   */
  getActionDescription(actionType: GameActionType): string {
    switch (actionType) {
      case 'water_crop':
        return 'Tưới nước cho cây trồng';
      case 'chop_tree':
        return 'Chặt cây lấy gỗ';
      case 'mine_stone':
        return 'Đào đá và khoáng sản';
      case 'start_day':
        return 'Bắt đầu ngày mới';
      case 'end_day':
        return 'Kết thúc ngày và ngủ';
      case 'submit_contract':
        return 'Nộp hợp đồng';
      default:
        return 'Hành động không xác định';
    }
  }

  /**
   * Simulate multiple mining attempts (for strategy planning)
   * Returns average stamina cost to get desired items
   */
  simulateMiningStrategy(targetStone: number = 0, targetCoal: number = 0, targetIron: number = 0): {
    averageAttempts: number;
    averageStamina: number;
    minStamina: number;
    maxStamina: number;
  } {
    // Calculate expected attempts for each resource
    const stoneAttempts = targetStone / (GAME_CONSTANTS.DROP_RATES.STONE / 100);
    const coalAttempts = targetCoal / (GAME_CONSTANTS.DROP_RATES.COAL / 100);
    const ironAttempts = targetIron / (GAME_CONSTANTS.DROP_RATES.IRON / 100);
    
    // Total expected attempts (worst case - need all different types)
    const totalAttempts = Math.max(stoneAttempts, coalAttempts, ironAttempts);
    const averageStamina = totalAttempts * GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
    
    // Best case: Get exactly what you need
    const minAttempts = targetStone + targetCoal + targetIron;
    const minStamina = minAttempts * GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
    
    // Worst case: 2x expected attempts (unlucky)
    const maxStamina = totalAttempts * 2 * GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE;
    
    return {
      averageAttempts: Math.ceil(totalAttempts),
      averageStamina: Math.ceil(averageStamina),
      minStamina: minStamina,
      maxStamina: Math.ceil(maxStamina)
    };
  }
}

export const resourceService = new ResourceService();
