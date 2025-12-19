import styles from './Wiki.module.css';

export function Wiki() {
  const handleBriefWiki = () => {
    window.open('https://suiharvest.fandom.com/vi/wiki/Gameplay', '_blank');
  };

  return (
    <div className={styles.wikiContainer}>
      <div className={styles.comingSoonContainer}>
        <div className={styles.comingSoonContent}>
          <h1 className={styles.comingSoonTitle}>
            Wiki
          </h1>
          <p className={styles.comingSoonText}>Coming soon...</p>
          <button 
            className={styles.briefWikiButton}
            onClick={handleBriefWiki}
          >
            Brief Wiki
          </button>
        </div>
      </div>
   </div>
  ); 
}
