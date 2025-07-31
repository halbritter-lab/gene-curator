#!/bin/bash

# Gene Curator Development Environment Startup Script

echo "🧬 Starting Gene Curator Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start backend services (database and API)
echo "🚀 Starting backend services (PostgreSQL + FastAPI)..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres backend

# Wait for backend to be healthy
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Check backend health
if docker exec gene_curator_api python -c "import requests; print('OK') if requests.get('http://localhost:8000/api/v1/health').status_code == 200 else exit(1)" > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "❌ Backend is not responding. Check logs with: docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs backend"
    exit 1
fi

# Start frontend development server
echo "🎨 Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Gene Curator is now running!"
echo ""
echo "📍 Access Points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo "   Database:  postgresql://dev_user:dev_password@localhost:5433/gene_curator_dev"
echo ""
echo "🔑 Development Login Credentials:"
echo "   Admin:     admin@gene-curator.dev / admin123"
echo "   Curator:   curator@gene-curator.dev / curator123"
echo "   Viewer:    viewer@gene-curator.dev / viewer123"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f"
echo "   Stop all:     docker-compose -f docker-compose.yml -f docker-compose.dev.yml down"
echo "   Restart API:  docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart backend"
echo ""
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $FRONTEND_PID 2>/dev/null
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
    echo "✅ All services stopped."
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Wait for user to stop
wait $FRONTEND_PID