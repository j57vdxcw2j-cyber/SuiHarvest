module sui_contracts::trader {
    use 0x2::coin::{Self, Coin};
    use 0x2::sui::SUI;
    use 0x2::clock::Clock;
    use 0x2::balance::{Self, Balance};
    use 0x2::tx_context::{Self, TxContext};
    use 0x2::transfer;
    
    use sui_contracts::inventory;

    // ERROR CODES
    const E_INSUFFICIENT_PAYMENT: u64 = 1;
    const E_WRONG_ORE_TYPE: u64 = 2;
    const E_BANK_EMPTY: u64 = 3;
    const E_UNSUPPORTED_RARITY: u64 = 4;

    // PRICES
    const SEED_PRICE: u64 = 100_000_000;  
    const CRAFT_FEE: u64 = 50_000_000;    
    const PRICE_COMMON: u64 = 50_000_000;
    const PRICE_RARE: u64 = 200_000_000;
    const PRICE_EPIC: u64 = 500_000_000;

    public struct HouseBank has key {
        id: 0x2::object::UID,
        balance: Balance<SUI>,
    }

    fun init(ctx: &mut TxContext) {
        let bank = HouseBank {
            id: 0x2::object::new(ctx),
            balance: balance::zero<SUI>(),
        };
        transfer::share_object(bank);
    }

    // === FIX 1: Dùng &mut Coin để split tiền, tránh mất tiền thừa ===
    public fun buy_seed(
        bank: &mut HouseBank,
        payment: &mut Coin<SUI>, 
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(payment) >= SEED_PRICE, E_INSUFFICIENT_PAYMENT);

        // Split đúng số tiền cần trả
        let paid_coin = coin::split(payment, SEED_PRICE, ctx);
        balance::join(&mut bank.balance, coin::into_balance(paid_coin));

        // Random logic (Giữ nguyên cho demo)
        let time_mod = (0x2::clock::timestamp_ms(clock) % 100u64) as u8;
        let rarity = if (time_mod <= 94u8) { 1u8 } else if (time_mod <= 98u8) { 2u8 } else { 3u8 };
        let plant_type = ((0x2::clock::timestamp_ms(clock) % 5u64) as u8) + 1u8;

        let seed = inventory::mint_seed(ctx, rarity, plant_type);
        transfer::public_transfer(seed, tx_context::sender(ctx));
    }

    public fun harvest(seed: inventory::Seed, ctx: &mut TxContext) {
        let rarity = inventory::seed_rarity(&seed);
        let plant_type = inventory::seed_type(&seed);
        inventory::burn_seed(seed);

        let quality = if (rarity == 3u8) { 3u8 } else if (rarity == 2u8) { 2u8 } else { 1u8 };
        let crop = inventory::mint_crop(ctx, rarity, plant_type, quality);
        transfer::public_transfer(crop, tx_context::sender(ctx));
    }

    public fun sell_crop(
        bank: &mut HouseBank,
        crop: inventory::Crop,
        ctx: &mut TxContext,
    ) {
        let rarity = inventory::crop_rarity(&crop);
        let price = if (rarity == 1u8) { PRICE_COMMON } 
                    else if (rarity == 2u8) { PRICE_RARE } 
                    else if (rarity == 3u8) { PRICE_EPIC } 
                    else { abort E_UNSUPPORTED_RARITY };

        assert!(balance::value(&bank.balance) >= price, E_BANK_EMPTY);

        inventory::burn_crop(crop);

        // Lấy tiền từ bank trả user
        let payment = coin::take(&mut bank.balance, price, ctx);
        transfer::public_transfer(payment, tx_context::sender(ctx));
    }

    // === FIX 2: Tương tự với craft_tool, dùng &mut Coin ===
    public fun craft_tool(
        bank: &mut HouseBank,
        payment: &mut Coin<SUI>,
        ore1: inventory::Ore,
        ore2: inventory::Ore,
        ore3: inventory::Ore,
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(payment) >= CRAFT_FEE, E_INSUFFICIENT_PAYMENT);

        let paid_coin = coin::split(payment, CRAFT_FEE, ctx);
        balance::join(&mut bank.balance, coin::into_balance(paid_coin));

        let type1 = inventory::ore_type(&ore1);
        let type2 = inventory::ore_type(&ore2);
        let type3 = inventory::ore_type(&ore3);
        assert!(type1 == type2, E_WRONG_ORE_TYPE);
        assert!(type2 == type3, E_WRONG_ORE_TYPE);

        inventory::burn_ore(ore1);
        inventory::burn_ore(ore2);
        inventory::burn_ore(ore3);

        let tool = inventory::mint_tool(ctx, type1, 100u8);
        transfer::public_transfer(tool, tx_context::sender(ctx));
    }

    // Helper & Cheat functions giữ nguyên...
    public fun price_common(): u64 { PRICE_COMMON }
    public fun price_rare(): u64 { PRICE_RARE }
    public fun price_epic(): u64 { PRICE_EPIC }

    public entry fun mine_ore(clock: &Clock, ctx: &mut TxContext) {
        let rnd = (0x2::clock::timestamp_ms(clock) % 100u64) as u8;
        let ore_type = if (rnd < 60u8) { 1u8 } else if (rnd < 90u8) { 2u8 } else { 3u8 };
        let ore = inventory::mint_ore(ctx, ore_type);
        transfer::public_transfer(ore, tx_context::sender(ctx));
    }

    public entry fun cheat_seed(ctx: &mut TxContext) {
        let seed = inventory::mint_seed(ctx, 3u8, 1u8);
        transfer::public_transfer(seed, tx_context::sender(ctx));
    }
}