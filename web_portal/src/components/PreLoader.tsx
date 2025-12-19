import { useState, useEffect } from 'react';
import styles from './PreLoader.module.css';
import logoImage from '../assets/SuiHarvest.png';

interface PreLoaderProps {
  onComplete: () => void;
}

export default function PreLoader({ onComplete }: PreLoaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let scrollCount = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isComplete) return;

      // Prevent default page scroll
      e.preventDefault();

      // Only count scroll down
      if (e.deltaY > 0) {
        scrollCount++;
        
        // Update progress: 50% per scroll (2 scrolls = 100%)
        const newProgress = Math.min(100, scrollCount * 50);
        setScrollProgress(newProgress);
        
        // Complete when reaching 100% (2 scrolls)
        if (newProgress >= 100 && !isComplete) {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      }
    };

    // Prevent scroll on body
    document.body.style.overflow = 'hidden';
    
    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'auto';
    };
  }, [isComplete, onComplete]);

  return (
    <div className={`${styles.preLoader} ${isComplete ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src={logoImage} alt="SuiHarvest Logo" className={styles.logoImage} />
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <p className={styles.instruction}>
            {scrollProgress < 100 ? `Scroll down to enter (${scrollProgress === 0 ? '0' : scrollProgress === 50 ? '1' : '2'}/2)` : 'Welcome!'}
          </p>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.wheel} />
          </div>
          <div className={styles.arrows}>
            <span>↓</span>
            <span>↓</span>
            <span>↓</span>
          </div>
        </div>
      </div>

      <div className={styles.background}>
        <div className={styles.particle} style={{ left: '10%', animationDelay: '0s' }} />
        <div className={styles.particle} style={{ left: '20%', animationDelay: '0.5s' }} />
        <div className={styles.particle} style={{ left: '30%', animationDelay: '1s' }} />
        <div className={styles.particle} style={{ left: '40%', animationDelay: '1.5s' }} />
        <div className={styles.particle} style={{ left: '50%', animationDelay: '2s' }} />
        <div className={styles.particle} style={{ left: '60%', animationDelay: '2.5s' }} />
        <div className={styles.particle} style={{ left: '70%', animationDelay: '3s' }} />
        <div className={styles.particle} style={{ left: '80%', animationDelay: '3.5s' }} />
        <div className={styles.particle} style={{ left: '90%', animationDelay: '4s' }} />
      </div>
    </div>
  );
}
