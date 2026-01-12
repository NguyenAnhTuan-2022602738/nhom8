import React, { useState } from 'react';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart, settings }) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image); // Default to main image
  const primaryColor = settings?.primaryColor || '#c9184a';

  // Ensure images array exists, fallback to single image if needed
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-grid">
          <div className="modal-gallery">
             <div className="main-image-container">
                <img src={selectedImage} alt={product.name} className="main-image" />
             </div>
             <div className="thumbnail-list">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                    style={{ borderColor: selectedImage === img ? primaryColor : 'transparent' }}
                  >
                    <img src={img} alt={`${product.name} ${index}`} />
                  </div>
                ))}
             </div>
          </div>
          
          <div className="modal-info">
            <span className="modal-category">Hoa Tươi Cao Cấp</span>
            <h2 className="modal-title" style={{ color: primaryColor }}>{product.name}</h2>
            <p className="modal-price" style={{ color: primaryColor }}>
              {Number(product.price).toLocaleString('vi-VN')} ₫
            </p>
            
            <p className="modal-desc">{product.description}</p>
            
            <div className="modal-actions">
              <div className="quantity-selector">
                <button onClick={handleDecrease}><Minus size={16} /></button>
                <span>{quantity}</span>
                <button onClick={handleIncrease}><Plus size={16} /></button>
              </div>
              
              <button 
                className="modal-add-btn"
                style={{ background: primaryColor }}
                onClick={handleAdd}
              >
                <ShoppingBag size={20} style={{ marginRight: '8px' }} />
                Thêm - {(Number(product.price) * quantity).toLocaleString('vi-VN')} ₫
              </button>
            </div>
            
            <div className="modal-meta">
              <p>✓ Giao hàng miễn phí trong bán kính 5km</p>
              <p>✓ Tặng kèm thiệp chúc mừng</p>
              <p>✓ Cam kết hoa tươi 3 ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
