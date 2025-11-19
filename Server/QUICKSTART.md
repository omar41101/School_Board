# Quick Start Guide - School Management Backend

## Prerequisites
- Node.js installed
- MongoDB installed and running

## Setup Steps

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running. You can check by running:
```powershell
mongod --version
```

If not running, start it:
```powershell
# Start MongoDB service (Windows)
net start MongoDB

# Or run directly
mongod
```

### 3. Configure Environment
The `.env` file is already created. Update if needed:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Change in production
- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Your frontend URL

### 4. Start the Server

Development mode (with nodemon auto-reload):
```powershell
npm run dev
```

Production mode:
```powershell
npm start
```

### 5. Test the Server
Open your browser or use curl:
```
http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## API Testing

### Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

### Use the Token
Copy the token from login response and use it in headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/school_management`

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 5001)

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and run `npm install`

## Next Steps

1. **Create Admin User**: Register an admin user first
2. **Test Endpoints**: Use Postman or Thunder Client to test APIs
3. **Connect Frontend**: Update frontend API URL to `http://localhost:5000/api`
4. **Read Documentation**: Check README.md for full API documentation

## Development Tips

- Use `npm run dev` for development (auto-reload on changes)
- Check console for errors and logs
- MongoDB data is stored locally
- JWT tokens expire in 7 days (configurable)

---

Happy Coding! 🚀
