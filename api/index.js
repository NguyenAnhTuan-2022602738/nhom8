import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for simplicity (or configure specific domains)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://tuannguyen10112004:tuannguyencoder@cluster0.xsi5t.mongodb.net/shop_hoa";

// Only connect if not already connected
if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGO_URI)
      .then(() => console.log('✅ Connected to MongoDB'))
      .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// Schemas
const ProductSchema = new mongoose.Schema({
  id: Number, 
  name: String,
  price: Number,
  image: String,
  images: [String],
  description: String,
  category: String
});

const SettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true }, 
  value: mongoose.Schema.Types.Mixed
});

// Use models if already compiled to avoid overwriting error in serverless
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingsSchema);

// --- API Routes ---
app.get('/api', (req, res) => {
    res.json({ message: "Hello from Flower Shop API 🌸" });
});

// 1. Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Settings / Layout
app.get('/api/settings/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    res.json(setting ? setting.value : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    const updated = await Setting.findOneAndUpdate(
      { key }, 
      { key, value }, 
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Local Development Server
// Check if this module is being run directly (not imported)
// In ESM, import.meta.url is the file URL. process.argv[1] is the script path.
// Doing a loose check or simply trying to listen if PORT is defined and not serverless environment.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    });
}

// Export for Vercel Serverless
export default app;
