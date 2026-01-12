import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

const Hero = ({ settings, isEditing, data, onUpdate }) => {
  const fileInputRef = useRef(null);

  const handleTextChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...data, bgImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentData = {
    title: data.title || "Mùa Yêu Thương",
    subtitle: data.subtitle || "Trao gửi yêu thương qua những đóa hoa tươi thắm nhất...",
    buttonText: data.buttonText || "Mua Ngay",
    bgImage: data.bgImage || "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop"
  };

  return (
    <section className="hero-section" style={{ 
      backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${currentData.bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative' // For upload button placement
    }}>
      {isEditing && (
        <>
            <button 
                className="upload-btn" 
                onClick={() => fileInputRef.current.click()}
                title="Thay đổi ảnh nền"
            >
                <Camera size={20} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleImageUpload}
            />
        </>
      )}

      {isEditing ? (
          <input 
            className="editable-input title"
            value={currentData.title}
            onChange={(e) => handleTextChange('title', e.target.value)}
            style={{ color: settings.primaryColor }}
          />
      ) : (
          <h2 className="hero-title" style={{ color: settings.primaryColor }}>{currentData.title}</h2>
      )}

      {isEditing ? (
          <textarea 
            className="editable-input subtitle"
            value={currentData.subtitle}
            onChange={(e) => handleTextChange('subtitle', e.target.value)}
          />
      ) : (
          <p className="hero-subtitle">{currentData.subtitle}</p>
      )}

      <button className="btn-primary" style={{ background: settings.primaryColor }}>
        {isEditing ? (
             <input 
                value={currentData.buttonText}
                onChange={(e) => handleTextChange('buttonText', e.target.value)}
                className="editable-input-simple"
             />
        ) : (
             currentData.buttonText || "Mua Ngay"
        )}
      </button>
    </section>
  );
};

export default Hero;
