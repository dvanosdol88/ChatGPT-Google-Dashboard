# Fix Custom Domain Assignment

## Quick Fix Steps

Your domain `dashboard.davidcfacfp.com` is currently assigned to the wrong Render service. Here's how to fix it:

### Option 1: Using Render Dashboard (Easiest)

1. **Login to Render Dashboard**: https://dashboard.render.com

2. **Find and Remove Domain from Wrong Service**:
   - Look for service: `calendar-backend-xwk6` (or any service showing "Personal Dashboard - David CFP")
   - Go to Settings → Custom Domains
   - Find `dashboard.davidcfacfp.com`
   - Click "Remove"

3. **Add Domain to Correct Service**:
   - Find service: `chatgpt-dashboard-frontend`
   - Go to Settings → Custom Domains
   - Click "Add Custom Domain"
   - Enter: `dashboard.davidcfacfp.com`
   - Click "Verify"

### Option 2: Using Render CLI

If you have Render CLI authenticated:

```bash
# List all services
render services list

# Find the service ID for calendar-backend
# Then remove the custom domain:
render custom-domains remove dashboard.davidcfacfp.com --service-id [calendar-backend-service-id]

# Add domain to correct service:
render custom-domains add dashboard.davidcfacfp.com --service-id [chatgpt-dashboard-frontend-service-id]
```

### Verification

After making changes, run:
```bash
./verify-domain-update.sh
```

You should see:
```
✅ SUCCESS! Domain now points to ChatGPT Dashboard
```

### Why This Happened

Render only allows one service to use a custom domain. When someone deployed the calendar-backend service and assigned the domain to it, it automatically removed the domain from your ChatGPT dashboard.

### Current Services

- ❌ `dashboard.davidcfacfp.com` → Points to old calendar-backend
- ✅ `chatgpt-dashboard-frontend.onrender.com` → Your full-featured dashboard
- ✅ `chatgpt-dashboard-backend.onrender.com` → Your API backend