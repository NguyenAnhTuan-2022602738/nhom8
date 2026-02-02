import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const SUGGESTED_QUESTIONS = [
  "Sản phẩm còn hàng không?",
  "Tư vấn size cho mình với",
  "Phí ship như thế nào?",
  "Chính sách đổi trả ra sao?",
  "Shop có cửa hàng trực tiếp không?"
];

const AUTO_REPLIES = [
  "Cảm ơn bạn đã nhắn tin! Admin sẽ phản hồi bạn sớm nhất có thể ạ ❤️",
  "Hiện tại shop đang quá tải tin nhắn, bạn đợi chút xíu nhé ☕",
  "Chào bạn, shop đã nhận được tin nhắn. Admin sẽ check ngay đây ạ! 🏃‍♂️",
  "Nếu cần gấp, bạn hãy để lại số điện thoại để shop gọi lại tư vấn nhé! 📞"
];

const ChatWidget = ({ settings, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const autoReplyTimeoutRef = useRef(null);

  // Initialize session
  useEffect(() => {
    const userIdentifier = user?.email || user?.id || 'guest';
    const storageKey = `chatSessionId-${userIdentifier}`;
    
    let sid = localStorage.getItem(storageKey);
    if (!sid) {
      sid = `session-${userIdentifier}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(storageKey, sid);
    }
    setSessionId(sid);
    loadMessages(sid);

    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      socketRef.current.emit('join-session', sid);
    });

    socketRef.current.on('new-message', (message) => {
      setMessages(prev => {
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      if (!isOpen && message.sender === 'admin') {
        setUnreadCount(prev => prev + 1);
      }
      
      // Clear auto-reply timeout if admin replies
      if (message.sender === 'admin') {
        if (autoReplyTimeoutRef.current) {
          clearTimeout(autoReplyTimeoutRef.current);
          autoReplyTimeoutRef.current = null;
        }
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);
    };
  }, [user]);

  // Auto-reply logic
  useEffect(() => {
    if (!isOpen || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // If last message is from customer, start countdown for auto-reply
    if (lastMessage.sender === 'customer') {
      if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);

      autoReplyTimeoutRef.current = setTimeout(async () => {
        // Double check if last message is still from customer (in case of race condition)
        setMessages(currentMessages => {
            const currentLast = currentMessages[currentMessages.length - 1];
            if (currentLast && currentLast.sender === 'customer') {
                const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
                const autoMsg = {
                    id: Date.now(),
                    sender: 'admin',
                    message: randomReply,
                    timestamp: new Date().toISOString(),
                    isRead: false,
                    isAutoReply: true
                };
                
                // Save and emit like a real message so it persists
                api.saveSetting(`chat-${sessionId}`, [...currentMessages, autoMsg]);
                // We don't necessarily need to emit socket if it's "local" auto-response, 
                // but emitting lets admin see it too (optional). Let's keep it local+save for now to avoid complexity.
                
                return [...currentMessages, autoMsg];
            }
            return currentMessages;
        });
      }, 10000); // 10 seconds delay
    } else {
        // If last message is admin, clear timeout
        if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);
    }

    return () => {
      if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);
    };
  }, [messages, isOpen, sessionId]);

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
        const unread = savedMessages.filter(m => m.sender === 'admin' && !m.isRead).length;
        setUnreadCount(unread);
      } else {
        const welcomeMsg = {
          id: Date.now(),
          sender: 'admin',
          message: `Xin chào ${user?.name || 'bạn'}! 👋 Chúng tôi có thể giúp gì cho bạn hôm nay?`,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        setMessages([welcomeMsg]);
      }
    } catch (e) {
      console.log("No previous chat found");
    }
  };

const QA_MAP = {
  "Sản phẩm còn hàng không?": "Dạ đa số sản phẩm trên web đều còn hàng ạ. Bạn gửi ảnh mẫu cụ thể để mình check chính xác nhé! 🥰",
  "Tư vấn size cho mình với": "Shop có đủ size S, M, L ạ. Bạn cho mình xin chiều cao cân nặng để shop tư vấn chuẩn nhất nha!",
  "Phí ship như thế nào?": "Phí ship nội thành là 20k, ngoại thành 30k. Freeship cho đơn từ 500k bạn nhé! 🛵",
  "Chính sách đổi trả ra sao?": "Shop hỗ trợ đổi size/mẫu trong vòng 3 ngày nếu còn nguyên tem mác ạ. Lỗi do shop đổi trả miễn phí luôn nhé! ✨",
  "Shop có cửa hàng trực tiếp không?": "Dạ hiện shop bán online là chính để có giá tốt nhất ạ. Kho giao hàng tại Hoàn Kiếm, Hà Nội bạn nhé!"
};

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'customer',
      message: text,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setInputMessage('');

    try {
      // 1. Save user message first
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages); // Optimistic update
      api.saveSetting(`chat-${sessionId}`, updatedMessages).catch(e => console.error(e));
      
      if (socketRef.current) {
        socketRef.current.emit('send-message', {
          sessionId,
          message: newMessage
        });
      }

      // 2. Check for instant auto-reply (QA Match)
      if (QA_MAP[text]) {
        setIsTyping(true); // Simulate typing
        setTimeout(() => {
          const replyMsg = {
            id: Date.now() + 1,
            sender: 'admin',
            message: QA_MAP[text],
            timestamp: new Date().toISOString(),
            isRead: false,
            isAutoReply: true
          };
          
          setMessages(prev => {
            const newMsgs = [...prev, replyMsg];
            api.saveSetting(`chat-${sessionId}`, newMsgs).catch(e => console.error(e));
            return newMsgs;
          });
          setIsTyping(false);
          
          // Clear general auto-reply timeout if instant reply sent
          if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);
        }, 1500); // 1.5s delay for realistic feel
      }

    } catch (e) {
      console.error("Failed to save message", e);
    }
  };

  const handleSendMessage = () => sendMessage(inputMessage);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    const readMessages = messages.map(m => ({ ...m, isRead: true }));
    setMessages(readMessages);
    api.saveSetting(`chat-${sessionId}`, readMessages).catch(e => console.error(e));
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #764ba2 100%)`, color: 'white',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={28} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4f', color: 'white',
            borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold'
          }}>{unreadCount}</div>
        )}
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: window.innerWidth <= 768 ? 'calc(100vw - 40px)' : '350px', maxWidth: '350px',
      height: isMinimized ? '60px' : (window.innerWidth <= 768 ? 'calc(100vh - 100px)' : '550px'),
      background: 'white', borderRadius: '15px', boxShadow: '0 5px 40px rgba(0,0,0,0.2)',
      display: 'flex', flexDirection: 'column', zIndex: 9999, transition: 'height 0.3s ease', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #764ba2 100%)`, color: 'white', padding: '15px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '15px', borderTopRightRadius: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageCircle size={20} />
          <div>
            <span style={{ fontWeight: 'bold', display: 'block' }}>Chat Hỗ Trợ</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', background: '#4cd964', borderRadius: '50%' }}></span>
              Thường trả lời ngay
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
            <Minimize2 size={18} />
          </button>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'customer' ? 'flex-end' : 'flex-start' }}>
                {msg.sender === 'admin' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', marginTop: 'auto' }}>
                    <MessageCircle size={16} color="#666" />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: '15px',
                  background: msg.sender === 'customer' ? settings.primaryColor : 'white',
                  color: msg.sender === 'customer' ? 'white' : '#333',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '0.9rem', lineHeight: '1.4',
                  borderBottomRightRadius: msg.sender === 'customer' ? '4px' : '15px',
                  borderBottomLeftRadius: msg.sender === 'customer' ? '15px' : '4px'
                }}>
                  {msg.message}
                  <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div style={{ padding: '8px 12px', background: 'white', borderTop: '1px solid #f0f0f0', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', gap: '8px', scrollbarWidth: 'none' }}>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '6px 12px', borderRadius: '15px', border: `1px solid ${settings.primaryColor}40`,
                  background: `${settings.primaryColor}10`, color: settings.primaryColor,
                  fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = `${settings.primaryColor}20`}
                onMouseLeave={e => e.target.style.background = `${settings.primaryColor}10`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 15px 15px', background: 'white', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                style={{
                  width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '20px',
                  outline: 'none', fontSize: '0.9rem', paddingRight: '35px'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={{
                background: inputMessage.trim() ? settings.primaryColor : '#ddd',
                color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputMessage.trim() ? 'pointer' : 'default',
                transition: 'background 0.3s'
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
