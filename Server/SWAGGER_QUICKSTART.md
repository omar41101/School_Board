# 🚀 Quick Start - Testing Swagger API Documentation

## Step 1: Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# Windows - if MongoDB is installed as a service
net start MongoDB

# OR if you have MongoDB in a custom location
mongod --dbpath "C:\path\to\your\data\db"
```

## Step 2: Start the Server

```bash
cd Server
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

## Step 3: Open Swagger UI

Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

You should see a beautiful interactive API documentation interface! 🎨

## Step 4: Test the API

### Option A: Test Without Authentication

Try the **Register** endpoint first:

1. Find **Authentication** section
2. Click on `POST /api/auth/register`
3. Click "Try it out"
4. Enter sample data:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "student"
}
```
5. Click "Execute"
6. You should get a **201 Created** response with a JWT token!

### Option B: Authenticate and Test Protected Endpoints

1. **Register or Login** first to get a token
2. Copy the token from the response
3. Click the **"Authorize" button** 🔓 at the top right
4. Enter: `Bearer YOUR_TOKEN_HERE`
5. Click "Authorize"
6. Click "Close"

Now you can test any protected endpoint! Try:

#### Get All Students
1. Go to **Students** section
2. Click `GET /api/students`
3. Click "Try it out"
4. Optionally add filters:
   - `level`: "Grade 10"
   - `status`: "active"
   - `page`: 1
   - `limit`: 10
5. Click "Execute"

#### Create a Student
1. Find `POST /api/students`
2. Click "Try it out"
3. Fill in the request body:
```json
{
  "user": "USER_ID_HERE",
  "level": "Grade 10",
  "className": "10-A",
  "dateOfBirth": "2008-05-15",
  "address": {
    "street": "123 Main St",
    "city": "Example City",
    "state": "Example State",
    "postalCode": "12345",
    "country": "Example Country"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Mother",
    "phone": "555-0100"
  }
}
```
4. Click "Execute"

## Step 5: Explore All Endpoints

The Swagger UI organizes all 67 endpoints into categories:

- 🔐 **Authentication** (5 endpoints)
- 👤 **Users** (5 endpoints)
- 🎓 **Students** (5 endpoints)
- 👨‍🏫 **Teachers** (5 endpoints)
- 👪 **Parents** (5 endpoints)
- 📚 **Courses** (6 endpoints)
- 📊 **Grades** (5 endpoints)
- 📝 **Assignments** (6 endpoints)
- ✅ **Attendance** (4 endpoints)
- 💰 **Payments** (5 endpoints)
- 💬 **Messages** (5 endpoints)
- 📅 **Events** (6 endpoints)
- 🍽️ **Cantine** (5 endpoints)

## 📋 Useful Testing Scenarios

### Scenario 1: Student Lifecycle
1. Register a user with role "student"
2. Create a student profile
3. Enroll in a course
4. View assignments
5. Submit an assignment
6. Check grades

### Scenario 2: Teacher Workflow
1. Register as teacher
2. Create a course
3. Create assignments for the course
4. Record student attendance
5. Add grades

### Scenario 3: Admin Operations
1. Login as admin
2. View all users
3. Create new teachers/students
4. Manage payments
5. View system-wide analytics

### Scenario 4: Parent Portal
1. Register as parent
2. Link to student(s)
3. View child's grades
4. View child's attendance
5. Make payments

## 🔍 Pro Tips

### Filtering Data
Most GET endpoints support filtering:
```
GET /api/students?level=Grade 10&status=active&page=1&limit=10
GET /api/grades?student=STUDENT_ID&term=Fall 2024
GET /api/attendance?date=2024-01-15&status=absent
GET /api/payments?status=pending&type=tuition
```

### Pagination
All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Response Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation error)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found

## 🐛 Troubleshooting

### "Unauthorized" Error
- Make sure you clicked "Authorize" and entered your token
- Token format: `Bearer YOUR_TOKEN_HERE`
- Token might be expired - login again

### "Forbidden" Error
- Check role requirements (e.g., only Admin can delete users)
- Your user role might not have permission

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database is accessible

### Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📖 Additional Resources

- **Swagger Config**: `Server/src/config/swagger.js`
- **Route Files**: `Server/src/routes/*.routes.js`
- **API Examples**: `Server/API_EXAMPLES.md`
- **Full Documentation**: `Server/SWAGGER_COMPLETE.md`

## 🎯 What You Can Do

✅ Test all 67 API endpoints  
✅ View request/response schemas  
✅ See required vs optional fields  
✅ Test authentication and authorization  
✅ Explore filtering and pagination  
✅ Download OpenAPI spec (JSON)  
✅ Generate client SDKs from spec  

---

**Happy Testing! 🚀**

If you encounter any issues, check the console logs in the terminal where you ran `npm run dev`.
