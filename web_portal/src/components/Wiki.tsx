import { useState, useEffect } from 'react';
import styles from './Wiki.module.css';

export function Wiki() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigationCategories = [
    { 
      id: 'gameplay', 
      title: 'Gameplay', 
      icon: '🎮',
      items: ['Daily Cycle', 'Stamina System', 'Contracts', 'Resources']
    },
    { 
      id: 'resources', 
      title: 'Resources', 
      icon: '💎',
      items: ['Crops', 'Minerals', 'Wood', 'Tools']
    },
    { 
      id: 'blockchain', 
      title: 'Blockchain', 
      icon: '⛓️',
      items: ['NFT Items', 'Smart Contracts', 'Tokenomics', 'Wallet Setup']
    },
    { 
      id: 'crafting', 
      title: 'Crafting', 
      icon: '🔨',
      items: ['Recipes', 'Tools', 'Upgrades', 'Materials']
    },
    { 
      id: 'trading', 
      title: 'Trading', 
      icon: '💰',
      items: ['Marketplace', 'Price Guide', 'Trading Tips', 'Economy']
    },
    { 
      id: 'community', 
      title: 'Community', 
      icon: '👥',
      items: ['Events', 'Leaderboard', 'Social Features', 'Guilds']
    },
  ];

  const galleryImages = [
    { 
      title: 'The Trader Arrives', 
      subtitle: 'The Trader Update',
      description: 'Latest game update',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop'
    },
    { 
      title: 'Harvest Season', 
      subtitle: 'Daily Gameplay',
      description: 'Farm your way to success',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop'
    },
    { 
      title: 'Blockchain Economy', 
      subtitle: 'NFT Marketplace',
      description: 'Trade your assets',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
    },
  ];

  const statistics = {
    pages: '128,891',
    edits: '1,234',
    files: '31,477',
    contributors: '684'
  };

  const wikiStaff = [
    { name: 'MinhDaoVN', role: 'Administrator', avatar: '👨‍💼' },
    { name: 'TruongIT', role: 'Moderator', avatar: '🛡️' },
    { name: 'AnhGaming', role: 'Editor', avatar: '✏️' }
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.wikiContainer}>
      {/* Hero Section */}
      <div className={styles.wikiHero}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroIcon}>📚</span> SuiHarvest Wiki
        </h1>
        <p className={styles.heroSubtitle}>
          Welcome to the community wiki for SuiHarvest.
        </p>
        <p className={styles.heroDesc}>
          Please follow the Wiki Policies and Editing Guidelines before editing or adding any pages. Make sure to help complete stub pages.
        </p>
      </div>

      <div className={styles.wikiLayout}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Gallery Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Gallery</h2>
              <div className={styles.carouselContainer}>
                <button 
                  className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                  onClick={prevSlide}
                  aria-label="Previous slide"
                >
                  ‹
                </button>

                <div className={styles.carouselWrapper}>
                  <div 
                    className={styles.carouselTrack}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {galleryImages.map((img, index) => (
                      <div 
                        key={index} 
                        className={`${styles.carouselSlide} ${index === currentSlide ? styles.active : ''}`}
                      >
                        <div className={styles.slideBackground}>
                          <img src={img.image} alt={img.title} />
                        </div>
                        <div className={styles.slideContent}>
                          <h2 className={styles.slideTitle}>{img.title}</h2>
                          <h3 className={styles.slideSubtitle}>{img.subtitle}</h3>
                          <p className={styles.slideDescription}>{img.description}</p>
                          <button className={styles.slideButton}>
                            Read more ›
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                  onClick={nextSlide}
                  aria-label="Next slide"
                >
                  ›
                </button>

                <div className={styles.carouselIndicators}>
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Navigation Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Navigation</h2>
              <div className={styles.navigationGrid}>
                {navigationCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className={styles.navCard}
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  >
                    <div className={styles.navCardHeader}>
                      <span className={styles.navIcon}>{category.icon}</span>
                      <h3>{category.title}</h3>
                    </div>
                    {activeCategory === category.id && (
                      <ul className={styles.navItems}>
                        {category.items.map((item, idx) => (
                          <li key={idx} onClick={(e) => e.stopPropagation()}>
                            <a href={`#${item.toLowerCase().replace(' ', '-')}`}>{item}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Statistics Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Wiki Statistics</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{statistics.pages}</div>
                  <div className={styles.statLabel}>wikis</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{statistics.edits}</div>
                  <div className={styles.statLabel}>articles</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{statistics.files}</div>
                  <div className={styles.statLabel}>files</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{statistics.contributors}</div>
                  <div className={styles.statLabel}>active editors</div>
                </div>
              </div>
            </section>

            {/* Categories Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Categories</h2>
              <div className={styles.categoriesContent}>
                <p>Community content is available under <a href="#license">CC BY-SA</a> unless otherwise noted.</p>
                <div className={styles.categoryTags}>
                  <span className={styles.tag}>Gameplay</span>
                  <span className={styles.tag}>Resources</span>
                  <span className={styles.tag}>Blockchain</span>
                  <span className={styles.tag}>Economy</span>
                  <span className={styles.tag}>Trading</span>
                  <span className={styles.tag}>Community</span>
                  <span className={styles.tag}>Updates</span>
                  <span className={styles.tag}>Guides</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className={styles.sidebar}>
            {/* Play Now Card */}
            <div className={styles.sidebarCard}>
              <button className={styles.playButton} onClick={() => window.location.hash = 'game'}>
                🎮 Play Now!
              </button>
              <p className={styles.playDesc}>Start your farming adventure</p>
            </div>

            {/* Search */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Search Wiki</h3>
              <input 
                type="text" 
                placeholder="Search articles..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Wiki Community */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.titleIcon}>👥</span> Wiki Community
              </h3>
              <p className={styles.communityDesc}>
                Join today! Talk with other fans, catch up on the latest news, and share your knowledge.
              </p>
              <button className={styles.communityButton}>
                Join the Discussion
              </button>
            </div>

            {/* Social Media */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.titleIcon}>💬</span> Social Media
              </h3>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>
                  <span>🐦</span> Official Twitter
                </a>
                <a href="#" className={styles.socialLink}>
                  <span>💬</span> Discord Server
                </a>
                <a href="#" className={styles.socialLink}>
                  <span>📹</span> YouTube Channel
                </a>
                <a href="https://github.com/j57vdxcw2j-cyber/SuiHarvest" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <span>🔗</span> GitHub Repository
                </a>
              </div>
            </div>

            {/* Wiki Staff Team */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <span className={styles.titleIcon}>⭐</span> Wiki Staff Team
              </h3>
              <div className={styles.staffList}>
                {wikiStaff.map((staff, index) => (
                  <div key={index} className={styles.staffMember}>
                    <span className={styles.staffAvatar}>{staff.avatar}</span>
                    <div className={styles.staffInfo}>
                      <div className={styles.staffName}>{staff.name}</div>
                      <div className={styles.staffRole}>{staff.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.viewAllButton}>View All Staff</button>
            </div>

            {/* Contributors */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>🏆 Top Contributors</h3>
              <div className={styles.contributorsList}>
                <div className={styles.contributor}>
                  <span className={styles.contributorRank}>1.</span>
                  <span className={styles.contributorName}>MinhDaoVN</span>
                  <span className={styles.contributorEdits}>1,247 edits</span>
                </div>
                <div className={styles.contributor}>
                  <span className={styles.contributorRank}>2.</span>
                  <span className={styles.contributorName}>TruongIT</span>
                  <span className={styles.contributorEdits}>892 edits</span>
                </div>
                <div className={styles.contributor}>
                  <span className={styles.contributorRank}>3.</span>
                  <span className={styles.contributorName}>AnhGaming</span>
                  <span className={styles.contributorEdits}>654 edits</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
    </div>
  );
}

