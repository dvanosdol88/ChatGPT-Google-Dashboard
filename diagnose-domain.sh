#!/bin/bash

echo "🔍 Domain Diagnostic for dashboard.davidcfacfp.com"
echo "================================================="

echo -e "\n📍 Current Content Check:"
echo "What's being served at the domain:"
curl -s https://dashboard.davidcfacfp.com | grep -E "(chatgpt|calendar|Dashboard)" | head -5

echo -e "\n🌐 DNS Resolution (via HTTP headers):"
curl -I https://dashboard.davidcfacfp.com 2>&1 | grep -E "(location|server|cf-)" | head -10

echo -e "\n✅ What SHOULD be served:"
echo "New dashboard features:"
curl -s https://chatgpt-dashboard-frontend.onrender.com | grep -o "<title>[^<]*" | head -1

echo -e "\n📋 Quick Actions:"
echo "1. In Cloudflare: Set DNS to 'DNS only' (gray cloud) not 'Proxied'"
echo "2. In Render: Add dashboard.davidcfacfp.com to your frontend service"
echo "3. Clear Cloudflare cache after DNS changes"
echo "4. If using Cloudflare proxy, create a Page Rule to bypass for this subdomain"

echo -e "\n🔗 Direct Links to Test:"
echo "Old (current): https://dashboard.davidcfacfp.com"
echo "New (target): https://chatgpt-dashboard-frontend.onrender.com"