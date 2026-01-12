import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FallingFlowers from '../FallingFlowers';

const Layout = ({ children, settings, cartCount }) => {
  return (
    <div className="app-container">
      {settings.showFlowers && <FallingFlowers />}
      <Header settings={settings} cartCount={cartCount} />
      <main>
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
};

export default Layout;
