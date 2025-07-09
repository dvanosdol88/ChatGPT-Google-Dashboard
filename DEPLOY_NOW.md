# 🚀 Deploy ChatGPT-Google Dashboard - Quick Steps

## Step 1: Create Database (2 min)
[Click here to create database](https://dashboard.render.com/new/database)

**Settings:**
- Name: `david-gpt-db-2025` (or add random numbers like `chatgpt-db-7483`)
- Database: `chatgpt_dashboard`  
- User: `chatgpt_dashboard_user`
- Region: Oregon (US West)
- Instance Type: Free

**After creation:** Copy the "External Database URL" from the database dashboard

---

## Step 2: Create Backend (3 min)
[Click here to create backend](https://dashboard.render.com/new/web-service?repo=https://github.com/dvanosdol88/ChatGPT-Google-Dashboard)

**Settings:**
- Name: `david-gpt-backend-2025` (or add random numbers)
- Region: Oregon (US West)
- Branch: `main`
- Root Directory: `backend`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: Free

**Environment Variables (click "Advanced"):**
| Key | Value |
|-----|-------|
| DATABASE_URL | *Paste the External Database URL from Step 1* |
| OPENAI_API_KEY | `rnd_IwCrq0zq4qCyGc4fP6hLBQgd5nLW` |
| PORT | `5000` |
| NODE_ENV | `production` |

**After creation:** Copy the backend URL (like `https://david-gpt-backend-2025-xxx.onrender.com`)

---

## Step 3: Create Frontend (3 min)
[Click here to create frontend](https://dashboard.render.com/new/static-site?repo=https://github.com/dvanosdol88/ChatGPT-Google-Dashboard)

**Settings:**
- Name: `david-gpt-frontend-2025` (or add random numbers)
- Branch: `main`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Instance Type: Free

**After deployment starts:**
1. Go to Environment tab
2. Add variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://[YOUR-BACKEND-URL].onrender.com/api` (use the URL from Step 2)
3. This will trigger a rebuild

---

## Step 4: Wait & Test (10 min)
Services will build and deploy. Monitor progress in the Render dashboard.

**Test your app:**
1. Visit your frontend URL
2. Create a task manually
3. Try AI task generation
4. Check health status (should show green checkmarks)

---

## 🎉 Done!
Your dashboard is live. Share the frontend URL to access from anywhere.