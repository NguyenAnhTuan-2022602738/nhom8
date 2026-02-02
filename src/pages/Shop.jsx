import React from 'react';
import ProductCard from '../components/ProductCard';
import SharedFooter from '../components/SharedFooter';

const Shop = ({ products, settings, onOpenModal, onAddToCart, categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(6); // Default 6 items
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false); // Mobile sidebar toggle

  // Reset pagination when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, itemsPerPage]);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '0' }}>
      
      {/* Banner / Title Section */}
      <div style={{ textAlign: 'center', padding: '2rem 0', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <h2 className="section-title" style={{ margin: 0 }}>✨ Cửa Hàng Hoa</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>Khám phá những mẫu hoa tươi thắm nhất dành cho bạn</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', padding: '0 20px', flexWrap: 'wrap', flexDirection: 'row', position: 'relative' }}>
        
        {/* Mobile Filter Toggle */}
        <div style={{ width: '100%', display: 'none', zIndex: 101, position: 'relative' }} className="mobile-filter-toggle">
            <button 
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #ddd',
                    background: 'white',
                    color: settings.primaryColor,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
            >
                <span>{showMobileSidebar ? '🔼 Ẩn bộ lọc' : '🔍 Bộ lọc & Danh mục'}</span>
            </button>
            <style>{`
                @media (max-width: 768px) {
                    .mobile-filter-toggle { display: block !important; }
                    .sidebar-container { 
                        display: ${showMobileSidebar ? 'block' : 'none'} !important; 
                        position: absolute !important;
                        top: 60px;
                        left: 20px;
                        right: 20px;
                        z-index: 1000;
                        width: auto !important;
                    }
                    .sidebar-container .glass-card {
                        position: relative !important;
                        top: 0 !important;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
                    }
                }
            `}</style>
        </div>

        {/* Left Sidebar - Categories & Search */}
        <div className="sidebar-container" style={{ flex: '0 0 250px', minWidth: '200px' }}>
            <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                
                {/* Search Input */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '10px 35px 10px 15px', 
                                borderRadius: '20px', 
                                border: '1px solid #ddd',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: `2px solid ${settings.primaryColor}`, paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏷️ Danh Mục
                </h3>
                
                {/* Scrollable Category List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        style={{
                            textAlign: 'left',
                            padding: '10px 15px',
                            borderRadius: '10px',
                            border: 'none',
                            background: selectedCategory === 'all' ? `${settings.primaryColor}15` : 'transparent',
                            color: selectedCategory === 'all' ? settings.primaryColor : '#444',
                            cursor: 'pointer',
                            fontWeight: selectedCategory === 'all' ? '600' : '400',
                            transition: 'all 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexShrink: 0
                        }}
                    >
                        <span>Tất cả sản phẩm</span>
                        <span style={{ fontSize: '0.8rem', background: '#eee', padding: '2px 8px', borderRadius: '10px' }}>{products.length}</span>
                    </button>
                    
                    {categories.map(cat => {
                        const count = products.filter(p => p.category === cat.name).length;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                style={{
                                    textAlign: 'left',
                                    padding: '10px 15px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: selectedCategory === cat.name ? `${settings.primaryColor}15` : 'transparent',
                                    color: selectedCategory === cat.name ? settings.primaryColor : '#444',
                                    cursor: 'pointer',
                                    fontWeight: selectedCategory === cat.name ? '600' : '400',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <span>{cat.name}</span>
                                <span style={{ fontSize: '0.8rem', background: '#eee', padding: '2px 8px', borderRadius: '10px' }}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Right Content - Products Grid */}
        <div style={{ flex: 1, minWidth: '0' }}> 
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                    {selectedCategory === 'all' ? 'Tất cả sản phẩm' : selectedCategory}
                </h3>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} trên tổng số {filteredProducts.length} kết quả
                </span>
              </div>
              
              {/* Items Per Page Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Hiển thị:</span>
                  <select 
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer' }}
                  >
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                  </select>
              </div>
          </div>

          <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
              gap: '1.5rem' 
          }}>
            {currentItems.length > 0 ? (
              currentItems.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  settings={settings}
                  onOpenModal={onOpenModal}
                  onAddToCart={onAddToCart}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.5)', borderRadius: '15px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🥀</div>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>Không tìm thấy sản phẩm nào phù hợp.</p>
                  <button onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }} style={{ marginTop: '1rem', padding: '8px 20px', border: '1px solid #999', borderRadius: '20px', background: 'transparent', cursor: 'pointer' }}>
                      Xóa bộ lọc
                  </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '2rem' }}>
                  <button 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                      &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                      <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          style={{ 
                              padding: '8px 12px', 
                              border: currentPage === index + 1 ? `1px solid ${settings.primaryColor}` : '1px solid #ddd', 
                              borderRadius: '5px', 
                              background: currentPage === index + 1 ? settings.primaryColor : 'white', 
                              color: currentPage === index + 1 ? 'white' : '#333',
                              cursor: 'pointer' 
                          }}
                      >
                          {index + 1}
                      </button>
                  ))}

                  <button 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                      &gt;
                  </button>
              </div>
          )}
        </div>
      
      </div>
      
      <SharedFooter settings={settings} />
    </div>
  );
};

export default Shop;
