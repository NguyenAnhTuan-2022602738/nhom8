import React from 'react';

const About = ({ settings }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
       <h2 className="section-title">Về {settings.title}</h2>
       <div className="glass-card">
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Chào mừng bạn đến với <strong>{settings.title}</strong> – nơi những đóa hoa không chỉ là quà tặng, mà là ngôn ngữ của cảm xúc.
          </p>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Chúng tôi bắt đầu hành trình này với niềm đam mê bất tận dành cho vẻ đẹp của thiên nhiên. Mỗi bông hoa tại tiệm đều được tuyển chọn kỹ lưỡng từ những vườn ươm tốt nhất, được chăm sóc và gói ghém bằng tất cả sự trân trọng.
          </p>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Sứ mệnh của chúng tôi là mang lại nụ cười và sự ấm áp cho người nhận. Dù là một lời tỏ tình e ấp, một lời xin lỗi chân thành, hay chỉ đơn giản là niềm vui tự thưởng cho bản thân, chúng tôi luôn có loài hoa phù hợp dành cho bạn.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '2rem' }}>
             <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop" style={{ width: '100%', borderRadius: '15px' }} alt="Flower Shop" />
          </div>
       </div>
    </div>
  );
};

export default About;
