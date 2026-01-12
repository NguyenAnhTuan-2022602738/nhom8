import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductModal from './components/ProductModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import './index.css';

const initialProducts = [
  { 
    id: 1, 
    name: "Rose Symphony", 
    price: 450000, 
    image: "https://images.unsplash.com/photo-1563241527-302ae5518b53?q=80&w=1000&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1563241527-302ae5518b53?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Bản giao hưởng của tình yêu vĩnh cửu. Sự kết hợp hoàn hảo giữa những đóa hồng đỏ thắm và vẻ đẹp kiêu sa, mang lại không gian lãng mạn cho bất kỳ dịp nào." 
  },
  { 
    id: 2, 
    name: "Pink Paradise", 
    price: 320000, 
    image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=1000&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522748906645-95d8adfd66c7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521711207860-26462723658a?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Thiên đường màu hồng mộng mơ. Những cánh hoa nhẹ nhàng đung đưa trong gió, gợi nhớ về những kỷ niệm ngọt ngào nhất của tuổi thanh xuân." 
  },
  { 
    id: 3, 
    name: "Tulip Dreams", 
    price: 280000, 
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1000&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554528122-8b8398cb9b69?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588607149026-66f80e071725?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Giấc mơ dịu dàng của mùa xuân. Vẻ đẹp thanh tao và tinh tế của loài hoa tulip sẽ làm bừng sáng không gian sống của bạn." 
  },
  { 
    id: 4, 
    name: "Baby's Breath", 
    price: 150000, 
    image: "https://images.unsplash.com/photo-1594950669299-6e3e15777717?q=80&w=1000&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1594950669299-6e3e15777717?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516205651411-a427118d2cc3?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Vẻ đẹp thuần khiết và ngây thơ. Những bông hoa nhỏ li ti như những ngôi sao sáng, tượng trưng cho tình yêu vĩnh cửu và sự chân thành." 
  },
  { 
    id: 5, 
    name: "Luxury Peony", 
    price: 550000, 
    image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=1000&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487530811171-ec5045bf9468?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Sự quý phái và thịnh vượng. Mẫu đơn, nữ hoàng của các loài hoa, mang đến vẻ đẹp sang trọng và đẳng cấp cho người sở hữu." 
  },
  { 
    id: 6, 
    name: "Sunflower Joy", 
    price: 200000, 
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35a2651?q=80&w=1000&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1597848212624-a19eb35a2651?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Niềm vui rực rỡ dưới ánh mặt trời. Mang năng lượng tích cực và sự ấm áp đến cho người nhận." 
  }
];

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  // Interface Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : { title: "🌸 Tiệm Hoa Của Nàng", showFlowers: true, primaryColor: "#c9184a" };
  });

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    document.title = settings.title;
    document.documentElement.style.setProperty('--deep-rose', settings.primaryColor);
  }, [settings]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    // Add toast logic here if wanted, or just simple alert for now
    // alert(`Đã thêm ${quantity} ${product.name} vào giỏ!`);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Router>
      <Layout settings={settings} cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}>
        <Routes>
          <Route path="/" element={<Home products={products} setProducts={setProducts} settings={settings} onOpenModal={handleOpenModal} onAddToCart={addToCart} />} />
          <Route path="/shop" element={<Shop products={products} settings={settings} onOpenModal={handleOpenModal} onAddToCart={addToCart} />} />
          <Route path="/about" element={<About settings={settings} />} />
          <Route path="/contact" element={<Contact settings={settings} />} />
          <Route path="/cart" element={<Cart settings={settings} cartItems={cartItems} />} />
          <Route path="/admin" element={
            <Admin 
              products={products} 
              setProducts={setProducts} 
              settings={settings} 
              setSettings={setSettings} 
            />
          } />
        </Routes>
        
        {/* Product Modal */}
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={handleCloseModal} 
            onAddToCart={addToCart}
            settings={settings}
          />
        )}
      </Layout>
    </Router>
  );
}

export default App;
