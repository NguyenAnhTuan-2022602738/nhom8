import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ settings, isEditing, data, onUpdate }) => {
  
  // Sử dụng data từ layout thay vì settings
  const currentData = {
    title: data?.title || settings?.title || "Tiệm Hoa Của Nắng",
    description: data?.description || settings?.description || "Nơi tôn vinh vẻ đẹp của thiên nhiên qua từng cánh hoa. Chúng tôi mang đến những đóa hoa tươi thắm nhất, gói ghém trọn vẹn yêu thương.",
    address: data?.address || settings?.address || "123 Đường Hoa Hồng, TP. Mộng Mơ",
    phone: data?.phone || settings?.phone || "0909.123.456",
    email: data?.email || settings?.email || "hello@tiemhoacuanang.com"
  };

  const handleUpdate = (field, value) => {
      if (onUpdate) {
          onUpdate({ ...data, [field]: value });
      }
  };

  return (
    <footer className="footer" style={{ position: 'relative', border: isEditing ? '2px dashed blue' : 'none' }}>
      <div className="footer-content">
        <div className="footer-column">
          {isEditing ? (
              <input
                className="editable-input-simple section-title-input"
                value={currentData.title}
                onChange={e => handleUpdate('title', e.target.value)}
                style={{ color: settings?.primaryColor, width: '100%', marginBottom: '10px' }}
                placeholder="Tên cửa hàng (Footer)..."
              />
          ) : (
             <h3 style={{ color: settings?.primaryColor }}>{currentData.title}</h3>
          )}
          
          {isEditing ? (
              <textarea
                className="editable-input-simple"
                value={currentData.description}
                onChange={e => handleUpdate('description', e.target.value)}
                rows={4}
                style={{ width: '100%', lineHeight: '1.6' }}
                placeholder="Mô tả ngắn về cửa hàng..."
              />
          ) : (
             <p style={{ maxWidth: '300px', lineHeight: '1.6' }}>
                {currentData.description}
             </p>
          )}
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
            <MapPin size={18} /> 
            {isEditing ? (
                <input 
                    className="editable-input-simple"
                    value={currentData.address} 
                    onChange={e => handleUpdate('address', e.target.value)}
                    placeholder="Nhập địa chỉ..."
                    style={{ flex: 1 }}
                />
            ) : (
                currentData.address
            )}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={18} /> 
            {isEditing ? (
                <input 
                    className="editable-input-simple"
                    value={currentData.phone} 
                    onChange={e => handleUpdate('phone', e.target.value)}
                    placeholder="Nhập SĐT..."
                    style={{ flex: 1 }}
                />
            ) : (
                currentData.phone
            )}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={18} /> 
             {isEditing ? (
                <input 
                    className="editable-input-simple"
                    value={currentData.email} 
                    onChange={e => handleUpdate('email', e.target.value)}
                    placeholder="Nhập Email..."
                    style={{ flex: 1 }}
                />
            ) : (
                currentData.email
            )}
          </p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '1rem' }}>
            <a href="#"><Facebook /></a>
            <a href="#"><Instagram /></a>
            <a href="#"><Twitter /></a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', opacity: 0.7 }}>
        © 2024 {currentData.title}. All rights reserved. Made with ❤️ by Antigravity.
         {isEditing && <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'blue' }}>(Tên cửa hàng trong bản quyền sẽ tự động cập nhật theo tên phía trên)</div>}
      </div>
    </footer>
  );
};

export default Footer;
