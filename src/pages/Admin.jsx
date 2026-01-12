import React, { useState } from 'react';

const Admin = ({ products, settings, setSettings, setProducts }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', image: '', description: '' });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setFormData({ name: '', price: '', image: '', description: '' });
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            
      {/* Interface Settings */}
      <div className="glass-card">
        <h2 style={{ borderBottom: '2px solid pink', paddingBottom: '10px' }}>🎨 Tùy Chỉnh Giao Diện</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Tên Cửa Hàng</label>
            <input value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Màu Chủ Đạo</label>
            <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} style={{ height: '50px', padding: '5px' }} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ margin: 0 }}>Hiệu ứng Hoa Rơi:</label>
            <input 
              type="checkbox" 
              checked={settings.showFlowers} 
              onChange={e => setSettings({...settings, showFlowers: e.target.checked})} 
              style={{ width: '20px', height: '20px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: 1, minWidth: '300px' }}>
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
              <label>Link Ảnh (URL)</label>
              <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required placeholder="https://example.com/flower.jpg" />
            </div>
            <div className="form-group">
              <label>Lời chúc / Mô tả</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" placeholder="Môt tả vẻ đẹp..." />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingProduct ? 'Cập nhật' : 'Thêm mới'}</button>
              {editingProduct && (
                <button type="button" onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', image: '', description: '' }); }} className="btn-danger" style={{ flex: 1, borderRadius: '30px' }}>Hủy</button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-card" style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ textAlign: 'center', borderBottom: '2px dashed pink', paddingBottom: '10px' }}>📦 Kho Hoa Hiện Tại</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
            {products.map(product => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.6)', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', border: '2px solid white' }} />
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{product.name}</strong><br/>
                    <span style={{ fontWeight: 'bold' }}>{Number(product.price).toLocaleString('vi-VN')} đ</span>
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
