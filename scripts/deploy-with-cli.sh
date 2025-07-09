#!/bin/bash

echo "🚀 Deploying ChatGPT-Google Dashboard with Render CLI"
echo "===================================================="
echo ""

# Check if render CLI is logged in
if ! render whoami &>/dev/null; then
    echo "❌ You're not logged in to Render CLI"
    echo "Please run: render login"
    exit 1
fi

echo "✅ Logged in to Render CLI"
echo ""

# Get workspace info
echo "Current workspace:"
render whoami
echo ""

echo "⚠️  IMPORTANT: Manual deployment steps required"
echo "=============================================="
echo ""
echo "Since Render CLI doesn't support blueprint deployment directly,"
echo "please use the Render Dashboard to deploy:"
echo ""
echo "1. Open https://dashboard.render.com/blueprints"
echo "2. Click 'New Blueprint Instance'"
echo "3. Connect your GitHub repo: dvanosdol88/ChatGPT-Google-Dashboard"
echo "4. Select branch: main"
echo "5. Add environment variables when prompted:"
echo "   - OPENAI_API_KEY = [Your OpenAI API key]"
echo ""
echo "The render.yaml file has been fixed and will create:"
echo "- PostgreSQL database (free tier)"
echo "- Backend Node.js service"
echo "- Frontend static site"
echo ""
echo "Alternative: Manual creation via Dashboard"
echo "========================================="
echo ""
echo "If blueprint still fails, create services manually:"
echo ""
echo "1. Create PostgreSQL Database:"
echo "   - Name: chatgpt-dashboard-db"
echo "   - Database: chatgpt_dashboard"
echo "   - User: chatgpt_dashboard_user"
echo ""
echo "2. Create Backend Web Service:"
echo "   - Repo: https://github.com/dvanosdol88/ChatGPT-Google-Dashboard"
echo "   - Name: chatgpt-dashboard-backend"
echo "   - Root Directory: backend"
echo "   - Build: npm install"
echo "   - Start: npm start"
echo "   - Environment variables:"
echo "     DATABASE_URL = [from PostgreSQL]"
echo "     OPENAI_API_KEY = [your key]"
echo "     PORT = 5000"
echo ""
echo "3. Create Frontend Static Site:"
echo "   - Same repo"
echo "   - Name: chatgpt-dashboard-frontend"
echo "   - Root Directory: frontend"
echo "   - Build: npm install && npm run build"
echo "   - Publish: build"
echo "   - After deploy, add env var:"
echo "     REACT_APP_API_URL = [backend URL]/api"
echo ""
echo "Press Enter to open Render Dashboard..."
read -p ""

# Open dashboard
if command -v xdg-open &> /dev/null; then
    xdg-open "https://dashboard.render.com/blueprints"
elif command -v open &> /dev/null; then
    open "https://dashboard.render.com/blueprints"
else
    echo "Please open https://dashboard.render.com/blueprints manually"
fi