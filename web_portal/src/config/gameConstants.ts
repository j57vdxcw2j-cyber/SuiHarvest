import type {
  GameConstants,
  Crop,
  Resource,
  Tool,
  Contract,
  CropType,
  ResourceType,
  ToolType,
  ContractDifficulty
} from '../types';

/**
 * Game Constants for SuiHarvest
 * Based on gameplay document
 */

export const GAME_CONSTANTS: GameConstants = {
  DAILY_FEE: 0.75, // SUI
  MAX_STAMINA: 50,
  FAME_POINTS_FOR_CHEST: 100,
  
  // Gacha Case System
  CASE_COST: 0.75, // SUI per case opening
  MAX_CASES_PER_DAY: 3, // Maximum 3 cases per real-time day
  
  CASE_RARITY_RATES: {
    COMMON: 75,    // 75% chance - LOW rewards (player LOSES money)
    ADVANCED: 22,  // 22% chance - Breakeven or slight loss
    EPIC: 3        // 3% chance - HIGH rewards (player PROFITS) + FREE SPIN
  },
  
  STAMINA_COSTS: {
    WATER_CROP: 2,
    CHOP_TREE: 6,
    MINE_STONE: 8
  },
  
  DROP_RATES: {
    // Crops - Always 100%
    CARROT: 100,
    POTATO: 100,
    WHEAT: 100,
    
    // Forest - Always wood
    WOOD: 100,
    
    // Mountain - Random minerals
    STONE: 70,
    COAL: 20,
    IRON: 10
  },
  
  CONTRACT_SPAWN_RATES: {
    BASIC: 50,
    ADVANCED: 35,
    EXPERT: 15
  }
};

/**
 * Crop Definitions
 */
export const CROPS: Record<CropType, Crop> = {
  carrot: {
    id: 'carrot',
    name: 'Cà rốt',
    category: 'crop',
    type: 'carrot',
    icon: '🥕',
    description: 'Nông sản phổ biến nhất',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP,
    dropRate: GAME_CONSTANTS.DROP_RATES.CARROT
  },
  potato: {
    id: 'potato',
    name: 'Khoai tây',
    category: 'crop',
    type: 'potato',
    icon: '🥔',
    description: 'Thường dùng cho Hợp đồng cấp trung',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP,
    dropRate: GAME_CONSTANTS.DROP_RATES.POTATO
  },
  wheat: {
    id: 'wheat',
    name: 'Lúa mì',
    category: 'crop',
    type: 'wheat',
    icon: '🌾',
    description: 'Nông sản thiết yếu',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.WATER_CROP,
    dropRate: GAME_CONSTANTS.DROP_RATES.WHEAT
  }
};

/**
 * Resource Definitions
 */
export const RESOURCES: Record<ResourceType, Resource> = {
  wood: {
    id: 'wood',
    name: 'Gỗ',
    category: 'resource',
    type: 'wood',
    icon: '🪵',
    description: 'Tài nguyên cốt lõi. Hầu hết mọi Hợp đồng đều cần Gỗ',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.CHOP_TREE,
    dropRate: GAME_CONSTANTS.DROP_RATES.WOOD,
    location: 'forest'
  },
  stone: {
    id: 'stone',
    name: 'Đá',
    category: 'resource',
    type: 'stone',
    icon: '🪨',
    description: 'Tỷ lệ rơi 70%. Giá trị thấp',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE,
    dropRate: GAME_CONSTANTS.DROP_RATES.STONE,
    location: 'mountain'
  },
  coal: {
    id: 'coal',
    name: 'Than',
    category: 'resource',
    type: 'coal',
    icon: '⚫',
    description: 'Tỷ lệ rơi 20%. Giá trị trung bình',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE,
    dropRate: GAME_CONSTANTS.DROP_RATES.COAL,
    location: 'mountain'
  },
  iron: {
    id: 'iron',
    name: 'Sắt',
    category: 'resource',
    type: 'iron',
    icon: '🔩',
    description: 'Tỷ lệ rơi 10%. Giá trị cực cao. Cần thiết cho Hợp đồng Expert',
    staminaCost: GAME_CONSTANTS.STAMINA_COSTS.MINE_STONE,
    dropRate: GAME_CONSTANTS.DROP_RATES.IRON,
    location: 'mountain'
  }
};

/**
 * Tool Definitions
 */
export const TOOLS: Record<ToolType, Tool> = {
  watering_can: {
    id: 'watering_can',
    name: 'Bình Tưới Nước',
    category: 'tool',
    type: 'watering_can',
    icon: '💧',
    description: 'Dùng để tưới nước cho cây trồng',
    usageLocation: 'farm'
  },
  axe: {
    id: 'axe',
    name: 'Rìu Cùn',
    category: 'tool',
    type: 'axe',
    icon: '🪓',
    description: 'Dùng để chặt cây lấy gỗ',
    usageLocation: 'forest'
  },
  pickaxe: {
    id: 'pickaxe',
    name: 'Cuốc Chim',
    category: 'tool',
    type: 'pickaxe',
    icon: '⛏️',
    description: 'Dùng để đập đá và khai thác quặng',
    usageLocation: 'mountain'
  }
};

/**
 * Contract Templates by Difficulty
 */
export const CONTRACT_TEMPLATES: Record<ContractDifficulty, Contract[]> = {
  basic: [
    {
      id: 'basic_1',
      difficulty: 'basic',
      description: 'Giao 5 Gỗ và 3 Đá',
      requirements: { wood: 5, stone: 3 },
      rewards: { sui: 0.45, famePoints: 10 },
      spawnRate: 30
    },
    {
      id: 'basic_2',
      difficulty: 'basic',
      description: 'Giao 10 Cà rốt',
      requirements: { carrot: 10 },
      rewards: { sui: 0.45, famePoints: 10 },
      spawnRate: 20
    },
    {
      id: 'basic_3',
      difficulty: 'basic',
      description: 'Giao 3 Gỗ và 5 Cà rốt',
      requirements: { wood: 3, carrot: 5 },
      rewards: { sui: 0.40, famePoints: 10 },
      spawnRate: 25
    },
    {
      id: 'basic_4',
      difficulty: 'basic',
      description: 'Giao 7 Khoai tây và 2 Gỗ',
      requirements: { potato: 7, wood: 2 },
      rewards: { sui: 0.50, famePoints: 10 },
      spawnRate: 25
    }
  ],
  
  advanced: [
    {
      id: 'advanced_1',
      difficulty: 'advanced',
      description: 'Giao 8 Gỗ, 3 Than và 5 Lúa mì',
      requirements: { wood: 8, coal: 3, wheat: 5 },
      rewards: { sui: 0.90, famePoints: 20 },
      spawnRate: 30
    },
    {
      id: 'advanced_2',
      difficulty: 'advanced',
      description: 'Giao 10 Khoai tây, 5 Gỗ và 2 Than',
      requirements: { potato: 10, wood: 5, coal: 2 },
      rewards: { sui: 0.95, famePoints: 20 },
      spawnRate: 30
    },
    {
      id: 'advanced_3',
      difficulty: 'advanced',
      description: 'Giao 12 Gỗ và 4 Than',
      requirements: { wood: 12, coal: 4 },
      rewards: { sui: 0.85, famePoints: 20 },
      spawnRate: 40
    }
  ],
  
  expert: [
    {
      id: 'expert_1',
      difficulty: 'expert',
      description: 'Giao 2 Sắt, 10 Gỗ và 5 Than',
      requirements: { iron: 2, wood: 10, coal: 5 },
      rewards: { sui: 2.00, famePoints: 50 },
      spawnRate: 40
    },
    {
      id: 'expert_2',
      difficulty: 'expert',
      description: 'Giao 3 Sắt và 15 Gỗ',
      requirements: { iron: 3, wood: 15 },
      rewards: { sui: 2.20, famePoints: 50 },
      spawnRate: 30
    },
    {
      id: 'expert_3',
      difficulty: 'expert',
      description: 'Giao 20 Gỗ, 8 Than và 1 Sắt',
      requirements: { wood: 20, coal: 8, iron: 1 },
      rewards: { sui: 1.80, famePoints: 50 },
      spawnRate: 30
    }
  ]
};

/**
 * Gacha Case Contract Templates
 * Epic rarity = EASIER requirements + HIGHER rewards + FREE SPIN
 */
export const CASE_CONTRACT_TEMPLATES: {
  common: Contract[];
  advanced: Contract[];
  epic: Contract[];
} = {
  // Common Cases (75%) - LOW rewards, player LOSES money (cost 0.75 SUI)
  common: [
    {
      id: 'common_1',
      difficulty: 'basic' as ContractDifficulty,
      description: 'Giao 5 Cà rốt',
      requirements: { carrot: 5 },
      rewards: { sui: 0.30, famePoints: 10 },
      spawnRate: 20
    },
    {
      id: 'common_2',
      difficulty: 'basic' as ContractDifficulty,
      description: 'Giao 6 Khoai tây',
      requirements: { potato: 6 },
      rewards: { sui: 0.35, famePoints: 10 },
      spawnRate: 20
    },
    {
      id: 'common_3',
      difficulty: 'basic' as ContractDifficulty,
      description: 'Giao 8 Lúa mì',
      requirements: { wheat: 8 },
      rewards: { sui: 0.40, famePoints: 10 },
      spawnRate: 20
    },
    {
      id: 'common_4',
      difficulty: 'basic' as ContractDifficulty,
      description: 'Giao 5 Gỗ',
      requirements: { wood: 5 },
      rewards: { sui: 0.45, famePoints: 10 },
      spawnRate: 20
    },
    {
      id: 'common_5',
      difficulty: 'basic' as ContractDifficulty,
      description: 'Giao 3 Đá',
      requirements: { stone: 3 },
      rewards: { sui: 0.50, famePoints: 10 },
      spawnRate: 20
    }
  ],
  
  // Advanced Cases (22%) - Breakeven or slight loss
  advanced: [
    {
      id: 'advanced_1',
      difficulty: 'advanced' as ContractDifficulty,
      description: 'Giao 10 Gỗ và 4 Đá',
      requirements: { wood: 10, stone: 4 },
      rewards: { sui: 0.65, famePoints: 25 },
      spawnRate: 33
    },
    {
      id: 'advanced_2',
      difficulty: 'advanced' as ContractDifficulty,
      description: 'Giao 8 Gỗ và 2 Than',
      requirements: { wood: 8, coal: 2 },
      rewards: { sui: 0.70, famePoints: 25 },
      spawnRate: 33
    },
    {
      id: 'advanced_3',
      difficulty: 'advanced' as ContractDifficulty,
      description: 'Giao 15 Gỗ và 1 Than',
      requirements: { wood: 15, coal: 1 },
      rewards: { sui: 0.60, famePoints: 25 },
      spawnRate: 34
    }
  ],
  
  // Epic Cases (3%) - EASY requirements + HIGH rewards (player PROFITS) + FREE SPIN
  epic: [
    {
      id: 'epic_1',
      difficulty: 'expert' as ContractDifficulty, // Still marked expert for rewards tracking
      description: '🌟 EPIC! Giao chỉ 3 Gỗ',
      requirements: { wood: 3 },
      rewards: { sui: 1.50, famePoints: 80 }, // +0.75 SUI profit
      spawnRate: 30
    },
    {
      id: 'epic_2',
      difficulty: 'expert' as ContractDifficulty,
      description: '🌟 EPIC! Giao 5 Cà rốt và 2 Đá',
      requirements: { carrot: 5, stone: 2 },
      rewards: { sui: 2.00, famePoints: 80 }, // +1.25 SUI profit
      spawnRate: 30
    },
    {
      id: 'epic_3',
      difficulty: 'expert' as ContractDifficulty,
      description: '🌟 EPIC! Giao 8 Lúa mì',
      requirements: { wheat: 8 },
      rewards: { sui: 2.50, famePoints: 100 }, // +1.75 SUI profit, Instant chest eligible!
      spawnRate: 40
    }
  ]
};

/**
 * Location Descriptions
 */
export const LOCATIONS = {
  home: {
    id: 'home',
    name: 'Nhà',
    description: 'Một túp lều nhỏ với đống lửa trại. Điểm hồi sinh và kết thúc ngày.',
    icon: '🏠'
  },
  farm: {
    id: 'farm',
    name: 'Nông Trại',
    description: 'Những ô đất tơi xốp chờ gieo hạt. Chi phí thấp, rủi ro bằng 0.',
    icon: '🌱',
    risk: 'low'
  },
  forest: {
    id: 'forest',
    name: 'Rừng Rậm',
    description: 'Khu rừng già với những cây cổ thụ. Tiêu hao vừa phải. Luôn cần thiết.',
    icon: '🌲',
    risk: 'medium'
  },
  mountain: {
    id: 'mountain',
    name: 'Đỉnh Núi',
    description: 'Vách núi đá hiểm trở và các mỏ quặng lộ thiên. Rủi ro cao, phần thưởng lớn.',
    icon: '⛰️',
    risk: 'high'
  },
  submit_quest: {
    id: 'submit_quest',
    name: 'Trạm Giao Nhiệm Vụ',
    description: 'Một con đường đất với chiếc xe ngựa thồ hàng.',
    icon: '🛒'
  }
} as const;

/**
 * Empty Inventory Template
 */
export const EMPTY_INVENTORY = {
  carrot: 0,
  potato: 0,
  wheat: 0,
  wood: 0,
  stone: 0,
  coal: 0,
  iron: 0
};
