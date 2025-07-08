#!/bin/bash

echo "🚀 Setting up ChatGPT-Google Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your credentials"
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Update backend/.env with your credentials"
echo "2. In one terminal: cd backend && npm start"
echo "3. In another terminal: cd frontend && npm start"
echo "4. Open http://localhost:3000 in your browser"