import React, { useState, useEffect } from 'react';
import { CheckCircle, ShoppingCart, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
  const Icon = type === 'success' ? CheckCircle : ShoppingCart;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: bgColor,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 9999,
        animation: 'slideInRight 0.3s ease',
        maxWidth: '350px'
      }}
    >
      <Icon size={20} />
      <span style={{ flex: 1, fontSize: '0.95rem' }}>{message}</span>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer',
          padding: '0',
          display: 'flex'
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
