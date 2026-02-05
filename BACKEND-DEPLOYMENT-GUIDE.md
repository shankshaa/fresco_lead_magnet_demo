# 🚀 Backend Deployment Guide

## ✅ What We Built:

**Frontend:** `addenda-tracker.html`
**Backend:** `api/compare.js` (Vercel serverless function)
**Config:** `vercel.json`, `package.json`

---

## 📋 Files You Need to Deploy:

```
your-project/
├── addenda-tracker.html    ← Frontend
├── api/
│   └── compare.js          ← Backend API
├── vercel.json             ← Vercel config
└── package.json            ← Node.js config
```

---

## 🔑 Step 1: Get Your Anthropic API Key

1. Go to: **console.anthropic.com**
2. Sign up or log in
3. Click "Get API Keys" or go to Settings → API Keys
4. Click "Create Key"
5. **Copy the key** (starts with `sk-ant-...`)
6. **SAVE IT SOMEWHERE SAFE** - you can't see it again!

**Cost:** Pay-as-you-go
- ~$0.01-0.05 per document comparison
- You need a credit card on file

---

## 🚀 Step 2: Push to GitHub

### If you haven't already:

```bash
# In your project folder:
git init
git add .
git commit -m "Add backend API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/addenda-tracker
git push -u origin main
```

### If you already have a repo:

```bash
# Just update it:
git add .
git commit -m "Add backend API"
git push
```

---

## 🔧 Step 3: Deploy to Vercel with API Key

### A. Via Vercel Dashboard (Easiest):

1. **Go to:** vercel.com
2. **Log in**
3. **Find your project** (fresco_lead_magnet or addenda-tracker)
4. **Click on it**
5. **Go to:** Settings (top menu)
6. **Click:** Environment Variables (left sidebar)
7. **Add New Variable:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (paste your key)
   - Environments: Check all (Production, Preview, Development)
8. **Click "Save"**
9. **Go to Deployments tab**
10. **Click "Redeploy"** on the latest deployment
11. **Wait 1 minute**
12. **Done!** ✅

---

### B. Via CLI:

```bash
# Install Vercel CLI if you haven't:
npm i -g vercel

# Deploy with environment variable:
vercel --prod

# Then add the API key in the dashboard (see option A)
```

---

## 🧪 Step 4: Test It!

1. **Go to your Vercel URL:**
   ```
   https://your-project.vercel.app
   ```

2. **Open browser console** (F12)

3. **Upload two PDFs**

4. **Click "Compare Documents"**

5. **Watch the console:**
   ```
   📄 Extracting text from PDFs...
   🚀 Sending to backend API for analysis...
   ✅ Analysis complete!
   ```

6. **See REAL AI results!** 🎉

---

## ❌ Troubleshooting

### Issue: "API key not configured"

**Solution:**
- Go to Vercel → Your Project → Settings → Environment Variables
- Make sure `ANTHROPIC_API_KEY` is added
- Click "Redeploy" after adding

### Issue: "404 Not Found" on /api/compare

**Solution:**
- Make sure `api/compare.js` is in your GitHub repo
- Make sure it's in the `api/` folder, not root
- Redeploy

### Issue: "Fallback to mock data"

**Solution:**
- Check browser console for specific error
- Verify API key is correct (starts with `sk-ant-`)
- Check Vercel function logs: Vercel Dashboard → Your Project → Deployments → Click deployment → Functions tab

### Issue: "CORS error"

**Solution:**
- The backend already has CORS headers
- Make sure you're calling `/api/compare` not `https://api.anthropic.com`
- Check if the API function is actually deployed

---

## 💰 Cost Monitoring

**Track your usage:**
1. Go to: console.anthropic.com
2. Click "Usage" or "Billing"
3. See costs per API call

**Set spending limits:**
1. Billing → Set monthly limit (e.g., $10/month)
2. You'll get email alerts

**Estimated costs:**
- 10 comparisons: ~$0.10-0.50
- 100 comparisons: ~$1-5
- 1000 comparisons: ~$10-50

---

## 🔒 Security Notes

✅ **Secure:**
- API key is stored in Vercel environment variables (encrypted)
- Not visible in source code
- Not exposed to browser

❌ **Don't:**
- Put API key in HTML file
- Commit API key to GitHub
- Share API key publicly

---

## 📊 Monitor Your Deployment

**Vercel Dashboard Shows:**
- Request count
- Response times
- Error rates
- Function logs

**Check:**
- Vercel Dashboard → Your Project → Analytics
- See how many people are using it!

---

## 🎯 Next Steps

1. ✅ Deploy with API key
2. ✅ Test with real PDFs
3. ✅ Share the link!
4. ✅ Monitor usage and costs
5. ✅ Add more features as needed

---

## 🆘 Need Help?

**Check Vercel function logs:**
```
Vercel Dashboard → Project → Deployments → 
Click latest deployment → Functions tab → 
Click on api/compare.js → See logs
```

**Test the API directly:**
```bash
curl -X POST https://your-project.vercel.app/api/compare \
  -H "Content-Type: application/json" \
  -d '{"originalText": "test", "addendumText": "test2"}'
```

---

## 🎊 You're Done!

Your tool now has:
- ✅ Real AI-powered analysis
- ✅ Secure backend
- ✅ No hardcoded API keys
- ✅ Production-ready!

**Share it with the world!** 🚀
