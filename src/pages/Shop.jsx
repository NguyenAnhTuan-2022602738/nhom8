import React from 'react';
import ProductCard from '../components/ProductCard';
import SharedFooter from '../components/SharedFooter';

const Shop = ({ products, settings, onOpenModal, onAddToCart }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '0' }}>
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
      <SharedFooter settings={settings} />
    </div>
  );
};

export default Shop;
