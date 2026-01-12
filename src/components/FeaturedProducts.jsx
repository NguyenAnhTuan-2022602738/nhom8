import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Columns } from 'lucide-react';

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

  const handleProductUpdate = (updatedProduct) => {
    // Update the GLOBAL products list
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
  };

  const handleDuplicateProduct = (product) => {
    const newId = Date.now();
    const newProduct = { ...product, id: newId, name: `${product.name} (Copy)` };
    
    // 1. Add to global products
    setProducts([...products, newProduct]);
    
    // 2. Add to this section's list
    onUpdate({ ...data, featuredIds: [...featuredIds, newId] });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Xóa sản phẩm này khỏi danh sách này? (Sản phẩm vẫn còn trong Cửa hàng)")) {
        // Just remove from this section
        onUpdate({ ...data, featuredIds: featuredIds.filter(id => id !== productId) });
    }
  };
  
  // Note: True deletion from DB wasn't requested, just "remove from here". 
  // If user meant delete globally:
  // const handleDeleteGlobal = (productId) => {
  //    if(confirm...) setProducts(products.filter(p => p.id !== productId));
  // }
  // But usually home builder just manages display. Let's stick to "remove from view".

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
