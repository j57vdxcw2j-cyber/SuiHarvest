// User Profile Types
export interface UserProfile {
  id: string; // Firebase UID
  walletAddress: string; // Sui wallet address
  username: string;
  avatar: string;
  level: number;
  experience: number;
  maxExperience: number;
  joinDate: string; // ISO date string
  lastLogin: string; // ISO date string
  
  // Stats
  totalTransactions: number;
  gachaTransactions: number;
  questTransactions: number;
  
  // Game State
  stamina: number;
  maxStamina: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Transaction Types
export const TransactionType = {
  GACHA: 'gacha',
  QUEST: 'quest',
  TRADE: 'trade',
  TRANSFER: 'transfer'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // SUI amount
  description: string;
  status: TransactionStatus;
  txHash?: string; // Sui blockchain transaction hash
  timestamp: string; // ISO date string
  metadata?: Record<string, any>; // Additional data (item IDs, quest IDs, etc.)
}

// Activity Log Types
export interface Activity {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  icon?: string;
  metadata?: Record<string, any>;
}

// Gacha Result Types
export interface GachaResult {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: string;
  txHash: string;
}

// Quest Types
export const QuestStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CLAIMED: 'claimed'
} as const;

export type QuestStatus = typeof QuestStatus[keyof typeof QuestStatus];

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number; // SUI amount
  experience: number;
  requirements: Record<string, any>;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: QuestStatus;
  progress: number;
  maxProgress: number;
  startedAt: string;
  completedAt?: string;
  claimedAt?: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  experience: number;
  totalTransactions: number;
}

// Auth Types
export interface WalletAuthData {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================
// GAME TYPES - SuiHarvest Gameplay
// ============================================

// Item Categories
export const ItemCategory = {
  CROP: 'crop',
  RESOURCE: 'resource',
  TOOL: 'tool'
} as const;

export type ItemCategory = typeof ItemCategory[keyof typeof ItemCategory];

// Crop Types
export const CropType = {
  CARROT: 'carrot',
  POTATO: 'potato',
  WHEAT: 'wheat'
} as const;

export type CropType = typeof CropType[keyof typeof CropType];

// Resource Types
export const ResourceType = {
  WOOD: 'wood',
  STONE: 'stone',
  COAL: 'coal',
  IRON: 'iron'
} as const;

export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

// Tool Types
export const ToolType = {
  WATERING_CAN: 'watering_can',
  AXE: 'axe',
  PICKAXE: 'pickaxe'
} as const;

export type ToolType = typeof ToolType[keyof typeof ToolType];

// Location Types
export const LocationType = {
  HOME: 'home',
  FARM: 'farm',
  FOREST: 'forest',
  MOUNTAIN: 'mountain',
  SUBMIT_QUEST: 'submit_quest'
} as const;

export type LocationType = typeof LocationType[keyof typeof LocationType];

// Action Types
export const GameActionType = {
  WATER_CROP: 'water_crop',
  CHOP_TREE: 'chop_tree',
  MINE_STONE: 'mine_stone',
  START_DAY: 'start_day',
  END_DAY: 'end_day',
  SUBMIT_CONTRACT: 'submit_contract'
} as const;

export type GameActionType = typeof GameActionType[keyof typeof GameActionType];

// Contract Difficulty (Legacy - now using CaseRarity)
export const ContractDifficulty = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const;

export type ContractDifficulty = typeof ContractDifficulty[keyof typeof ContractDifficulty];

// Case Rarity System (Gacha)
export const CaseRarity = {
  COMMON: 'common',      // 70% - Easy contracts, normal rewards
  ADVANCED: 'advanced',  // 25% - Medium difficulty, better rewards
  EPIC: 'epic'          // 5% - Easy contracts, great rewards + FREE SPIN
} as const;

export type CaseRarity = typeof CaseRarity[keyof typeof CaseRarity];

// Game Item Definition
export interface GameItem {
  id: string;
  name: string;
  category: ItemCategory;
  icon: string;
  description: string;
}

// Crop Item
export interface Crop extends GameItem {
  category: typeof ItemCategory.CROP;
  type: CropType;
  staminaCost: number; // Cost to harvest
  dropRate: number; // Always 100% for crops
}

// Resource Item
export interface Resource extends GameItem {
  category: typeof ItemCategory.RESOURCE;
  type: ResourceType;
  staminaCost: number; // Cost to gather
  dropRate: number; // Probability (0-100)
  location: LocationType;
}

// Tool Item
export interface Tool extends GameItem {
  category: typeof ItemCategory.TOOL;
  type: ToolType;
  usageLocation: LocationType;
}

// Inventory State
export interface Inventory {
  // Crops
  carrot: number;
  potato: number;
  wheat: number;
  // Resources
  wood: number;
  stone: number;
  coal: number;
  iron: number;
}

// Contract Requirements
export interface ContractRequirements {
  wood?: number;
  stone?: number;
  coal?: number;
  iron?: number;
  carrot?: number;
  potato?: number;
  wheat?: number;
}

// Contract Rewards
export interface ContractRewards {
  sui: number; // SUI amount
  famePoints: number; // Fame Points (FP)
}

// Contract Definition
export interface Contract {
  id: string;
  difficulty: ContractDifficulty;
  requirements: ContractRequirements;
  rewards: ContractRewards;
  description: string;
  spawnRate: number; // Probability (0-100)
}

// Game Session State (Daily Loop)
export interface GameSession {
  id: string;
  userId: string;
  walletAddress: string;
  day: number; // Day counter
  startedAt: string; // ISO date
  endedAt?: string; // ISO date
  
  // Daily State
  contract: Contract;
  currentStamina: number;
  maxStamina: number;
  inventory: Inventory;
  
  // Actions Log
  actions: GameAction[];
  
  // Status
  completed: boolean;
  contractSubmitted: boolean;
  dailyFeePaid: boolean; // 0.75 SUI
  
  // Gacha Case System
  casesOpened: number; // Number of cases opened today (max 3)
  currentCaseRarity?: CaseRarity; // Rarity of current contract
  hasFreeSpinAvailable: boolean; // True if Epic was obtained
}

// Game Action Record
export interface GameAction {
  id: string;
  type: GameActionType;
  location: LocationType;
  staminaCost: number;
  result?: {
    itemType?: CropType | ResourceType;
    quantity: number;
    success: boolean;
  };
  timestamp: string; // ISO date
}

// Game State (Persisted in UserProfile)
export interface GameState {
  currentDay: number;
  totalDaysPlayed: number;
  famePoints: number;
  treasureChestsOpened: number;
  
  // Lifetime Stats
  totalContractsCompleted: number;
  totalSuiEarned: number;
  totalStaminaUsed: number;
  
  // Contract Stats by Difficulty
  basicContractsCompleted: number;
  advancedContractsCompleted: number;
  expertContractsCompleted: number;
  
  // Gacha Case Stats
  totalCasesOpened: number;
  commonCasesOpened: number;
  advancedCasesOpened: number;
  epicCasesOpened: number;
  totalFreeSpinsReceived: number;
  
  // Daily Limits (resets every 24 hours real-time)
  lastCaseResetTime?: string; // ISO timestamp when the 24h cycle started
  casesOpenedToday: number; // Current count (max 3)
  
  // Last Session
  lastSessionId?: string;
  lastPlayedAt?: string; // ISO date
  canStartNewDay: boolean;
}

// Treasure Chest
export interface TreasureChest {
  id: string;
  userId: string;
  requiredFamePoints: number; // 100 FP
  suiReward: number;
  claimedAt?: string; // ISO date
  txHash?: string;
}

// Game Constants
export interface GameConstants {
  DAILY_FEE: number; // 0.75 SUI
  MAX_STAMINA: number; // 50
  FAME_POINTS_FOR_CHEST: number; // 100
  
  STAMINA_COSTS: {
    WATER_CROP: number; // 2
    CHOP_TREE: number; // 6
    MINE_STONE: number; // 8
  };
  
  DROP_RATES: {
    CARROT: number; // 100%
    POTATO: number; // 100%
    WHEAT: number; // 100%
    WOOD: number; // 100%
    STONE: number; // 70%
    COAL: number; // 20%
    IRON: number; // 10%
  };
  
  CONTRACT_SPAWN_RATES: {
    BASIC: number; // 50%
    ADVANCED: number; // 35%
    EXPERT: number; // 15%
  };
  
  // Gacha Case System
  CASE_COST: number; // 0.75 SUI per case
  MAX_CASES_PER_DAY: number; // 3 cases maximum
  
  CASE_RARITY_RATES: {
    COMMON: number;   // 70%
    ADVANCED: number; // 25%
    EPIC: number;     // 5%
  };
}

// Contract Case (Gacha Container)
export interface ContractCase {
  id: string;
  userId: string;
  rarity: CaseRarity;
  contract: Contract; // The actual contract obtained from opening
  isFreeSpin: boolean; // True if from Epic bonus
  openedAt: string; // ISO timestamp
  animationSeed: number; // For consistent animation replay
}

// Case Opening Result
export interface CaseOpeningResult {
  case: ContractCase;
  contract: Contract;
  grantedFreeSpin: boolean; // True if Epic - player gets another free case
}
