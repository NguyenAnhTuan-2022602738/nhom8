import React, { useState } from 'react';
import SharedFooter from '../components/SharedFooter';

const Contact = ({ settings }) => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
         <h2 className="section-title">Liên Hệ Với Chúng Tôi</h2>
         <div className="glass-card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem' }}>💐</div>
                <h3>Cảm ơn bạn đã nhắn tin!</h3>
                <p>Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input required placeholder="Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required placeholder="email@example.com" />
                </div>
                <div className="form-group">
                  <label>Lời Nhắn</label>
                  <textarea rows="5" required placeholder="Bạn cần tư vấn loại hoa nào?" />
                </div>
                <button className="btn-primary" style={{ width: '100%', background: `linear-gradient(45deg, #ff9a9e 0%, ${settings.primaryColor} 100%)` }}>
                  Gửi Tin Nhắn
                </button>
              </form>
            )}
         </div>
      </div>
      <SharedFooter settings={settings} />
    </>
  );
};

export default Contact;
