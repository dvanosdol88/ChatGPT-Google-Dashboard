# 🌐 Custom Domain Setup Guide

## Setting up dashboard.davidcfacfp.com on Render

### 1. Add Custom Domain in Render

1. Go to your **Frontend service** on Render Dashboard
2. Navigate to **Settings** → **Custom Domains**
3. Click **Add Custom Domain**
4. Enter: `dashboard.davidcfacfp.com`
5. Render will provide DNS records to configure

### 2. Configure DNS Records

You'll need to add one of these options to your domain's DNS settings:

#### Option A: CNAME Record (Recommended for subdomains)
```
Type: CNAME
Name: dashboard
Value: chatgpt-dashboard-frontend.onrender.com
TTL: 300 (or default)
```

#### Option B: A Record (If CNAME doesn't work)
```
Type: A
Name: dashboard
Value: [Render's IP address - provided in dashboard]
TTL: 300 (or default)
```

### 3. Update Backend API URL

The frontend is already configured to use the backend API dynamically. However, if you need to update it:

1. In Render, go to your **Frontend service**
2. Navigate to **Environment** → **Environment Variables**
3. Update or add:
   ```
   REACT_APP_API_URL=https://chatgpt-dashboard-backend.onrender.com/api
   ```

### 4. SSL Certificate

Render automatically provisions and manages SSL certificates for custom domains. This process can take 10-30 minutes after DNS propagation.

### 5. DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate globally
- You can check propagation status at: https://www.whatsmydns.net/
- Search for: `dashboard.davidcfacfp.com`

### 6. Testing Your Custom Domain

Once DNS has propagated and SSL is ready:

1. Visit: https://dashboard.davidcfacfp.com
2. Verify SSL certificate (padlock icon in browser)
3. Test all functionality:
   - Gmail widget (10 recent emails)
   - Calendar events
   - Google Drive integration
   - Document management
   - Tasks and lists

### 7. Troubleshooting

#### "Domain not verified" error
- Ensure DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Click "Verify" again in Render dashboard

#### SSL Certificate pending
- This is normal and can take 10-30 minutes
- Render will automatically provision the certificate

#### API calls failing from custom domain
- Check browser console for CORS errors
- Verify backend CORS settings include your custom domain
- Backend should already be configured to accept requests from dashboard.davidcfacfp.com

### 8. Google OAuth Redirect URI

Don't forget to add your custom domain to Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client
4. Add to **Authorized JavaScript origins**:
   - `https://dashboard.davidcfacfp.com`
5. Add to **Authorized redirect URIs**:
   - `https://dashboard.davidcfacfp.com/auth/google/callback`
6. Save changes

### 9. Final Checklist

- [ ] Custom domain added in Render
- [ ] DNS records configured (CNAME or A record)
- [ ] DNS propagation complete
- [ ] SSL certificate active
- [ ] Google OAuth updated with new domain
- [ ] All features working on custom domain

## Celebrate! 🎉

Once everything is working, you'll have your professional dashboard at:
**https://dashboard.davidcfacfp.com**

The dashboard will display:
- 📧 Your 10 most recent Gmail messages
- 📅 Upcoming calendar events
- 📄 Document management system
- ✅ Tasks from Google Drive
- 📝 Custom lists
- 🔗 Quick access to ChatGPT