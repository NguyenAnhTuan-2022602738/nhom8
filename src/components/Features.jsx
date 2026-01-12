import React from 'react';

const Features = ({ isEditing, data, onUpdate }) => {
  const currentData = {
    title: data.title || "Tại Sao Chọn Chúng Tôi?",
    items: data.items || [
        { icon: "💐", title: "Hoa Tươi Mỗi Ngày", text: "Nhập mới mỗi sáng sớm, đảm bảo độ tươi từ 3-5 ngày." },
        { icon: "🎨", title: "Thiết Kế Độc Bản", text: "Mỗi bó hoa là một tác phẩm nghệ thuật riêng biệt." },
        { icon: "🚀", title: "Giao Hoa 2H", text: "Giao hàng siêu tốc nội thành trong vòng 2 giờ." }
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

  return (
    <section style={{ background: 'var(--glass-bg)', padding: '3rem 0' }}>
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
                <div key={index} className="feature-item">
                    {isEditing ? (
                        <>
                             <input 
                                className="editable-input-simple icon"
                                value={item.icon}
                                onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                                style={{ fontSize: '3rem', width: '60px', textAlign: 'center', marginBottom: '10px' }}
                             />
                             <input 
                                className="editable-input-simple bold"
                                value={item.title}
                                onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                style={{ display: 'block', width: '100%', textAlign: 'center', marginBottom: '10px' }}
                             />
                             <textarea 
                                className="editable-input-simple"
                                value={item.text}
                                onChange={(e) => handleItemChange(index, 'text', e.target.value)}
                                style={{ width: '100%', textAlign: 'center', height: '60px' }}
                             />
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </>
                    )}
                </div>
            ))}
         </div>
    </section>
  );
};

export default Features;
