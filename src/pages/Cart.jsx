import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ settings, cartItems }) => {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '50vh', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', color: settings.primaryColor, marginBottom: '2rem' }}>Giỏ Hàng Của Bạn</h2>
      
      {cartItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <p>Giỏ hàng hiện đang trống.</p>
          <Link to="/shop">
            <button className="btn-primary" style={{ marginTop: '1rem', background: settings.primaryColor }}>Tiếp Tục Mua Sắm</button>
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                  <div>
                    <h4 style={{ margin: 0, color: settings.primaryColor }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{Number(item.price).toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                   <span style={{ fontWeight: 'bold' }}>x{item.quantity}</span>
                   <span style={{ fontWeight: 'bold', color: settings.primaryColor }}>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '2px dashed #eee', paddingTop: '1rem' }}>
            <h3>Tổng cộng: <span style={{ color: settings.primaryColor }}>{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString('vi-VN')} ₫</span></h3>
            <button className="btn-primary" style={{ background: settings.primaryColor, marginTop: '1rem', width: '100%' }}>Thanh Toán Ngay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
