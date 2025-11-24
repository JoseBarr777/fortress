#!/bin/bash

# Development startup script for Fortress App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Fortress App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

# Start development environment (detached to run migrations)
docker compose -f docker-compose.dev.yml up --build -d

# Wait for the database to be ready
echo "⏳ Waiting for the database to be ready..."
for i in {1..30}; do
    if docker compose -f docker-compose.dev.yml exec -T neon-local pg_isready -h localhost -p 5432 -U neon >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "   Attempt $i/30..."
    sleep 2
done

# Run migrations with Drizzle inside the container
echo "📜 Applying latest schema with Drizzle..."
docker compose -f docker-compose.dev.yml exec -T app npm run db:migrate

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:3000"
echo "   Database: postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "Useful commands:"
echo "   View logs: docker compose -f docker-compose.dev.yml logs -f"
echo "   Stop app: docker compose -f docker-compose.dev.yml down"
echo ""
echo "Following application logs (Ctrl+C to exit)..."
docker compose -f docker-compose.dev.yml logs -f app