import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const ReviewCard = ({ review, settings, isAdmin, onDelete }) => {
  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        fill={index < review.rating ? settings.primaryColor : 'none'}
        color={index < review.rating ? settings.primaryColor : '#ddd'}
      />
    ));
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'relative'
    }}>
      {isAdmin && (
        <button
          onClick={() => onDelete(review.id)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.85rem'
          }}
        >
          <Trash2 size={14} /> Xóa
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          {review.customerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{review.customerName}</h4>
          <div style={{ display: 'flex', gap: '3px', marginTop: '5px' }}>
            {renderStars()}
          </div>
        </div>
      </div>

      <p style={{ lineHeight: '1.6', color: '#555', margin: '15px 0' }}>
        {review.comment}
      </p>

      {review.images && review.images.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
          {review.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Review ${index}`}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => window.open(img, '_blank')}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#999', textAlign: 'right' }}>
        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
      </div>
    </div>
  );
};

export default ReviewCard;
