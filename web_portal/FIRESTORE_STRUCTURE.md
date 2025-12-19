# Firestore Database Structure

This document describes the complete Firestore database structure for SuiHarvest game.

## Collections Overview

```
firestore
├── users/                    # User profiles and game progress
│   └── {walletAddress}/
├── gameSessions/             # Daily gameplay sessions
│   └── {sessionId}/
├── transactions/             # Financial transactions (existing)
│   └── {transactionId}/
├── activities/               # Activity logs (existing)
│   └── {activityId}/
└── treasureChests/           # Fame Points reward claims
    └── {chestId}/
```

---

## 1. users/{walletAddress}

**Purpose**: Store user profile, stats, and persistent game state

### Document Structure

```typescript
{
  // User Identity
  id: string,                    // Same as walletAddress
  walletAddress: string,         // Sui wallet address
  username: string,              // Display name
  avatar: string,                // Avatar URL
  
  // Level & Progress
  level: number,
  experience: number,
  maxExperience: number,
  
  // Timestamps
  joinDate: string,              // ISO date
  lastLogin: string,             // ISO date
  createdAt: string,
  updatedAt: string,
  
  // Transaction Stats (existing)
  totalTransactions: number,
  gachaTransactions: number,
  questTransactions: number,
  
  // Current Stamina (resets daily)
  stamina: number,               // Current: 0-50
  maxStamina: number,            // Max: 50
  
  // Game State (NEW)
  gameState: {
    // Daily Progress
    currentDay: number,          // Current day counter
    totalDaysPlayed: number,     // Total days played
    
    // Fame Points System
    famePoints: number,          // Current FP (0-100+)
    treasureChestsOpened: number,
    
    // Lifetime Stats
    totalContractsCompleted: number,
    totalSuiEarned: number,
    totalStaminaUsed: number,
    
    // Contract Completion by Difficulty
    basicContractsCompleted: number,
    advancedContractsCompleted: number,
    expertContractsCompleted: number,
    
    // Session Tracking
    lastSessionId?: string,      // Reference to active session
    lastPlayedAt?: string,       // ISO date
    canStartNewDay: boolean      // Can create new session?
  }
}
```

### Example

```json
{
  "id": "0x225c2f8f197432082bbdf255871c25bb0512f994b06e2143a196049cf9838de7",
  "walletAddress": "0x225c2f8f197432082bbdf255871c25bb0512f994b06e2143a196049cf9838de7",
  "username": "Player_225c2f",
  "level": 5,
  "experience": 1250,
  "stamina": 32,
  "maxStamina": 50,
  "gameState": {
    "currentDay": 12,
    "totalDaysPlayed": 12,
    "famePoints": 45,
    "totalContractsCompleted": 10,
    "totalSuiEarned": 8.75,
    "basicContractsCompleted": 6,
    "advancedContractsCompleted": 3,
    "expertContractsCompleted": 1,
    "canStartNewDay": true
  }
}
```

---

## 2. gameSessions/{sessionId}

**Purpose**: Track a single day's gameplay (daily loop)

### Document Structure

```typescript
{
  // Session Identity
  id: string,                    // Auto-generated session ID
  userId: string,                // Wallet address
  walletAddress: string,         // Sui wallet address
  day: number,                   // Day number
  
  // Timestamps
  startedAt: string,             // ISO date - when day started
  endedAt?: string,              // ISO date - when player slept
  
  // Daily Contract
  contract: {
    id: string,
    difficulty: 'basic' | 'advanced' | 'expert',
    description: string,
    requirements: {              // What items are needed
      wood?: number,
      stone?: number,
      coal?: number,
      iron?: number,
      carrot?: number,
      potato?: number,
      wheat?: number
    },
    rewards: {
      sui: number,               // SUI reward
      famePoints: number         // Fame Points reward
    },
    spawnRate: number
  },
  
  // Current Resources
  currentStamina: number,        // 0-50
  maxStamina: number,            // Always 50
  
  // Inventory (current items)
  inventory: {
    carrot: number,
    potato: number,
    wheat: number,
    wood: number,
    stone: number,
    coal: number,
    iron: number
  },
  
  // Action History
  actions: [
    {
      id: string,
      type: 'water_crop' | 'chop_tree' | 'mine_stone' | 'start_day' | 'end_day' | 'submit_contract',
      location: 'home' | 'farm' | 'forest' | 'mountain' | 'submit_quest',
      staminaCost: number,
      result?: {
        itemType?: string,       // 'carrot', 'wood', 'iron', etc.
        quantity: number,
        success: boolean
      },
      timestamp: string          // ISO date
    }
  ],
  
  // Status Flags
  completed: boolean,            // Day finished?
  contractSubmitted: boolean,    // Contract completed?
  dailyFeePaid: boolean          // 0.75 SUI paid?
}
```

### Example

```json
{
  "id": "session_1734556789_abc123",
  "userId": "0x225c2f8f...",
  "walletAddress": "0x225c2f8f...",
  "day": 13,
  "startedAt": "2025-12-18T10:00:00Z",
  "contract": {
    "id": "advanced_1734556789_xyz",
    "difficulty": "advanced",
    "description": "Giao 8 Gỗ, 3 Than và 5 Lúa mì",
    "requirements": { "wood": 8, "coal": 3, "wheat": 5 },
    "rewards": { "sui": 0.90, "famePoints": 20 }
  },
  "currentStamina": 14,
  "maxStamina": 50,
  "inventory": {
    "wood": 8,
    "coal": 3,
    "wheat": 5,
    "carrot": 0,
    "potato": 0,
    "stone": 2,
    "iron": 0
  },
  "actions": [
    {
      "id": "action_1",
      "type": "chop_tree",
      "location": "forest",
      "staminaCost": 6,
      "result": { "itemType": "wood", "quantity": 1, "success": true },
      "timestamp": "2025-12-18T10:05:00Z"
    }
  ],
  "completed": false,
  "contractSubmitted": false,
  "dailyFeePaid": true
}
```

---

## 3. treasureChests/{chestId}

**Purpose**: Track Fame Points reward claims (100 FP → Random SUI)

### Document Structure

```typescript
{
  id: string,                    // Auto-generated chest ID
  userId: string,                // Wallet address
  requiredFamePoints: number,    // Always 100
  suiReward: number,             // Random 1.5 - 2.5 SUI
  claimedAt?: string,            // ISO date
  txHash?: string                // Blockchain transaction hash
}
```

### Example

```json
{
  "id": "chest_1734556789_xyz",
  "userId": "0x225c2f8f...",
  "requiredFamePoints": 100,
  "suiReward": 1.87,
  "claimedAt": "2025-12-18T15:30:00Z",
  "txHash": "0xabcdef..."
}
```

---

## 4. transactions/{transactionId} (Existing)

**Purpose**: Financial transaction history

### Document Structure

```typescript
{
  id: string,
  userId: string,
  type: 'gacha' | 'quest' | 'trade' | 'transfer',
  amount: number,                // SUI amount
  description: string,
  status: 'pending' | 'success' | 'failed',
  txHash?: string,
  timestamp: string,
  metadata?: object
}
```

---

## 5. activities/{activityId} (Existing)

**Purpose**: Activity feed/log

### Document Structure

```typescript
{
  id: string,
  userId: string,
  type: string,
  title: string,
  description: string,
  timestamp: string,
  icon?: string,
  metadata?: object
}
```

---

## Firestore Security Rules (Updated)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{walletAddress} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                       request.resource.data.walletAddress == walletAddress &&
                       request.resource.data.id == walletAddress;
      allow update: if isAuthenticated() && 
                       resource.data.walletAddress == walletAddress;
      allow delete: if false;
    }
    
    // Game Sessions
    match /gameSessions/{sessionId} {
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid ||
                     exists(/databases/$(database)/documents/users/$(resource.data.userId));
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
                       exists(/databases/$(database)/documents/users/$(resource.data.userId));
      allow delete: if false;
    }
    
    // Treasure Chests
    match /treasureChests/{chestId} {
      allow read: if isAuthenticated() &&
                     exists(/databases/$(database)/documents/users/$(resource.data.userId));
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
                       exists(/databases/$(database)/documents/users/$(resource.data.userId));
      allow delete: if false;
    }
    
    // Transactions (existing)
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && 
                     exists(/databases/$(database)/documents/users/$(resource.data.userId));
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    // Activities (existing)
    match /activities/{activityId} {
      allow read: if isAuthenticated() && 
                     exists(/databases/$(database)/documents/users/$(resource.data.userId));
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    // Default: Deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Query Examples

### Get Current Active Session
```typescript
const userRef = doc(db, 'users', walletAddress);
const userDoc = await getDoc(userRef);
const sessionId = userDoc.data().gameState?.lastSessionId;

if (sessionId) {
  const sessionRef = doc(db, 'gameSessions', sessionId);
  const session = await getDoc(sessionRef);
}
```

### Get All Treasure Chests for User
```typescript
const q = query(
  collection(db, 'treasureChests'),
  where('userId', '==', walletAddress)
);
const snapshot = await getDocs(q);
```

### Get Recent Game Sessions
```typescript
const q = query(
  collection(db, 'gameSessions'),
  where('userId', '==', walletAddress),
  where('completed', '==', true)
);
const snapshot = await getDocs(q);
```

---

## Data Flow

### Daily Loop Flow

1. **Start Day** → Create `gameSession` doc
   - Generate random contract
   - Initialize stamina to 50
   - Empty inventory

2. **Player Actions** → Update `gameSession`
   - Deduct stamina
   - Add items to inventory
   - Log actions

3. **Submit Contract** → Update `gameSession` + `users`
   - Validate inventory
   - Remove items from inventory
   - Add fame points to user
   - Update stats

4. **End Day** → Update `gameSession` + `users`
   - Mark session as completed
   - Burn remaining inventory
   - Allow starting new day

5. **Claim Treasure Chest** (if FP >= 100)
   - Create `treasureChest` doc
   - Deduct 100 FP from user
   - Initiate SUI transfer

---

## Indexes Required

Firebase will prompt you to create these indexes when queries fail:

### gameSessions
- `userId` (Ascending) + `completed` (Ascending)
- `userId` (Ascending) + `day` (Descending)

### treasureChests
- `userId` (Ascending) + `claimedAt` (Descending)

### transactions (existing)
- `userId` (Ascending) + `timestamp` (Descending)

### activities (existing)
- `userId` (Ascending) + `timestamp` (Descending)

---

## Migration Notes

### For Existing Users

If you have existing users in production, run this migration:

```typescript
async function migrateExistingUsers() {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  
  for (const userDoc of usersSnapshot.docs) {
    const data = userDoc.data();
    
    // Only migrate if gameState doesn't exist
    if (!data.gameState) {
      await updateDoc(userDoc.ref, {
        'gameState': {
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
          canStartNewDay: true
        },
        stamina: 50,
        maxStamina: 50
      });
      
      console.log(`Migrated user: ${userDoc.id}`);
    }
  }
}
```

---

## Best Practices

1. **Always use transactions** for critical operations (contract submission, chest claims)
2. **Validate inventory** before allowing contract submission
3. **Log all actions** in `gameSessions.actions` for debugging
4. **Cleanup old sessions** periodically (older than 30 days)
5. **Use batch writes** when updating multiple documents
6. **Cache active session** in client to reduce Firestore reads

---

## Cost Optimization

- **Reads**: ~1-3 per action (session + user profile)
- **Writes**: ~1-2 per action (session update + user stamina)
- **Per day**: ~20-50 operations (assuming 10-20 actions per session)
- **Monthly cost** (1000 active users): ~$5-10

To reduce costs:
- Cache session data in React state
- Batch action updates (update every 3 actions instead of every action)
- Use local state for inventory, sync on contract submission only
