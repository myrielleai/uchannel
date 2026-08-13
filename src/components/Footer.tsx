import React, { useState } from 'react';

export interface FooterProps {
  basePath?: string;
  showContactForm?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  basePath = '',
  showContactForm = true,
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const cleanBasePath = basePath ? (basePath.endsWith('/') ? basePath.slice(0, -1) : basePath) : '';
  const logoImgSrc = cleanBasePath ? `${cleanBasePath}/assets/logo.png` : '/assets/logo.png';
  const logoWebpSrc = cleanBasePath ? `${cleanBasePath}/assets/logo.webp` : '/assets/logo.webp';
  const homeHref = cleanBasePath ? `${cleanBasePath}/` : '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage('Thank you! A consultant will respond within 2 business hours.');
      setFormState({ name: '', email: '', company: '', phone: '', message: '' });

      setTimeout(() => {
        setStatusMessage('');
      }, 8000);
    }, 1400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, string> = {
      'f-name': 'name',
      'f-email': 'email',
      'f-company': 'company',
      'f-phone': 'phone',
      'f-message': 'message',
    };
    const key = fieldMap[id] || id;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <footer id="contact" className="site-footer">
      {showContactForm && (
        <div className="footer-cta-strip">
          <div className="hero-grid-bg" aria-hidden="true"></div>
          <div className="container footer-cta-inner reveal-on-scroll">
            <div className="footer-cta-text">
              <h2 className="footer-cta-headline">
                Ready to own the <span className="spotlight-target">spotlight?</span>
              </h2>
            </div>
            <form className="contact-form" id="quote-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="f-name" className="sr-only">Your Name</label>
                  <input
                    type="text"
                    id="f-name"
                    className="form-input"
                    placeholder="Your Name"
                    required
                    autoComplete="name"
                    value={formState.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f-email" className="sr-only">Work Email</label>
                  <input
                    type="email"
                    id="f-email"
                    className="form-input"
                    placeholder="Work Email"
                    required
                    autoComplete="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="f-company" className="sr-only">Company</label>
                  <input
                    type="text"
                    id="f-company"
                    className="form-input"
                    placeholder="Company"
                    required
                    autoComplete="organization"
                    value={formState.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f-phone" className="sr-only">Phone Number</label>
                  <input
                    type="tel"
                    id="f-phone"
                    className="form-input"
                    placeholder="Phone Number"
                    required
                    autoComplete="tel"
                    value={formState.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="f-message" className="sr-only">Campaign details</label>
                <textarea
                  id="f-message"
                  className="form-input form-textarea"
                  placeholder="Campaign details — formats, locations, target dates…"
                  required
                  value={formState.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button type="submit" className="btn-submit" id="form-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : statusMessage ? 'Proposal Requested ✓' : 'Send Message'}
              </button>
              {statusMessage && (
                <div className="form-status" id="form-status" role="status" aria-live="polite">
                  {statusMessage}
                </div>
              )}
            </form>
            <div className="footer-contact-info">
              <div className="contact-item">
                <span className="contact-label">Phone Number</span>
                <span className="contact-value">
                  <a href="tel:+639084558946">(+63) 908-455-8946</a>
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Address</span>
                <span className="contact-value">
                  18th Floor, Octagon Center,<br />San Miguel Avenue, Pasig City
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email Address</span>
                <span className="contact-value">
                  <a href="mailto:sales@uchannel.ph">sales@uchannel.ph</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <a href={homeHref} className="footer-logo-link" aria-label="Back to top">
            <picture>
              <source srcSet={logoWebpSrc} type="image/webp" />
              <img src={logoImgSrc} alt="U Channel" className="footer-logo-img" loading="lazy" decoding="async" width="48" height="48" />
            </picture>
            <span className="logo-divider" aria-hidden="true"></span>
            <div className="logo-text">
              <span className="brand-name">U CHANNEL</span>
              <span className="brand-tagline">ADVERTISING CORPORATION</span>
            </div>
          </a>

          <nav className="footer-nav" aria-label="Footer navigation">
            <a href={`${homeHref}#hero-step-2`}>Who We Are</a>
            <a href={`${homeHref}#hero-step-3`}>Services</a>
            <a href="/advertising-solutions/">Solutions</a>
            <a href="/locations/">Locations</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="footer-socials">
            <a href="#" className="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/uchannel/" className="social-btn" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" className="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div className="container footer-legal">
          <span>U Channel. © 2025. All Rights Reserved.</span>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
