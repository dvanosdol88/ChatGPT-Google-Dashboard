#!/bin/bash

echo "🚀 Deploy to Render via API"
echo "=========================="
echo ""
echo "To deploy via API, you need a Render API key:"
echo ""
echo "1. Get your API key from: https://dashboard.render.com/u/settings/api-keys"
echo "2. Set it as environment variable:"
echo "   export RENDER_API_KEY=your-api-key-here"
echo ""
echo "3. Run this script again with the API key set"
echo ""

if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ RENDER_API_KEY not set"
    exit 1
fi

echo "✅ API key detected"
echo ""
echo "Creating services via Render API..."
echo ""

# Function to make API calls
render_api() {
    curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
         -H "Content-Type: application/json" \
         "$@"
}

# Get owner ID
echo "Getting account info..."
OWNER_ID=$(render_api "https://api.render.com/v1/owners" | jq -r '.[] | select(.owner.type == "user") | .owner.id' | head -1)

if [ -z "$OWNER_ID" ]; then
    echo "❌ Could not get owner ID. Check your API key."
    exit 1
fi

echo "Owner ID: $OWNER_ID"
echo ""

# Create PostgreSQL database
echo "Creating PostgreSQL database..."
DB_RESPONSE=$(render_api -X POST "https://api.render.com/v1/services" \
    -d @- <<EOF
{
  "type": "postgres",
  "name": "chatgpt-dashboard-db",
  "ownerId": "$OWNER_ID",
  "plan": "free",
  "region": "oregon",
  "postgres": {
    "databaseName": "chatgpt_dashboard",
    "databaseUser": "chatgpt_dashboard_user"
  }
}
EOF
)

DB_ID=$(echo "$DB_RESPONSE" | jq -r '.id')
if [ "$DB_ID" == "null" ] || [ -z "$DB_ID" ]; then
    echo "❌ Failed to create database"
    echo "$DB_RESPONSE" | jq .
    exit 1
fi

echo "✅ Database created: $DB_ID"
echo ""

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 30

# Get database connection string
DB_URL=$(render_api "https://api.render.com/v1/services/$DB_ID" | jq -r '.service.postgres.connectionString')

# Create backend service
echo "Creating backend service..."
BACKEND_RESPONSE=$(render_api -X POST "https://api.render.com/v1/services" \
    -d @- <<EOF
{
  "type": "web_service",
  "name": "chatgpt-dashboard-backend",
  "ownerId": "$OWNER_ID",
  "plan": "free",
  "region": "oregon",
  "runtime": "node",
  "repo": {
    "url": "https://github.com/dvanosdol88/ChatGPT-Google-Dashboard",
    "branch": "main",
    "buildCommand": "cd backend && npm install",
    "startCommand": "cd backend && npm start"
  },
  "envVars": [
    {"key": "DATABASE_URL", "value": "$DB_URL"},
    {"key": "NODE_ENV", "value": "production"},
    {"key": "PORT", "value": "5000"},
    {"key": "OPENAI_API_KEY", "value": "YOUR_OPENAI_KEY_HERE"}
  ]
}
EOF
)

BACKEND_ID=$(echo "$BACKEND_RESPONSE" | jq -r '.id')
if [ "$BACKEND_ID" == "null" ] || [ -z "$BACKEND_ID" ]; then
    echo "❌ Failed to create backend"
    echo "$BACKEND_RESPONSE" | jq .
    exit 1
fi

BACKEND_URL=$(echo "$BACKEND_RESPONSE" | jq -r '.service.serviceDetails.url')
echo "✅ Backend created: $BACKEND_URL"
echo ""

# Create frontend service
echo "Creating frontend service..."
FRONTEND_RESPONSE=$(render_api -X POST "https://api.render.com/v1/services" \
    -d @- <<EOF
{
  "type": "static_site",
  "name": "chatgpt-dashboard-frontend",
  "ownerId": "$OWNER_ID",
  "plan": "free",
  "region": "oregon",
  "repo": {
    "url": "https://github.com/dvanosdol88/ChatGPT-Google-Dashboard",
    "branch": "main",
    "buildCommand": "cd frontend && npm install && npm run build",
    "publishPath": "frontend/build"
  },
  "envVars": [
    {"key": "REACT_APP_API_URL", "value": "${BACKEND_URL}/api"}
  ]
}
EOF
)

FRONTEND_ID=$(echo "$FRONTEND_RESPONSE" | jq -r '.id')
if [ "$FRONTEND_ID" == "null" ] || [ -z "$FRONTEND_ID" ]; then
    echo "❌ Failed to create frontend"
    echo "$FRONTEND_RESPONSE" | jq .
    exit 1
fi

FRONTEND_URL=$(echo "$FRONTEND_RESPONSE" | jq -r '.service.serviceDetails.url')
echo "✅ Frontend created: $FRONTEND_URL"
echo ""

echo "🎉 Deployment initiated!"
echo ""
echo "Services created:"
echo "- Database: $DB_ID"
echo "- Backend: $BACKEND_URL"
echo "- Frontend: $FRONTEND_URL"
echo ""
echo "⚠️  IMPORTANT: Update your OpenAI API key"
echo "1. Go to $BACKEND_URL in Render dashboard"
echo "2. Update OPENAI_API_KEY environment variable"
echo ""
echo "It will take 5-10 minutes for the initial deployment to complete."