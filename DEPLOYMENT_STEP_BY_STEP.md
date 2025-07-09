# 🚀 Step-by-Step Deployment Guide

## Overview
This guide will walk you through deploying your ChatGPT-Google Dashboard with all the new features:
- 📧 10 most recent Gmail messages
- 📁 5 most recently modified Google Drive files
- 📄 Document capture and management
- 🌐 Custom domain (dashboard.davidcfacfp.com)

## Prerequisites Checklist
Before starting, ensure you have:
- [ ] GitHub repository with latest code
- [ ] Render account
- [ ] Google Cloud Console access
- [ ] Domain control panel access (for DNS)

---

## Step 1: Push Latest Code to GitHub

```bash
# Check current status
git status

# If you have any uncommitted changes
git add -A
git commit -m "Prepare for deployment"

# Push to GitHub
git push origin main
```

✅ **Verify**: Check https://github.com/dvanosdol88/ChatGPT-Google-Dashboard that all changes are pushed

---

## Step 2: Configure Google Cloud Console

### 2.1 Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Enable these APIs:
   - ✅ Gmail API
   - ✅ Google Drive API
   - ✅ Google Calendar API

### 2.2 Update OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Add these scopes if not already present:
   ```
   - .../auth/gmail.readonly
   - .../auth/drive.readonly
   - .../auth/calendar.readonly
   ```

### 2.3 Update OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   ```
   https://dashboard.davidcfacfp.com
   https://chatgpt-dashboard-frontend.onrender.com
   http://localhost:3000
   ```
4. Add to **Authorized redirect URIs**:
   ```
   https://dashboard.davidcfacfp.com/auth/google/callback
   https://chatgpt-dashboard-frontend.onrender.com/auth/google/callback
   http://localhost:3000/auth/google/callback
   ```
5. **Save** changes

### 2.4 Get Your Refresh Token

If you don't have a refresh token yet, you'll need to generate one:
1. Use the OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
2. Select the required scopes
3. Authorize and get your refresh token

---

## Step 3: Deploy to Render

### 3.1 Go to Render Dashboard

1. Log in to [Render](https://dashboard.render.com)
2. Navigate to your services

### 3.2 Update Environment Variables

Go to each service (backend) and add/verify these environment variables:

#### Required Environment Variables:
```bash
# Database (auto-configured by Render)
DATABASE_URL=[auto-generated]

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_REDIRECT_URI=https://dashboard.davidcfacfp.com/auth/google/callback

# Google API Credentials (if using service account)
GOOGLE_API_CREDENTIALS={"type":"service_account"...}

# Drive File IDs (for tasks/lists)
DRIVE_WORK_TASKS_FILE_ID=your_file_id
DRIVE_PERSONAL_TASKS_FILE_ID=your_file_id
DRIVE_SHOPPING_LIST_FILE_ID=your_file_id
DRIVE_READING_LIST_FILE_ID=your_file_id
DRIVE_PROJECTS_LIST_FILE_ID=your_file_id

# OpenAI (if using AI features)
OPENAI_API_KEY=your_openai_key_here
```

### 3.3 Trigger Manual Deploy

1. Go to your **Backend service**
2. Click **Manual Deploy** > **Deploy latest commit**
3. Wait for build to complete (watch logs)
4. Repeat for **Frontend service**

### 3.4 Verify Services are Running

- Backend: https://chatgpt-dashboard-backend.onrender.com/api/health
- Frontend: https://chatgpt-dashboard-frontend.onrender.com

---

## Step 4: Configure Custom Domain

### 4.1 Add Custom Domain in Render

1. Go to your **Frontend service** in Render
2. Navigate to **Settings** > **Custom Domains**
3. Click **Add Custom Domain**
4. Enter: `dashboard.davidcfacfp.com`
5. Copy the DNS configuration shown

### 4.2 Configure DNS Records

Go to your domain registrar's DNS management:

1. Add a CNAME record:
   ```
   Type: CNAME
   Name: dashboard
   Value: chatgpt-dashboard-frontend.onrender.com
   TTL: 300
   ```

2. Save DNS changes

### 4.3 Wait for DNS Propagation

- This can take 5 minutes to 48 hours
- Check status at: https://www.whatsmydns.net/
- Search for: `dashboard.davidcfacfp.com`

### 4.4 Verify Domain in Render

1. Go back to Render > Custom Domains
2. Click **Verify** next to your domain
3. Wait for SSL certificate (10-30 minutes)

---

## Step 5: Test Everything

### 5.1 Basic Functionality Test

Visit https://dashboard.davidcfacfp.com and verify:

- [ ] Page loads without errors
- [ ] OpenAI logo in top right links to ChatGPT
- [ ] All widgets are visible

### 5.2 Gmail Integration Test

- [ ] Gmail widget shows "Loading emails..."
- [ ] 10 most recent emails appear
- [ ] Clicking an email opens it in Gmail
- [ ] Unread indicators (blue dots) show correctly
- [ ] Time stamps are formatted correctly

### 5.3 Google Drive Integration Test

- [ ] Drive widget shows "Recent Files"
- [ ] 5 most recent files are displayed
- [ ] File icons match file types
- [ ] Clicking a file opens it in Drive
- [ ] File metadata (size, modified time) displays

### 5.4 Document Management Test

- [ ] Document capture tab opens
- [ ] Can drag/drop or select files
- [ ] Document search works
- [ ] Files upload to correct Drive folders

### 5.5 Tasks and Lists Test

- [ ] Work tasks load from Drive (or show config message)
- [ ] Personal tasks load from Drive
- [ ] Lists dropdown works
- [ ] "Edit in Google Drive" buttons work

---

## Step 6: Troubleshooting

### If Gmail isn't working:

1. Check browser console for errors
2. Verify in Render logs:
   ```
   GET /api/google/gmail/messages
   ```
3. Common issues:
   - Missing GOOGLE_REFRESH_TOKEN
   - Gmail API not enabled
   - Incorrect scopes

### If Drive files don't show:

1. Check the endpoint:
   ```
   GET /api/google/drive/recent-files
   ```
2. Verify:
   - Drive API is enabled
   - OAuth token has drive.readonly scope
   - No CORS errors

### If custom domain doesn't work:

1. Check DNS propagation
2. Verify CNAME record
3. Wait for SSL certificate
4. Check Render domain status

### If API calls fail with CORS:

1. Check backend CORS configuration includes your domain
2. Verify frontend is using correct API URL
3. Check browser network tab for exact error

---

## Step 7: Create Google Drive Files for Tasks/Lists

1. Go to [Google Drive](https://drive.google.com)
2. Create these markdown files:
   - `work-tasks.md`
   - `personal-tasks.md`
   - `shopping-list.md`
   - `reading-list.md`
   - `projects-list.md`

3. Get each file's ID:
   - Open the file
   - Copy ID from URL: `https://docs.google.com/document/d/[FILE_ID]/edit`

4. Add these IDs to Render environment variables

---

## Step 8: Final Verification

### Production Checklist:
- [ ] Custom domain loads with HTTPS
- [ ] All Google APIs return data
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] All external links open correctly

### Performance Check:
- [ ] Page loads in < 3 seconds
- [ ] API calls complete quickly
- [ ] No memory leaks in console

---

## 🎉 Congratulations!

Your dashboard is now live at:
### https://dashboard.davidcfacfp.com

## Next Steps:

1. **Monitor**: Check Render logs regularly
2. **Backup**: Set up automated backups
3. **Analytics**: Add Google Analytics (optional)
4. **Enhance**: Add more widgets as needed

## Support Resources:

- **Render Status**: https://status.render.com
- **Google Cloud Console**: https://console.cloud.google.com
- **GitHub Issues**: https://github.com/dvanosdol88/ChatGPT-Google-Dashboard/issues

---

## Quick Commands Reference:

```bash
# Check deployment status
git log --oneline -5

# View Render logs (install Render CLI first)
render logs -s chatgpt-dashboard-backend
render logs -s chatgpt-dashboard-frontend

# Test API endpoints
curl https://chatgpt-dashboard-backend.onrender.com/api/health
```

Good luck with your deployment! 🚀