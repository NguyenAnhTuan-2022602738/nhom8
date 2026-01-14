import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw, Search, ChevronDown, ChevronUp, LogIn } from 'lucide-react';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: '#17a2b8', icon: CheckCircle },
  shipping: { label: 'Đang giao', color: '#007bff', icon: Truck },
  delivered: { label: 'Đã giao', color: '#28a745', icon: Package },
  cancelled: { label: 'Đã hủy', color: '#dc3545', icon: XCircle }
};

const Orders = ({ settings, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedPhone, setSearchedPhone] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Load đơn hàng của user đang đăng nhập
  const loadUserOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getUserOrders(user.id);
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm đơn hàng theo SĐT (cho khách chưa đăng nhập)
  const handleSearchByPhone = async () => {
    if (!searchPhone.trim()) return;
    setLoading(true);
    setSearchedPhone(searchPhone);
    try {
      const allOrders = await api.getOrders();
      const filtered = (allOrders || []).filter(order => 
        order.customer?.phone?.includes(searchPhone.trim())
      );
      setOrders(filtered);
    } catch (error) {
      console.error('Failed to search orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      <div style={{ padding: '2rem', minHeight: '60vh', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', color: settings.primaryColor, marginBottom: '1.5rem', textAlign: 'center' }}>
          <Package size={28} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          {user ? 'Đơn Hàng Của Tôi' : 'Tra Cứu Đơn Hàng'}
        </h2>

        {/* Nếu đã đăng nhập - hiển thị thông tin user */}
        {user && (
          <div style={{
            background: '#fff0f3',
            border: `1px solid ${settings.primaryColor}40`,
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ color: settings.primaryColor }}>
              👤 Xin chào <strong>{user.name}</strong>! Đây là các đơn hàng của bạn.
            </span>
            <button
              onClick={loadUserOrders}
              style={{
                background: settings.primaryColor,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem'
              }}
            >
              <RefreshCw size={14} /> Làm mới
            </button>
          </div>
        )}

        {/* Nếu chưa đăng nhập - form tìm kiếm */}
        {!user && (
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem', color: '#666' }}>
              💡 <strong>Đăng nhập</strong> để xem đơn hàng của bạn, hoặc nhập SĐT đã đặt hàng để tra cứu.
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại để tìm đơn hàng..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchByPhone()}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <button
                onClick={handleSearchByPhone}
                style={{
                  background: settings.primaryColor,
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Tìm kiếm
              </button>
              <Link to="/login">
                <button
                  style={{
                    background: 'white',
                    color: settings.primaryColor,
                    border: `1px solid ${settings.primaryColor}`,
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '500'
                  }}
                >
                  <LogIn size={16} /> Đăng nhập
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Danh sách đơn hàng */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : !user && !searchedPhone ? (
          // Chưa đăng nhập và chưa tìm kiếm
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Nhập số điện thoại để tìm đơn hàng
            </p>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>
              Hoặc đăng nhập để xem tất cả đơn hàng của bạn
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {searchedPhone ? `Không tìm thấy đơn hàng với SĐT "${searchedPhone}"` : 'Bạn chưa có đơn hàng nào'}
            </p>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>
              {searchedPhone ? 'Vui lòng kiểm tra lại số điện thoại.' : 'Hãy mua sắm và đặt hàng ngay!'}
            </p>
            <Link to="/shop">
              <button className="btn-primary" style={{ background: settings.primaryColor }}>
                🛍️ Bắt Đầu Mua Sắm
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              📋 Tìm thấy <strong>{orders.length}</strong> đơn hàng
            </div>
            {orders.map((order) => {
              const orderId = order._id || order.orderId;
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedOrder === orderId;

              return (
                <div key={orderId} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                  {/* Header - Always visible */}
                  <div
                    onClick={() => toggleExpand(orderId)}
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      background: isExpanded ? '#fafafa' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: `${statusConfig.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <StatusIcon size={22} color={statusConfig.color} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#333', fontSize: '0.95rem' }}>
                          #{orderId?.slice(-8)?.toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{
                        background: `${statusConfig.color}20`,
                        color: statusConfig.color,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {statusConfig.label}
                      </span>
                      <span style={{ fontWeight: 'bold', color: settings.primaryColor, minWidth: '100px', textAlign: 'right' }}>
                        {order.totalAmount?.toLocaleString('vi-VN')} ₫
                      </span>
                      {isExpanded ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #eee' }}>
                      {/* Customer Info */}
                      <div style={{ padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#666' }}>👤 Thông tin giao hàng</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <p style={{ margin: 0 }}><strong>Tên:</strong> {order.customer?.name}</p>
                          <p style={{ margin: 0 }}><strong>SĐT:</strong> {order.customer?.phone}</p>
                          {order.customer?.email && <p style={{ margin: 0 }}><strong>Email:</strong> {order.customer?.email}</p>}
                        </div>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}><strong>Địa chỉ:</strong> {order.customer?.address}</p>
                        {order.customer?.note && (
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>
                            <strong>Ghi chú:</strong> {order.customer?.note}
                          </p>
                        )}
                      </div>

                      {/* Order Items */}
                      <div style={{ padding: '1rem 0' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#666' }}>📦 Sản phẩm đã đặt</h4>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 0',
                            borderBottom: idx < order.items.length - 1 ? '1px dashed #eee' : 'none'
                          }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '500' }}>{item.name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                {Number(item.price).toLocaleString('vi-VN')} ₫ x {item.quantity}
                              </div>
                            </div>
                            <div style={{ fontWeight: 'bold', color: settings.primaryColor }}>
                              {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '10px',
                        marginTop: '0.5rem'
                      }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Tổng cộng:</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: settings.primaryColor }}>
                          {order.totalAmount?.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <SharedFooter settings={settings} />
    </>
  );
};

export default Orders;

