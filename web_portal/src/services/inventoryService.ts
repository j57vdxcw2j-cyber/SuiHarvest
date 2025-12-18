import type { Inventory, CropType, ResourceType, ApiResponse } from '../types';
import { EMPTY_INVENTORY } from '../config/gameConstants';

/**
 * Inventory Service
 * Manages player inventory, item addition, and daily burn mechanism
 */

class InventoryService {
  /**
   * Create empty inventory
   */
  createEmptyInventory(): Inventory {
    return { ...EMPTY_INVENTORY };
  }

  /**
   * Add item to inventory
   */
  addItem(inventory: Inventory, itemType: CropType | ResourceType, quantity: number = 1): Inventory {
    return {
      ...inventory,
      [itemType]: (inventory[itemType] || 0) + quantity
    };
  }

  /**
   * Remove item from inventory
   */
  removeItem(inventory: Inventory, itemType: CropType | ResourceType, quantity: number = 1): ApiResponse<Inventory> {
    const currentAmount = inventory[itemType] || 0;
    
    if (currentAmount < quantity) {
      return {
        success: false,
        error: `Không đủ ${itemType}. Có: ${currentAmount}, cần: ${quantity}`
      };
    }
    
    return {
      success: true,
      data: {
        ...inventory,
        [itemType]: currentAmount - quantity
      }
    };
  }

  /**
   * Remove multiple items (for contract submission)
   */
  removeItems(inventory: Inventory, items: Partial<Inventory>): ApiResponse<Inventory> {
    let updatedInventory = { ...inventory };
    
    // Validate first - check if we have enough of all items
    for (const [itemType, quantity] of Object.entries(items)) {
      const currentAmount = inventory[itemType as keyof Inventory] || 0;
      if (currentAmount < quantity) {
        return {
          success: false,
          error: `Không đủ ${itemType}. Có: ${currentAmount}, cần: ${quantity}`
        };
      }
    }
    
    // If validation passes, remove all items
    for (const [itemType, quantity] of Object.entries(items)) {
      updatedInventory = {
        ...updatedInventory,
        [itemType as keyof Inventory]: (updatedInventory[itemType as keyof Inventory] || 0) - quantity
      };
    }
    
    return {
      success: true,
      data: updatedInventory,
      message: 'Đã nộp vật phẩm thành công'
    };
  }

  /**
   * Burn inventory (end of day - Roguelike mechanic)
   * All items are destroyed, returns empty inventory
   */
  burnInventory(): Inventory {
    console.log('🔥 Burning all remaining items...');
    return this.createEmptyInventory();
  }

  /**
   * Get total item count in inventory
   */
  getTotalItemCount(inventory: Inventory): number {
    return Object.values(inventory).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Check if inventory is empty
   */
  isEmpty(inventory: Inventory): boolean {
    return this.getTotalItemCount(inventory) === 0;
  }

  /**
   * Get inventory summary (for display)
   */
  getInventorySummary(inventory: Inventory): Array<{
    type: string;
    name: string;
    icon: string;
    quantity: number;
  }> {
    const summary = [];
    
    if (inventory.carrot > 0) summary.push({ type: 'carrot', name: 'Cà rốt', icon: '🥕', quantity: inventory.carrot });
    if (inventory.potato > 0) summary.push({ type: 'potato', name: 'Khoai tây', icon: '🥔', quantity: inventory.potato });
    if (inventory.wheat > 0) summary.push({ type: 'wheat', name: 'Lúa mì', icon: '🌾', quantity: inventory.wheat });
    if (inventory.wood > 0) summary.push({ type: 'wood', name: 'Gỗ', icon: '🪵', quantity: inventory.wood });
    if (inventory.stone > 0) summary.push({ type: 'stone', name: 'Đá', icon: '🪨', quantity: inventory.stone });
    if (inventory.coal > 0) summary.push({ type: 'coal', name: 'Than', icon: '⚫', quantity: inventory.coal });
    if (inventory.iron > 0) summary.push({ type: 'iron', name: 'Sắt', icon: '🔩', quantity: inventory.iron });
    
    return summary;
  }

  /**
   * Calculate inventory value (estimated SUI worth)
   * Based on typical market values
   */
  estimateInventoryValue(inventory: Inventory): number {
    // Rough estimates based on contract rewards
    const values = {
      carrot: 0.02,
      potato: 0.025,
      wheat: 0.03,
      wood: 0.05,
      stone: 0.03,
      coal: 0.1,
      iron: 0.3
    };
    
    let totalValue = 0;
    for (const [item, quantity] of Object.entries(inventory)) {
      totalValue += (values[item as keyof typeof values] || 0) * quantity;
    }
    
    return totalValue;
  }
}

export const inventoryService = new InventoryService();
