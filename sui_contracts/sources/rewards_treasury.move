module sui_contracts::rewards_treasury {
    use 0x2::coin::{Self, Coin};
    use 0x2::sui::SUI;
    use 0x2::balance::{Self, Balance};
    use 0x2::tx_context::{Self, TxContext};
    use 0x2::transfer;
    use 0x2::object::{Self, UID};
    use 0x2::event;

    // Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_ALREADY_CLAIMED: u64 = 4;

    // Admin capability - chỉ admin mới withdraw được
    public struct AdminCap has key, store {
        id: UID
    }

    // Treasury lưu trữ SUI rewards
    public struct RewardsTreasury has key {
        id: UID,
        balance: Balance<SUI>,
        admin: address,
        total_deposited: u64,
        total_withdrawn: u64,
    }

    // Claim ticket - backend tạo, user dùng để claim 1 lần
    public struct ClaimTicket has key, store {
        id: UID,
        user: address,
        amount: u64,
        reason: vector<u8>, // "daily_contract", "treasure_chest", etc.
        created_at: u64,
        claimed: bool,
    }

    // Events
    public struct DepositEvent has copy, drop {
        amount: u64,
        new_balance: u64,
    }

    public struct WithdrawEvent has copy, drop {
        user: address,
        amount: u64,
        reason: vector<u8>,
    }

    // Init function - tạo treasury và admin cap
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        
        let treasury = RewardsTreasury {
            id: object::new(ctx),
            balance: balance::zero<SUI>(),
            admin: tx_context::sender(ctx),
            total_deposited: 0,
            total_withdrawn: 0,
        };

        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::share_object(treasury);
    }

    // Admin deposit SUI vào treasury
    public entry fun deposit(
        _admin_cap: &AdminCap,
        treasury: &mut RewardsTreasury,
        payment: Coin<SUI>,
    ) {
        let amount = coin::value(&payment);
        balance::join(&mut treasury.balance, coin::into_balance(payment));
        treasury.total_deposited = treasury.total_deposited + amount;

        event::emit(DepositEvent {
            amount,
            new_balance: balance::value(&treasury.balance),
        });
    }

    // Admin tạo claim ticket cho user (gọi từ backend)
    public entry fun create_claim_ticket(
        _admin_cap: &AdminCap,
        treasury: &RewardsTreasury,
        user: address,
        amount: u64,
        reason: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(balance::value(&treasury.balance) >= amount, E_INSUFFICIENT_BALANCE);
        assert!(amount > 0, E_INVALID_AMOUNT);

        let ticket = ClaimTicket {
            id: object::new(ctx),
            user,
            amount,
            reason,
            created_at: 0, // Có thể dùng Clock nếu cần
            claimed: false,
        };

        transfer::transfer(ticket, user);
    }

    // User claim SUI bằng ticket
    public entry fun claim_reward(
        treasury: &mut RewardsTreasury,
        ticket: ClaimTicket,
        ctx: &mut TxContext,
    ) {
        let ClaimTicket { id, user, amount, reason, created_at: _, claimed } = ticket;
        
        assert!(!claimed, E_ALREADY_CLAIMED);
        assert!(tx_context::sender(ctx) == user, E_NOT_ADMIN);
        assert!(balance::value(&treasury.balance) >= amount, E_INSUFFICIENT_BALANCE);

        object::delete(id);

        // Withdraw SUI từ treasury
        let reward = coin::take(&mut treasury.balance, amount, ctx);
        treasury.total_withdrawn = treasury.total_withdrawn + amount;

        event::emit(WithdrawEvent {
            user,
            amount,
            reason,
        });

        transfer::public_transfer(reward, user);
    }

    // View functions
    public fun treasury_balance(treasury: &RewardsTreasury): u64 {
        balance::value(&treasury.balance)
    }

    public fun total_deposited(treasury: &RewardsTreasury): u64 {
        treasury.total_deposited
    }

    public fun total_withdrawn(treasury: &RewardsTreasury): u64 {
        treasury.total_withdrawn
    }
}
