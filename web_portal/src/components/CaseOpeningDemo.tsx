import { useState } from 'react';
import { CaseOpening } from './CaseOpening';
import type { Contract, CaseRarity } from '../types';

/**
 * Demo page for Case Opening UI
 */
export function CaseOpeningDemo() {
  const [showCaseOpening, setShowCaseOpening] = useState(false);
  const [lastResult, setLastResult] = useState<{
    contract: Contract;
    rarity: CaseRarity;
    freeSpin: boolean;
  } | null>(null);

  const handleComplete = (contract: Contract, rarity: CaseRarity, grantedFreeSpin: boolean) => {
    setLastResult({ contract, rarity, freeSpin: grantedFreeSpin });
    setShowCaseOpening(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a192f 0%, #1a2942 100%)',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '48px' }}>
          🎁 Case Opening Demo
        </h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '30px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Experience CS2-style case opening animation with 3 rarity tiers
          </p>
          
          <button
            onClick={() => setShowCaseOpening(true)}
            style={{
              padding: '20px 60px',
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.5)',
              transition: 'all 0.3s ease'
            }}
          >
            📦 Open Case
          </button>
        </div>

        {lastResult && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '30px',
            border: `3px solid ${getRarityColor(lastResult.rarity)}`
          }}>
            <h2 style={{ marginTop: 0 }}>Last Opening Result</h2>
            
            <div style={{
              display: 'grid',
              gap: '16px',
              marginTop: '20px'
            }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <strong>Rarity:</strong> 
                <span style={{ 
                  color: getRarityColor(lastResult.rarity),
                  marginLeft: '10px',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {lastResult.rarity.toUpperCase()}
                </span>
              </div>

              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <strong>Contract:</strong>
                <div style={{ marginTop: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
                  {lastResult.contract.description}
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <strong>Requirements:</strong>
                <div style={{ marginTop: '8px' }}>
                  {Object.entries(lastResult.contract.requirements).map(([item, qty]) => (
                    <div key={item} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '4px 0'
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{item}</span>
                      <span style={{ color: '#FFD700', fontWeight: 'bold' }}>×{qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px'
              }}>
                <strong>Rewards:</strong>
                <div style={{ marginTop: '8px' }}>
                  <div>💰 {lastResult.contract.rewards.sui} SUI</div>
                  <div>⭐ {lastResult.contract.rewards.famePoints} Fame Points</div>
                </div>
              </div>

              {lastResult.freeSpin && (
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #A855F7 0%, #7c3aed 100%)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  🎉 FREE SPIN GRANTED! 🎉
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <h3 style={{ marginTop: 0 }}>ℹ️ Drop Rates</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>● Common</span>
              <span>70%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#3B82F6' }}>● Advanced</span>
              <span>25%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A855F7' }}>● Epic (+ Free Spin)</span>
              <span>5%</span>
            </div>
          </div>
        </div>
      </div>

      {showCaseOpening && (
        <CaseOpening
          onComplete={handleComplete}
          onCancel={() => setShowCaseOpening(false)}
        />
      )}
    </div>
  );
}

function getRarityColor(rarity: CaseRarity) {
  switch (rarity) {
    case 'common': return '#9CA3AF';
    case 'advanced': return '#3B82F6';
    case 'epic': return '#A855F7';
    default: return '#9CA3AF';
  }
}
