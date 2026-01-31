import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Settings, UserCircle, ChevronDown } from 'lucide-react';

const Header = ({ settings, cartCount, user, isAdmin, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
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
          <div className="nav-links" style={{ marginRight: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Trang Chủ</NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Cửa Hàng</NavLink>
            
            {/* Dropdown Menu */}
            <div 
              ref={dropdownRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dark)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.color = settings.primaryColor}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}
              >
                Khám Phá
                <ChevronDown 
                  size={16} 
                  style={{ 
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '8px 0',
                  minWidth: '180px',
                  zIndex: 1000,
                  marginTop: '5px'
                }}>
                  <NavLink 
                    to="/faq" 
                    onClick={handleNavClick}
                    style={{
                      display: 'block',
                      padding: '10px 20px',
                      color: 'var(--text-dark)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `${settings.primaryColor}15`;
                      e.target.style.color = settings.primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-dark)';
                    }}
                  >
                    ❓ FAQ
                  </NavLink>
                  <NavLink 
                    to="/promotions" 
                    onClick={handleNavClick}
                    style={{
                      display: 'block',
                      padding: '10px 20px',
                      color: 'var(--text-dark)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `${settings.primaryColor}15`;
                      e.target.style.color = settings.primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-dark)';
                    }}
                  >
                    🎁 Khuyến Mãi
                  </NavLink>
                  <NavLink 
                    to="/reviews" 
                    onClick={handleNavClick}
                    style={{
                      display: 'block',
                      padding: '10px 20px',
                      color: 'var(--text-dark)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `${settings.primaryColor}15`;
                      e.target.style.color = settings.primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-dark)';
                    }}
                  >
                    ⭐ Đánh Giá
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Đơn Hàng</NavLink>
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
          
          {/* Khám Phá Group */}
          <div style={{ padding: '8px 15px', fontSize: '0.85rem', color: '#999', fontWeight: '600' }}>KHÁM PHÁ</div>
          <NavLink to="/faq" onClick={handleNavClick} style={{ padding: '10px 15px 10px 25px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>❓ FAQ</NavLink>
          <NavLink to="/promotions" onClick={handleNavClick} style={{ padding: '10px 15px 10px 25px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>🎁 Khuyến Mãi</NavLink>
          <NavLink to="/reviews" onClick={handleNavClick} style={{ padding: '10px 15px 10px 25px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>⭐ Đánh Giá</NavLink>
          
          <NavLink to="/orders" onClick={handleNavClick} style={{ padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-dark)', background: '#f8f9fa' }}>📦 Đơn Hàng</NavLink>
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

