module sui_contracts::game_treasury {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID};

    // ERROR CODES
    const E_INSUFFICIENT_PAYMENT: u64 = 1;
    const E_TREASURY_EMPTY: u64 = 2;
    const E_INVALID_REWARD_AMOUNT: u64 = 3;
    const E_NOT_ADMIN: u64 = 4;

    // GAME CONSTANTS (Balanced economics for profitability)
    const DAILY_ENTRY_FEE: u64 = 750_000_000;  // 0.75 SUI
    const MIN_REWARD: u64 = 400_000_000;        // 0.4 SUI
    const MAX_REWARD: u64 = 600_000_000;        // 0.6 SUI
    // Economics: User pays 0.75 SUI/day, needs ~4 days for 100 FP
    // Revenue: 0.75 × 4 = 3.0 SUI
    // Cost: 0.4-0.6 SUI (avg 0.5 SUI)
    // Profit: 2.5 SUI (83% margin) → Sustainable for admin

    /// Treasury object that holds the game's SUI pool
    public struct GameTreasury has key {
        id: UID,
        balance: Balance<SUI>,
        admin: address,
        total_deposits: u64,
        total_withdrawals: u64,
    }

    /// Admin capability for treasury management
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Initialize the treasury (called once at deployment)
    fun init(ctx: &mut TxContext) {
        let admin = tx_context::sender(ctx);
        
        let treasury = GameTreasury {
            id: object::new(ctx),
            balance: balance::zero<SUI>(),
            admin,
            total_deposits: 0,
            total_withdrawals: 0,
        };
        
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        
        transfer::share_object(treasury);
        transfer::transfer(admin_cap, admin);
    }

    /// Player pays daily entry fee to start a new day
    /// Takes ownership of payment coin
    public entry fun pay_daily_fee(
        treasury: &mut GameTreasury,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        let payment_value = coin::value(&payment);
        assert!(payment_value >= DAILY_ENTRY_FEE, E_INSUFFICIENT_PAYMENT);

        // Split exact amount needed
        let paid_coin = coin::split(&mut payment, DAILY_ENTRY_FEE, ctx);
        let paid_balance = coin::into_balance(paid_coin);
        
        balance::join(&mut treasury.balance, paid_balance);
        treasury.total_deposits = treasury.total_deposits + DAILY_ENTRY_FEE;
        
        // Transfer remaining balance back to sender (or destroy if empty)
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        }
    }

    /// Pay out reward to player (for claiming treasure chest or accumulated earnings)
    /// Reward amount must be greater than 0
    public entry fun claim_reward(
        treasury: &mut GameTreasury,
        reward_amount: u64,
        ctx: &mut TxContext,
    ) {
        // Validate reward amount is positive
        assert!(reward_amount > 0, E_INVALID_REWARD_AMOUNT);
        
        let treasury_balance = balance::value(&treasury.balance);
        assert!(treasury_balance >= reward_amount, E_TREASURY_EMPTY);

        // Withdraw reward from treasury
        let reward_balance = balance::split(&mut treasury.balance, reward_amount);
        let reward_coin = coin::from_balance(reward_balance, ctx);
        
        // Transfer to player
        let player = tx_context::sender(ctx);
        transfer::public_transfer(reward_coin, player);
        
        treasury.total_withdrawals = treasury.total_withdrawals + reward_amount;
    }

    /// Admin deposits SUI to replenish treasury
    public entry fun admin_deposit(
        treasury: &mut GameTreasury,
        _admin_cap: &AdminCap,
        payment: Coin<SUI>,
    ) {
        let amount = coin::value(&payment);
        balance::join(&mut treasury.balance, coin::into_balance(payment));
        treasury.total_deposits = treasury.total_deposits + amount;
    }

    /// Admin emergency withdraw (only in case of issues)
    public entry fun admin_withdraw(
        treasury: &mut GameTreasury,
        admin_cap: &AdminCap,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == treasury.admin, E_NOT_ADMIN);
        
        let treasury_balance = balance::value(&treasury.balance);
        assert!(treasury_balance >= amount, E_TREASURY_EMPTY);

        let withdrawn = balance::split(&mut treasury.balance, amount);
        let coin = coin::from_balance(withdrawn, ctx);
        transfer::public_transfer(coin, treasury.admin);
        
        treasury.total_withdrawals = treasury.total_withdrawals + amount;
    }

    // === VIEW FUNCTIONS ===
    
    /// Get current treasury balance
    public fun get_balance(treasury: &GameTreasury): u64 {
        balance::value(&treasury.balance)
    }

    /// Get total deposits
    public fun get_total_deposits(treasury: &GameTreasury): u64 {
        treasury.total_deposits
    }

    /// Get total withdrawals
    public fun get_total_withdrawals(treasury: &GameTreasury): u64 {
        treasury.total_withdrawals
    }

    /// Get admin address
    public fun get_admin(treasury: &GameTreasury): address {
        treasury.admin
    }

    // === TEST HELPERS (for testnet only) ===
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
