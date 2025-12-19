
<img width="2816" height="1536" alt="SuiHarvest" src="https://github.com/user-attachments/assets/5a841fe4-6bfb-494d-a7f4-70807b1da5b0" />

> A Blockchain-Powered Farming Game on Sui Network

[![Sui Network](https://img.shields.io/badge/Sui-Network-4DA2FF?style=flat&logo=sui&logoColor=white)](https://sui.io/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/)

**SuiHarvest** is a Web3 farming simulation game built on the Sui blockchain, combining traditional farming game mechanics with blockchain technology. Players can farm crops, mine resources, craft tools, and earn rewards through on-chain interactions.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Building Plan](#-building-plan)
- [Web Implementation](#-web-implementation)
- [Game Implementation](#-game-implementation)
- [Smart Contract Structure](#-smart-contract-structure)
- [Smart Contract Logic](#-smart-contract-logic)
- [Guidelines](#-guidelines)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

SuiHarvest is a decentralized farming game where players:
- Pay a daily entry fee (0.75 SUI) to access the game
- Manage stamina to perform various farming activities
- Complete contracts to earn Fame Points and rewards
- Collect and trade NFT items (seeds, crops, ores, tools)
- Compete on leaderboards and unlock treasure chests

The game integrates:
- **Sui Blockchain** for transparent, trustless transactions
- **Firebase** for user management and game state
- **React** for responsive, modern UI
- **TypeScript** for type-safe development

---

## Features

### Core Gameplay
- **Daily Entry System**: Pay 0.75 SUI to play each day
- **Stamina Management**: 50 stamina points for strategic gameplay
- **Multiple Activities**:
  - **Farm**: Plant and harvest crops (15 stamina)
  - **Chop Wood**: Gather wood resources (10 stamina)
  - **Mine Stone**: Extract stone materials (10 stamina)
- **Contract System**: Complete tasks for rewards and Fame Points
- **Inventory Management**: Collect and organize items
- **Treasure Chests**: Unlock rewards based on Fame Points milestones

### User Features
- **Wallet Authentication**: Connect with Sui Wallet
- **Profile Dashboard**: Track progress and stats
- **Inventory System**: Manage seeds, crops, ores, and tools
- **Fame Points**: Earn reputation through gameplay
- **Reward Claims**: Withdraw earnings from contracts

### Admin Dashboard
- **Treasury Management**: Monitor and manage game treasury
- **Account Management**: Track users and their activity
- **Game Maintenance**: Control game settings and parameters
- **Analytics**: Real-time statistics and transaction monitoring
- **Secure Access**: Multi-layer authentication with wallet verification

---

## Tech Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **@mysten/dapp-kit** - Sui wallet integration
- **@tanstack/react-query** - State management

### Backend
- **Firebase Authentication** - User authentication
- **Firestore Database** - Game state and user data
- **Firebase Storage** - Asset storage (ready)
- **Cloud Functions** - Serverless backend (ready)

### Blockchain
- **Sui Network (Testnet)** - Blockchain infrastructure
- **Move Language** - Smart contract development
- **@mysten/sui.js** - Sui SDK for JavaScript

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TS linting rules
- **Vite Preview** - Production build testing

---

## Project Structure

```
SuiHarvest/
├── 📂 web_portal/                    # Frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/            # React components
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── Wiki.tsx              # Documentation
│   │   │   ├── Game.tsx              # Main game interface
│   │   │   ├── Contact.tsx           # Contact form
│   │   │   ├── AdminDashboard.tsx    # Admin main page
│   │   │   ├── AdminSidebar.tsx      # Admin navigation
│   │   │   ├── SuiManagement.tsx     # Treasury operations
│   │   │   ├── AccountManagement.tsx # User monitoring
│   │   │   ├── MaintenanceManagement.tsx # Game settings
│   │   │   ├── Navigation.tsx        # Main navigation
│   │   │   └── ConnectModal.tsx      # Wallet connection
│   │   │
│   │   ├── 📂 config/
│   │   │   └── firebase.ts           # Firebase configuration
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── authService.ts        # Authentication logic
│   │   │   ├── userService.ts        # User data management
│   │   │   ├── gameStateService.ts   # Game state management
│   │   │   └── suiBlockchainService.ts # Blockchain interactions
│   │   │
│   │   ├── 📂 contexts/
│   │   │   └── AuthContext.tsx       # Auth state provider
│   │   │
│   │   ├── 📂 types/
│   │   │   └── index.ts              # TypeScript type definitions
│   │   │
│   │   ├── 📂 styles/
│   │   │   └── globals.css           # Global styles
│   │   │
│   │   ├── App.tsx                   # Root component
│   │   └── main.tsx                  # Entry point
│   │
│   ├── 📂 public/                    # Static assets
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── vite.config.ts                # Vite config
│   └── .env                          # Environment variables
│
├── 📂 sui_contracts/                 # Smart contracts
│   ├── 📂 sources/
│   │   ├── inventory.move            # NFT items (Seed, Crop, Ore, Tool)
│   │   └── trader.move               # Trading & crafting logic
│   │
│   ├── 📂 tests/
│   │   ├── inventory_tests.move      # Inventory tests
│   │   └── trader_tests.move         # Trader tests
│   │
│   ├── Move.toml                     # Move package config
│   └── 📂 build/                     # Compiled bytecode
│
├── 📂 design_assets/                 # Game assets
│   ├── 📂 characters/                # Character sprites
│   ├── 📂 environment/               # Environment tiles
│   ├── 📂 items_icons/               # Item icons
│   ├── 📂 ui/                        # UI elements
│   └── 📂 audio/                     # Sound effects & music
│
└── README.md                         # This file
```

---

## Setup & Installation

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v18+ and npm
- **Sui Wallet** browser extension ([Install](https://chrome.google.com/webstore/detail/sui-wallet))
- **Firebase Account** ([Sign up](https://firebase.google.com/))
- **Sui CLI** (optional, for smart contract development)
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SuiHarvest.git
cd SuiHarvest
```

#### 2. Frontend Setup

```bash
# Navigate to web portal
cd web_portal

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### 3. Configure Environment Variables

Edit `web_portal/.env` with your Firebase credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Sui Contract Configuration (Update after deployment)
VITE_SUI_PACKAGE_ID=0x...
VITE_SUI_TREASURY_ID=0x...
VITE_SUI_ADMIN_CAP_ID=0x...
```

#### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Anonymous** provider
4. Create **Firestore Database** (Start in test mode)
5. Copy configuration to `.env`

**Firestore Collections** (auto-created on first use):
```
users/              # User profiles & game state
gameSessions/       # Daily gameplay sessions
transactions/       # Financial transactions
activities/         # Activity logs
treasureChests/     # Fame Points rewards
admin_accounts/     # Admin accounts
```

#### 5. Run Development Server

```bash
# From web_portal directory
npm run dev
```

The application will be available at `http://localhost:5173`

#### 6. Smart Contract Deployment (Optional)

```bash
# Navigate to contracts directory
cd sui_contracts

# Build contracts
sui move build

# Test contracts
sui move test

# Deploy to Sui Testnet
sui client publish --gas-budget 100000000
```

After deployment, update `.env` with the package IDs.

---

## Building Plan

### Phase 1: Foundation 
- [x] Project structure setup
- [x] Firebase integration
- [x] Basic UI components (Home, Wiki, Contact)
- [x] Wallet connection system
- [x] Authentication flow

### Phase 2: Core Game 
- [x] Game interface design
- [x] Stamina system
- [x] Action buttons (Farm, Chop, Mine)
- [x] Contract system
- [x] Inventory management
- [x] Fame Points tracking
- [x] Daily entry fee integration

### Phase 3: Admin Dashboard 
- [x] Admin authentication
- [x] Treasury management UI
- [x] Account management system
- [x] Transaction monitoring
- [x] Game maintenance controls
- [x] Real-time statistics

### Phase 4: Smart Contracts 
- [x] Inventory module (NFT items)
- [x] Trader module (buy/sell/craft)
- [x] Treasury system
- [x] Admin capabilities
- [x] Test coverage

### Phase 5: Integration & Polish 
- [ ] Full blockchain integration
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment

### Phase 6: Future Features 
- [ ] Multiplayer interactions
- [ ] Guild system
- [ ] Advanced crafting recipes
- [ ] Seasonal events
- [ ] Mobile app version

---

## Web Implementation

### Architecture

The web portal follows a modern React architecture with separation of concerns:

```
Components → Services → Firebase/Blockchain
    ↓           ↓            ↓
  UI Logic   Business    Data Layer
             Logic
```

### Key Components

#### 1. **Navigation System**
- Hash-based routing (`/#home`, `/#wiki`, `/#game`, etc.)
- Responsive navigation bar
- Mobile-friendly menu

```typescript
// App.tsx - Route handling
const renderPage = () => {
  switch (location.hash) {
    case '#home': return <Home />;
    case '#wiki': return <Wiki />;
    case '#game': return <Game />;
    // ...
  }
}
```

#### 2. **Authentication Flow**

**User Authentication:**
```typescript
// 1. Connect wallet
const connectWallet = async () => {
  await connect();
  const address = currentAccount.address;
  
  // 2. Check/create user profile
  const user = await getUserProfile(address);
  if (!user) {
    await createUser(address);
  }
}
```

**Admin Authentication:**
```typescript
// 1. Navigate to /#admin
// 2. Enter username + password
// 3. Connect wallet
// 4. Verify wallet address matches admin list
// 5. Grant admin access
```

#### 3. **Game Component**

The main game interface manages:
- **State Management**: Stamina, inventory, contracts
- **Action Handlers**: Farm, chop, mine
- **Contract System**: Create, progress, complete
- **Real-time Updates**: Firebase listeners

```typescript
const handleFarm = async () => {
  if (stamina < 15) return showError('Not enough stamina');
  
  // Deduct stamina
  setStamina(prev => prev - 15);
  
  // Update game state
  await updateGameSession({
    stamina: stamina - 15,
    actions: [...actions, { type: 'farm', timestamp: Date.now() }]
  });
  
  // Blockchain interaction (optional)
  await buyAndHarvestSeed();
}
```

#### 4. **Admin Dashboard**

Three main sections:

**A. Sui Management**
- Display treasury balance
- Deposit/withdraw SUI
- Transaction history

**B. Account Management**
- User list with stats
- Activity monitoring
- Transaction logs

**C. Maintenance Management**
- Game settings (entry fee, stamina costs)
- Enable/disable features
- Announcement system

### Services Layer

#### authService.ts
```typescript
- signInWithWallet(address: string)
- signOut()
- getCurrentUser()
- isAdmin(address: string)
```

#### userService.ts
```typescript
- createUser(address: string)
- getUserProfile(address: string)
- updateUserProfile(data: Partial<User>)
- recordTransaction(tx: Transaction)
- recordActivity(activity: Activity)
```

#### gameStateService.ts
```typescript
- createGameSession(userId: string)
- updateGameSession(data: Partial<GameSession>)
- submitContract(contract: Contract)
- claimRewards(contractId: string)
```

#### suiBlockchainService.ts
```typescript
- payDailyEntryFee(amount: number)
- buyAndHarvestSeed()
- sellCrop(cropId: string)
- craftTool(ores: Ore[])
- adminDepositToTreasury(amount: number)
```

### Styling System

**CSS Modules** for component-scoped styles:

```css
/* Component.module.css */
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

**Global Styles** in `globals.css`:
```css
:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.3);
}
```

### State Management

**React Hooks** for local state:
```typescript
const [stamina, setStamina] = useState(50);
const [inventory, setInventory] = useState<Item[]>([]);
const [contracts, setContracts] = useState<Contract[]>([]);
```

**Context API** for global state:
```typescript
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**React Query** for server state:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['user', address],
  queryFn: () => getUserProfile(address)
});
```

---

## Game Implementation

### Game Loop

```
1. Daily Entry (0.75 SUI)
   ↓
2. Receive 50 Stamina
   ↓
3. Choose Actions:
   - Farm (15 stamina) → Get crops
   - Chop Wood (10 stamina) → Get wood
   - Mine Stone (10 stamina) → Get stone
   ↓
4. Complete Contracts
   ↓
5. Earn Fame Points
   ↓
6. Unlock Treasure Chests
   ↓
7. Claim Rewards
```

### Stamina System

```typescript
interface StaminaConfig {
  maxStamina: 50,
  costs: {
    farm: 15,
    chopWood: 10,
    mineStone: 10
  }
}

// Stamina regeneration (not yet implemented)
// - 1 point per 10 minutes
// - Or buy stamina refill (future feature)
```

### Contract System

```typescript
interface Contract {
  id: string;
  type: 'daily' | 'weekly' | 'special';
  requirements: {
    action: 'farm' | 'chop' | 'mine';
    count: number;
  };
  rewards: {
    fame: number;
    sui: number;
  };
  progress: number;
  status: 'active' | 'completed' | 'claimed';
}

// Example contract
{
  type: 'daily',
  requirements: { action: 'farm', count: 3 },
  rewards: { fame: 10, sui: 0.5 },
  progress: 2, // 2/3 completed
  status: 'active'
}
```

### Inventory System

Items are stored both:
- **On-chain**: NFTs owned by user wallet
- **Off-chain**: Firestore for quick access

```typescript
interface Inventory {
  seeds: Seed[];
  crops: Crop[];
  ores: Ore[];
  tools: Tool[];
}

interface Seed {
  id: string;
  rarity: 'common' | 'rare' | 'epic';
  plantType: 'wheat' | 'corn' | 'potato' | 'carrot' | 'tomato';
}

interface Crop {
  id: string;
  rarity: 'common' | 'rare' | 'epic';
  plantType: string;
  quality: 'low' | 'medium' | 'high';
}

interface Ore {
  id: string;
  type: 'stone' | 'iron' | 'gold';
}

interface Tool {
  id: string;
  type: 'pickaxe' | 'axe' | 'hoe';
  level: number;
  durability: number;
}
```

### Fame Points System

```typescript
// Earn fame through:
- Completing contracts: 10-50 fame per contract
- Daily streak: +5 fame per consecutive day
- Special achievements: 100+ fame

// Fame milestones unlock treasure chests:
- Bronze Chest: 100 fame → 1 SUI reward
- Silver Chest: 500 fame → 5 SUI reward
- Gold Chest: 1000 fame → 10 SUI reward
- Legendary Chest: 5000 fame → 50 SUI reward
```

### Trading Mechanics

```typescript
// Buy Seed (100 MIST = 0.0001 SUI)
buyAndHarvestSeed() → Seed NFT → Plant → Crop NFT

// Sell Crop
sellCrop(crop) → Receive SUI based on rarity:
  - Common: 50 MIST
  - Rare: 200 MIST
  - Epic: 500 MIST

// Craft Tool
craftTool(ore1, ore2, ore3) → Tool NFT
  - Requires 3 ores of same type
  - Crafting fee: 50 MIST
  - Tool level = ore type (1=stone, 2=iron, 3=gold)
```

### Game State Persistence

```typescript
// Firebase structure for game session
interface GameSession {
  userId: string;
  date: string; // YYYY-MM-DD
  stamina: number;
  actions: Action[];
  contracts: Contract[];
  fame: number;
  earnedToday: number;
  entryFeePaid: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Real-time sync
const unsubscribe = onSnapshot(
  doc(db, 'gameSessions', sessionId),
  (doc) => {
    setGameState(doc.data());
  }
);
```

---

## Smart Contract Structure

### Module Architecture

```
sui_contracts/
└── game_treasury.move    # Main treasury for game economics
```

**Note**: The game currently uses a simplified treasury-based economic model. NFT-based items (seeds, crops, ores, tools) and trading mechanics are planned for future releases.

### Game Treasury Module (`game_treasury.move`)

**Purpose**: Manage all SUI flows in the game - entry fees, rewards, and admin operations

**Deployed Contract**:
```
Package ID: 0xfa2d05a857031c41addcaee9d55b099c44ef67143d29f21cb162d54e473cc118
Treasury ID: 0x73d75d73101f46f438a461d4b6db02a2338bb7cc75cbb8759cd7c8252fe4c881
Admin Cap ID: 0x0ed3858755a1958fb400e8eb4c597b37952d155a80a88b77728df75c1c92fd0b
Network: Sui Testnet
```

#### Structs

```move
/// Main treasury object storing game funds
public struct GameTreasury has key {
    id: UID,
    balance: Balance<SUI>,        // Total SUI in treasury
    admin: address,               // Admin wallet address
    total_deposits: u64,          // Cumulative deposits (tracking)
    total_withdrawals: u64,       // Cumulative withdrawals (tracking)
}

/// Admin capability token for privileged operations
public struct AdminCap has key, store {
    id: UID,
}
```

#### Constants

```move
// Economic parameters
const DAILY_ENTRY_FEE: u64 = 750_000_000;  // 0.75 SUI per day
const MIN_REWARD: u64 = 400_000_000;       // 0.4 SUI (min chest reward)
const MAX_REWARD: u64 = 600_000_000;       // 0.6 SUI (max chest reward)

// Economics explanation:
// - Player pays 0.75 SUI/day × ~4 days = 3.0 SUI revenue per chest
// - Average reward: 0.5 SUI per chest
// - Profit: 2.5 SUI per chest (83% margin) → Sustainable model
```

#### Error Codes

```move
const E_INSUFFICIENT_PAYMENT: u64 = 1;    // Payment below required amount
const E_TREASURY_EMPTY: u64 = 2;          // Treasury has insufficient balance
const E_INVALID_REWARD_AMOUNT: u64 = 3;   // Reward amount is 0 or negative
const E_NOT_ADMIN: u64 = 4;               // Caller is not admin
```

#### Initialization

```move
fun init(ctx: &mut TxContext) {
    let admin = tx_context::sender(ctx);
    
    // Create shared treasury object
    let treasury = GameTreasury {
        id: object::new(ctx),
        balance: balance::zero<SUI>(),
        admin,
        total_deposits: 0,
        total_withdrawals: 0,
    };
    
    // Create admin capability
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    
    transfer::share_object(treasury);      // Make treasury accessible to all
    transfer::transfer(admin_cap, admin);  // Give admin cap to deployer
}
```

---

## ⚙️ Smart Contract Logic

### 1. Pay Daily Entry Fee

```move
public entry fun pay_daily_fee(
    treasury: &mut GameTreasury,
    mut payment: Coin<SUI>,
    ctx: &mut TxContext,
)
```

**Purpose**: Player pays 0.75 SUI to unlock gameplay for the day

**Flow**:
1. Validate payment amount ≥ DAILY_ENTRY_FEE (0.75 SUI)
2. Split exact amount (0.75 SUI) from payment coin
3. Convert to Balance and add to treasury
4. Increment `total_deposits` counter
5. Return remaining coin to player (or destroy if empty)

**Key Features**:
- Uses `coin::split()` to avoid losing excess payment
- Automatically returns change to player
- Tracks total deposits for analytics

---

### 2. Claim Reward

```move
public entry fun claim_reward(
    treasury: &mut GameTreasury,
    reward_amount: u64,  // In MIST (1 SUI = 1,000,000,000 MIST)
    ctx: &mut TxContext,
)
```

**Purpose**: Player claims accumulated rewards (e.g., from treasure chests)

**Flow**:
1. Validate reward_amount > 0
2. Check treasury has sufficient balance
3. Split reward amount from treasury balance
4. Create coin from balance
5. Transfer coin to player
6. Increment `total_withdrawals` counter

**Reward Amounts**:
- Typical range: 0.4 - 0.6 SUI per treasure chest
- No hardcoded limits in contract (flexible for future features)
- Backend validates reward eligibility before calling contract

---

### 3. Admin Deposit

```move
public entry fun admin_deposit(
    treasury: &mut GameTreasury,
    _admin_cap: &AdminCap,  // Proof of admin ownership
    payment: Coin<SUI>,
)
```

**Purpose**: Admin replenishes treasury to ensure sufficient funds for rewards

**Flow**:
1. Verify caller owns AdminCap (checked by Sui runtime)
2. Convert payment coin to balance
3. Add to treasury balance
4. Increment `total_deposits` counter

**Access Control**:
- Requires AdminCap NFT (minted at initialization)
- Only admin wallet can call this function
- No amount limits (admin decision)

---

### 4. Admin Withdraw

```move
public entry fun admin_withdraw(
    treasury: &mut GameTreasury,
    admin_cap: &AdminCap,
    amount: u64,
    ctx: &mut TxContext,
)
```

**Purpose**: Admin withdraws profits or performs emergency fund extraction

**Flow**:
1. Verify caller is the original admin (address check)
2. Verify caller owns AdminCap
3. Check treasury has sufficient balance
4. Split amount from treasury
5. Transfer to admin wallet
6. Increment `total_withdrawals` counter

**Security**:
- Requires both AdminCap ownership AND address match
- Prevents malicious admin transfer of AdminCap
- Ensures only original deployer can withdraw

---

### 5. View Functions

```move
// Get current treasury balance
public fun get_balance(treasury: &GameTreasury): u64

// Get total deposits (all-time)
public fun get_total_deposits(treasury: &GameTreasury): u64

// Get total withdrawals (all-time)
public fun get_total_withdrawals(treasury: &GameTreasury): u64

// Get admin address
public fun get_admin(treasury: &GameTreasury): address
```

**Purpose**: Read-only functions for analytics and monitoring

---

### Transaction Examples

#### Example 1: Player Pays Entry Fee

```typescript
// Frontend code (TypeScript with @mysten/sui.js)
const tx = new Transaction();

// Split 1 SUI from gas (contract takes 0.75, returns 0.25)
const [paymentCoin] = tx.splitCoins(tx.gas, [1_000_000_000]);

// Call contract
tx.moveCall({
  target: `${PACKAGE_ID}::game_treasury::pay_daily_fee`,
  arguments: [
    tx.object(GAME_TREASURY_ID),
    paymentCoin
  ],
});

await signAndExecuteTransaction({ transaction: tx });
```

#### Example 2: Player Claims Reward

```typescript
const tx = new Transaction();

// Claim 0.5 SUI reward (500,000,000 MIST)
tx.moveCall({
  target: `${PACKAGE_ID}::game_treasury::claim_reward`,
  arguments: [
    tx.object(GAME_TREASURY_ID),
    tx.pure.u64(500_000_000)
  ],
});

await signAndExecuteTransaction({ transaction: tx });
```

#### Example 3: Admin Deposits Funds

```typescript
const tx = new Transaction();

// Admin deposits 10 SUI
const [coin] = tx.splitCoins(tx.gas, [10_000_000_000]);

tx.moveCall({
  target: `${PACKAGE_ID}::game_treasury::admin_deposit`,
  arguments: [
    tx.object(GAME_TREASURY_ID),
    tx.object(ADMIN_CAP_ID),
    coin
  ],
});

await signAndExecuteTransaction({ transaction: tx });
```

#### Example 4: Query Treasury Balance

```bash
# Using Sui CLI
sui client object $GAME_TREASURY_ID --json

# Look for fields.balance value in output
# Balance is in MIST (divide by 1,000,000,000 for SUI)
```

---

### Economic Model

**Revenue Flow**:
```
Player pays 0.75 SUI/day → Treasury
×4 days average to reach 100 Fame Points
= 3.0 SUI total revenue per chest
```

**Cost Flow**:
```
Treasury → Player: 0.4-0.6 SUI (avg 0.5 SUI)
Profit per chest: 2.5 SUI (83% margin)
```

**Sustainability**:
- Treasury balance grows over time
- Admin can withdraw profits periodically
- System remains solvent with healthy margins

---

### Security Considerations

#### 1. Payment Handling
**Proper coin splitting**:
```move
let paid_coin = coin::split(&mut payment, DAILY_ENTRY_FEE, ctx);
balance::join(&mut treasury.balance, coin::into_balance(paid_coin));
// Remaining payment returned to sender
```

#### 2. Access Control
**Admin functions protected**:
```move
assert!(tx_context::sender(ctx) == treasury.admin, E_NOT_ADMIN);
// Only original admin can withdraw
```

#### 3. Balance Validation
**Prevent overdraft**:
```move
assert!(balance::value(&treasury.balance) >= reward_amount, E_TREASURY_EMPTY);
// Never pay more than available
```

#### 4. Input Validation
**Validate amounts**:
```move
assert!(reward_amount > 0, E_INVALID_REWARD_AMOUNT);
assert!(payment_value >= DAILY_ENTRY_FEE, E_INSUFFICIENT_PAYMENT);
```

---

## Guidelines

### For Developers

#### Code Standards
- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Components**: Functional components with hooks
- **Styling**: CSS Modules for component styles
- **Comments**: JSDoc for exported functions

#### File Organization
```
ComponentName/
├── ComponentName.tsx        # Component logic
├── ComponentName.module.css # Component styles
└── index.ts                 # Export file
```

#### Best Practices
1. **State Management**: Keep state as local as possible
2. **Error Handling**: Always use try-catch for async operations
3. **Loading States**: Show loading indicators for async actions
4. **Validation**: Validate user inputs before submission
5. **Accessibility**: Use semantic HTML and ARIA labels

#### Git Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add your feature description"

# 3. Push and create PR
git push origin feature/your-feature-name
```

### For Smart Contract Development

#### Move Best Practices
1. **Object Ownership**: Use `key` for owned objects, `store` for transferable
2. **Error Handling**: Define error constants at module level
3. **Testing**: Write comprehensive test cases
4. **Gas Efficiency**: Minimize storage and computation
5. **Security**: Validate all inputs, use proper access control

#### Testing
```bash
# Run all tests
sui move test

# Run specific test
sui move test test_buy_seed

# Run with coverage
sui move test --coverage
```

#### Deployment Checklist
- [ ] All tests passing
- [ ] Error codes documented
- [ ] Access control verified
- [ ] Gas costs optimized
- [ ] Audit completed (for mainnet)

### For Users

#### Getting Started
1. Install Sui Wallet extension
2. Get testnet SUI from faucet: https://discord.gg/sui
3. Connect wallet to app
4. Pay 0.75 SUI daily entry fee
5. Start playing!

#### Tips & Strategies
- **Manage Stamina**: Plan your actions to maximize efficiency
- **Complete Contracts**: Focus on daily contracts for steady fame growth
- **Farm Epic Seeds**: Higher rarity = better profits
- **Save for Tools**: Tools reduce action costs (future feature)
- **Check Leaderboards**: Compete with other players

#### Troubleshooting

**Wallet Won't Connect**
- Ensure Sui Wallet extension is installed
- Check you're on the correct network (Testnet)
- Refresh the page and try again

**Transaction Failed**
- Check you have enough SUI for gas fees
- Verify you have sufficient balance
- Wait a few seconds and retry

**Game State Not Updating**
- Refresh the page
- Check your internet connection
- Clear browser cache

---

## Deployment

### Frontend Deployment

#### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build project
cd web_portal
npm run build

# 3. Deploy
vercel --prod
```

#### Option 2: Netlify

```bash
# 1. Build project
npm run build

# 2. Deploy dist folder
netlify deploy --prod --dir=dist
```

#### Option 3: Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Initialize Firebase
firebase init hosting

# 3. Build and deploy
npm run build
firebase deploy --only hosting
```

### Environment Variables

Set these in your deployment platform:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_SUI_PACKAGE_ID=...
VITE_SUI_TREASURY_ID=...
VITE_SUI_ADMIN_CAP_ID=...
```

### Smart Contract Deployment

#### Deploy to Testnet

```bash
# 1. Build contracts
cd sui_contracts
sui move build

# 2. Deploy
sui client publish --gas-budget 100000000

# 3. Save package ID
# Look for "Published Objects" in output
# Save packageObjectId to .env
```

#### Deploy to Mainnet

```bash
# 1. Ensure tests pass
sui move test

# 2. Switch to mainnet
sui client switch --env mainnet

# 3. Deploy with sufficient gas
sui client publish --gas-budget 500000000

# 4. Verify deployment
sui client object <PACKAGE_ID>
```

### Post-Deployment

1. **Update Configuration**
   - Add contract IDs to `.env`
   - Update Firebase security rules
   - Configure CORS settings

2. **Test Production**
   - Verify wallet connection
   - Test all game actions
   - Check admin dashboard

3. **Monitor**
   - Set up Firebase Analytics
   - Enable error tracking
   - Monitor transaction logs

---

## Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Code Review Process

1. All PRs require at least one review
2. Tests must pass
3. Code must follow project standards
4. Documentation must be updated

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Team

**SuiHarvest Team**
- Developer 1: Nguyễn Minh Chính - 2275106050051 
- Developer 2: Nguyễn Thành Phát - 2474802016639 
- Developer 3: Nguyễn Hữu Đồng - 2474802010087 
- Developer 4: Võ Việt Tiến - 2474802010391 
- Developer 5: Hồ Du Tuấn Đạt - 2374802010097 
- Designer 1: Hồ Du Tuấn Đạt - 2374802010097 
- Designer 2: Nguyễn Minh Chính - 2275106050051 
- Project Lead: Hồ Du Tuấn Đạt - 2374802010097 

---

## Acknowledgments

- **Sui Foundation** - For blockchain infrastructure
- **Firebase** - For backend services
- **React Team** - For the amazing framework
- **Move Community** - For smart contract guidance
- **Van Lang University** - For cooperation and organization

---

## Contact & Support

- **Website**: https://suiharvest.io (coming soon)

---

## Roadmap

### Q1 2026
- [ ] Launch on Sui Mainnet
- [ ] Mobile app development
- [ ] Guild system implementation

### Q2 2026
- [ ] Multiplayer features
- [ ] Advanced crafting system
- [ ] Seasonal events

### Q3 2026
- [ ] NFT marketplace integration
- [ ] Cross-chain bridge
- [ ] DAO governance

---

<div align="center">

**Built with love on Sui Blockchain**

[⬆ Back to Top](#-suiharvest)

</div>
