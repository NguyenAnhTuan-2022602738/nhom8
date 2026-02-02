import React from 'react';
import { Tag, Clock, Gift } from 'lucide-react';

const PromotionCard = ({ promotion, settings }) => {
  const discountText = promotion.type === 'percentage' 
    ? `${promotion.discount}%` 
    : `${promotion.discount.toLocaleString('vi-VN')}đ`;

  const validUntil = new Date(promotion.validUntil);
  const now = new Date();
  const daysLeft = Math.ceil((validUntil - now) / (1000 * 60 * 60 * 24));

  return (
    <div 
      style={{
        background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #764ba2 100%)`,
        borderRadius: '20px',
        padding: '25px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 10px 30px ${settings.primaryColor}30`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 15px 40px ${settings.primaryColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 10px 30px ${settings.primaryColor}30`;
      }}
    >
      {/* Decorative Circle */}
      <div style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%'
      }} />

      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {promotion.title}
            </h3>
            <p style={{ margin: '5px 0 0 0', opacity: 1, fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>
              Giảm <span style={{ fontWeight: 'bold', color: '#ffeb3b', animation: 'blink 1.5s infinite ease-in-out', display: 'inline-block' }}>{discountText}</span>
            </p>
          </div>
          <Gift size={40} style={{ opacity: 0.8 }} />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          padding: '10px 15px',
          marginBottom: '15px',
          border: '2px dashed rgba(255,255,255,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <Tag size={16} />
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '2px' }}>
              {promotion.code}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
            Nhấp để sao chép mã
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', opacity: 0.9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} />
            <span>Còn {daysLeft} ngày</span>
          </div>
          <div>
            Đơn tối thiểu: {promotion.minPurchase?.toLocaleString('vi-VN')}đ
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
