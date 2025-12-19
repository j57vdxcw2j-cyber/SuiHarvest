import { useState } from 'react';
import { caseService } from '../services/caseService';
import { GAME_CONSTANTS } from '../config/gameConstants';
import type { CaseRarity } from '../types';

/**
 * Backend Test Component
 * Tests case opening system without UI
 */
export function CaseSystemTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{
    totalRolls: number;
    commonCount: number;
    advancedCount: number;
    epicCount: number;
  }>({
    totalRolls: 0,
    commonCount: 0,
    advancedCount: 0,
    epicCount: 0
  });

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
  };

  // Test 1: Roll case rarities 1000 times to verify drop rates
  const testDropRates = () => {
    addLog('=== TEST 1: Drop Rates (1000 rolls) ===');
    const results = { common: 0, advanced: 0, epic: 0 };
    
    for (let i = 0; i < 1000; i++) {
      const rarity = caseService.rollCaseRarity();
      results[rarity]++;
    }
    
    const commonPercent = (results.common / 1000 * 100).toFixed(2);
    const advancedPercent = (results.advanced / 1000 * 100).toFixed(2);
    const epicPercent = (results.epic / 1000 * 100).toFixed(2);
    
    addLog(`Common: ${results.common}/1000 (${commonPercent}% - Expected: 70%)`);
    addLog(`Advanced: ${results.advanced}/1000 (${advancedPercent}% - Expected: 25%)`);
    addLog(`Epic: ${results.epic}/1000 (${epicPercent}% - Expected: 5%)`);
    
    setTestResults({
      totalRolls: 1000,
      commonCount: results.common,
      advancedCount: results.advanced,
      epicCount: results.epic
    });
    
    addLog('✅ Drop rate test completed');
  };

  // Test 2: Open a single case
  const testOpenCase = () => {
    addLog('=== TEST 2: Open Single Case ===');
    const userId = 'test_user_' + Date.now();
    const result = caseService.openCase(userId, false);
    
    const rarityInfo = caseService.getRarityInfo(result.case.rarity);
    addLog(`Rarity: ${rarityInfo.name} (${rarityInfo.dropRate}%)`);
    addLog(`Contract: ${result.contract.description}`);
    addLog(`Difficulty: ${result.contract.difficulty}`);
    addLog(`Rewards: ${result.contract.rewards.sui} SUI + ${result.contract.rewards.famePoints} FP`);
    addLog(`Free Spin: ${result.grantedFreeSpin ? '✅ YES!' : '❌ No'}`);
    
    const reqKeys = Object.keys(result.contract.requirements);
    addLog(`Requirements: ${reqKeys.map(k => `${k}:${result.contract.requirements[k as keyof typeof result.contract.requirements]}`).join(', ')}`);
    
    addLog('✅ Case opened successfully');
  };

  // Test 3: Test contract generation for each rarity
  const testContractGeneration = () => {
    addLog('=== TEST 3: Contract Generation ===');
    
    const rarities: CaseRarity[] = ['common', 'advanced', 'epic'];
    
    rarities.forEach(rarity => {
      addLog(`\n--- ${rarity.toUpperCase()} ---`);
      
      // Generate 5 contracts of this rarity
      for (let i = 0; i < 5; i++) {
        const contract = caseService.generateContractForRarity(rarity);
        addLog(`  ${contract.description} (${contract.rewards.sui} SUI, ${contract.rewards.famePoints} FP)`);
      }
    });
    
    addLog('\n✅ Contract generation test completed');
  };

  // Test 4: Test canOpenCase logic
  const testCanOpenCase = () => {
    addLog('=== TEST 4: Can Open Case Validation ===');
    
    // Scenario 1: First case of the day
    let result = caseService.canOpenCase(0, false, false);
    addLog(`Scenario 1 (First case): ${result.data?.canOpen ? '✅ CAN OPEN' : '❌ CANNOT'} - Payment: ${result.data?.requiresPayment}`);
    
    // Scenario 2: Has free spin
    result = caseService.canOpenCase(1, true, false);
    addLog(`Scenario 2 (Free spin): ${result.data?.canOpen ? '✅ CAN OPEN' : '❌ CANNOT'} - Payment: ${result.data?.requiresPayment}`);
    
    // Scenario 3: Contract not completed
    result = caseService.canOpenCase(1, false, false);
    addLog(`Scenario 3 (Contract incomplete): ${result.data?.canOpen ? '✅ CAN OPEN' : '❌ CANNOT'} - Reason: ${result.data?.reason}`);
    
    // Scenario 4: Contract completed, can open next
    result = caseService.canOpenCase(1, false, true);
    addLog(`Scenario 4 (Contract done): ${result.data?.canOpen ? '✅ CAN OPEN' : '❌ CANNOT'} - Payment: ${result.data?.requiresPayment}`);
    
    // Scenario 5: Daily limit reached
    result = caseService.canOpenCase(3, false, true);
    addLog(`Scenario 5 (3 cases opened): ${result.data?.canOpen ? '✅ CAN OPEN' : '❌ CANNOT'} - Reason: ${result.data?.reason}`);
    
    addLog('✅ Validation test completed');
  };

  // Test 5: Test animation sequence generation
  const testAnimationSequence = () => {
    addLog('=== TEST 5: Animation Sequence ===');
    
    const seed = Math.random();
    const sequence = caseService.generateAnimationSequence('epic', seed);
    
    addLog(`Generated ${sequence.length} contracts for animation`);
    addLog(`Middle item (result): ${sequence[25].description}`);
    
    // Count rarities in sequence
    const seqRarities = { common: 0, advanced: 0, epic: 0 };
    sequence.forEach(c => {
      if (c.description.includes('🌟')) seqRarities.epic++;
      else if (c.difficulty === 'advanced') seqRarities.advanced++;
      else seqRarities.common++;
    });
    
    addLog(`Sequence distribution: Common ${seqRarities.common}, Advanced ${seqRarities.advanced}, Epic ${seqRarities.epic}`);
    addLog('✅ Animation sequence generated');
  };

  // Test 6: Test getRarityInfo
  const testRarityInfo = () => {
    addLog('=== TEST 6: Rarity Info ===');
    
    const rarities: CaseRarity[] = ['common', 'advanced', 'epic'];
    rarities.forEach(rarity => {
      const info = caseService.getRarityInfo(rarity);
      addLog(`${info.name}: ${info.description} (${info.dropRate}%)`);
      addLog(`  Color: ${info.color}`);
    });
    
    addLog('✅ Rarity info test completed');
  };

  // Run all tests
  const runAllTests = () => {
    setLogs([]);
    addLog('🚀 Starting backend tests...\n');
    
    testDropRates();
    setTimeout(() => testOpenCase(), 100);
    setTimeout(() => testContractGeneration(), 200);
    setTimeout(() => testCanOpenCase(), 300);
    setTimeout(() => testAnimationSequence(), 400);
    setTimeout(() => testRarityInfo(), 500);
    setTimeout(() => addLog('\n✅ All tests completed!'), 600);
  };

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0a192f 0%, #1a2942 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ marginBottom: '20px' }}>🧪 Case System Backend Test</h1>
        
        {/* Test Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button onClick={runAllTests} style={buttonStyle}>
            🚀 Run All Tests
          </button>
          <button onClick={testDropRates} style={buttonStyle}>
            📊 Test Drop Rates
          </button>
          <button onClick={testOpenCase} style={buttonStyle}>
            📦 Open Single Case
          </button>
          <button onClick={testContractGeneration} style={buttonStyle}>
            📝 Test Contracts
          </button>
          <button onClick={testCanOpenCase} style={buttonStyle}>
            ✅ Test Validation
          </button>
          <button onClick={testAnimationSequence} style={buttonStyle}>
            🎬 Test Animation
          </button>
          <button onClick={testRarityInfo} style={buttonStyle}>
            ℹ️ Rarity Info
          </button>
          <button onClick={() => setLogs([])} style={{ ...buttonStyle, background: '#dc2626' }}>
            🗑️ Clear Logs
          </button>
        </div>

        {/* Test Results Summary */}
        {testResults.totalRolls > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h3>📊 Drop Rate Statistics ({testResults.totalRolls} rolls)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
              <StatCard
                label="Common"
                value={testResults.commonCount}
                percent={(testResults.commonCount / testResults.totalRolls * 100).toFixed(2)}
                expected="70%"
                color="#9CA3AF"
              />
              <StatCard
                label="Advanced"
                value={testResults.advancedCount}
                percent={(testResults.advancedCount / testResults.totalRolls * 100).toFixed(2)}
                expected="25%"
                color="#3B82F6"
              />
              <StatCard
                label="Epic"
                value={testResults.epicCount}
                percent={(testResults.epicCount / testResults.totalRolls * 100).toFixed(2)}
                expected="5%"
                color="#A855F7"
              />
            </div>
          </div>
        )}

        {/* System Info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3>⚙️ System Configuration</h3>
          <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '14px' }}>
            <div>Case Cost: {GAME_CONSTANTS.CASE_COST} SUI</div>
            <div>Max Cases/Day: {GAME_CONSTANTS.MAX_CASES_PER_DAY}</div>
            <div>Common Rate: {GAME_CONSTANTS.CASE_RARITY_RATES.COMMON}%</div>
            <div>Advanced Rate: {GAME_CONSTANTS.CASE_RARITY_RATES.ADVANCED}%</div>
            <div>Epic Rate: {GAME_CONSTANTS.CASE_RARITY_RATES.EPIC}%</div>
          </div>
        </div>

        {/* Console Logs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <h3>📝 Console Logs ({logs.length})</h3>
          <div style={{
            marginTop: '10px',
            maxHeight: '500px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            {logs.length === 0 ? (
              <div style={{ opacity: 0.5 }}>No logs yet. Click a test button to start.</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{
                  padding: '4px 8px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  whiteSpace: 'pre-wrap',
                  color: log.includes('===') ? '#FFD700' : 
                         log.includes('✅') ? '#10b981' : 
                         log.includes('❌') ? '#ef4444' : 
                         'white'
                }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, percent, expected, color }: {
  label: string;
  value: number;
  percent: string;
  expected: string;
  color: string;
}) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      padding: '15px',
      borderRadius: '8px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>
        {percent}% <span style={{ opacity: 0.5 }}>(Expected: {expected})</span>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: 'rgba(59, 130, 246, 0.8)',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '14px'
};
