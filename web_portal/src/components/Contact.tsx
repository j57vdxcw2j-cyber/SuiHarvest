import type { FormEvent } from 'react';
import { useState } from 'react';
import styles from './Contact.module.css';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className={styles.contactContainer}>
      <div className="container">
        <div className={styles.contactGrid}>
          <div>
            <h1>Contact Us</h1>
            <p>Have questions? We'd love to hear from you.</p>

            <div className={styles.contactItem}>
              <strong>📍 HQ:</strong> Van Lang University, HCMC
            </div>
            <div className={styles.contactItem}>
              <strong>📧 Email:</strong> hello@suiharvest.xyz
            </div>
            <div className={styles.contactItem}>
              <strong>💬 Discord:</strong> discord.gg/suiharvest
            </div>
          </div>

          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />
              </div>
              <button type="submit" className="btn btn-orange" style={{ width: '100%' }}>
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
