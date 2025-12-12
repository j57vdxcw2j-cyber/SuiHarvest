module 0x0::trader {
    use 0x2::coin::{Coin, Self};
    use 0x2::sui::SUI;
    use 0x2::clock::Clock;
    use 0x2::balance::{Balance, Self};
    use 0x2::tx_context::TxContext;

    use 0x0::inventory;

    // ============================================================================
    // ERROR CODES
    // ============================================================================
    const E_INSUFFICIENT_PAYMENT: u64 = 1;
    const E_WRONG_ORE_TYPE: u64 = 2;
    const E_BANK_EMPTY: u64 = 3;
    const E_UNSUPPORTED_RARITY: u64 = 4;

    // ============================================================================
    // PRICE CONSTANTS (in MIST: 1 SUI = 1_000_000_000 MIST)
    // ============================================================================
    const SEED_PRICE: u64 = 100_000_000;  // 0.1 SUI
    const CRAFT_FEE: u64 = 50_000_000;    // 0.05 SUI
    const PRICE_COMMON: u64 = 50_000_000;
    const PRICE_RARE: u64 = 200_000_000;
    const PRICE_EPIC: u64 = 500_000_000;

    // ============================================================================
    // HOUSE BANK: Game Treasury
    // ============================================================================
    public struct HouseBank has key {
        id: 0x2::object::UID,
        balance: Balance<SUI>,
    }

    /// Initialize HouseBank as a shared object
    public fun init_bank(ctx: &mut TxContext) {
        let bank = HouseBank {
            id: 0x2::object::new(ctx),
            balance: 0x2::balance::zero<SUI>(),
        };
        transfer::share_object(bank);
    }

    // ============================================================================
    // GAME FUNCTIONS
    // ============================================================================

    /// **buy_seed**: Gacha system
    /// - Checks payment >= SEED_PRICE
    /// - Generates random rarity based on clock
    /// - Mints and transfers seed to caller
    public fun buy_seed(
        bank: &mut HouseBank,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&payment) >= SEED_PRICE, E_INSUFFICIENT_PAYMENT);
        
        // Deposit payment to bank
        let paid_balance = coin::into_balance(payment);
        0x2::balance::join(&mut bank.balance, paid_balance);

        // Generate rarity: use clock timestamp mod 100
        let time_mod = (0x2::clock::timestamp_ms(clock) % 100u64) as u8;
        let rarity = if (time_mod <= 94u8) {
            1u8  // Common (95%)
        } else if (time_mod <= 98u8) {
            2u8  // Rare (4%)
        } else {
            3u8  // Epic (1%)
        };

        let plant_type = ((0x2::clock::timestamp_ms(clock) % 5u64) as u8) + 1u8;

        // Mint seed and transfer to caller
        let seed = inventory::mint_seed(ctx, rarity, plant_type);
        transfer::public_transfer(seed, tx_context::sender(ctx));
    }

    /// **harvest**: Convert seed to crop
    /// - Burns the seed
    /// - Mints crop with matching rarity
    /// - Transfers crop to caller
    public fun harvest(
        seed: inventory::Seed,
        ctx: &mut TxContext,
    ) {
        let rarity = inventory::seed_rarity(&seed);
        let plant_type = inventory::seed_type(&seed);
        
        inventory::burn_seed(seed);
        
        let quality = if (rarity == 3u8) { 3u8 } 
                      else if (rarity == 2u8) { 2u8 } 
                      else { 1u8 };
        
        let crop = inventory::mint_crop(ctx, rarity, plant_type, quality);
        transfer::public_transfer(crop, tx_context::sender(ctx));
    }

    /// **sell_crop**: Convert crop to SUI
    /// - Checks crop rarity to determine price
    /// - Validates bank has sufficient balance
    /// - Burns crop and pays seller from bank
    public fun sell_crop(
        bank: &mut HouseBank,
        crop: inventory::Crop,
        ctx: &mut TxContext,
    ) {
        let rarity = inventory::crop_rarity(&crop);
        let price = if (rarity == 1u8) {
            PRICE_COMMON
        } else if (rarity == 2u8) {
            PRICE_RARE
        } else if (rarity == 3u8) {
            PRICE_EPIC
        } else {
            abort E_UNSUPPORTED_RARITY
        };

        assert!(0x2::balance::value(&bank.balance) >= price, E_BANK_EMPTY);

        inventory::burn_crop(crop);
        
        let payment = 0x2::coin::take(&mut bank.balance, price, ctx);
        transfer::public_transfer(payment, tx_context::sender(ctx));
    }

    /// **craft_tool**: Create tool from 3 ores
    /// - Checks payment >= CRAFT_FEE
    /// - Verifies all 3 ores have matching type
    /// - Burns all 3 ores
    /// - Mints tool with level = ore_type, durability = 100
    /// - Transfers tool to caller
    public fun craft_tool(
        bank: &mut HouseBank,
        payment: Coin<SUI>,
        ore1: inventory::Ore,
        ore2: inventory::Ore,
        ore3: inventory::Ore,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&payment) >= CRAFT_FEE, E_INSUFFICIENT_PAYMENT);

        // Deposit payment to bank
        let paid_balance = coin::into_balance(payment);
        0x2::balance::join(&mut bank.balance, paid_balance);

        // Verify all ores are same type
        let type1 = inventory::ore_type(&ore1);
        let type2 = inventory::ore_type(&ore2);
        let type3 = inventory::ore_type(&ore3);
        assert!(type1 == type2 && type2 == type3, E_WRONG_ORE_TYPE);

        // Burn ores
        inventory::burn_ore(ore1);
        inventory::burn_ore(ore2);
        inventory::burn_ore(ore3);

        // Mint tool with level = ore_type, durability = 100
        let tool = inventory::mint_tool(ctx, type1, 100u8);
        transfer::public_transfer(tool, tx_context::sender(ctx));
    }

    // Helper functions for tests
    public fun price_common(): u64 { PRICE_COMMON }
    public fun price_rare(): u64 { PRICE_RARE }
    public fun price_epic(): u64 { PRICE_EPIC }
}
