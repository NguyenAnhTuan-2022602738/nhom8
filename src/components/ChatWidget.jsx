import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { api } from '../services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ChatWidget = ({ settings, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize session
  useEffect(() => {
    let sid = localStorage.getItem('chatSessionId');
    if (!sid) {
      sid = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', sid);
    }
    setSessionId(sid);
    loadMessages(sid);

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      socketRef.current.emit('join-session', sid);
    });

    // Listen for new messages
    socketRef.current.on('new-message', (message) => {
      setMessages(prev => {
        // Check if message already exists (avoid duplicates)
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      // Show unread badge if chat is closed and message is from admin
      if (!isOpen && message.sender === 'admin') {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (sid) => {
    try {
      const savedMessages = await api.getSetting(`chat-${sid}`);
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
        // Count unread admin messages
        const unread = savedMessages.filter(m => m.sender === 'admin' && !m.isRead).length;
        setUnreadCount(unread);
      } else {
        // Welcome message
        const welcomeMsg = {
          id: Date.now(),
          sender: 'admin',
          message: `Xin chào! 👋 Chúng tôi có thể giúp gì cho bạn?`,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        setMessages([welcomeMsg]);
      }
    } catch (e) {
      console.log("No previous chat found");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'customer',
      message: inputMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setInputMessage('');

    // Save to backend
    try {
      const updatedMessages = [...messages, newMessage];
      await api.saveSetting(`chat-${sessionId}`, updatedMessages);
    } catch (e) {
      console.error("Failed to save message", e);
    }

    // Emit message via socket
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        sessionId,
        message: newMessage
      });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    // Mark all messages as read
    const readMessages = messages.map(m => ({ ...m, isRead: true }));
    setMessages(readMessages);
    api.saveSetting(`chat-${sessionId}`, readMessages).catch(e => console.error(e));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #764ba2 100%)`,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={28} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ff4d4f',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: window.innerWidth <= 768 ? 'calc(100vw - 40px)' : '350px',
      maxWidth: '350px',
      height: isMinimized ? '60px' : (window.innerWidth <= 768 ? 'calc(100vh - 100px)' : '500px'),
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      transition: 'height 0.3s ease',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #764ba2 100%)`,
        color: 'white',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageCircle size={20} />
          <span style={{ fontWeight: 'bold' }}>Chat Hỗ Trợ</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleMinimize}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            background: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'customer' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  background: msg.sender === 'customer' 
                    ? settings.primaryColor 
                    : 'white',
                  color: msg.sender === 'customer' ? 'white' : '#333',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {msg.message}
                  <div style={{
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    marginTop: '5px',
                    textAlign: 'right'
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '15px',
            background: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                background: settings.primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
