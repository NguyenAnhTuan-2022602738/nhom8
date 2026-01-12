import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';

const Header = ({ settings, cartCount }) => {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: settings.primaryColor }}>{settings.title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="nav-links" style={{ marginRight: '2rem' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Trang Chủ</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Cửa Hàng</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Về Chúng Tôi</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Liên Hệ</NavLink>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <NavLink to="/cart" style={{ color: 'var(--text-dark)', position: 'relative' }}>
             <ShoppingBag size={24} />
             {cartCount > 0 && (
               <span style={{ position: 'absolute', top: -8, right: -8, background: settings.primaryColor, color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem' }}>
                 {cartCount}
               </span>
             )}
          </NavLink>
          <NavLink to="/admin" title="Admin">
            <User size={24} />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
