# Deploy Backend to Vercel (Node.js + Socket.IO)

## Setup

### 1. Prepare Backend
Files đã sẵn sàng:
- ✅ `api/package.json`
- ✅ `api/index.js`
- ✅ `api/vercel.json` (vừa tạo)

### 2. Deploy Backend to Vercel

**Option A: Vercel CLI**
```bash
cd api
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com
2. "Add New" → "Project"
3. Import GitHub repo
4. **Root Directory**: Set to `api`
5. **Environment Variables**:
   ```
   MONGO_URI = mongodb+srv://tuannguyen10112004:tuannguyencoder@cluster0.xsi5t.mongodb.net/shop_hoa
   CLIENT_URL = https://your-frontend.vercel.app
   ```
6. Deploy

### 3. Get Backend URL
- After deployment: `https://your-backend.vercel.app`
- Copy this URL

### 4. Deploy Frontend
1. Update `.env.production`:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
2. Deploy frontend to Vercel (separate project)
3. Get frontend URL

### 5. Update Backend CLIENT_URL
- Go to backend project on Vercel
- Settings → Environment Variables
- Update `CLIENT_URL` to frontend URL
- Redeploy

## Testing

1. Open frontend
2. Send chat message
3. Check console: Should see Socket.IO connection
4. Test admin reply → Should work real-time

## Done! 🎉

Both frontend + backend on Vercel with Socket.IO working!
