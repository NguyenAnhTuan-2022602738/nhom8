import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import DraggableSection from '../components/DraggableSection';
import { PenTool, Save, Plus } from 'lucide-react';

const DEFAULT_HERO_DATA = {
  title: "Mùa Yêu Thương",
  subtitle: "Trao gửi yêu thương qua những đóa hoa tươi thắm nhất. Mỗi bông hoa là một lời nói từ trái tim.",
  buttonText: "Mua Ngay",
  bgImage: "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2000&auto=format&fit=crop"
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

const INITIAL_LAYOUT = [
  { id: 'hero-1', type: 'hero', content: DEFAULT_HERO_DATA },
  { id: 'featured-1', type: 'featured', content: { title: "Sản Phẩm Nổi Bật 🌟" } },
  { id: 'features-1', type: 'features', content: DEFAULT_FEATURES_DATA },
  { id: 'testimonials-1', type: 'testimonials', content: DEFAULT_TESTIMONIALS_DATA },
];

const Home = ({ products, setProducts, settings, onOpenModal, onAddToCart }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('homeLayoutV2');
    return saved ? JSON.parse(saved) : INITIAL_LAYOUT;
  });

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
        const clonedContent = JSON.parse(JSON.stringify(sectionToClone.content));
        newLayout.splice(index + 1, 0, { ...sectionToClone, id: newId, content: clonedContent });
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

  const handleUpdateContent = (id, newContent) => {
    setLayout(prev => prev.map(item => item.id === id ? { ...item, content: newContent } : item));
  };

  const handleSave = () => {
    localStorage.setItem('homeLayoutV2', JSON.stringify(layout));
    setIsEditing(false);
    alert("Đã lưu mọi thay đổi thành công!");
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
        // Pass global products and setProducts to ensure synchronization with Shop page
        return <FeaturedProducts products={products} setProducts={setProducts} settings={settings} onOpenModal={onOpenModal} onAddToCart={onAddToCart} {...commonProps} />;
      case 'features':
        return <Features {...commonProps} />;
      case 'testimonials':
        return <Testimonials {...commonProps} />;
      default:
        return null;
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
            {layout.map((item) => (
              <DraggableSection 
                key={item.id} 
                id={item.id} 
                isEditing={isEditing}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              >
                {renderSection(item)}
              </DraggableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <button 
        className={`edit-mode-toggle ${isEditing ? 'active' : ''}`} 
        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
      >
        {isEditing ? <><Save size={20} /> Lưu Kết Quả</> : <><PenTool size={20} /> Sửa Chi Tiết</>}
      </button>
    </>
  );
};

export default Home;
