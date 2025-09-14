#!/bin/bash

# Yield Desk Deployment Script
echo "🚀 Deploying Yield Desk to production..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to project root
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
cd apps/web
npm run build

# Go back to root
cd ../..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://yield-desk.com"
echo ""
echo "📋 Next steps:"
echo "1. Go to Vercel Dashboard to configure your domain"
echo "2. Update DNS records for yield-desk.com"
echo "3. Wait for DNS propagation (24-48 hours)"
echo "4. Test your live site!"
