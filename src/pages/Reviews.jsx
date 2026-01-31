import React, { useState, useEffect } from 'react';
import { MessageCircle, Star, Filter } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    customerName: "Nguyễn Thị Lan",
    rating: 5,
    comment: "Hoa rất tươi và đẹp! Đóng gói cẩn thận, giao hàng nhanh chóng. Người nhận rất hài lòng. Sẽ tiếp tục ủng hộ shop!",
    images: ["https://images.unsplash.com/photo-1563241527-302ae5518b53?w=200"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    customerName: "Trần Văn Minh",
    rating: 5,
    comment: "Đặt hoa sinh nhật cho vợ, shop tư vấn rất nhiệt tình. Bó hoa đẹp hơn cả mong đợi. Vợ mình rất thích!",
    images: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    customerName: "Lê Thị Hương",
    rating: 4,
    comment: "Hoa đẹp, giá hợp lý. Chỉ có điều giao hơi trễ 15 phút so với hẹn. Nhưng nhìn chung vẫn hài lòng.",
    images: ["https://images.unsplash.com/photo-1520763185298-1b434c919102?w=200", "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const Reviews = ({ settings, isAdmin }) => {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [filterRating, setFilterRating] = useState(0); // 0 = all

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const savedData = await api.getSetting('reviewsData');
        if (savedData && savedData.length > 0) {
          setReviews(savedData);
        }
      } catch (e) {
        console.log("Using default reviews");
      }
    };
    loadReviews();
  }, []);

  const handleSubmitReview = async (formData) => {
    const newReview = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    try {
      await api.saveSetting('reviewsData', updatedReviews);
      alert('✅ Cảm ơn bạn đã đánh giá!');
    } catch (e) {
      console.error("Save failed", e);
      alert('⚠️ Lỗi khi lưu đánh giá');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      const updatedReviews = reviews.filter(r => r.id !== id);
      setReviews(updatedReviews);
      
      try {
        await api.saveSetting('reviewsData', updatedReviews);
        alert('✅ Đã xóa đánh giá!');
      } catch (e) {
        console.error("Delete failed", e);
        alert('⚠️ Lỗi khi xóa');
      }
    }
  };

  const filteredReviews = filterRating === 0 
    ? reviews 
    : reviews.filter(r => r.rating === filterRating);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', minHeight: '70vh' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <MessageCircle size={60} style={{ color: settings.primaryColor, marginBottom: '1rem' }} />
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            💬 Đánh Giá Khách Hàng
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Chia sẻ trải nghiệm của bạn với chúng tôi
          </p>
        </div>

        {/* Statistics */}
        <div className="glass-card review-stats" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: settings.primaryColor }}>
              {averageRating}
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={i < Math.round(averageRating) ? settings.primaryColor : 'none'}
                  color={i < Math.round(averageRating) ? settings.primaryColor : '#ddd'}
                />
              ))}
            </div>
          </div>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Dựa trên {reviews.length} đánh giá
          </p>

          {/* Rating breakdown */}
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {ratingCounts.map(({ star, count }) => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ minWidth: '50px', textAlign: 'right' }}>{star} sao</span>
                <div style={{ flex: 1, height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                    height: '100%',
                    background: settings.primaryColor,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{ minWidth: '40px', color: '#999', fontSize: '0.9rem' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form */}
        <ReviewForm onSubmit={handleSubmitReview} settings={settings} />

        {/* Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Filter size={18} color="#666" />
          <span style={{ color: '#666' }}>Lọc theo:</span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterRating(0)}
              style={{
                padding: '8px 15px',
                border: `2px solid ${filterRating === 0 ? settings.primaryColor : '#ddd'}`,
                background: filterRating === 0 ? settings.primaryColor : 'white',
                color: filterRating === 0 ? 'white' : '#666',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: filterRating === 0 ? 'bold' : 'normal'
              }}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                style={{
                  padding: '8px 15px',
                  border: `2px solid ${filterRating === star ? settings.primaryColor : '#ddd'}`,
                  background: filterRating === star ? settings.primaryColor : 'white',
                  color: filterRating === star ? 'white' : '#666',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {star} <Star size={14} fill={filterRating === star ? 'white' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                settings={settings}
                isAdmin={isAdmin}
                onDelete={handleDeleteReview}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
              <p style={{ fontSize: '1.2rem' }}>Chưa có đánh giá {filterRating > 0 ? `${filterRating} sao` : ''}</p>
            </div>
          )}
        </div>
      </div>

      <SharedFooter settings={settings} />
    </>
  );
};

export default Reviews;
