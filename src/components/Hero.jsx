import React, { useState, useEffect, useRef } from 'react';
import { Camera, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { uploadImage } from '../utils/cloudinary';

const Hero = ({ settings, isEditing, data, onUpdate }) => {
  const fileInputRef = useRef(null);

  // Helper for text
  const handleTextChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const images = data.images && data.images.length > 0 ? data.images : [data.bgImage || "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const currentData = {
    title: data.title || "Mùa Yêu Thương",
    subtitle: data.subtitle || "Trao gửi yêu thương qua những đóa hoa tươi thắm nhất...",
    buttonText: data.buttonText || "Mua Ngay",
    bgImage: images[currentImageIndex]
  };

  // Auto-slide
  useEffect(() => {
    if (images.length > 1 && !isEditing) {
      const timer = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 5000); 
      return () => clearInterval(timer);
    }
  }, [images.length, isEditing]);

  const handleNext = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Handle uploading/adding image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      const newImages = [...images, imageUrl];
      onUpdate({ ...data, images: newImages, bgImage: newImages[0] });
      setCurrentImageIndex(newImages.length - 1);
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (e, index) => {
    e.stopPropagation();
    if (images.length <= 1) {
        alert("Phải giữ ít nhất 1 ảnh banner!");
        return;
    }
    const newImages = images.filter((_, i) => i !== index);
    onUpdate({ ...data, images: newImages, bgImage: newImages[0] });
    setCurrentImageIndex(0);
  };

  return (
    <section className="hero-section" style={{ 
      backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(${currentData.bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative' // For upload button placement
    }}>
      {/* Slider Arrows */}
      {images.length > 1 && (
        <>
            <button 
                onClick={handlePrev} 
                className="slider-arrow left"
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', zIndex: 10,  boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
            >
                <ChevronLeft size={24} color={settings.primaryColor} />
            </button>
            <button 
                onClick={handleNext} 
                className="slider-arrow right"
                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
            >
                <ChevronRight size={24} color={settings.primaryColor} />
            </button>
            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                {images.map((_, idx) => (
                    <div 
                        key={idx} 
                        style={{ 
                            width: '10px', 
                            height: '10px', 
                            borderRadius: '50%', 
                            background: idx === currentImageIndex ? settings.primaryColor : 'white',
                            opacity: idx === currentImageIndex ? 1 : 0.6,
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }} 
                        onClick={() => setCurrentImageIndex(idx)}
                    />
                ))}
            </div>
        </>
      )}

      {isEditing && (
        <>
            {/* Multiple Image Manager */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', padding: '10px', borderRadius: '8px', zIndex: 20, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', maxWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Quản lý Banner ({images.length})</span>
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', border: `1px solid ${settings.primaryColor}`, color: settings.primaryColor, background: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        <Plus size={14} /> Thêm Ảnh
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0, cursor: 'pointer' }} onClick={() => setCurrentImageIndex(idx)}>
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: idx === currentImageIndex ? `2px solid ${settings.primaryColor}` : '1px solid #ddd' }} />
                            <button 
                                onClick={(e) => handleRemoveImage(e, idx)} 
                                style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: 'none', cursor: 'pointer' }}
                                title="Xóa ảnh này"
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>
            </div>

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
