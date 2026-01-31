import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onToggle, settings }) => {
  return (
    <div 
      style={{ 
        background: 'white',
        borderRadius: '15px',
        marginBottom: '15px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px 25px',
          background: isOpen ? `linear-gradient(135deg, ${settings.primaryColor} 0%, #764ba2 100%)` : 'white',
          color: isOpen ? 'white' : '#333',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: '600',
          textAlign: 'left',
          transition: 'all 0.3s ease'
        }}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      <div
        style={{
          maxHeight: isOpen ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease'
        }}
      >
        <div style={{ padding: '20px 25px', lineHeight: '1.8', color: '#555' }}>
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
