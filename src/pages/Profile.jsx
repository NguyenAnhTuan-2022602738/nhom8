import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Save, Package, LogOut, Edit3 } from 'lucide-react';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

const Profile = ({ settings, user, onUpdateUser, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, password
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      loadOrders();
    }
  }, [activeTab, user]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getUserOrders(user.id);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await api.updateProfile(user.id, profileData);
      onUpdateUser(result.user);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Đã xảy ra lỗi' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await api.changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Đã xảy ra lỗi' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const STATUS_LABELS = {
    pending: { text: 'Chờ xác nhận', color: '#ffc107' },
    confirmed: { text: 'Đã xác nhận', color: '#17a2b8' },
    shipping: { text: 'Đang giao', color: '#007bff' },
    delivered: { text: 'Đã giao', color: '#28a745' },
    cancelled: { text: 'Đã hủy', color: '#dc3545' }
  };

  if (!user) return null;

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', minHeight: '60vh' }}>
        <h2 style={{ color: settings.primaryColor, textAlign: 'center', marginBottom: '2rem' }}>
          <User size={28} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Tài Khoản Của Tôi
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'profile', label: 'Thông tin', icon: <User size={16} /> },
            { id: 'orders', label: 'Đơn hàng', icon: <Package size={16} /> },
            { id: 'password', label: 'Đổi mật khẩu', icon: <Lock size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: activeTab === tab.id ? 'none' : '1px solid #ddd',
                background: activeTab === tab.id ? settings.primaryColor : 'white',
                color: activeTab === tab.id ? 'white' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#e8f5e9' : '#fff3f3',
            color: message.type === 'success' ? '#2e7d32' : '#c62828',
            border: `1px solid ${message.type === 'success' ? '#a5d6a7' : '#ffcdd2'}`
          }}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: settings.primaryColor }}>👤 Thông tin cá nhân</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'none',
                    border: `1px solid ${settings.primaryColor}`,
                    color: settings.primaryColor,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit3 size={16} /> Chỉnh sửa
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} /> Email
                </label>
                <input type="email" value={user.email} disabled style={{ background: '#f5f5f5', cursor: 'not-allowed' }} />
                <small style={{ color: '#888', fontSize: '0.8rem' }}>Email không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} /> Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  style={{ background: isEditing ? 'white' : '#f5f5f5' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} /> Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  placeholder="0909 123 456"
                  style={{ background: isEditing ? 'white' : '#f5f5f5' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} /> Địa chỉ mặc định
                </label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  rows={2}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  style={{ background: isEditing ? 'white' : '#f5f5f5' }}
                />
              </div>
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({ name: user.name, phone: user.phone || '', address: user.address || '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '25px',
                    border: '1px solid #ddd',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    background: isSaving ? '#ccc' : settings.primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSaving ? 'Đang lưu...' : <><Save size={18} /> Lưu thay đổi</>}
                </button>
              </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #eee' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '25px',
                  border: '1px solid #dc3545',
                  background: 'white',
                  color: '#dc3545',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
              >
                <LogOut size={18} /> Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Đang tải đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Bạn chưa có đơn hàng nào</p>
                <Link to="/shop">
                  <button className="btn-primary" style={{ background: settings.primaryColor }}>
                    🛍️ Mua sắm ngay
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => {
                  const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                  return (
                    <div key={order._id} className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#333' }}>#{order._id?.slice(-8)?.toUpperCase()}</div>
                          <div style={{ fontSize: '0.85rem', color: '#888' }}>{formatDate(order.createdAt)}</div>
                        </div>
                        <span style={{
                          background: `${status.color}20`,
                          color: status.color,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {status.text}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img key={idx} src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                        ))}
                        {order.items?.length > 3 && (
                          <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#666' }}>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#666' }}>{order.items?.length} sản phẩm</span>
                        <span style={{ fontWeight: 'bold', color: settings.primaryColor, fontSize: '1.1rem' }}>
                          {order.totalAmount?.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: settings.primaryColor }}>🔐 Đổi mật khẩu</h3>
            
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  placeholder="Ít nhất 6 ký tự"
                />
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  background: isSaving ? '#ccc' : settings.primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSaving ? 'Đang xử lý...' : <><Lock size={18} /> Đổi mật khẩu</>}
              </button>
            </form>
          </div>
        )}
      </div>
      <SharedFooter settings={settings} />
    </>
  );
};

export default Profile;
