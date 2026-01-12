import React from 'react';
import ProductCard from '../components/ProductCard';

const Shop = ({ products, settings, onOpenModal, onAddToCart }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <h2 className="section-title">✨ Cửa Hàng Hoa</h2>
      <div className="grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            settings={settings}
            onOpenModal={onOpenModal}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
