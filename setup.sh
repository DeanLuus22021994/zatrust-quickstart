#!/bin/bash
set -e

echo "🚀 Zatrust Quickstart - Turnkey Setup"
echo "======================================"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    echo "   Please install Docker Desktop and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is required but not available."
    echo "   Please install Docker Desktop with Compose support."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Ask user what they want to do
echo ""
echo "Choose setup option:"
echo "1) Development environment (VS Code DevContainer)"
echo "2) Production deployment"
echo "3) Local development (requires Node.js)"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up development environment..."
        docker compose up -d dev
        echo ""
        echo "✅ Development container is running!"
        echo "📋 Next steps:"
        echo "   1. Open this folder in VS Code"
        echo "   2. Install 'Dev Containers' extension if not already installed"
        echo "   3. Command Palette (Ctrl/Cmd+Shift+P) → 'Dev Containers: Reopen in Container'"
        echo "   4. VS Code will automatically install dependencies and setup the environment"
        echo "   5. Run 'npm run dev' in the VS Code terminal"
        echo "   6. Visit http://localhost:3000"
        ;;
    2)
        echo ""
        echo "🏗️  Building and deploying production environment..."
        docker compose -f docker-compose.prod.yml up -d --build
        echo ""
        echo "✅ Production deployment complete!"
        echo "🌐 Application is running at: http://localhost:3000"
        echo "🏥 Health check: docker compose -f docker-compose.prod.yml ps"
        echo "🛑 To stop: docker compose -f docker-compose.prod.yml down"
        ;;
    3)
        echo ""
        echo "🔧 Setting up local development..."
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js is required but not installed."
            echo "   Please install Node.js 20+ and try again."
            exit 1
        fi
        
        echo "📦 Installing dependencies..."
        npm install
        
        echo ""
        echo "✅ Local development setup complete!"
        echo "📋 Next steps:"
        echo "   1. Run 'npm run dev' to start the development server"
        echo "   2. Visit http://localhost:3000"
        echo "   3. Run 'npm run test:e2e' to run tests (after installing Playwright browsers)"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete! Happy coding!"