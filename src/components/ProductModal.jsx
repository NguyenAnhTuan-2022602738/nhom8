import React, { useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Edit, Save } from 'lucide-react';
import { api } from '../services/api';

const ProductModal = ({ product, isOpen, onClose, onAddToCart, settings, isAdmin, onUpdateProduct }) => {
  // Handle isOpen prop if passed (older usage might not have it, but Home.jsx likely does)
  // Actually Home.jsx renders it conditionally.
  // Wait, in previous step checking view_file, ProductModal takes (product, onClose, onAddToCart, settings). isOpen is not used?
  // Let's stick to existing signature but add isAdmin and onUpdateProduct.
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...product, images: product.images || [] });
  const [selectedImage, setSelectedImage] = useState(product.image); 
  const primaryColor = settings?.primaryColor || '#c9184a';

  // Ensure images array exists
  const images = editData.images && editData.images.length > 0 ? editData.images : [editData.image];

  // Sync selected image if not in new images list
  if (images.length > 0 && !images.includes(selectedImage)) {
      if (images[0]) setSelectedImage(images[0]);
  }

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

  const handleSave = async () => {
    try {
        const updatedProduct = { 
            ...editData, 
            image: images[0] || editData.image, // Ensure main image is synced
            // If user added images via text in Admin but here we use editData
        };
        // Call API
        await api.updateProduct(product.id, updatedProduct);
        if (onUpdateProduct) onUpdateProduct(updatedProduct);
        
        setIsEditing(false);
        alert("Đã cập nhật sản phẩm thành công! 🌟");
    } catch (e) {
        console.error(e);
        alert("Lỗi khi cập nhật sản phẩm");
    }
  };

  const handleAddImage = () => {
      const url = prompt("Nhập URL ảnh mới:");
      if (url) {
          const newImages = [...images, url];
          setEditData(prev => ({ ...prev, images: newImages }));
          setSelectedImage(url);
      }
  };

   const handleRemoveImage = (e, index) => {
    e.stopPropagation();
    if (images.length <= 1) {
        alert("Phải giữ ít nhất 1 ảnh!");
        return;
    }
    const newImages = images.filter((_, i) => i !== index);
    setEditData(prev => ({ ...prev, images: newImages }));
    if (selectedImage === images[index]) setSelectedImage(newImages[0]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

         {isAdmin && (
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                style={{ position: 'absolute', top: '20px', right: '60px', border: 'none', background: 'transparent', cursor: 'pointer', color: primaryColor, display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
            >
                {isEditing ? <><Save size={24} /> Lưu</> : <><Edit size={24} /> Sửa</>}
            </button>
        )}
        
        <div className="modal-grid">
          <div className="modal-gallery">
             <div className="main-image-container" style={{ position: 'relative' }}>
                <img src={selectedImage || images[0]} alt={product.name} className="main-image" />
             </div>
             <div className="thumbnail-list">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-item ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                    style={{ borderColor: selectedImage === img ? primaryColor : 'transparent', position: 'relative' }}
                  >
                    <img src={img} alt={`${product.name} ${index}`} />
                    {isEditing && (
                        <button onClick={(e) => handleRemoveImage(e, index)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '15px', height: '15px', fontSize: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>x</button>
                    )}
                  </div>
                ))}
                 {isEditing && (
                    <div 
                        className="thumbnail-item"
                        onClick={handleAddImage}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #ccc', cursor: 'pointer' }}
                    >
                        <Plus size={20} color="#ccc" />
                    </div>
                )}
             </div>
          </div>
          
          <div className="modal-info">
            <span className="modal-category">Hoa Tươi Cao Cấp</span>
            
            {isEditing ? (
                 <input 
                    value={editData.name} 
                    onChange={e => setEditData({...editData, name: e.target.value})}
                    style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '100%', marginBottom: '10px', padding: '5px' }}
                />
            ) : (
                <h2 className="modal-title" style={{ color: primaryColor }}>{product.name}</h2>
            )}

            <p className="modal-price" style={{ color: primaryColor }}>
              {isEditing ? (
                    <input 
                        type="number"
                        value={editData.price} 
                        onChange={e => setEditData({...editData, price: e.target.value})}
                        style={{ fontSize: '1.2rem', fontWeight: 'bold', color: primaryColor, width: '150px' }}
                    />
                 ) : (
                    Number(product.price).toLocaleString('vi-VN') + ' ₫'
                 )}
            </p>
            
            {isEditing ? (
                <textarea 
                    value={editData.description} 
                    onChange={e => setEditData({...editData, description: e.target.value})}
                    rows={6}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', borderColor: '#ddd' }}
                />
            ) : (
                 <p className="modal-desc">{product.description || "Mô tả sản phẩm đang được cập nhật..."}</p>
            )}
            
            {!isEditing && (
                <>
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
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
