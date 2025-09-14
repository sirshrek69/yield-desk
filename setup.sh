#!/bin/bash

# Tokenised Fixed Income MVP Setup Script

set -e

echo "🚀 Setting up Tokenised Fixed Income MVP..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build SDK
echo "🔨 Building SDK..."
cd packages/sdk
pnpm build
cd ../..

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env with your private key and RPC URL"
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Update .env with your configuration"
echo "   2. Run 'pnpm dev' to start all services"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation: See README.md for more details"
