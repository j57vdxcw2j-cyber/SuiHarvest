import { useState } from 'react';
import styles from './Blog.module.css';

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Introducing SuiHarvest: The Future of Blockchain Gaming',
      excerpt: 'Discover how we\'re combining strategic gameplay with true ownership and real rewards on the Sui blockchain.',
      category: 'Announcements',
      author: 'SuiHarvest Team',
      date: 'December 15, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'Why We Chose Sui Blockchain',
      excerpt: 'Learn about the technical advantages of Sui\'s parallel transaction processing and how it benefits gameplay.',
      category: 'Technology',
      author: 'Dev Team',
      date: 'December 10, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: 'Earning Strategies: Top Player Tips',
      excerpt: 'Pro players share their winning strategies for maximizing SUI earnings and climbing the leaderboard.',
      category: 'Guides',
      author: 'Community',
      date: 'December 8, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop',
      featured: true
    },
    {
      id: 4,
      title: 'Understanding Our Tokenomics Model',
      excerpt: 'A deep dive into how the 90/10 split works, reward distribution, and platform sustainability.',
      category: 'Economics',
      author: 'SuiHarvest Team',
      date: 'December 5, 2024',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
      featured: false
    },
    {
      id: 5,
      title: 'Smart Contract Audit Results',
      excerpt: 'Full transparency on our security audit process and findings from independent blockchain security experts.',
      category: 'Security',
      author: 'Security Team',
      date: 'December 1, 2024',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
      featured: false
    },
    {
      id: 6,
      title: 'Community Spotlight: December Winners',
      excerpt: 'Meet this month\'s top farmers, hear their stories, and learn how they achieved success.',
      category: 'Community',
      author: 'Community Team',
      date: 'November 28, 2024',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      featured: false
    },
    {
      id: 7,
      title: 'Upcoming Features: Q1 2025 Preview',
      excerpt: 'Get an exclusive look at NFT characters, mobile apps, and other exciting features coming soon.',
      category: 'Announcements',
      author: 'Product Team',
      date: 'November 25, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      featured: true
    },
    {
      id: 8,
      title: 'Stamina Management Guide',
      excerpt: 'Master the art of stamina optimization to complete more contracts and earn higher rewards.',
      category: 'Guides',
      author: 'Pro Player',
      date: 'November 20, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      featured: false
    }
  ];

  const categories = ['all', 'Announcements', 'Guides', 'Technology', 'Economics', 'Security', 'Community'];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className={styles.blogContainer}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero}>
          <h1>SuiHarvest Blog</h1>
          <p>News, guides, and insights from the blockchain farming frontier</p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <section className={styles.featuredSection}>
            <div className={styles.featuredPost}>
              <div className={styles.featuredImage}>
                <img src={featuredPost.image} alt={featuredPost.title} />
                <div className={styles.featuredBadge}>Featured</div>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.postMeta}>
                  <span className={styles.category}>{featuredPost.category}</span>
                  <span className={styles.date}>{featuredPost.date}</span>
                  <span className={styles.readTime}>{featuredPost.readTime}</span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <div className={styles.postFooter}>
                  <div className={styles.author}>By {featuredPost.author}</div>
                  <button className={styles.readMore}>Read More →</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className={styles.filterSection}>
          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Posts' : category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className={styles.blogGrid}>
          {filteredPosts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <div className={styles.cardImage}>
                <img src={post.image} alt={post.title} />
                <div className={styles.cardCategory}>{post.category}</div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.cardAuthor}>By {post.author}</div>
                  <button className={styles.cardReadMore}>Read →</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter */}
        <section className={styles.newsletterSection}>
          <div className={styles.newsletterCard}>
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest updates, guides, and exclusive insights.</p>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" />
              <button onClick={() => alert('Newsletter subscription coming soon!')}>Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
