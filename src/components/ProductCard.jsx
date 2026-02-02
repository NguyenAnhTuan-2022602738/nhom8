import React, { useState } from 'react';
import { Heart, ShoppingBag, Camera, Copy, Trash } from 'lucide-react';
import { uploadImage } from '../utils/cloudinary';

const ProductCard = ({ product, settings, onOpenModal, onAddToCart, isEditing, onUpdate, onDelete, onDuplicate }) => {
  const primaryColor = settings?.primaryColor || '#c9184a';
  const [isLiked, setIsLiked] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      
      // Update images array, set as first image
      const newImages = [imageUrl, ...(product.images || [])];
      onUpdate({ ...product, images: newImages });
      
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextChange = (field, value) => {
    onUpdate({ ...product, [field]: value });
  };

  return (
    <div className="product-card" onClick={() => !isEditing && onOpenModal && onOpenModal(product)}>
      <div className="product-image-container">
        <img
          src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=600&auto=format&fit=crop';
          }}
        />
        {!isEditing && (
            <button
              className="wishlist-btn"
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
              style={{
                color: isLiked ? '#ff4d4f' : '#fff',
                fill: isLiked ? '#ff4d4f' : 'none'
              }}
            >
              <Heart size={20} fill={isLiked ? "#ff4d4f" : "rgba(0,0,0,0.3)"} />
            </button>
        )}
        
        {isEditing && (
            <>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    document.getElementById(`file-input-${product.id}`).click(); 
                  }}
                  style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px',
                    padding: '8px 15px',
                    background: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                  }}
                >
                    <Camera size={14} />
                    Đổi ảnh
                </button>
                <input 
                  id={`file-input-${product.id}`}
                  type="file" 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                <div className="card-edit-controls" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onDuplicate && onDuplicate(product)} className="card-ctrl-btn copy" title="Nhân bản">
                        <Copy size={14} />
                    </button>
                    <button onClick={() => onDelete && onDelete(product.id)} className="card-ctrl-btn delete" title="Xóa">
                        <Trash size={14} />
                    </button>
                </div>
            </>
        )}
      </div>
      
      <div className="product-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                 <span className="product-category">Hoa Tươi</span>
                 {isEditing ? (
                     <input 
                        className="editable-input-simple bold"
                        value={product.name}
                        onChange={(e) => handleTextChange('name', e.target.value)}
                        style={{ width: '100%', fontSize: '1.2rem', fontFamily: 'Dancing Script' }}
                        onClick={e => e.stopPropagation()}
                     />
                 ) : (
                     <h3 className="product-title" style={{ color: primaryColor }}>{product.name}</h3>
                 )}
            </div>
            {isEditing ? (
                 <input 
                    className="editable-input-simple"
                    value={product.price}
                    type="number"
                    onChange={(e) => handleTextChange('price', Number(e.target.value))}
                    style={{ width: '80px', fontSize: '1rem', fontWeight: 'bold' }}
                    onClick={e => e.stopPropagation()}
                 />
            ) : (
                <span className="product-price" style={{ color: primaryColor }}>
                    {Number(product.price).toLocaleString('vi-VN')}
                    <span style={{ fontSize: '0.8rem', verticalAlign: 'top' }}>₫</span>
                </span>
            )}
        </div>
        
        {isEditing ? (
            <textarea 
                className="editable-input-simple"
                value={product.description}
                onChange={(e) => handleTextChange('description', e.target.value)}
                style={{ width: '100%', height: '60px', margin: '10px 0', fontSize: '0.8rem' }}
                onClick={e => e.stopPropagation()}
            />
        ) : (
            <p className="product-desc">
                {product.description}
            </p>
        )}
        
        <button 
          className="add-to-cart-btn" 
          onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
          style={{ 
            '--btn-primary-color': primaryColor,
            opacity: isEditing ? 0.5 : 1,
            pointerEvents: isEditing ? 'none' : 'auto'
          }}
        >
          <ShoppingBag size={18} style={{ marginRight: '8px' }} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
