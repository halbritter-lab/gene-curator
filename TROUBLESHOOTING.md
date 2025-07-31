# Gene Curator Troubleshooting Guide

## Common Issues and Solutions

### 🚨 Frontend Issues

#### **"403 Forbidden" on Statistics Endpoint**
```
GET http://localhost:8000/api/v1/genes/statistics 403 (Forbidden)
```

**Solution:** ✅ **FIXED** - Statistics endpoint no longer requires authentication.
- The statistics endpoint was requiring authentication but should be public
- Fixed by removing auth requirement from `/api/v1/genes/statistics`

#### **"422 Unprocessable Entity" on Login**
```
POST http://localhost:8000/api/v1/auth/login 422 (Unprocessable Entity)
```

**Solution:** ✅ **FIXED** - Login now sends correct JSON format.
- Frontend was sending form data instead of JSON
- Backend expects `{"email": "...", "password": "..."}`
- Fixed by updating frontend auth API to send JSON

#### **Windows Line Ending Issues in Scripts**
```
start-dev.sh: line 2: \r': command not found
```

**Solution:**
```bash
dos2unix start-dev.sh
# OR recreate the script with Unix line endings
```

### 🐳 Docker Issues

#### **Backend Container Won't Start**
```bash
# Check logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs backend

# Common fixes:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres backend
```

#### **Database Connection Issues**
```bash
# Check database health
docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps

# Reset database if needed
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

#### **Port Already in Use**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Check what's using the port
lsof -i :3000  # or :8000, :5433
# Kill the process or use different ports
```

### 🔧 Frontend Development Issues

#### **Node Modules Issues**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### **Vite Build Errors**
```bash
# Clear Vite cache
rm -rf frontend/.vite
npm run dev
```

#### **ESLint/Build Errors**
```bash
# Fix linting issues
npm run lint
# Or disable temporarily by updating vite.config.js
```

### 🔑 Authentication Issues

#### **Login Not Working**
1. Check credentials:
   - Admin: `admin@gene-curator.dev` / `admin123`
   - Curator: `curator@gene-curator.dev` / `curator123`
   - Viewer: `viewer@gene-curator.dev` / `viewer123`

2. Verify backend is running:
   ```bash
   curl http://localhost:8000/api/v1/health
   # Should return: {"status": "healthy", ...}
   ```

3. Check browser console for network errors

#### **Token Expired Issues**
- The app should automatically refresh tokens
- If stuck, logout and login again
- Clear browser storage: `localStorage.clear()`

### 🗄️ Database Issues

#### **No Data Showing**
```bash
# Check if database has data
docker exec gene_curator_db psql -U dev_user -d gene_curator_dev -c "SELECT COUNT(*) FROM genes;"

# Should show 8 genes
# If 0, run seed script:
docker exec gene_curator_db psql -U dev_user -d gene_curator_dev -f /docker-entrypoint-initdb.d/003_seed_data.sql
```

#### **Database Permission Errors**
```bash
# Reset database with fresh data
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres
# Wait for database to initialize, then start backend
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend
```

### 🌐 Network/Proxy Issues

#### **Corporate Proxy Blocking Requests**
If you see German error pages or "Zugriff verweigert":

1. **Bypass proxy for local development:**
   ```bash
   export NO_PROXY="localhost,127.0.0.1,0.0.0.0"
   export no_proxy="localhost,127.0.0.1,0.0.0.0"
   ```

2. **Use Docker internal networking:**
   - Frontend should use `http://backend:8000` in production
   - Keep `http://localhost:8000` for development

3. **Test from inside containers:**
   ```bash
   # Test backend from inside
   docker exec gene_curator_api curl http://localhost:8000/api/v1/health
   ```

### 📊 Debugging Commands

#### **Check Service Status**
```bash
# All services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps

# Specific service logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f postgres
```

#### **Test API Endpoints**
```bash
# Health check
docker exec gene_curator_api python -c "import requests; print(requests.get('http://localhost:8000/api/v1/health').json())"

# Database connection
docker exec gene_curator_db psql -U dev_user -d gene_curator_dev -c "SELECT version();"

# Gene count
docker exec gene_curator_db psql -U dev_user -d gene_curator_dev -c "SELECT COUNT(*) FROM genes;"
```

#### **Frontend Debug Mode**
```bash
# Start with debug output
cd frontend
VITE_DEBUG=true npm run dev

# Check browser console (F12)
# Check Network tab for failed requests
```

### 🔄 Reset Everything

If nothing works, nuclear option:

```bash
# Stop everything
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v

# Remove all containers and volumes
docker system prune -f
docker volume prune -f

# Restart from scratch
cd frontend && rm -rf node_modules package-lock.json
npm install
cd ..
./start-dev.sh
```

### 📞 Getting Help

1. **Check logs first:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=50
   ```

2. **Include in bug reports:**
   - Docker version: `docker --version`
   - Node version: `node --version`
   - Operating system
   - Complete error messages
   - Steps to reproduce

3. **Useful debug info:**
   ```bash
   # System info
   docker info
   docker-compose version
   
   # Service status
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps
   
   # Port usage
   netstat -tulpn | grep -E ':(3000|8000|5433)'
   ```