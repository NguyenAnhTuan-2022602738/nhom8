import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = ({ settings }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3 style={{ color: settings.primaryColor }}>{settings.title}</h3>
          <p style={{ maxWidth: '300px', lineHeight: '1.6' }}>
            Nơi tôn vinh vẻ đẹp của thiên nhiên qua từng cánh hoa. Chúng tôi mang đến những đóa hoa tươi thắm nhất, gói ghém trọn vẹn yêu thương.
          </p>
        </div>
        
        <div className="footer-column">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li><a href="/">Trang Chủ</a></li>
            <li><a href="/shop">Cửa Hàng</a></li>
            <li><a href="/about">Câu Chuyện</a></li>
            <li><a href="/contact">Chính Sách</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Kết Nối</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} /> 123 Đường Hoa Hồng, TP. Mộng Mơ
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={18} /> 0909.123.456
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={18} /> hello@tiemhoacuanang.com
          </p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '1rem' }}>
            <a href="#"><Facebook /></a>
            <a href="#"><Instagram /></a>
            <a href="#"><Twitter /></a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', opacity: 0.7 }}>
        © 2024 {settings.title}. All rights reserved. Made with ❤️ by Antigravity.
      </div>
    </footer>
  );
};

export default Footer;
