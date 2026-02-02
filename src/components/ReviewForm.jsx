import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { uploadImage } from '../utils/cloudinary';

const ReviewForm = ({ onSubmit, settings }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      
      // Upload all files to Cloudinary
      const uploadPromises = files.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      setPreviewImages(prev => [...prev, ...imageUrls]);
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUrlAdd = () => {
    const url = prompt("Nhập URL ảnh:");
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
      setPreviewImages(prev => [...prev, url]);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({ customerName: '', rating: 5, comment: '', images: [] });
    setPreviewImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
      <h3 style={{ color: settings.primaryColor, marginBottom: '1.5rem', textAlign: 'center' }}>
        ✍️ Để lại đánh giá của bạn
      </h3>

      <div className="form-group">
        <label>Tên của bạn</label>
        <input
          required
          value={formData.customerName}
          onChange={e => setFormData({ ...formData, customerName: e.target.value })}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="form-group">
        <label>Đánh giá ({formData.rating} sao)</label>
        <div style={{ display: 'flex', gap: '5px', fontSize: '2rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={32}
              fill={star <= formData.rating ? settings.primaryColor : 'none'}
              color={star <= formData.rating ? settings.primaryColor : '#ddd'}
              style={{ cursor: 'pointer' }}
              onClick={() => setFormData({ ...formData, rating: star })}
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Nhận xét</label>
        <textarea
          required
          value={formData.comment}
          onChange={e => setFormData({ ...formData, comment: e.target.value })}
          rows={5}
          placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ và sản phẩm..."
        />
      </div>

      <div className="form-group">
        <label>Ảnh thực tế (tùy chọn)</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {previewImages.map((img, index) => (
            <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
              <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ 
            flex: 1,
            padding: '10px',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}>
            <Upload size={18} /> Tải ảnh lên
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
          <button
            type="button"
            onClick={handleImageUrlAdd}
            style={{
              flex: 1,
              padding: '10px',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            📎 Dán link ảnh
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', background: settings.primaryColor }}
      >
        Gửi đánh giá
      </button>
    </form>
  );
};

export default ReviewForm;
