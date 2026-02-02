import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { uploadImage } from '../utils/cloudinary';

const Testimonials = ({ isEditing, data, onUpdate }) => {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const currentData = {
    title: data.title || "Khách Hàng Nói Gì? 💬",
    items: data.items || [
           { name: "Nguyễn Thùy Linh", quote: "Hoa đẹp xỉu mọi người ơi! Shop gói hàng siêu có tâm.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" },
           { name: "Trần Văn Phúc", quote: "Đặt hoa tặng vợ nhân dịp kỷ niệm, vợ mình thích lắm.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
    ]
  };

  const handleTitleChange = (val) => {
    onUpdate({ ...data, title: val });
  };

  const handleItemChange = (index, field, val) => {
    const newItems = [...currentData.items];
    newItems[index] = { ...newItems[index], [field]: val };
    onUpdate({ ...data, items: newItems });
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      const imageUrl = await uploadImage(file);
      const newItems = [...currentData.items];
      newItems[index] = { ...newItems[index], avatar: imageUrl };
      onUpdate({ ...data, items: newItems });
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <section>
        {isEditing ? (
             <input 
                className="editable-input section-title-input"
                value={currentData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
             />
         ) : (
             <h2 className="section-title">{currentData.title}</h2>
         )}

        <div className="features-grid">
           {currentData.items.map((item, index) => (
             <div key={index} className="testimonial-card" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={item.avatar} className="testimonial-avatar" alt="User"/>
                    {isEditing && (
                        <label className="upload-avatar-btn" title="Đổi ảnh đại diện">
                            <Camera size={14} />
                            <input type="file" style={{ display: 'none' }} onChange={(e) => handleImageUpload(index, e)} />
                        </label>
                    )}
                </div>

                {isEditing ? (
                    <>
                        <textarea 
                            className="editable-input-simple italic"
                            value={item.quote}
                            onChange={(e) => handleItemChange(index, 'quote', e.target.value)}
                            style={{ width: '100%', height: '80px', marginBottom: '10px' }}
                        />
                        <input 
                            className="editable-input-simple bold"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            style={{ width: '100%', textAlign: 'center' }}
                        />
                    </>
                ) : (
                    <>
                        <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{item.quote}"</p>
                        <strong>- {item.name}</strong>
                    </>
                )}
             </div>
           ))}
        </div>
    </section>
  );
};

export default Testimonials;
