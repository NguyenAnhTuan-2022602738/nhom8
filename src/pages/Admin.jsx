import React, { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const Admin = ({ products, settings, setProducts }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', image: '', images: '', description: '' });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
        ...product,
        images: product.images ? product.images.join('\n') : ''
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
      setProducts(products.filter(p => p.id !== id));
      try {
         await api.deleteProduct(id);
      } catch (e) { console.error("Delete failed", e); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process images textarea -> array
    const imageList = formData.images
        ? formData.images.split('\n').map(s => s.trim()).filter(s => s)
        : (formData.image ? [formData.image] : []);

    const productData = {
        ...formData,
        images: imageList,
        // Ensure main image is set if not provided but list has items
        image: formData.image || (imageList.length > 0 ? imageList[0] : '')
    };

    if (editingProduct) {
      // Update
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: p.id } : p));
      setEditingProduct(null);
      try {
          await api.updateProduct(editingProduct.id, productData);
      } catch (e) { console.error("Update failed", e); }
    } else {
      // Create
      const newProduct = { ...productData, id: Date.now() };
      setProducts([...products, newProduct]);
      try {
          await api.createProduct(newProduct);
      } catch (e) { console.error("Create failed", e); }
    }
    setFormData({ name: '', price: '', image: '', images: '', description: '' });
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Quick Link to UI Editor */}
      <div style={{ 
          background: 'linear-gradient(135deg, #fff5f8 0%, #ffe0e6 100%)', 
          padding: '15px 20px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(201, 24, 74, 0.1)'
      }}>
          <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>🎨 Tùy Chỉnh Giao Diện</span>
              <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>
                  Chỉnh sửa tên shop, màu sắc, banner, footer và bố cục trang chủ.
              </p>
          </div>
          <Link 
              to="/" 
              style={{ 
                  background: settings.primaryColor, 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '25px', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  boxShadow: '0 3px 10px rgba(201, 24, 74, 0.3)'
              }}
          >
              Sửa Giao Diện →
          </Link>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: 1, minWidth: '350px' }}>
          <h2 style={{ textAlign: 'center', borderBottom: '2px solid pink', paddingBottom: '10px' }}>
            {editingProduct ? '✏️ Sửa Sản Phẩm' : '✨ Thêm Sản Phẩm Mới'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Tên loài hoa</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Ví dụ: Hoa Hồng..." />
            </div>
            <div className="form-group">
              <label>Giá bán (VNĐ)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required placeholder="500000" />
            </div>
            <div className="form-group">
              <label>Ảnh Chính (URL)</label>
              <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required placeholder="https://example.com/flower.jpg" />
            </div>
            <div className="form-group">
              <label>Album Ảnh (Mỗi dòng 1 link)</label>
              <textarea 
                value={formData.images} 
                onChange={e => setFormData({...formData, images: e.target.value})} 
                rows="4" 
                placeholder="https://img1.jpg&#10;https://img2.jpg" 
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </div>
            
            {/* Live Preview Section */}
            {(formData.image || formData.images) && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Xem trước ảnh chính:</label>
                    <div style={{ width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', marginTop: '5px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formData.image ? (
                            <img 
                                src={formData.image} 
                                alt="Preview" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = '⚠️ Link ảnh lỗi'; }}
                            />
                        ) : (
                            <span style={{ color: '#999' }}>Chưa có link ảnh</span>
                        )}
                    </div>
                </div>
            )}
            
            <div className="form-group">
              <label>Lời chúc / Mô tả</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" placeholder="Môt tả vẻ đẹp..." />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingProduct ? 'Cập nhật' : 'Thêm mới'}</button>
              {editingProduct && (
                <button type="button" onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', image: '', images: '', description: '' }); }} className="btn-danger" style={{ flex: 1, borderRadius: '30px' }}>Hủy</button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-card" style={{ flex: 2, minWidth: '350px' }}>
          <h2 style={{ textAlign: 'center', borderBottom: '2px dashed pink', paddingBottom: '10px' }}>📦 Kho Hoa Hiện Tại</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '800px', overflowY: 'auto', paddingRight: '10px' }}>
            {products.map(product => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.6)', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '')} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', border: '2px solid white' }} />
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{product.name}</strong><br/>
                    <span style={{ fontWeight: 'bold' }}>{Number(product.price).toLocaleString('vi-VN')} đ</span>
                    {product.images && product.images.length > 1 && (
                        <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>📸 {product.images.length} ảnh</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleEdit(product)} title="Sửa" style={{ width: '35px', height: '35px', borderRadius:'50%', border:'none', background:'white', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.1)' }}>✏️</button>
                  <button onClick={() => handleDelete(product.id)} title="Xóa" style={{ width: '35px', height: '35px', borderRadius:'50%', border:'none', background:'#ff6b6b', color:'white', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.1)' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
