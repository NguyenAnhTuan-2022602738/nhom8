import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Columns, Plus } from 'lucide-react';
import { api } from '../services/api';

const FeaturedProducts = ({ products, setProducts, settings, onOpenModal, onAddToCart, isEditing, data, onUpdate }) => {
  // We use data.featuredIds to know WHICH products to show in this section.
  // If no IDs are stored yet, we initialize with the IDs of the first 3 products.
  useEffect(() => {
    if ((!data.featuredIds || data.featuredIds.length === 0) && products.length > 0) {
        onUpdate({ 
            ...data, 
            featuredIds: products.slice(0, 3).map(p => p.id)
        });
    }
  }, []); // Run once on mount

  const featuredIds = data.featuredIds || [];
  const title = data.title || "Sản Phẩm Nổi Bật 🌟";
  const columns = data.columns || 3;

  // Filter global products to find the ones to display
  // Use map to preserve order if possible, or just filter
  const displayedProducts = featuredIds
    .map(id => products.find(p => p.id === id))
    .filter(p => p !== undefined);

  const handleProductUpdate = async (updatedProduct) => {
    // Update local state first (Optimistic)
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    
    // Update DB
    try {
        await api.updateProduct(updatedProduct.id, updatedProduct);
    } catch (e) {
        console.error("Failed to update DB", e);
    }
  };

  const handleDuplicateProduct = async (product) => {
    const newId = Date.now();
    const newProduct = { ...product, id: newId, _id: undefined, name: `${product.name} (Copy)` };
    
    // Update local
    setProducts([...products, newProduct]);
    onUpdate({ ...data, featuredIds: [...featuredIds, newId] });
    
    // Update DB
    try {
        await api.createProduct(newProduct);
    } catch (e) {
        console.error("Failed to create in DB", e);
    }
  };
  
  const handleAddProduct = async () => {
    const newId = Date.now();
    const newProduct = {
        id: newId,
        name: "Sản phẩm mới",
        price: 0,
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300",
        images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300"],
        description: "Mô tả sản phẩm mới...",
        category: "Hoa Tươi"
    };

    // Update local
    setProducts([...products, newProduct]);
    onUpdate({ ...data, featuredIds: [...featuredIds, newId] });
    
    // Update DB
    try {
        await api.createProduct(newProduct);
    } catch (e) {
        console.error("Failed to create in DB", e);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Xóa sản phẩm này khỏi danh sách này? (Sản phẩm vẫn còn trong Cửa hàng)")) {
        // Just remove from this section
        onUpdate({ ...data, featuredIds: featuredIds.filter(id => id !== productId) });
    }
  };

  const handleColumnChange = (cols) => {
    onUpdate({ ...data, columns: cols });
  };

  return (
    <section style={{ position: 'relative' }}>
        {isEditing ? (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                 <input 
                    className="editable-input section-title-input"
                    value={title}
                    onChange={(e) => onUpdate({ ...data, title: e.target.value })}
                 />
                 <div className="grid-controls" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', padding: '5px 15px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '10px' }}>
                    <Columns size={16} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Cột:</span>
                    {[2, 3, 4].map(num => (
                        <button 
                            key={num}
                            onClick={() => handleColumnChange(num)}
                            style={{ 
                                background: columns === num ? settings.primaryColor : '#eee',
                                color: columns === num ? 'white' : '#333',
                                border: 'none',
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {num}
                        </button>
                    ))}
                 </div>
                 <div style={{ marginTop: '10px', color: '#666', fontSize: '0.8rem' }}>
                    * Mẹo: Các thay đổi nội dung ở đây sẽ cập nhật trực tiếp vào Cửa Hàng.
                 </div>
            </div>
        ) : (
             <h2 className="section-title">{title}</h2>
        )}
        
        <div className="grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 4 ? '250px' : columns === 2 ? '400px' : '280px'}, 1fr))` }}>
            {displayedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                settings={settings} 
                onOpenModal={onOpenModal}
                onAddToCart={onAddToCart}
                isEditing={isEditing}
                onUpdate={handleProductUpdate}
                onDuplicate={handleDuplicateProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
            
            {isEditing && (
                <div 
                    onClick={handleAddProduct}
                    style={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: '24px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        minHeight: '400px', 
                        cursor: 'pointer',
                        color: '#999',
                        transition: 'all 0.2s',
                        background: 'rgba(255,255,255,0.5)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = settings.primaryColor; e.currentTarget.style.color = settings.primaryColor; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.color = '#999'; }}
                >
                    <div style={{ background: '#f5f5f5', borderRadius: '50%', padding: '20px', marginBottom: '15px' }}>
                        <Plus size={40} />
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Thêm Sản Phẩm Mới</span>
                </div>
            )}
        </div>
        {!isEditing && (
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none', background: settings.primaryColor }}>Xem Tất Cả Sản Phẩm</Link>
            </div>
        )}
    </section>
  );
};

export default FeaturedProducts;

