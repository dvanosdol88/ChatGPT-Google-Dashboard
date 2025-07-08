# 🚀 Quick Deploy to Render - 5 Minutes

## Step 1: Click Deploy Button
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/dvanosdol88/ChatGPT-Google-Dashboard)

## Step 2: Connect GitHub
- Sign in to Render
- Authorize GitHub access
- Select your forked repository

## Step 3: Add Your OpenAI Key
When prompted for environment variables:
- **OPENAI_API_KEY**: `sk-...` (required)
- Leave Google credentials empty for now

## Step 4: Deploy
- Click "Apply"
- Wait 5-10 minutes for deployment
- You'll get 2 URLs:
  - Backend: `https://chatgpt-dashboard-backend-xxx.onrender.com`
  - Frontend: `https://chatgpt-dashboard-frontend-xxx.onrender.com`

## Step 5: Configure Frontend
1. Go to your frontend service in Render
2. Environment > Add Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://chatgpt-dashboard-backend-xxx.onrender.com/api`
3. Click "Save Changes" (triggers redeploy)

## Done! 🎉
Visit your frontend URL to start using the dashboard.

### Test Your Deployment:
- ✓ Create tasks manually
- ✓ Generate tasks with AI
- ✓ Create and manage lists
- ✓ Check health status (should show all green)

### Troubleshooting:
- **Tasks not saving?** Check backend logs in Render dashboard
- **AI not working?** Verify your OpenAI API key is correct
- **Frontend errors?** Ensure REACT_APP_API_URL is set correctly

### Next Steps:
- Add Google OAuth for Drive/Gmail/Calendar integration
- Customize the UI to your preferences
- Enable automatic backups in Render