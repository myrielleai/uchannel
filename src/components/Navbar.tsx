import React, { useEffect, useState } from 'react';

export interface NavbarProps {
  activePage?: 'home' | 'who-we-are' | 'services' | 'solutions' | 'locations' | 'contact' | string;
  basePath?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage = '',
  basePath = '',
  ctaText = 'Get a Quote',
  ctaHref = '#contact',
  className = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Normalize basePath to end without trailing slash if present for asset joins
  const cleanBasePath = basePath ? (basePath.endsWith('/') ? basePath.slice(0, -1) : basePath) : '';

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) > 8) {
        if (currentScrollY > 120 && delta > 0 && !isMobileOpen) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileOpen]);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const logoImgSrc = cleanBasePath ? `${cleanBasePath}/assets/logo.png` : '/assets/logo.png';
  const logoWebpSrc = cleanBasePath ? `${cleanBasePath}/assets/logo.webp` : '/assets/logo.webp';
  const homeHref = cleanBasePath ? `${cleanBasePath}/` : '/';

  return (
    <>
      <header
        id="site-header"
        className={`site-header ${isScrolled ? 'scrolled' : ''} ${isHidden ? 'nav-hidden' : ''} ${className}`}
      >
        <div className="container nav-container">
          <a href={homeHref} className="logo-link" id="nav-brand-logo" aria-label="U Channel home">
            <picture>
              <source srcSet={logoWebpSrc} type="image/webp" />
              <img src={logoImgSrc} alt="U Channel logo" className="logo-img" width="48" height="48" />
            </picture>
            <span className="logo-divider" aria-hidden="true"></span>
            <div className="logo-text">
              <span className="brand-name">U CHANNEL</span>
              <span className="brand-tagline">ADVERTISING CORPORATION</span>
            </div>
          </a>

          <nav aria-label="Primary navigation" className="nav-wrapper">
            <div className="nav-hover-pill" aria-hidden="true"></div>
            <ul className="nav-list">
              <li>
                <a
                  href={`${homeHref}#hero-step-2`}
                  className={`nav-link ${activePage === 'who-we-are' ? 'active' : ''}`}
                >
                  Who We Are
                </a>
              </li>
              <li>
                <a
                  href={`${homeHref}#hero-step-3`}
                  className={`nav-link ${activePage === 'services' ? 'active' : ''}`}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/advertising-solutions/"
                  className={`nav-link ${activePage === 'solutions' ? 'active' : ''}`}
                >
                  Solutions
                </a>
              </li>
              <li>
                <a
                  href="/locations/"
                  className={`nav-link ${activePage === 'locations' ? 'active' : ''}`}
                >
                  Locations
                </a>
              </li>
            </ul>
          </nav>

          <a href={ctaHref} className="nav-cta" id="header-cta-btn">
            {ctaText}
          </a>

          {/* Mobile hamburger button */}
          <button
            className={`hamburger ${isMobileOpen ? 'open' : ''}`}
            id="hamburger-btn"
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`mobile-drawer-overlay ${isMobileOpen ? 'open' : ''}`}
        id="mobile-drawer-overlay"
        aria-hidden={!isMobileOpen}
        onClick={closeMobileMenu}
      />

      {/* Mobile drawer menu */}
      <div
        className={`mobile-drawer ${isMobileOpen ? 'open' : ''}`}
        id="mobile-drawer"
        aria-hidden={!isMobileOpen}
      >
        <ul className="mobile-nav-list">
          <li>
            <a
              href={`${homeHref}#hero-step-2`}
              className={`mobile-nav-link ${activePage === 'who-we-are' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Who We Are
            </a>
          </li>
          <li>
            <a
              href={`${homeHref}#hero-step-3`}
              className={`mobile-nav-link ${activePage === 'services' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="/advertising-solutions/"
              className={`mobile-nav-link ${activePage === 'solutions' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Solutions
            </a>
          </li>
          <li>
            <a
              href="/locations/"
              className={`mobile-nav-link ${activePage === 'locations' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Locations
            </a>
          </li>
          <li>
            <a
              href={ctaHref}
              className={`mobile-nav-link ${activePage === 'contact' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </a>
          </li>
        </ul>
        <a href={ctaHref} className="mobile-cta" onClick={closeMobileMenu}>
          {ctaText}
        </a>
      </div>
    </>
  );
};

export default Navbar;
