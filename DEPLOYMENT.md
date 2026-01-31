# 🚀 Full Deployment Guide

## Overview
- **Backend**: Railway (Socket.IO support)
- **Frontend**: Vercel (Static hosting)
- **Database**: MongoDB Atlas (already configured)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repo

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `ThuMayDangIu/code`
4. Railway auto-detects Node.js project

### Step 3: Configure Root Directory
**IMPORTANT:** Railway needs to know where backend code is located.

1. Click on your service
2. Go to "Settings" tab
3. Find "Root Directory"
4. Set to: `api`
5. Click "Save"

### Step 4: Add Environment Variables
1. Go to "Variables" tab
2. Click "New Variable" and add:

```
MONGO_URI = mongodb+srv://tuannguyen10112004:tuannguyencoder@cluster0.xsi5t.mongodb.net/shop_hoa

CLIENT_URL = https://your-app.vercel.app
```

(You'll update `CLIENT_URL` after deploying frontend)

### Step 5: Deploy
1. Railway automatically deploys
2. Wait for build to complete (~2 minutes)
3. Go to "Settings" → "Networking" → "Generate Domain"
4. **Copy your Railway URL**: `https://xxx.up.railway.app`

✅ **Backend deployed!**

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment File
1. Open `.env.production`
2. Replace with your Railway URL:

```bash
VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
```

**Example:**
```bash
VITE_API_URL=https://backend-production-abc123.up.railway.app/api
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Configure for production deployment"
git push
```

### Step 3: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-RAILWAY-URL.up.railway.app/api`
5. Click "Deploy"
6. Wait ~2 minutes
7. **Copy your Vercel URL**: `https://xxx.vercel.app`

✅ **Frontend deployed!**

---

## Part 3: Connect Frontend & Backend

### Update Railway CLIENT_URL
1. Go back to Railway dashboard
2. Open your project → "Variables"
3. Update `CLIENT_URL` with your Vercel URL:

```
CLIENT_URL = https://your-app.vercel.app
```

4. Service will auto-redeploy (~1 minute)

✅ **Connection complete!**

---

## Testing Real-time Chat

### Test 1: Customer Chat
1. Open your Vercel URL
2. Click chat widget (bottom-right)
3. Send message: "Hello"
4. Check browser console: Should see "✅ Socket connected"

### Test 2: Admin Real-time Reply
1. Open **new incognito tab**
2. Go to your Vercel URL
3. Login as admin (email: `admin@admin.com`, password: `admin`)
4. Go to "Tin Nhắn" tab
5. Select the session
6. Reply: "Hi there!"

### Test 3: Instant Message
**In the first tab (customer):**
- Should see admin's reply **INSTANTLY** ⚡
- No page refresh needed!

---

## Troubleshooting

### Chat not connecting?
- Check Railway logs: `Settings` → `Deployments` → Click latest → View logs
- Look for: `✅ Connected to MongoDB` and `Server running on port...`

### CORS errors?
- Verify `CLIENT_URL` in Railway matches your Vercel URL exactly
- No trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`

### Messages not appearing?
- Open browser DevTools → Network tab
- Look for WebSocket connection (should be green)
- Check Socket.IO logs in console

---

## URLs Checklist

After deployment, you should have:

- [ ] **Railway Backend**: `https://xxx.up.railway.app`
- [ ] **Vercel Frontend**: `https://xxx.vercel.app`
- [ ] **MongoDB**: Already configured
- [ ] **Chat Widget**: Working with real-time ⚡

---

## Cost

- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (unlimited deployments)
- **MongoDB Atlas**: Free tier (512MB)

**Total: $0/month** 🎉

---

## Need Help?

Check these files:
- `RAILWAY_DEPLOY.md` - Railway details
- `FRONTEND_UPDATE.md` - Frontend deployment
- `api/.env.example` - Backend environment variables
- `.env.example` - Frontend environment variables

Good luck! 🚀🌸
