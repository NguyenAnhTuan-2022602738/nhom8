import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductModal from './components/ProductModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { api } from './services/api';
import './index.css';

const initialProducts = [
  { 
    id: 1, 
    name: "Rose Symphony", 
    price: 450000, 
    image: "https://images.unsplash.com/photo-1563241527-302ae5518b53?q=80&w=1000&auto=format&fit=crop", 
    images: ["https://images.unsplash.com/photo-1563241527-302ae5518b53?q=80&w=1000&auto=format&fit=crop"],
    description: "Bản giao hưởng của tình yêu vĩnh cửu." 
  },
  { 
    id: 2, 
    name: "Pink Paradise", 
    price: 320000, 
    image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=1000&auto=format&fit=crop", 
    images: ["https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=1000&auto=format&fit=crop"],
    description: "Thiên đường màu hồng mộng mơ." 
  },
  { 
    id: 3, 
    name: "Tulip Dreams", 
    price: 280000, 
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1000&auto=format&fit=crop", 
    images: ["https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1000&auto=format&fit=crop"],
    description: "Giấc mơ dịu dàng của mùa xuân." 
  }
];

// Default settings - sẽ được ghi đè bởi dữ liệu từ DB
const DEFAULT_SETTINGS = { 
  title: "🌸 Tiệm Hoa Của Nàng", 
  showFlowers: true, 
  primaryColor: "#c9184a"
};

function App() {
  const [products, setProducts] = useState(initialProducts); 
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Auth State - User object with role
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = user?.role === 'admin';

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // Load Data from MongoDB - OPTIMIZED: Single call for homeLayoutV2 + parallel for products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load song song cả products và homeLayoutV2
        const [dbProducts, savedData] = await Promise.all([
          api.getProducts(),
          api.getSetting('homeLayoutV2')
        ]);
        
        // Set products
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }
        
        // Extract globalSettings từ homeLayoutV2
        if (savedData && savedData.globalSettings) {
          const newSettings = { ...DEFAULT_SETTINGS, ...savedData.globalSettings };
          setSettings(newSettings);
          
          // Apply settings ngay lập tức
          document.title = newSettings.title;
          document.documentElement.style.setProperty('--deep-rose', newSettings.primaryColor);
        }
      } catch (error) {
        console.error("Failed to connect to backend", error);
        // Fallback to localStorage
        const localData = localStorage.getItem('homeLayoutV2');
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed.globalSettings) {
              setSettings(prev => ({ ...prev, ...parsed.globalSettings }));
            }
          } catch (e) {}
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply settings khi thay đổi (không auto-save, chỉ apply UI)
  useEffect(() => {
    if (settings.title) {
      document.title = settings.title;
    }
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--deep-rose', settings.primaryColor);
    }
  }, [settings]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    // Hiển thị toast thông báo
    setToast({ message: `Đã thêm "${product.name}" vào giỏ hàng!`, type: 'success' });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleOpenModal = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  // Loading screen
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌸</div>
          <div style={{ color: '#c9184a', fontWeight: 'bold' }}>Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout settings={settings} user={user} isAdmin={isAdmin} onLogout={handleLogout} cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}>
        <Routes>
          <Route path="/" element={
            <Home 
              products={products} 
              setProducts={setProducts} 
              settings={settings} 
              setSettings={setSettings}
              onOpenModal={handleOpenModal} 
              onAddToCart={addToCart} 
              isAdmin={isAdmin} 
            />
          } />
          <Route path="/shop" element={<Shop products={products} settings={settings} onOpenModal={handleOpenModal} onAddToCart={addToCart} />} />
          <Route path="/about" element={<About settings={settings} isAdmin={isAdmin} />} />
          <Route path="/contact" element={<Contact settings={settings} />} />
          <Route path="/cart" element={
            <Cart 
              settings={settings} 
              cartItems={cartItems} 
              user={user}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />
          } />
          <Route path="/login" element={
            user ? (
              user.role === 'admin' ? <Admin products={products} setProducts={setProducts} settings={settings} /> : <Profile settings={settings} user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} settings={settings} />
            )
          } />
          <Route path="/register" element={
            user ? (
              user.role === 'admin' ? <Admin products={products} setProducts={setProducts} settings={settings} /> : <Profile settings={settings} user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
            ) : (
              <Register settings={settings} onLogin={handleLogin} />
            )
          } />
          <Route path="/profile" element={
            user ? (
              <Profile settings={settings} user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} settings={settings} />
            )
          } />
          <Route path="/orders" element={<Orders settings={settings} user={user} />} />
          <Route path="/admin" element={
            isAdmin ? (
              <Admin 
                products={products} 
                setProducts={setProducts} 
                settings={settings}
              />
            ) : (
              <Login onLogin={handleLogin} settings={settings} />
            )
          } />
        </Routes>
        
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={handleCloseModal} 
            onAddToCart={addToCart}
            settings={settings}
            isAdmin={isAdmin}
            onUpdateProduct={(updatedProduct) => {
                setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                setSelectedProduct(updatedProduct);
            }}
          />
        )}
      </Layout>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </Router>
  );
}

export default App;
