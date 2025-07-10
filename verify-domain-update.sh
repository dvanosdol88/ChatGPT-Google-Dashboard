#!/bin/bash

echo "Verifying custom domain update..."
echo "================================"

echo -e "\n1. Testing dashboard.davidcfacfp.com..."
response=$(curl -s https://dashboard.davidcfacfp.com | grep -o 'chatgpt-dashboard-backend\|calendar-backend' | head -1)

if [[ $response == *"chatgpt-dashboard-backend"* ]]; then
    echo "✅ SUCCESS! Domain now points to ChatGPT Dashboard"
    echo "   Backend: chatgpt-dashboard-backend.onrender.com"
else
    echo "❌ STILL POINTING TO OLD SERVICE"
    echo "   Current backend: $response"
    echo "   DNS may still be propagating. Try again in 5-10 minutes."
fi

echo -e "\n2. Checking response headers..."
curl -I https://dashboard.davidcfacfp.com 2>/dev/null | grep -E "(server|location)" | head -3

echo -e "\n3. Testing API endpoint..."
api_test=$(curl -s https://dashboard.davidcfacfp.com | grep -o 'API_BASE_URL[^;]*' | head -1)
echo "   $api_test"

echo -e "\nDone!"