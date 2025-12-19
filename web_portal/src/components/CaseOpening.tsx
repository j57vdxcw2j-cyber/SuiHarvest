import { useState, useRef } from 'react';
import { caseService } from '../services/caseService';
import type { Contract, CaseRarity } from '../types';
import styles from './CaseOpening.module.css';

interface CaseOpeningProps {
  onComplete: (contract: Contract, rarity: CaseRarity, grantedFreeSpin: boolean) => void;
  onCancel?: () => void;
}

/**
 * CS2-Style Case Opening Component
 * Scrolling animation with rarity reveal
 */
export function CaseOpening({ onComplete, onCancel }: CaseOpeningProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSequence, setAnimationSequence] = useState<Contract[]>([]);
  const [finalContract, setFinalContract] = useState<Contract | null>(null);
  const [finalRarity, setFinalRarity] = useState<CaseRarity | null>(null);
  const [grantedFreeSpin, setGrantedFreeSpin] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const getRarityColor = (rarity: CaseRarity) => {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'advanced': return '#3B82F6';
      case 'epic': return '#A855F7';
      default: return '#9CA3AF';
    }
  };

  const openCase = () => {
    if (isAnimating) return;
    
    // Roll the case
    const userId = 'temp_user'; // Will be replaced with real user
    const result = caseService.openCase(userId, false);
    
    setFinalContract(result.contract);
    setFinalRarity(result.case.rarity);
    setGrantedFreeSpin(result.grantedFreeSpin);
    
    // Generate animation sequence
    const sequence = caseService.generateAnimationSequence(
      result.case.rarity,
      result.case.animationSeed
    );
    setAnimationSequence(sequence);
    
    // Start animation
    setIsAnimating(true);
    setRevealed(false);
    
    // Trigger scroll animation
    setTimeout(() => {
      if (carouselRef.current) {
        // Calculate scroll position to land on middle item (index 25)
        const itemWidth = 200; // Width of each card
        const gap = 16; // Gap between cards
        const totalItemWidth = itemWidth + gap;
        const targetScroll = (25 * totalItemWidth) - (window.innerWidth / 2) + (itemWidth / 2);
        
        carouselRef.current.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    // Reveal after animation
    setTimeout(() => {
      setIsAnimating(false);
      setRevealed(true);
    }, 5000); // 5 second animation
  };

  const handleComplete = () => {
    if (finalContract && finalRarity) {
      onComplete(finalContract, finalRarity, grantedFreeSpin);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2>ase Opening</h2>
          {onCancel && !isAnimating && !revealed && (
            <button onClick={onCancel} className={styles.closeButton}>×</button>
          )}
        </div>

        {/* Opening Animation or Reveal */}
        {!isAnimating && !revealed && (
          <div className={styles.startScreen}>
            <div className={styles.caseBox}>
              <div className={styles.caseIcon}>📦</div>
              <h3>Ready to Open</h3>
              <p>Click to reveal your contract</p>
            </div>
            <button onClick={openCase} className={styles.openButton}>
              Open Case
            </button>
          </div>
        )}

        {isAnimating && (
          <div className={styles.animationContainer}>
            <div className={styles.pointer}></div>
            <div className={styles.carousel} ref={carouselRef}>
              <div className={styles.carouselTrack}>
                {animationSequence.map((contract, index) => {
                  const rarity: CaseRarity = 
                    contract.description.includes('🌟') ? 'epic' :
                    contract.difficulty === 'advanced' ? 'advanced' : 'common';
                  
                  return (
                    <div
                      key={index}
                      className={styles.carouselItem}
                      style={{
                        borderColor: getRarityColor(rarity),
                        boxShadow: `0 0 20px ${getRarityColor(rarity)}50`
                      }}
                    >
                      <div 
                        className={styles.rarityBadge}
                        style={{ background: getRarityColor(rarity) }}
                      >
                        {rarity.toUpperCase()}
                      </div>
                      <div className={styles.contractTitle}>
                        {contract.description.length > 30 
                          ? contract.description.substring(0, 30) + '...'
                          : contract.description
                        }
                      </div>
                      <div className={styles.rewards}>
                        SUI
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.animatingText}>
              <div className={styles.spinner}></div>
              <span>Opening...</span>
            </div>
          </div>
        )}

        {revealed && finalContract && finalRarity && (
          <div className={styles.revealScreen}>
            <div 
              className={styles.revealCard}
              style={{
                borderColor: getRarityColor(finalRarity),
                boxShadow: `0 0 40px ${getRarityColor(finalRarity)}80`
              }}
            >
              <div 
                className={styles.rarityBanner}
                style={{ background: getRarityColor(finalRarity) }}
              >
                {finalRarity === 'epic' && '🌟 '}
                {finalRarity.toUpperCase()}
                {finalRarity === 'epic' && ' 🌟'}
              </div>
              
              <div className={styles.contractDetails}>
                <h3>{finalContract.description}</h3>
                
                <div className={styles.requirements}>
                  <h4>Requirements:</h4>
                  {Object.entries(finalContract.requirements).map(([item, qty]) => (
                    <div key={item} className={styles.requirementItem}>
                      <span>{item}</span>
                      <span>×{qty}</span>
                    </div>
                  ))}
                </div>
                
                <div className={styles.rewardsList}>
                  <h4>Rewards:</h4>
                  <div className={styles.rewardItem}>
                     <strong>{finalContract.rewards.sui} SUI</strong>
                  </div>
                  <div className={styles.rewardItem}>
                    <strong>{finalContract.rewards.famePoints} Fame Points</strong>
                  </div>
                </div>

                {grantedFreeSpin && (
                  <div className={styles.bonusBanner}>
                    🎉 BONUS: FREE SPIN UNLOCKED! 🎉
                  </div>
                )}
              </div>

              <button onClick={handleComplete} className={styles.acceptButton}>
                ✅ Accept Contract
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
