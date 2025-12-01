# Docker Setup & Usage Guide

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

---

## 🚀 Start Everything with One Command

```powershell
# Start all services (Backend + MongoDB + Mongo Express UI)
docker-compose up -d
```

That's it! Your services are now running:
- **Backend API:** http://localhost:5000
- **Swagger Docs:** http://localhost:5000/api-docs
- **MongoDB:** localhost:27017
- **Mongo Express (DB UI):** http://localhost:8081

---

## 📋 Docker Commands

### Start Services
```powershell
# Start all services in background
docker-compose up -d

# Start and view logs
docker-compose up

# Start specific service
docker-compose up -d backend
```

### Stop Services
```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

### View Logs
```powershell
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f backend
```

### Restart Services
```powershell
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Check Status
```powershell
# View running containers
docker-compose ps

# View all containers
docker ps -a
```

---

## 🔧 Development Mode

The `docker-compose.yml` is configured for development with:
- **Hot reload:** Code changes in `/src` auto-restart the server
- **Volume mounting:** Your local code is synced with container
- **Debug logs:** Full logging enabled

---

## 🗄️ Database Management

### MongoDB Connection
```
Host: localhost
Port: 27017
Username: admin
Password: admin123
Database: school_management
```

### Mongo Express (Web UI)
```
URL: http://localhost:8081
Username: admin
Password: admin123
```

### Connect with MongoDB Compass
```
mongodb://admin:admin123@localhost:27017/school_management?authSource=admin
```

---

## 🔍 Useful Commands

### Execute Commands in Container
```powershell
# Open shell in backend container
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm install
docker-compose exec backend npm run seed

# Check Node version
docker-compose exec backend node -v
```

### View Container Stats
```powershell
# Real-time resource usage
docker stats
```

### Clean Up
```powershell
# Remove stopped containers
docker-compose rm

# Remove all unused images/containers/volumes
docker system prune -a
```

---

## 🏗️ Build & Rebuild

### Rebuild After Changes
```powershell
# Rebuild specific service
docker-compose build backend

# Rebuild all services
docker-compose build

# Rebuild and restart
docker-compose up -d --build
```

---

## 🔐 Environment Variables

The `docker-compose.yml` includes default environment variables.

**For production, change:**
- `MONGODB_URI`
- `JWT_SECRET`
- `MONGO_INITDB_ROOT_PASSWORD`
- MongoDB credentials

---

## 🧪 Testing the Setup

### 1. Health Check
```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-11-20T..."
}
```

### 2. Swagger Docs
Open: http://localhost:5000/api-docs

### 3. MongoDB
Open: http://localhost:8081

---

## 📦 What's Running?

When you run `docker-compose up -d`, you get:

1. **MongoDB Container**
   - Database server
   - Port: 27017
   - Persistent data storage

2. **Backend Container**
   - Node.js API server
   - Port: 5000
   - Auto-reload on code changes

3. **Mongo Express Container**
   - Database management UI
   - Port: 8081
   - Easy data viewing/editing

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Container Won't Start
```powershell
# View error logs
docker-compose logs backend

# Remove and recreate
docker-compose down
docker-compose up -d
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

### Can't Access Swagger
```powershell
# Check backend logs
docker-compose logs backend

# Verify backend is running
curl http://localhost:5000/health
```

---

## 🔄 Update to Latest Code

```powershell
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 💾 Backup & Restore Database

### Backup
```powershell
# Create backup
docker-compose exec mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --out /data/backup

# Copy backup to local machine
docker cp school_mongodb:/data/backup ./backup
```

### Restore
```powershell
# Copy backup to container
docker cp ./backup school_mongodb:/data/backup

# Restore database
docker-compose exec mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin /data/backup
```

---

## 🚀 Production Deployment

### 1. Update docker-compose.yml
```yaml
# Change:
command: npm run dev  # to
command: npm start

# Update environment variables
JWT_SECRET: your_production_secret
MONGODB_URI: your_production_db_uri
```

### 2. Build for Production
```powershell
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Enable SSL/HTTPS
Add nginx reverse proxy or use cloud provider SSL

---

## ⚡ Performance Tips

1. **Use .dockerignore:** Already configured to exclude unnecessary files
2. **Layer caching:** Dependencies installed before copying code
3. **Health checks:** Automatic container health monitoring
4. **Resource limits:** Add to docker-compose.yml if needed

---

## 📚 Additional Resources

- **Docker Docs:** https://docs.docker.com
- **Docker Compose:** https://docs.docker.com/compose
- **MongoDB Image:** https://hub.docker.com/_/mongo
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices

---

## 🎯 Common Workflows

### Daily Development
```powershell
# Start
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop when done
docker-compose down
```

### Testing Changes
```powershell
# Code changes auto-reload
# Just save your files and check logs

# If you change package.json
docker-compose down
docker-compose up -d --build
```

### Fresh Start
```powershell
# Complete reset (deletes database!)
docker-compose down -v
docker-compose up -d --build
```

---

**Need Help?**
- Check logs: `docker-compose logs backend`
- Check status: `docker-compose ps`
- View errors: `docker-compose logs --tail=50 backend`
