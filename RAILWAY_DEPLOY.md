# Railway Deployment Guide

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign in with GitHub

## Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-detect the `api/` folder

## Step 3: Set Environment Variables
In Railway dashboard, add these variables:

```
MONGO_URI = mongodb+srv://tuannguyen10112004:tuannguyencoder@cluster0.xsi5t.mongodb.net/shop_hoa
CLIENT_URL = https://your-vercel-app.vercel.app
```

(Railway auto-sets `PORT`)

## Step 4: Deploy
- Railway will automatically:
  - Run `npm install`
  - Run `npm start`
  - Assign a public URL

## Step 5: Get Your Backend URL
- Copy the URL from Railway (e.g., `https://your-app.up.railway.app`)
- Update frontend files with this URL

## Next: Update Frontend
See `FRONTEND_UPDATE.md` for instructions on updating frontend to use Railway backend.
