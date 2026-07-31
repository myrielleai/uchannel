import React from 'react';
import Navbar, { NavbarProps } from './Navbar';
import Footer, { FooterProps } from './Footer';

export interface LayoutProps {
  children: React.ReactNode;
  activePage?: NavbarProps['activePage'];
  basePath?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showContactForm?: boolean;
  ctaText?: string;
  ctaHref?: string;
  mainClassName?: string;
  mainStyle?: React.CSSProperties;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  basePath = '',
  showHeader = true,
  showFooter = true,
  showContactForm = true,
  ctaText,
  ctaHref,
  mainClassName = '',
  mainStyle,
}) => {
  return (
    <div className="layout-root min-h-screen flex flex-col bg-[#030712] text-white">
      {showHeader && (
        <Navbar
          activePage={activePage}
          basePath={basePath}
          ctaText={ctaText}
          ctaHref={ctaHref}
        />
      )}
      <main className={mainClassName} style={mainStyle}>
        {children}
      </main>
      {showFooter && (
        <Footer basePath={basePath} showContactForm={showContactForm} />
      )}
    </div>
  );
};

export default Layout;
