import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const AdminChatManagement = ({ settings }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    loadChatSessions();

    // Initialize socket
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('✅ Admin socket connected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession);
    }
  }, [selectedSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = async () => {
    setLoading(true);
    try {
      // Get all chat sessions from localStorage pattern
      const allSettings = await api.getAllSettings();
      const chatSessions = Object.keys(allSettings || {})
        .filter(key => key.startsWith('chat-'))
        .map(key => ({
          sessionId: key.replace('chat-', ''),
          lastMessage: allSettings[key][allSettings[key].length - 1]?.message || '',
          timestamp: allSettings[key][allSettings[key].length - 1]?.timestamp || '',
          unreadCount: allSettings[key].filter(m => m.sender === 'customer' && !m.isRead).length
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setChatSessions(chatSessions);
    } catch (e) {
      console.error("Failed to load chat sessions", e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId) => {
    try {
      const msgs = await api.getSetting(`chat-${sessionId}`);
      setMessages(msgs || []);
      
      // Mark all as read
      const updatedMessages = (msgs || []).map(m => ({ ...m, isRead: true }));
      await api.saveSetting(`chat-${sessionId}`, updatedMessages);
      
      // Update session list
      setChatSessions(prev => 
        prev.map(s => s.sessionId === sessionId ? { ...s, unreadCount: 0 } : s)
      );

      // Join this session's socket room
      if (socketRef.current) {
        socketRef.current.emit('join-session', sessionId);
        
        // Listen for new messages in this session
        socketRef.current.on('new-message', (message) => {
          setMessages(prev => {
            if (prev.find(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
        });
      }
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedSession) return;

    const newMessage = {
      id: Date.now(),
      sender: 'admin',
      message: replyMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setReplyMessage('');

    try {
      await api.saveSetting(`chat-${selectedSession}`, updatedMessages);
      
      // Update last message in session list
      setChatSessions(prev =>
        prev.map(s => s.sessionId === selectedSession 
          ? { ...s, lastMessage: replyMessage, timestamp: new Date().toISOString() }
          : s
        )
      );

      // Emit via socket
      if (socketRef.current) {
        socketRef.current.emit('send-message', {
          sessionId: selectedSession,
          message: newMessage
        });
      }
    } catch (e) {
      console.error("Failed to send reply", e);
      alert('Gửi tin nhắn thất bại!');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Xóa cuộc trò chuyện này?')) return;

    try {
      await api.deleteSetting(`chat-${sessionId}`);
      setChatSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      if (selectedSession === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }
    } catch (e) {
      console.error("Failed to delete session", e);
      alert('Xóa thất bại!');
    }
  };

  return (
    <div className="admin-chat-container" style={{ display: 'flex', height: '70vh', gap: '20px' }}>
      {/* Sessions List */}
      <div className="admin-chat-sessions" style={{ 
        width: '350px', 
        background: 'white', 
        borderRadius: '15px', 
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageCircle size={24} style={{ color: settings.primaryColor }} />
            Tin Nhắn
          </h3>
          <button
            onClick={loadChatSessions}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={18} style={{ color: settings.primaryColor }} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Đang tải...</div>
        ) : chatSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Chưa có tin nhắn nào
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatSessions.map(session => (
              <div
                key={session.sessionId}
                onClick={() => setSelectedSession(session.sessionId)}
                style={{
                  padding: '15px',
                  background: selectedSession === session.sessionId ? `${settings.primaryColor}15` : 'white',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  border: `2px solid ${selectedSession === session.sessionId ? settings.primaryColor : '#eee'}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ fontSize: '0.9rem' }}>ID: {session.sessionId.slice(-8)}</strong>
                  {session.unreadCount > 0 && (
                    <span style={{
                      background: '#ff4d4f',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {session.unreadCount}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.lastMessage}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                  {new Date(session.timestamp).toLocaleString('vi-VN')}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.sessionId);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="admin-chat-window" style={{ 
        flex: 1, 
        background: 'white', 
        borderRadius: '15px', 
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {selectedSession ? (
          <>
            <div style={{ 
              borderBottom: '2px solid #eee', 
              paddingBottom: '15px', 
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>Session: {selectedSession.slice(-12)}</h3>
              <span style={{ color: '#999', fontSize: '0.9rem' }}>{messages.length} tin nhắn</span>
            </div>

            {/* Messages */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '10px',
              background: '#f9f9f9',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    background: msg.sender === 'admin' ? settings.primaryColor : 'white',
                    color: msg.sender === 'admin' ? 'white' : '#333',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '5px' }}>
                      {msg.sender === 'admin' ? '👨‍💼 Admin' : '👤 Khách hàng'}
                    </div>
                    {msg.message}
                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '5px', textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder="Nhập tin nhắn trả lời..."
                style={{
                  flex: 1,
                  padding: '12px 15px',
                  border: '2px solid #eee',
                  borderRadius: '25px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                onClick={handleSendReply}
                style={{
                  background: settings.primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#999',
            fontSize: '1.1rem'
          }}>
            ← Chọn một cuộc trò chuyện để xem
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatManagement;
