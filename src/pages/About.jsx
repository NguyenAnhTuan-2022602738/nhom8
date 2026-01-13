import React, { useState, useEffect } from 'react';
import { PenTool, Save, Upload } from 'lucide-react';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

// Default content
const DEFAULT_ABOUT = {
  title: "Về {shopName}",
  paragraphs: [
    "Chào mừng bạn đến với {shopName} – nơi những đóa hoa không chỉ là quà tặng, mà là ngôn ngữ của cảm xúc.",
    "Chúng tôi bắt đầu hành trình này với niềm đam mê bất tận dành cho vẻ đẹp của thiên nhiên. Mỗi bông hoa tại tiệm đều được tuyển chọn kỹ lưỡng từ những vườn ươm tốt nhất, được chăm sóc và gói ghém bằng tất cả sự trân trọng.",
    "Sứ mệnh của chúng tôi là mang lại nụ cười và sự ấm áp cho người nhận. Dù là một lời tỏ tình e ấp, một lời xin lỗi chân thành, hay chỉ đơn giản là niềm vui tự thưởng cho bản thân, chúng tôi luôn có loài hoa phù hợp dành cho bạn."
  ],
  image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop"
};

const About = ({ settings, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aboutData, setAboutData] = useState(DEFAULT_ABOUT);

  // Load about data từ homeLayoutV2
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const savedData = await api.getSetting('homeLayoutV2');
        if (savedData && savedData.aboutPage) {
          setAboutData({ ...DEFAULT_ABOUT, ...savedData.aboutPage });
        }
      } catch (e) {
        // Fallback to localStorage
        try {
          const localData = localStorage.getItem('homeLayoutV2');
          if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.aboutPage) {
              setAboutData({ ...DEFAULT_ABOUT, ...parsed.aboutPage });
            }
          }
        } catch (parseErr) {}
      }
    };
    loadAboutData();
  }, []);

  const handleUpdate = (field, value) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };

  const handleParagraphUpdate = (index, value) => {
    setAboutData(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.map((p, i) => i === index ? value : p)
    }));
  };

  const handleAddParagraph = () => {
    setAboutData(prev => ({
      ...prev,
      paragraphs: [...prev.paragraphs, "Thêm nội dung mới tại đây..."]
    }));
  };

  const handleRemoveParagraph = (index) => {
    if (aboutData.paragraphs.length > 1) {
      setAboutData(prev => ({
        ...prev,
        paragraphs: prev.paragraphs.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Load existing data first
      let existingData = await api.getSetting('homeLayoutV2') || {};
      
      // Merge with about page data
      const dataToSave = {
        ...existingData,
        aboutPage: aboutData
      };
      
      localStorage.setItem('homeLayoutV2', JSON.stringify(dataToSave));
      await api.saveSetting('homeLayoutV2', dataToSave);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      alert('✅ Đã lưu nội dung trang Về Chúng Tôi!');
    } catch (e) {
      console.error("Save failed", e);
      alert('⚠️ Lỗi khi lưu, đã lưu tạm vào máy.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  // Replace {shopName} placeholder
  const formatText = (text) => text.replace(/{shopName}/g, settings.title);

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', position: 'relative' }}>
         <h2 className="section-title">
           {isEditing ? (
             <input 
               className="editable-input section-title-input"
               value={aboutData.title}
               onChange={e => handleUpdate('title', e.target.value)}
               style={{ width: '100%', textAlign: 'center' }}
             />
           ) : (
             formatText(aboutData.title)
           )}
         </h2>
         
         <div className="glass-card">
            {aboutData.paragraphs.map((paragraph, index) => (
              <div key={index} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <textarea
                      className="editable-input-simple"
                      value={paragraph}
                      onChange={e => handleParagraphUpdate(index, e.target.value)}
                      rows={4}
                      style={{ flex: 1, lineHeight: '1.8', fontSize: '1rem' }}
                    />
                    {aboutData.paragraphs.length > 1 && (
                      <button 
                        onClick={() => handleRemoveParagraph(index)}
                        style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                    {formatText(paragraph)}
                  </p>
                )}
              </div>
            ))}
            
            {isEditing && (
              <button 
                onClick={handleAddParagraph}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px dashed #ddd', 
                  background: 'transparent', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  color: '#888',
                  marginBottom: '1.5rem'
                }}
              >
                + Thêm đoạn văn
              </button>
            )}
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '2rem', position: 'relative' }}>
               {isEditing && (
                 <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                   <label style={{ 
                     background: 'white', 
                     padding: '8px 12px', 
                     borderRadius: '20px', 
                     cursor: 'pointer',
                     boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '5px',
                     fontSize: '0.8rem'
                   }}>
                     <Upload size={14} /> Đổi ảnh
                     <input 
                       type="text"
                       placeholder="Nhập URL ảnh..."
                       value={aboutData.image}
                       onChange={e => handleUpdate('image', e.target.value)}
                       style={{ display: 'none' }}
                     />
                   </label>
                   <input 
                     type="text"
                     placeholder="URL ảnh mới..."
                     value={aboutData.image}
                     onChange={e => handleUpdate('image', e.target.value)}
                     style={{ 
                       marginTop: '10px', 
                       padding: '8px', 
                       border: '1px solid #ddd', 
                       borderRadius: '8px',
                       width: '200px',
                       fontSize: '0.8rem'
                     }}
                   />
                 </div>
               )}
               <img 
                 src={aboutData.image} 
                 style={{ width: '100%', borderRadius: '15px' }} 
                 alt="Flower Shop" 
               />
            </div>
         </div>
      </div>

      {/* Admin Edit Button */}
      {isAdmin && (
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: isSaving ? '#6c757d' : (isEditing ? '#28a745' : settings.primaryColor),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '50px',
            cursor: isSaving ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            zIndex: 1000
          }}
        >
          {isSaving ? (
            <>
              <span style={{ 
                display: 'inline-block', 
                width: '16px', 
                height: '16px', 
                border: '2px solid white', 
                borderTopColor: 'transparent', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              Đang lưu...
            </>
          ) : isEditing ? (
            <><Save size={18} /> Lưu Thay Đổi</>
          ) : (
            <><PenTool size={18} /> Sửa Nội Dung</>
          )}
        </button>
      )}

      <SharedFooter settings={settings} />
    </>
  );
};

export default About;
