module 0x0::inventory {
    // ============================================================================
    // STRUCTS: All have key, store abilities
    // ============================================================================

    public struct Seed has key, store {
        id: 0x2::object::UID,
        rarity: u8,
        plant_type: u8,
    }

    public struct Crop has key, store {
        id: 0x2::object::UID,
        rarity: u8,
        plant_type: u8,
        quality: u8,
    }

    public struct Ore has key, store {
        id: 0x2::object::UID,
        ore_type: u8,  // 1=Stone, 2=Iron, 3=Gold
    }

    public struct Tool has key, store {
        id: 0x2::object::UID,
        level: u8,
        durability: u8,
    }

    // ============================================================================
    // MINT FUNCTIONS (public(package) - only callable by package modules)
    // ============================================================================

    public(package) fun mint_seed(ctx: &mut 0x2::tx_context::TxContext, rarity: u8, plant_type: u8): Seed {
        Seed {
            id: 0x2::object::new(ctx),
            rarity,
            plant_type,
        }
    }

    public(package) fun burn_seed(seed: Seed) {
        let Seed { id, rarity: _, plant_type: _ } = seed;
        0x2::object::delete(id);
    }

    public(package) fun mint_crop(ctx: &mut 0x2::tx_context::TxContext, rarity: u8, plant_type: u8, quality: u8): Crop {
        Crop {
            id: 0x2::object::new(ctx),
            rarity,
            plant_type,
            quality,
        }
    }

    public(package) fun burn_crop(crop: Crop) {
        let Crop { id, rarity: _, plant_type: _, quality: _ } = crop;
        0x2::object::delete(id);
    }

    public(package) fun mint_ore(ctx: &mut 0x2::tx_context::TxContext, ore_type: u8): Ore {
        Ore {
            id: 0x2::object::new(ctx),
            ore_type,
        }
    }

    public(package) fun burn_ore(ore: Ore) {
        let Ore { id, ore_type: _ } = ore;
        0x2::object::delete(id);
    }

    public(package) fun mint_tool(ctx: &mut 0x2::tx_context::TxContext, level: u8, durability: u8): Tool {
        Tool {
            id: 0x2::object::new(ctx),
            level,
            durability,
        }
    }

    public(package) fun burn_tool(tool: Tool) {
        let Tool { id, level: _, durability: _ } = tool;
        0x2::object::delete(id);
    }

    // ============================================================================
    // GETTER FUNCTIONS (public - required for trader module to read data)
    // ============================================================================

    public fun seed_rarity(seed: &Seed): u8 {
        seed.rarity
    }

    public fun seed_type(seed: &Seed): u8 {
        seed.plant_type
    }

    public fun crop_rarity(crop: &Crop): u8 {
        crop.rarity
    }

    public fun ore_type(ore: &Ore): u8 {
        ore.ore_type
    }

    public fun tool_level(tool: &Tool): u8 {
        tool.level
    }

    public fun tool_durability(tool: &Tool): u8 {
        tool.durability
    }
}
