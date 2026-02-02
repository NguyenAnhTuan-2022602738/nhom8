import React, { useState, useEffect } from 'react';
import { Gift, PenTool, Save, Plus, Trash2, Copy, Check } from 'lucide-react';
import PromotionCard from '../components/PromotionCard';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

const DEFAULT_PROMOTIONS = [
  {
    id: 1,
    title: "Chào Xuân 2024",
    code: "SPRING2024",
    discount: 15,
    type: "percentage",
    validFrom: "2024-01-01",
    validUntil: "2024-03-31",
    minPurchase: 200000,
    maxDiscount: 100000,
    isActive: true
  },
  {
    id: 2,
    title: "Miễn Phí Ship",
    code: "FREESHIP50K",
    discount: 50000,
    type: "fixed",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    minPurchase: 300000,
    maxDiscount: 50000,
    isActive: true
  },
  {
    id: 3,
    title: "Khách Hàng Mới",
    code: "WELCOME100",
    discount: 100000,
    type: "fixed",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    minPurchase: 500000,
    maxDiscount: 100000,
    isActive: true
  }
];

const Promotions = ({ settings, isAdmin }) => {
  const [promotions, setPromotions] = useState(DEFAULT_PROMOTIONS);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Load promotions
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const savedData = await api.getSetting('promotionsData');
        if (savedData && savedData.length > 0) {
          setPromotions(savedData);
        }
      } catch (e) {
        console.log("Using default promotions");
      }
    };
    loadPromotions();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAdd = () => {
    const newPromotion = {
      id: Date.now(),
      title: "Chương trình mới",
      code: "NEWCODE",
      discount: 10,
      type: "percentage",
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minPurchase: 100000,
      maxDiscount: 50000,
      isActive: true
    };
    setPromotions([...promotions, newPromotion]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa chương trình này?")) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleUpdate = (id, field, value) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.saveSetting('promotionsData', promotions);
      await new Promise(resolve => setTimeout(resolve, 300));
      alert('✅ Đã lưu chương trình khuyến mãi!');
    } catch (e) {
      console.error("Save failed", e);
      alert('⚠️ Lỗi khi lưu');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', minHeight: '70vh' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Gift size={60} style={{ color: settings.primaryColor, marginBottom: '1rem' }} />
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            🎁 Chương Trình Khuyến Mãi
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Nhận ngay ưu đãi hấp dẫn cho đơn hàng của bạn
          </p>
        </div>

        {/* Promotions Grid */}
        {!isEditing ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
            gap: '25px',
            marginBottom: '3rem'
          }}>
            {promotions.filter(p => p.isActive && (p.title.toLowerCase().includes('ship') || p.code.toLowerCase().includes('ship') || p.code.toLowerCase().includes('free'))).map(promotion => (
              <div
                key={promotion.id}
                onClick={() => handleCopyCode(promotion.code)}
                style={{ position: 'relative' }}
              >
                <PromotionCard promotion={promotion} settings={settings} />
                {copiedCode === promotion.code && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    pointerEvents: 'none'
                  }}>
                    <Check size={18} />
                    Đã sao chép!
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {promotions.map(promo => (
              <div
                key={promo.id}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>Tên chương trình</label>
                    <input
                      value={promo.title}
                      onChange={e => handleUpdate(promo.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mã code</label>
                    <input
                      value={promo.code}
                      onChange={e => handleUpdate(promo.id, 'code', e.target.value)}
                      style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại giảm</label>
                    <select
                      value={promo.type}
                      onChange={e => handleUpdate(promo.id, 'type', e.target.value)}
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (đ)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Giá trị giảm</label>
                    <input
                      type="number"
                      value={promo.discount}
                      onChange={e => handleUpdate(promo.id, 'discount', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Từ ngày</label>
                    <input
                      type="date"
                      value={promo.validFrom}
                      onChange={e => handleUpdate(promo.id, 'validFrom', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Đến ngày</label>
                    <input
                      type="date"
                      value={promo.validUntil}
                      onChange={e => handleUpdate(promo.id, 'validUntil', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Đơn tối thiểu</label>
                    <input
                      type="number"
                      value={promo.minPurchase}
                      onChange={e => handleUpdate(promo.id, 'minPurchase', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Giảm tối đa</label>
                    <input
                      type="number"
                      value={promo.maxDiscount}
                      onChange={e => handleUpdate(promo.id, 'maxDiscount', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={promo.isActive}
                      onChange={e => handleUpdate(promo.id, 'isActive', e.target.checked)}
                    />
                    Hoạt động
                  </label>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    style={{
                      background: '#ff4d4f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAdd}
              style={{
                width: '100%',
                padding: '15px',
                border: '3px dashed #667eea',
                background: 'transparent',
                borderRadius: '15px',
                cursor: 'pointer',
                color: '#667eea',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={20} /> Thêm chương trình mới
            </button>
          </div>
        )}

        {/* How to use */}
        <div className="glass-card" style={{ marginTop: '3rem' }}>
          <h3 style={{ color: settings.primaryColor, marginBottom: '1rem' }}>
            📝 Cách sử dụng mã giảm giá
          </h3>
          <ol style={{ lineHeight: '2', color: '#555' }}>
            <li>Chọn sản phẩm yêu thích và thêm vào giỏ hàng</li>
            <li>Vào trang Giỏ Hàng, nhấp vào ô "Nhập mã giảm giá"</li>
            <li>Nhập mã voucher (hoặc nhấp vào card ở trên để tự động sao chép)</li>
            <li>Nhấn "Áp dụng" và hưởng ưu đãi ngay!</li>
          </ol>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
            ℹ️ Mỗi đơn hàng chỉ được áp dụng 1 mã giảm giá. Không áp dụng đồng thời nhiều voucher.
          </p>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: isSaving ? '#6c757d' : (isEditing ? '#28a745' : settings.primaryColor),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '50px',
            cursor: isSaving ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            zIndex: 1000
          }}
        >
          {isSaving ? (
            'Đang lưu...'
          ) : isEditing ? (
            <><Save size={18} /> Lưu KM</>
          ) : (
            <><PenTool size={18} /> Sửa KM</>
          )}
        </button>
      )}

      <SharedFooter settings={settings} />
    </>
  );
};

export default Promotions;
