import React, { useState, useEffect } from 'react';
import { HelpCircle, PenTool, Save, Plus, Trash2 } from 'lucide-react';
import FAQItem from '../components/FAQItem';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

const DEFAULT_FAQS = [
  {
    category: "Đặt Hàng",
    items: [
      {
        question: "Làm thế nào để đặt hoa?",
        answer: "Bạn có thể đặt hoa qua 3 cách: (1) Thêm sản phẩm vào giỏ hàng và thanh toán online, (2) Gọi điện trực tiếp đến hotline, hoặc (3) Nhắn tin qua chat widget góc phải màn hình. Chúng tôi sẽ xác nhận đơn hàng trong vòng 30 phút."
      },
      {
        question: "Tôi có thể đặt hoa trước bao lâu?",
        answer: "Bạn có thể đặt hoa trước từ 1-30 ngày. Đối với các sự kiện lớn như đám cưới, sinh nhật, chúng tôi khuyến khích đặt trước ít nhất 3-5 ngày để có thể chuẩn bị kỹ càng nhất."
      },
      {
        question: "Có thể thay đổi hoặc hủy đơn hàng không?",
        answer: "Bạn có thể thay đổi hoặc hủy đơn hàng miễn phí trước 24 giờ so với thời gian giao hàng. Sau thời gian này, phí hủy sẽ là 20% giá trị đơn hàng vì chúng tôi đã chuẩn bị hoa tươi."
      }
    ]
  },
  {
    category: "Thanh Toán",
    items: [
      {
        question: "Các hình thức thanh toán nào được chấp nhận?",
        answer: "Chúng tôi chấp nhận: (1) Chuyển khoản ngân hàng, (2) Ví điện tử (MoMo, ZaloPay), (3) Thẻ tín dụng/ghi nợ, và (4) Tiền mặt khi nhận hàng (COD)."
      },
      {
        question: "Tôi có được hóa đơn VAT không?",
        answer: "Có, chúng tôi xuất hóa đơn VAT cho tất cả các đơn hàng. Vui lòng cung cấp thông tin công ty (tên, mã số thuế, địa chỉ) khi đặt hàng."
      }
    ]
  },
  {
    category: "Giao Hàng",
    items: [
      {
        question: "Khu vực nào được giao hàng miễn phí?",
        answer: "Miễn phí giao hàng trong bán kính 5km từ cửa hàng. Các khu vực xa hơn sẽ có phí ship từ 15,000đ - 50,000đ tùy khoảng cách."
      },
      {
        question: "Hoa được giao trong bao lâu?",
        answer: "Đơn hàng trong ngày sẽ được giao trong vòng 2-4 giờ. Đơn đặt trước sẽ được giao đúng khung giờ bạn yêu cầu với độ chính xác ±30 phút."
      },
      {
        question: "Nếu người nhận không có nhà thì sao?",
        answer: "Shipper sẽ gọi điện xác nhận trước khi giao. Nếu không liên lạc được, chúng tôi sẽ gọi cho người đặt hàng để sắp xếp lại thời gian giao hoặc gửi người thân."
      }
    ]
  },
  {
    category: "Chăm Sóc Hoa",
    items: [
      {
        question: "Làm thế nào để hoa tươi lâu hơn?",
        answer: "Mẹo giữ hoa tươi: (1) Cắt chéo cuống hoa 2-3cm mỗi 2 ngày, (2) Thay nước sạch hàng ngày, (3) Tránh ánh nắng trực tiếp và gió mạnh, (4) Bỏ lá úa, cánh héo kịp thời, (5) Thêm 1 muỗng đường + 2 giọt thuốc tẩy vào nước."
      },
      {
        question: "Hoa có cam kết tươi trong bao lâu?",
        answer: "Chúng tôi cam kết hoa tươi ít nhất 3 ngày kể từ ngày giao. Nếu hoa héo trước thời gian này (do lỗi chất lượng, không do chăm sóc sai cách), chúng tôi sẽ đổi mới hoàn toàn miễn phí."
      }
    ]
  },
  {
    category: "Chính Sách Đổi Trả",
    items: [
      {
        question: "Tôi có thể đổi trả hoa không?",
        answer: "Bạn có thể đổi/trả trong các trường hợp: (1) Hoa không đúng mẫu, (2) Hoa héo/hư khi nhận, (3) Giao sai địa chỉ/thời gian do lỗi của shop. Vui lòng chụp ảnh và liên hệ trong vòng 2 giờ kể từ khi nhận hàng."
      },
      {
        question: "Hoàn tiền mất bao lâu?",
        answer: "Sau khi xác nhận đổi trả hợp lệ, tiền sẽ được hoàn lại trong 1-3 ngày làm việc (chuyển khoản) hoặc ngay lập tức (ví điện tử)."
      }
    ]
  }
];

const FAQ = ({ settings, isAdmin }) => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openItems, setOpenItems] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load FAQ data
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const savedData = await api.getSetting('faqData');
        if (savedData && savedData.length > 0) {
          setFaqs(savedData);
        }
      } catch (e) {
        console.log("Using default FAQs");
      }
    };
    loadFAQs();
  }, []);

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQuestionChange = (catIndex, itemIndex, value) => {
    setFaqs(prev => prev.map((cat, ci) => 
      ci === catIndex 
        ? { ...cat, items: cat.items.map((item, ii) => 
            ii === itemIndex ? { ...item, question: value } : item
          )}
        : cat
    ));
  };

  const handleAnswerChange = (catIndex, itemIndex, value) => {
    setFaqs(prev => prev.map((cat, ci) => 
      ci === catIndex 
        ? { ...cat, items: cat.items.map((item, ii) => 
            ii === itemIndex ? { ...item, answer: value } : item
          )}
        : cat
    ));
  };

  const handleCategoryChange = (catIndex, value) => {
    setFaqs(prev => prev.map((cat, ci) => 
      ci === catIndex ? { ...cat, category: value } : cat
    ));
  };

  const addQuestion = (catIndex) => {
    setFaqs(prev => prev.map((cat, ci) => 
      ci === catIndex 
        ? { ...cat, items: [...cat.items, { question: "Câu hỏi mới?", answer: "Trả lời..." }] }
        : cat
    ));
  };

  const deleteQuestion = (catIndex, itemIndex) => {
    if (window.confirm("Xóa câu hỏi này?")) {
      setFaqs(prev => prev.map((cat, ci) => 
        ci === catIndex 
          ? { ...cat, items: cat.items.filter((_, ii) => ii !== itemIndex) }
          : cat
      ));
    }
  };

  const addCategory = () => {
    setFaqs(prev => [...prev, { 
      category: "Danh mục mới", 
      items: [{ question: "Câu hỏi mẫu?", answer: "Trả lời mẫu..." }] 
    }]);
  };

  const deleteCategory = (catIndex) => {
    if (window.confirm("Xóa toàn bộ danh mục này?")) {
      setFaqs(prev => prev.filter((_, ci) => ci !== catIndex));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.saveSetting('faqData', faqs);
      await new Promise(resolve => setTimeout(resolve, 300));
      alert('✅ Đã lưu FAQ thành công!');
    } catch (e) {
      console.error("Save failed", e);
      alert('⚠️ Lỗi khi lưu FAQ');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="faq-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem', minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <HelpCircle size={60} style={{ color: settings.primaryColor, marginBottom: '1rem' }} />
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            Câu Hỏi Thường Gặp
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Tìm câu trả lời nhanh chóng cho những thắc mắc của bạn
          </p>
        </div>

        {faqs.map((category, catIndex) => (
          <div key={catIndex} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              {isEditing ? (
                <input
                  className="editable-input-simple"
                  value={category.category}
                  onChange={e => handleCategoryChange(catIndex, e.target.value)}
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', flex: 1 }}
                />
              ) : (
                <h2 style={{ fontSize: '1.5rem', color: settings.primaryColor }}>
                  {category.category}
                </h2>
              )}
              {isEditing && (
                <button
                  onClick={() => deleteCategory(catIndex)}
                  style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px' }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} style={{ position: 'relative' }}>
                {isEditing ? (
                  <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        className="editable-input-simple"
                        value={item.question}
                        onChange={e => handleQuestionChange(catIndex, itemIndex, e.target.value)}
                        style={{ flex: 1, fontWeight: 'bold' }}
                        placeholder="Câu hỏi..."
                      />
                      <button
                        onClick={() => deleteQuestion(catIndex, itemIndex)}
                        style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <textarea
                      className="editable-input-simple"
                      value={item.answer}
                      onChange={e => handleAnswerChange(catIndex, itemIndex, e.target.value)}
                      rows={4}
                      style={{ width: '100%' }}
                      placeholder="Câu trả lời..."
                    />
                  </div>
                ) : (
                  <FAQItem
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItems[`${catIndex}-${itemIndex}`]}
                    onToggle={() => toggleItem(catIndex, itemIndex)}
                    settings={settings}
                  />
                )}
              </div>
            ))}

            {isEditing && (
              <button
                onClick={() => addQuestion(catIndex)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px dashed #ddd', 
                  background: 'white', 
                  borderRadius: '15px', 
                  cursor: 'pointer',
                  color: '#888',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '15px'
                }}
              >
                <Plus size={18} /> Thêm câu hỏi
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={addCategory}
            style={{ 
              width: '100%', 
              padding: '15px', 
              border: '3px dashed #667eea', 
              background: 'transparent', 
              borderRadius: '15px', 
              cursor: 'pointer',
              color: '#667eea',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} /> Thêm danh mục mới
          </button>
        )}
      </div>

      {/* Admin Controls */}
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
            'Đang lưu...'
          ) : isEditing ? (
            <><Save size={18} /> Lưu FAQ</>
          ) : (
            <><PenTool size={18} /> Sửa FAQ</>
          )}
        </button>
      )}

      <SharedFooter settings={settings} />
    </>
  );
};

export default FAQ;
