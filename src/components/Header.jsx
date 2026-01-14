import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Settings, UserCircle } from 'lucide-react';

const Header = ({ settings, cartCount, user, isAdmin, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: settings.primaryColor }}>{settings.title}</h1>
          </NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Desktop Nav Links */}
          <div className="nav-links" style={{ marginRight: '2rem' }}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Trang Chủ</NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Cửa Hàng</NavLink>
            <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Đơn Hàng</NavLink>
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
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isAdmin ? (
                    <NavLink to="/admin" title="Trang Quản Trị" style={{ color: settings.primaryColor, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Settings size={22} />
                    </NavLink>
                  ) : (
                    <NavLink to="/profile" title="Tài khoản" style={{ color: settings.primaryColor, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <UserCircle size={24} />
                    </NavLink>
                  )}
                  <span className="logout-btn-desktop" style={{ fontSize: '0.8rem', color: '#666', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ').pop()}
                  </span>
                  <button onClick={onLogout} className="logout-btn-desktop" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', color: '#888', textDecoration: 'underline' }}>
                      Thoát
                  </button>
              </div>
            ) : (
              <NavLink to="/login" title="Đăng Nhập" className="login-link-desktop">
                  <User size={24} color="#aaa" />
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                color: settings.primaryColor
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-dropdown" style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: 99,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animation: 'slideDown 0.3s ease'
        }}>
          <NavLink to="/" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>🏠 Trang Chủ</NavLink>
          <NavLink to="/shop" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>🛒 Cửa Hàng</NavLink>
          <NavLink to="/orders" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>📦 Đơn Hàng</NavLink>
          <NavLink to="/about" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>💐 Về Chúng Tôi</NavLink>
          <NavLink to="/contact" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>📞 Liên Hệ</NavLink>
          
          {user ? (
            <>
              {isAdmin ? (
                <NavLink to="/admin" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'white', background: settings.primaryColor }}>⚙️ Quản Trị</NavLink>
              ) : (
                <NavLink to="/profile" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'white', background: settings.primaryColor }}>👤 Tài Khoản ({user.name})</NavLink>
              )}
              <button onClick={() => { onLogout(); handleNavClick(); }} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', textAlign: 'left' }}>🚪 Đăng Xuất</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'white', background: settings.primaryColor }}>🔐 Đăng Nhập</NavLink>
              <NavLink to="/register" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: settings.primaryColor, background: '#fff', border: `1px solid ${settings.primaryColor}` }}>📝 Đăng Ký</NavLink>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;

