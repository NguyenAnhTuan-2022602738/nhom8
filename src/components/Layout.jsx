import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FallingFlowers from '../FallingFlowers';

const Layout = ({ children, settings, cartCount, isAdmin, onLogout }) => {
  return (
    <div className="app-container">
      {settings.showFlowers && <FallingFlowers />}
      <Header settings={settings} cartCount={cartCount} isAdmin={isAdmin} onLogout={onLogout} />
      <main>
        {children}
      </main>
      {/* Footer moved to individual pages for visual consistency with Home editor */}
    </div>
  );
};

export default Layout;
