import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { api } from '../services/api';

// Default footer data
const DEFAULT_FOOTER = {
  title: "🌸 Tiệm Hoa Của Nàng",
  description: "Nơi tôn vinh vẻ đẹp của thiên nhiên qua từng cánh hoa.",
  address: "123 Đường Hoa Hồng, TP. Mộng Mơ",
  phone: "0909.123.456",
  email: "hello@tiemhoacuanang.com"
};

/**
 * SharedFooter - Footer dùng chung cho tất cả các trang (trừ Home có footer riêng)
 * Tự động load dữ liệu từ homeLayoutV2
 */
const SharedFooter = ({ settings }) => {
  const [footerData, setFooterData] = useState(DEFAULT_FOOTER);

  // Load footer data từ homeLayoutV2
  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const savedData = await api.getSetting('homeLayoutV2');
        if (savedData) {
          // Tìm footer section trong sections array
          const sections = savedData.sections || savedData;
          if (Array.isArray(sections)) {
            const footerSection = sections.find(s => s.type === 'footer');
            if (footerSection && footerSection.content) {
              setFooterData({ ...DEFAULT_FOOTER, ...footerSection.content });
            }
          }
        }
      } catch (e) {
        // Fallback to localStorage
        try {
          const localData = localStorage.getItem('homeLayoutV2');
          if (localData) {
            const parsed = JSON.parse(localData);
            const sections = parsed.sections || parsed;
            if (Array.isArray(sections)) {
              const footerSection = sections.find(s => s.type === 'footer');
              if (footerSection && footerSection.content) {
                setFooterData({ ...DEFAULT_FOOTER, ...footerSection.content });
              }
            }
          }
        } catch (parseErr) {}
      }
    };
    loadFooterData();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3 style={{ color: settings?.primaryColor }}>{footerData.title || settings?.title}</h3>
          <p style={{ lineHeight: '1.6' }}>{footerData.description}</p>
        </div>

        <div className="footer-column">
          <h3>Liên kết</h3>
          <ul>
            <li><a href="/">Trang Chủ</a></li>
            <li><a href="/shop">Cửa Hàng</a></li>
            <li><a href="/about">Về Chúng Tôi</a></li>
            <li><a href="/contact">Liên Hệ</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Liên Hệ</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color={settings?.primaryColor} /> {footerData.address}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} color={settings?.primaryColor} /> {footerData.phone}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} color={settings?.primaryColor} /> {footerData.email}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.5)', fontSize: '0.9rem', color: '#666' }}>
        © 2024 {footerData.title || settings?.title}. Made with 💕
      </div>
    </footer>
  );
};

export default SharedFooter;
