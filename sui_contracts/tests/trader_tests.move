#[test_only]
module 0x0::trader_tests {
    use 0x2::coin;
    use 0x2::sui::SUI;
    use 0x2::test_scenario::{Self};

    use 0x0::inventory;
    use 0x0::trader;

    #[test]
    fun test_seed_mint_and_burn() {
        let mut scenario = test_scenario::begin(@0x0);
        
        let seed = inventory::mint_seed(scenario.ctx(), 1u8, 2u8);
        assert!(inventory::seed_rarity(&seed) == 1u8, 1);
        inventory::burn_seed(seed);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_ore_type_validation() {
        let mut scenario = test_scenario::begin(@0x0);
        
        let ore1 = inventory::mint_ore(scenario.ctx(), 2u8);
        let ore2 = inventory::mint_ore(scenario.ctx(), 2u8);
        let ore3 = inventory::mint_ore(scenario.ctx(), 2u8);
        
        assert!(inventory::ore_type(&ore1) == 2u8, 1);
        assert!(inventory::ore_type(&ore2) == 2u8, 2);
        assert!(inventory::ore_type(&ore3) == 2u8, 3);
        
        inventory::burn_ore(ore1);
        inventory::burn_ore(ore2);
        inventory::burn_ore(ore3);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_crop_and_seed_rarity() {
        let mut scenario = test_scenario::begin(@0x0);
        
        let seed = inventory::mint_seed(scenario.ctx(), 2u8, 1u8);
        assert!(inventory::seed_rarity(&seed) == 2u8, 4);
        assert!(inventory::seed_type(&seed) == 1u8, 5);
        
        let crop = inventory::mint_crop(scenario.ctx(), 2u8, 1u8, 2u8);
        assert!(inventory::crop_rarity(&crop) == 2u8, 6);
        
        inventory::burn_seed(seed);
        inventory::burn_crop(crop);
        test_scenario::end(scenario);
    }

    #[test]
    fun test_tool_properties() {
        let mut scenario = test_scenario::begin(@0x0);
        
        let tool = inventory::mint_tool(scenario.ctx(), 3u8, 100u8);
        assert!(inventory::tool_level(&tool) == 3u8, 7);
        assert!(inventory::tool_durability(&tool) == 100u8, 8);
        
        inventory::burn_tool(tool);
        test_scenario::end(scenario);
    }
}
