# Frontend Update Guide

After deploying backend to Railway, update these files with your Railway URL:

## 1. Update `.env.production`

```bash
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

## 2. Deploy to Vercel

```bash
# From project root
vercel --prod
```

Or via Vercel Dashboard:
1. Import GitHub repo
2. Set Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-app.up.railway.app/api`
3. Deploy

## 3. Update Railway Environment

After deploying frontend to Vercel, update Railway:

```
CLIENT_URL=https://your-vercel-app.vercel.app
```

## 4. Test Real-time Chat

1. Open frontend on Vercel
2. Send chat message
3. Open admin panel in new tab
4. Reply from admin
5. **Should see message instantly!** ⚡

---

## Quick Checklist

- [ ] Backend deployed to Railway
- [ ] Got Railway URL (e.g., `https://xxx.up.railway.app`)
- [ ] Updated `.env.production` with Railway URL
- [ ] Frontend deployed to Vercel
- [ ] Got Vercel URL (e.g., `https://xxx.vercel.app`)
- [ ] Updated Railway `CLIENT_URL` with Vercel URL
- [ ] Tested chat real-time functionality

Done! 🎉
