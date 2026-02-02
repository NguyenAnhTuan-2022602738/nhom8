import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, UserCheck } from 'lucide-react';
import SharedFooter from '../components/SharedFooter';
import { api } from '../services/api';

const Cart = ({ settings, cartItems, user, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const navigate = useNavigate();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  
  // Form thông tin khách hàng - khởi tạo từ user nếu có
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    note: ''
  });

  // Cập nhật form khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || ''
      }));
    }
  }, [user]);

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  const handleApplyVoucher = async () => {
    setVoucherError('');
    if (!voucherCode.trim()) return;

    // 1. Check cooldown (48h)
    const lastUsedKey = `voucher_used_${voucherCode.toUpperCase()}`;
    const lastUsedTime = localStorage.getItem(lastUsedKey);
    if (lastUsedTime) {
        const hoursDiff = (Date.now() - parseInt(lastUsedTime)) / (1000 * 60 * 60);
        if (hoursDiff < 48) {
            const hoursLeft = Math.ceil(48 - hoursDiff);
            setVoucherError(`Mã này đang trong thời gian chờ. Thử lại sau ${hoursLeft} giờ.`);
            return;
        }
    }

    try {
        // Fetch promotions to validate
        const promotions = await api.getSetting('promotionsData') || [];
        const promo = promotions.find(p => p.code.toUpperCase() === voucherCode.toUpperCase() && p.isActive);

        if (!promo) {
            setVoucherError('Mã giảm giá không tồn tại hoặc đã hết hạn.');
            return;
        }

        // Validate conditions
        const now = new Date();
        if (new Date(promo.validFrom) > now || new Date(promo.validUntil) < now) {
            setVoucherError('Mã giảm giá chưa đến hoặc đã quá hạn sử dụng.');
            return;
        }

        if (totalAmount < promo.minPurchase) {
            setVoucherError(`Đơn hàng tối thiểu ${promo.minPurchase.toLocaleString('vi-VN')}đ để sử dụng mã này.`);
            return;
        }

        // Calculate discount
        let discount = 0;
        if (promo.type === 'percentage') {
            discount = (totalAmount * promo.discount) / 100;
            if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
        } else {
            discount = promo.discount;
        }

        setAppliedVoucher({ ...promo, discountAmount: discount });
        setVoucherCode(''); 
        alert(`Áp dụng mã ${promo.code} thành công! Giảm ${discount.toLocaleString('vi-VN')}đ`);

    } catch (e) {
        console.error("Voucher check failed", e);
        setVoucherError('Lỗi khi kiểm tra mã giảm giá.');
    }
  };

  const handleRemoveVoucher = () => {
      setAppliedVoucher(null);
      setVoucherCode('');
  };

  const finalAmount = appliedVoucher ? Math.max(0, totalAmount - appliedVoucher.discountAmount) : totalAmount;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: customerInfo,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalAmount, // Use discounted amount
        subTotal: totalAmount,
        discount: appliedVoucher ? appliedVoucher.discountAmount : 0,
        voucherCode: appliedVoucher ? appliedVoucher.code : null,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const result = await api.createOrder(orderData);
      
      // Save cooldown to localStorage on success
      if (appliedVoucher) {
          localStorage.setItem(`voucher_used_${appliedVoucher.code}`, Date.now().toString());
      }

      setOrderInfo({
        orderId: result._id || result.id || Date.now().toString(),
        ...orderData
      });
      setOrderSuccess(true);
      onClearCart();
    } catch (error) {
      console.error('Order failed:', error);
      // Fallback: Lưu vào localStorage nếu API lỗi
      const fallbackOrder = {
        orderId: 'LOCAL-' + Date.now(),
        customer: customerInfo,
        items: cartItems,
        totalAmount: finalAmount,
        subTotal: totalAmount,
        discount: appliedVoucher ? appliedVoucher.discountAmount : 0,
        voucherCode: appliedVoucher ? appliedVoucher.code : null,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(fallbackOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Save cooldown logic for offline/fallback too
      if (appliedVoucher) {
        localStorage.setItem(`voucher_used_${appliedVoucher.code}`, Date.now().toString());
      }

      setOrderInfo(fallbackOrder);
      setOrderSuccess(true);
      onClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Màn hình đặt hàng thành công
  if (orderSuccess) {
    return (
      <>
        <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh', maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: settings.primaryColor, marginBottom: '1rem' }}>Đặt Hàng Thành Công!</h2>
            <p style={{ marginBottom: '0.5rem' }}>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>
              Mã đơn hàng: <strong style={{ color: settings.primaryColor }}>#{orderInfo?.orderId?.slice(-8)}</strong>
            </p>
            
            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: settings.primaryColor }}>📦 Thông tin đơn hàng</h4>
              <p style={{ margin: '0.3rem 0' }}><strong>Người nhận:</strong> {orderInfo?.customer?.name}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>SĐT:</strong> {orderInfo?.customer?.phone}</p>
              <p style={{ margin: '0.3rem 0' }}><strong>Địa chỉ:</strong> {orderInfo?.customer?.address}</p>
              <p style={{ margin: '0.3rem 0', fontWeight: 'bold', fontSize: '1.1rem', color: settings.primaryColor, marginTop: '1rem' }}>
                Tổng tiền: {orderInfo?.totalAmount?.toLocaleString('vi-VN')} ₫
              </p>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2rem' }}>
              Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất!
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop">
                <button className="btn-primary" style={{ background: settings.primaryColor }}>
                  Tiếp Tục Mua Sắm
                </button>
              </Link>
              <Link to="/">
                <button style={{ padding: '10px 30px', borderRadius: '30px', border: `2px solid ${settings.primaryColor}`, background: 'white', color: settings.primaryColor, cursor: 'pointer', fontWeight: '600' }}>
                  Về Trang Chủ
                </button>
              </Link>
            </div>
          </div>
        </div>
        <SharedFooter settings={settings} />
      </>
    );
  }

  return (
    <>
      <div style={{ padding: '2rem', minHeight: '60vh', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', color: settings.primaryColor, marginBottom: '1.5rem', textAlign: 'center' }}>
          <ShoppingBag size={28} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Giỏ Hàng Của Bạn
        </h2>
        
        {cartItems.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Giỏ hàng hiện đang trống.</p>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
            <Link to="/shop">
              <button className="btn-primary" style={{ background: settings.primaryColor }}>
                🛍️ Bắt Đầu Mua Sắm
              </button>
            </Link>
          </div>
        ) : !isCheckout ? (
          // Hiển thị giỏ hàng
          <>
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  {/* Thông tin sản phẩm */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '200px' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px' }} 
                    />
                    <div>
                      <h4 style={{ margin: 0, color: settings.primaryColor, fontSize: '1rem' }}>{item.name}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                        {Number(item.price).toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>

                  {/* Điều chỉnh số lượng */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        background: item.quantity <= 1 ? '#f5f5f5' : 'white',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        opacity: item.quantity <= 1 ? 0.5 : 1
                      }}
                      onMouseOver={e => { if (item.quantity > 1) e.target.style.background = '#f0f0f0'; }}
                      onMouseOut={e => { if (item.quantity > 1) e.target.style.background = 'white'; }}
                    >
                      <Minus size={16} />
                    </button>
                    
                    <input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        onUpdateQuantity(item.id, Math.max(1, val));
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) < 1) {
                          onUpdateQuantity(item.id, 1);
                        }
                      }}
                      style={{ 
                        width: '50px', 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        padding: '6px 4px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    />
                    
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.target.style.background = '#f0f0f0'}
                      onMouseOut={e => e.target.style.background = 'white'}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Thành tiền & Xóa */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '150px', justifyContent: 'flex-end' }}>
                    <span style={{ fontWeight: 'bold', color: settings.primaryColor, fontSize: '1rem' }}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                    </span>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#fff0f0',
                        color: '#ff4d4f',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => { e.target.style.background = '#ff4d4f'; e.target.style.color = 'white'; }}
                      onMouseOut={e => { e.target.style.background = '#fff0f0'; e.target.style.color = '#ff4d4f'; }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng kết */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Số lượng sản phẩm:</span>
                <span>{totalItems} sản phẩm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px dashed #eee' }}>
                <span>Phí vận chuyển:</span>
                <span style={{ color: '#28a745' }}>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Tổng cộng:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: settings.primaryColor }}>
                  {totalAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/shop" style={{ flex: 1, minWidth: '150px' }}>
                  <button style={{ 
                    width: '100%',
                    padding: '12px 20px', 
                    borderRadius: '30px', 
                    border: `2px solid ${settings.primaryColor}`, 
                    background: 'white', 
                    color: settings.primaryColor, 
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <ArrowLeft size={18} /> Tiếp tục mua
                  </button>
                </Link>
                <button 
                  onClick={() => setIsCheckout(true)}
                  className="btn-primary" 
                  style={{ 
                    flex: 2, 
                    minWidth: '200px',
                    background: settings.primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <CreditCard size={18} /> Tiến Hành Đặt Hàng
                </button>
              </div>
            </div>
          </>
        ) : (
          // Form đặt hàng
          <div className="glass-card" style={{ padding: '2rem' }}>
            <button 
              onClick={() => setIsCheckout(false)}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                color: settings.primaryColor,
                marginBottom: '1.5rem',
                fontWeight: '500'
              }}
            >
              <ArrowLeft size={18} /> Quay lại giỏ hàng
            </button>

            <h3 style={{ color: settings.primaryColor, marginBottom: '1rem' }}>📝 Thông Tin Đặt Hàng</h3>
            
            {/* Thông báo đã điền tự động */}
            {user && (
              <div style={{
                background: '#e8f5e9',
                border: '1px solid #a5d6a7',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.9rem',
                color: '#2e7d32'
              }}>
                <UserCheck size={20} />
                <span>Thông tin đã được điền tự động từ tài khoản <strong>{user.name}</strong>. Bạn có thể chỉnh sửa nếu cần.</span>
              </div>
            )}
            
            <form onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label>Họ và tên *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  required 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="0909 123 456"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Địa chỉ giao hàng *</label>
                <input 
                  type="text" 
                  name="address" 
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea 
                  name="note" 
                  value={customerInfo.note}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
                  rows="3"
                />
              </div>

              {/* Tóm tắt đơn hàng */}
              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>🛒 Tóm tắt đơn hàng ({totalItems} sản phẩm)</h4>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.25rem 0' }}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                  </div>
                ))}

                {/* Voucher Input */}
                <div style={{ padding: '10px 0', borderTop: '1px dashed #ddd', marginTop: '10px' }}>
                    {appliedVoucher ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e6f7ff', padding: '8px', borderRadius: '6px', border: '1px solid #91d5ff' }}>
                            <div>
                                <strong style={{ color: '#1890ff' }}>{appliedVoucher.code}</strong>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>- {appliedVoucher.discountAmount.toLocaleString('vi-VN')}đ</div>
                            </div>
                            <button type="button" onClick={handleRemoveVoucher} style={{ border: 'none', background: 'transparent', color: '#ff4d4f', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                placeholder="Mã giảm giá"
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                            />
                            <button
                                type="button"
                                onClick={handleApplyVoucher}
                                style={{ background: settings.primaryColor, color: 'white', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Áp dụng
                            </button>
                        </div>
                    )}
                    {voucherError && <div style={{ color: '#ff4d4f', fontSize: '0.8rem', marginTop: '5px' }}>{voucherError}</div>}
                </div>

                <div style={{ borderTop: '1px dashed #ddd', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                      <span>Tạm tính:</span>
                      <span>{totalAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  {appliedVoucher && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem', color: '#28a745' }}>
                          <span>Giảm giá:</span>
                          <span>- {appliedVoucher.discountAmount.toLocaleString('vi-VN')} ₫</span>
                      </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Tổng thanh toán:</span>
                    <span style={{ color: settings.primaryColor, fontSize: '1.1rem' }}>{finalAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  background: isSubmitting ? '#aaa' : settings.primaryColor,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '18px', 
                      height: '18px', 
                      border: '2px solid white', 
                      borderTopColor: 'transparent', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }} />
                    Đang xử lý...
                  </>
                ) : (
                  <>✨ Xác Nhận Đặt Hàng</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
      <SharedFooter settings={settings} />
    </>
  );
};

export default Cart;
