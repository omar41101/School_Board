# Docker Development Environment - Testing Optimized

## ⚡ What's Optimized for Testing

### 🚀 Super Fast Startup
- **No MongoDB authentication** - Saves 2-3 seconds on startup
- **Simplified health checks** - Faster container ready state
- **Cached npm packages** - Rebuild in seconds, not minutes
- **Delegated volumes** - Better performance on Windows/Mac

### 🐛 Easy Debugging
- **Node.js debug port exposed** - Port 9229 for VS Code/Chrome DevTools
- **Hot reload enabled** - Code changes auto-restart server
- **Full logs accessible** - Mounted to `./logs` folder
- **Debug mode enabled** - All console logs visible
- **No auth on Mongo Express** - Instant database access

### 🛠️ Developer Experience
- **All dependencies installed** - Including devDependencies
- **Source code mounted** - Edit locally, changes reflect instantly
- **More resources allocated** - 2 CPU cores, 2GB RAM
- **Development mode** - `NODE_ENV=development`

---

## 🎯 Quick Start

```powershell
# Start everything
docker-compose up -d

# View logs in real-time
docker-compose logs -f backend

# Stop everything
docker-compose down
```

**Services:**
- Backend API: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs
- MongoDB: localhost:27017 (no password!)
- Mongo Express: http://localhost:8081 (no login!)
- Debug Port: localhost:9229

---

## 🐛 VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach to Node",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}/src",
      "remoteRoot": "/app/src",
      "protocol": "inspector",
      "restart": true
    }
  ]
}
```

**Usage:**
1. Start containers: `docker-compose up -d`
2. Press F5 in VS Code
3. Set breakpoints
4. Debug like normal!

---

## 🔥 Hot Reload in Action

```powershell
# Start services
docker-compose up -d

# Edit any file in /src
# Server auto-restarts
# Check logs to see restart
docker-compose logs -f backend
```

---

## 💾 Database Management

### Connect with Any Tool (No Password!)

**MongoDB URI:**
```
mongodb://localhost:27017/school_management
```

**Mongo Express (Web UI):**
```
http://localhost:8081
# No login required!
```

**MongoDB Compass:**
```
mongodb://localhost:27017/school_management
```

---

## ⚡ Speed Optimizations

### First Run (Initial Build)
```powershell
docker-compose build --parallel
docker-compose up -d
```
Time: ~30-60 seconds

### Subsequent Runs (Already Built)
```powershell
docker-compose up -d
```
Time: ~5-10 seconds

### After Code Changes (No Rebuild Needed!)
Code changes trigger auto-restart via nodemon.
Time: ~1-2 seconds

### After package.json Changes
```powershell
docker-compose build backend --no-cache
docker-compose up -d
```
Time: ~20-30 seconds

---

## 🧪 Perfect for CI/CD

### GitHub Actions Example
```yaml
name: Test API

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start services
        run: docker-compose up -d
      
      - name: Wait for healthy services
        run: |
          timeout 30 sh -c 'until docker-compose exec -T backend curl -f http://localhost:5000/health; do sleep 1; done'
      
      - name: Run tests
        run: docker-compose exec -T backend npm test
      
      - name: Tear down
        run: docker-compose down
```

---

## 📊 Resource Usage

**Optimized for Development:**
- Backend: 2 CPU cores, 2GB RAM
- MongoDB: Default limits (fast for testing)
- Mongo Express: Minimal resources

**On production**, reduce to:
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
```

---

## 🔍 Common Commands

### View Live Logs
```powershell
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Last 50 lines
docker-compose logs --tail=50 backend
```

### Execute Commands Inside Container
```powershell
# Open shell
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm install package-name
docker-compose exec backend npm test

# Check environment
docker-compose exec backend env
```

### Database Operations
```powershell
# Open MongoDB shell
docker-compose exec mongodb mongosh school_management

# Seed database
docker-compose exec backend npm run seed

# Backup database
docker-compose exec mongodb mongodump --out=/data/backup
```

### Performance Checks
```powershell
# Container stats
docker stats

# Specific container
docker stats school_backend
```

---

## 🧹 Clean Up

### Remove Everything (Fresh Start)
```powershell
# Stop and remove containers + volumes
docker-compose down -v

# Remove images too
docker-compose down -v --rmi all

# Start fresh
docker-compose up -d --build
```

### Remove Just Data (Keep Containers)
```powershell
docker-compose down -v
docker-compose up -d
```

---

## 🚨 Troubleshooting

### Service Won't Start
```powershell
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache backend
docker-compose up -d
```

### Port Already in Use
```powershell
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "5001:5000"  # Use 5001 instead
```

### Hot Reload Not Working
```powershell
# Restart backend
docker-compose restart backend

# Or rebuild
docker-compose up -d --build backend
```

### Database Connection Issues
```powershell
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

---

## 🎯 Best Practices for Testing

### 1. Fast Feedback Loop
```powershell
# Edit code → Auto-reload → Check logs
docker-compose logs -f backend
```

### 2. Database Reset Between Tests
```powershell
# Quick reset
docker-compose exec mongodb mongosh school_management --eval "db.dropDatabase()"
docker-compose exec backend npm run seed
```

### 3. Parallel Testing
```powershell
# Run multiple compose files
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
```

### 4. Debug on Failure
```powershell
# Keep container running after failure
docker-compose up --abort-on-container-exit=false
```

---

## 📈 Compared to Production Setup

| Feature | Development | Production |
|---------|------------|------------|
| **Startup Time** | ~10s | ~30s |
| **MongoDB Auth** | None | Required |
| **Debug Port** | Exposed | Hidden |
| **Hot Reload** | Enabled | Disabled |
| **Dependencies** | All | Production only |
| **Resource Limits** | High | Optimized |
| **Logging** | Verbose | Structured |
| **Health Checks** | Fast | Thorough |

---

## 🔐 Moving to Production

When ready for production, create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASS}
    # No port exposure (use network only)

  backend:
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://${MONGO_USER}:${MONGO_PASS}@mongodb:27017/school_management?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
    # Remove debug port
    # Remove hot reload volumes
    command: npm start
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

**Use it:**
```powershell
docker-compose -f docker-compose.prod.yml up -d
```

---

**Perfect for:** Local dev, CI/CD, staging, testing  
**Not for:** Production (use separate config)

Last Updated: November 20, 2024
