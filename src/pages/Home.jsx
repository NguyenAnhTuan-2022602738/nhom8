import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import DraggableSection from '../components/DraggableSection';
import Footer from '../components/Footer';
import { PenTool, Save, Plus, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_HERO_DATA = {
  title: "Mùa Yêu Thương",
  subtitle: "Trao gửi yêu thương qua những đóa hoa tươi thắm nhất. Mỗi bông hoa là một lời nói từ trái tim.",
  buttonText: "Mua Ngay",
  bgImage: "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop",
  images: ["https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop"]
};

const DEFAULT_FEATURES_DATA = {
  title: "Tại Sao Chọn Chúng Tôi?",
  items: [
    { icon: "💐", title: "Hoa Tươi Mỗi Ngày", text: "Nhập mới mỗi sáng sớm, đảm bảo độ tươi từ 3-5 ngày." },
    { icon: "🎨", title: "Thiết Kế Độc Bản", text: "Mỗi bó hoa là một tác phẩm nghệ thuật riêng biệt." },
    { icon: "🚀", title: "Giao Hoa 2H", text: "Giao hàng siêu tốc nội thành trong vòng 2 giờ." }
  ]
};

const DEFAULT_TESTIMONIALS_DATA = {
  title: "Khách Hàng Nói Gì? 💬",
  items: [
    { name: "Nguyễn Thùy Linh", quote: "Hoa đẹp xỉu mọi người ơi! Shop gói hàng siêu có tâm.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" },
    { name: "Trần Văn Phúc", quote: "Đặt hoa tặng vợ nhân dịp kỷ niệm, vợ mình thích lắm.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
  ]
};

const DEFAULT_FOOTER_DATA = {
  title: "Tiệm Hoa Của Nắng",
  description: "Nơi tôn vinh vẻ đẹp của thiên nhiên qua từng cánh hoa. Chúng tôi mang đến những đóa hoa tươi thắm nhất, gói ghém trọn vẹn yêu thương.",
  address: "123 Đường Hoa Hồng, TP. Mộng Mơ",
  phone: "0909.123.456",
  email: "hello@tiemhoacuanang.com"
};

const INITIAL_LAYOUT = [
  { id: 'hero-1', type: 'hero', content: DEFAULT_HERO_DATA },
  { id: 'featured-1', type: 'featured', content: { title: "Sản Phẩm Nổi Bật 🌟" } },
  { id: 'features-1', type: 'features', content: DEFAULT_FEATURES_DATA },
  { id: 'testimonials-1', type: 'testimonials', content: DEFAULT_TESTIMONIALS_DATA },
  { id: 'footer-1', type: 'footer', content: DEFAULT_FOOTER_DATA }
];

const RevealWrapper = ({ children, isEditing, index }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const domRef = React.useRef();

  React.useEffect(() => {
    if (isEditing) {
        setIsVisible(true);
        return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const { current } = domRef;
    if (current) observer.observe(current);
    
    return () => {
        if (current) observer.unobserve(current);
    };
  }, [isEditing]);

  return (
    <div
      ref={domRef}
      className={isVisible ? "reveal-on-scroll is-visible" : "reveal-on-scroll"}
      style={{ 
          transitionDelay: isEditing ? '0s' : `${index * 0.1}s`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

const Home = ({ products, setProducts, settings, setSettings, onOpenModal, onAddToCart, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [layout, setLayout] = useState(INITIAL_LAYOUT); // Default first

  const handleUpdateContent = (id, newContent) => {
    setLayout(prev => prev.map(item => item.id === id ? { ...item, content: newContent } : item));
  };

  // Handle global settings change
  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const renderSection = (item) => {
    const commonProps = {
        isEditing,
        data: item.content || {},
        onUpdate: (data) => handleUpdateContent(item.id, data)
    };

    switch (item.type) {
      case 'hero':
        return <Hero settings={settings} {...commonProps} />;
      case 'featured':
        return <FeaturedProducts products={products} setProducts={setProducts} settings={settings} onOpenModal={onOpenModal} onAddToCart={onAddToCart} {...commonProps} />;
      case 'features':
        return <Features {...commonProps} />;
      case 'testimonials':
        return <Testimonials {...commonProps} />;
      case 'footer':
        return <Footer settings={settings} {...commonProps} />;
      default:
        return null;
    }
  };

  // Load Layout from DB - Đã được load từ App.jsx, chỉ cần xử lý sections
  useEffect(() => {
    const fetchLayout = async () => {
        try {
            let savedData = await api.getSetting('homeLayoutV2');
            
            // Fallback to local storage if API returns nothing
            if (!savedData) {
                 const localSaved = localStorage.getItem('homeLayoutV2');
                 if (localSaved) savedData = JSON.parse(localSaved);
            }

            if (savedData) {
                let sections;
                
                // Hỗ trợ cả format cũ (Array) và format mới (Object)
                if (Array.isArray(savedData)) {
                    // Format cũ - chỉ là array sections
                    sections = savedData;
                } else if (savedData.sections && Array.isArray(savedData.sections)) {
                    // Format mới - object với sections và globalSettings
                    sections = savedData.sections;
                }
                
                if (sections) {
                    // Ensure Footer exists (migration for old layouts)
                    const hasFooter = sections.some(item => item.type === 'footer');
                    if (!hasFooter) {
                        sections.push({ id: 'footer-1', type: 'footer', content: DEFAULT_FOOTER_DATA });
                    }
                    setLayout(sections);
                }
            }
        } catch (e) {
            console.error("Failed to load layout from DB", e);
             // Fallback to local storage
             const localSaved = localStorage.getItem('homeLayoutV2');
             if (localSaved) {
                 try {
                     const parsed = JSON.parse(localSaved);
                     const sections = Array.isArray(parsed) ? parsed : (parsed.sections || []);
                     if (sections.length > 0) {
                         if (!sections.some(item => item.type === 'footer')) {
                             sections.push({ id: 'footer-1', type: 'footer', content: DEFAULT_FOOTER_DATA });
                         }
                         setLayout(sections);
                     }
                 } catch (parseErr) {}
             }
        }
    };
    fetchLayout();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDuplicate = (id) => {
    const sectionToClone = layout.find(item => item.id === id);
    if (sectionToClone) {
        const newId = `${sectionToClone.type}-${Date.now()}`;
        const index = layout.findIndex(item => item.id === id);
        const newLayout = [...layout];
        // Deep clone content to avoid reference issues
        const clonedContent = JSON.parse(JSON.stringify(sectionToClone.content || {}));
        const newItem = { ...sectionToClone, id: newId, content: clonedContent };
        
        newLayout.splice(index + 1, 0, newItem);
        setLayout(newLayout);
    }
  };

  const handleDelete = (id) => {
    if (layout.length <= 1) {
        alert("Bạn không thể xóa hết thành phần!");
        return;
    }
    if (window.confirm("Bạn có chắc muốn xóa thành phần này?")) {
        setLayout(layout.filter(item => item.id !== id));
    }
  };

  const handleAddSection = (type) => {
    let content = {};
    if (type === 'hero') content = DEFAULT_HERO_DATA;
    if (type === 'features') content = DEFAULT_FEATURES_DATA;
    if (type === 'testimonials') content = DEFAULT_TESTIMONIALS_DATA;
    if (type === 'featured') content = { title: "Sản phẩm mới 🌟" };
    
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      content: JSON.parse(JSON.stringify(content))
    };
    
    // Insert before footer if possible
    const footerIndex = layout.findIndex(item => item.type === 'footer');
    const newLayout = [...layout];
    if (footerIndex !== -1) {
        newLayout.splice(footerIndex, 0, newSection);
    } else {
        newLayout.push(newSection);
    }
    setLayout(newLayout);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn khôi phục giao diện mặc định? Mọi thay đổi chưa lưu sẽ bị mất.")) {
        // Deep copy INITIAL_LAYOUT to avoid mutation issues
        const defaultLayout = JSON.parse(JSON.stringify(INITIAL_LAYOUT));
        setLayout(defaultLayout);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Tạo object chứa cả layout và globalSettings
    const dataToSave = {
      sections: layout,
      globalSettings: {
        title: settings.title,
        primaryColor: settings.primaryColor,
        showFlowers: settings.showFlowers
      }
    };
    
    // 1. Save to LocalStorage (Backup/Fast)
    localStorage.setItem('homeLayoutV2', JSON.stringify(dataToSave));
    
    // 2. Save to MongoDB - CHỈ 1 API CALL
    try {
        await api.saveSetting('homeLayoutV2', dataToSave);
        // Thêm delay nhỏ để user thấy hiệu ứng
        await new Promise(resolve => setTimeout(resolve, 500));
        alert("✅ Đã lưu tất cả thay đổi thành công!");
    } catch (e) {
         console.error("Save failed", e);
        alert("⚠️ Lỗi khi lưu vào DB, đã lưu tạm vào máy.");
    } finally {
        setIsSaving(false);
        setIsEditing(false);
    }
  };

  const dndOverlay = {
    position: 'relative'
  }

  return (
    <>
      <div style={dndOverlay}>
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
        >
          <SortableContext 
              items={layout.map(item => item.id)}
              strategy={verticalListSortingStrategy}
          >
            {layout.map((item, index) => (
              <DraggableSection 
                key={item.id} 
                id={item.id} 
                isEditing={isEditing}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              >
                <RevealWrapper isEditing={isEditing} index={index}>
                    {renderSection(item)}
                </RevealWrapper>
              </DraggableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {isAdmin && (
          <div className="admin-toolbar" style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              left: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
              zIndex: 1000,
              maxWidth: '95vw'
          }}>
            {isEditing && (
                <>
                  {/* Global Settings Panel */}
                  <div className="settings-panel" style={{ 
                      background: 'white', 
                      padding: '12px', 
                      borderRadius: '15px', 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                      marginBottom: '8px',
                      width: '100%',
                      maxWidth: '320px',
                      maxHeight: '35vh',
                      overflowY: 'auto'
                  }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
                          🎨 Cài Đặt Chung
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <label style={{ fontSize: '0.75rem', minWidth: '70px', color: '#555' }}>Tên Shop:</label>
                              <input 
                                  value={settings.title || ''} 
                                  onChange={e => handleSettingsChange('title', e.target.value)}
                                  style={{ flex: 1, minWidth: '120px', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.8rem' }}
                                  placeholder="Tên cửa hàng..."
                              />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label style={{ fontSize: '0.75rem', minWidth: '70px', color: '#555' }}>Màu:</label>
                              <input 
                                  type="color" 
                                  value={settings.primaryColor || '#c9184a'} 
                                  onChange={e => handleSettingsChange('primaryColor', e.target.value)}
                                  style={{ width: '35px', height: '28px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.7rem', color: '#888' }}>{settings.primaryColor}</span>
                              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontSize: '0.7rem', color: '#555' }}>🌸</span>
                                  <input 
                                      type="checkbox" 
                                      checked={settings.showFlowers || false} 
                                      onChange={e => handleSettingsChange('showFlowers', e.target.checked)}
                                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Add Section Menu */}
                  <div className="add-section-menu" style={{ 
                      background: 'white', 
                      padding: '8px 12px', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '8px',
                      justifyContent: 'center',
                      maxWidth: '320px'
                  }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', width: '100%', textAlign: 'center', marginBottom: '4px' }}>+ Thêm Section</span>
                      <button onClick={() => handleAddSection('hero')} className="btn-add-type">Banner</button>
                      <button onClick={() => handleAddSection('featured')} className="btn-add-type">Sản phẩm</button>
                      <button onClick={() => handleAddSection('features')} className="btn-add-type">Tính năng</button>
                      <button onClick={() => handleAddSection('testimonials')} className="btn-add-type">Đánh giá</button>
                  </div>
                </>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
                {isEditing && (
                    <button 
                        onClick={handleReset}
                        className="btn-secondary"
                        style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                        title="Khôi phục mặc định"
                    >
                        <RotateCcw size={18} /> Khôi phục
                    </button>
                )}
                <button 
                    className={`edit-mode-toggle ${isEditing ? 'active' : ''}`} 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    style={{
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
                        transition: 'all 0.3s ease',
                        opacity: isSaving ? 0.8 : 1
                    }}
                >
                    {isSaving ? (
                        <>
                            <span style={{ 
                                display: 'inline-block', 
                                width: '18px', 
                                height: '18px', 
                                border: '2px solid white', 
                                borderTopColor: 'transparent', 
                                borderRadius: '50%', 
                                animation: 'spin 1s linear infinite' 
                            }} />
                            Đang lưu...
                        </>
                    ) : isEditing ? (
                        <><Save size={20} /> Lưu Thay Đổi</>
                    ) : (
                        <><PenTool size={20} /> Sửa Giao Diện</>
                    )}
                </button>
            </div>
          </div>
      )}
    </>
  );
};

export default Home;
