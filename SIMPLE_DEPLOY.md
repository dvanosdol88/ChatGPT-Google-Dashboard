# Deploy in 3 Simple Steps

## Step 1: Create Database
Go to: https://dashboard.render.com/new/database

Fill in:
```
Name: [Pick ANY unique name, like: myapp-db-12345]
Database Name: chatgpt_dashboard
User: chatgpt_dashboard_user
Region: Oregon (US West)
Plan: Free
```

Click "Create Database"

**IMPORTANT:** After it's created, copy the "External Database URL" - you'll need it!

---

## Step 2: Create Backend
Go to: https://dashboard.render.com/new/web-service

1. Connect your GitHub and select: `dvanosdol88/ChatGPT-Google-Dashboard`
2. Fill in:
```
Name: [Pick ANY unique name, like: myapp-backend-12345]
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

3. Scroll down to "Environment Variables" and add:
```
DATABASE_URL = [Paste the database URL from Step 1]
OPENAI_API_KEY = rnd_IwCrq0zq4qCyGc4fP6hLBQgd5nLW
PORT = 5000
NODE_ENV = production
```

Click "Create Web Service"

**IMPORTANT:** Copy the URL after it's created (like https://myapp-backend-12345.onrender.com)

---

## Step 3: Create Frontend
Go to: https://dashboard.render.com/new/static-site

1. Select same repository: `dvanosdol88/ChatGPT-Google-Dashboard`
2. Fill in:
```
Name: [Pick ANY unique name, like: myapp-frontend-12345]
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

3. Click "Create Static Site"

4. **AFTER it starts building**, go to "Environment" tab and add:
```
REACT_APP_API_URL = [Your backend URL from Step 2]/api
```
Example: If your backend is https://myapp-backend-12345.onrender.com
Then use: https://myapp-backend-12345.onrender.com/api

---

## That's it! 
Wait 10-15 minutes for everything to build and deploy.
Then visit your frontend URL to use your app!