#!/bin/bash
# Test script to verify the Gene Curator setup

set -e

echo "🧬 Gene Curator Setup Verification"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose files exist
if [[ ! -f "docker-compose.yml" || ! -f "docker-compose.dev.yml" ]]; then
    echo "❌ Docker Compose files not found"
    exit 1
fi

echo "✅ Docker Compose files found"

# Check if database SQL files exist
if [[ ! -f "database/sql/001_initial_schema.sql" ]]; then
    echo "❌ Database schema files not found"
    exit 1
fi

echo "✅ Database schema files found"

# Check if backend structure exists
if [[ ! -f "backend/app/main.py" ]]; then
    echo "❌ Backend application files not found"
    exit 1
fi

echo "✅ Backend application structure found"

# Check if Makefile exists
if [[ ! -f "Makefile" ]]; then
    echo "❌ Makefile not found"
    exit 1
fi

echo "✅ Makefile found"

# Start the development environment
echo ""
echo "🚀 Starting development environment..."
echo "This may take a few minutes on first run..."

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
if ! docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "❌ Services failed to start"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs
    exit 1
fi

echo "✅ Services are running"

# Test database connection
echo ""
echo "🗄️  Testing database connection..."
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T postgres pg_isready -U dev_user -d gene_curator_dev > /dev/null 2>&1; then
    echo "✅ Database is accessible"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Test API health endpoint
echo ""
echo "🔧 Testing API health..."
sleep 10  # Give API time to start

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ API is responding"
    
    # Test detailed health check
    if curl -s http://localhost:8000/api/v1/health/detailed | grep -q "healthy"; then
        echo "✅ API health check passed"
    else
        echo "❌ API health check failed"
    fi
else
    echo "❌ API is not responding"
    echo "Backend logs:"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs backend
fi

# Test ClinGen scoring system
echo ""
echo "🧬 Testing ClinGen scoring system..."
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T postgres psql -U dev_user -d gene_curator_dev -c "SELECT calculate_genetic_evidence_score('{\"genetic_evidence\": {\"case_level_data\": []}}');" > /dev/null 2>&1; then
    echo "✅ ClinGen scoring functions are working"
else
    echo "❌ ClinGen scoring functions failed"
fi

# Test sample data
echo ""
echo "📊 Testing sample data..."
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T postgres psql -U dev_user -d gene_curator_dev -c "SELECT approved_symbol FROM genes WHERE approved_symbol = 'PKD1';" | grep -q "PKD1"; then
    echo "✅ Sample data is loaded"
else
    echo "❌ Sample data not found"
fi

echo ""
echo "🎉 Setup verification complete!"
echo ""
echo "Access your services at:"
echo "  • API Documentation: http://localhost:8000/docs"
echo "  • API Health: http://localhost:8000/health"
echo "  • Database: localhost:5433 (dev_user/dev_password)"
echo ""
echo "Common commands:"
echo "  • View logs: make dev-logs"
echo "  • Stop services: make dev-down"
echo "  • Database shell: make db-shell"
echo ""
echo "✨ Gene Curator is ready for development!"