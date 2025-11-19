# Quick Start Guide for QA Testing

## 🚀 5-Minute Setup

### Step 1: Start the Backend Server
```bash
cd c:\Users\omara\Desktop\school_board\Server
npm install
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Swagger docs available at http://localhost:5000/api-docs
```

### Step 2: Verify Server is Running
Open browser: `http://localhost:5000/health`

**Expected Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-11-19T..."
}
```

### Step 3: Access Swagger Documentation
Open: `http://localhost:5000/api-docs`

---

## 📝 Quick Testing Workflow

### Option 1: Using Swagger UI (Recommended for Beginners)

1. **Open Swagger:** `http://localhost:5000/api-docs`

2. **Register Admin Account:**
   - Find: `POST /api/auth/register`
   - Click "Try it out"
   - Use this JSON:
   ```json
   {
     "firstName": "Admin",
     "lastName": "Test",
     "email": "admin@test.com",
     "password": "Admin123!",
     "role": "admin"
   }
   ```
   - Click "Execute"
   - **Copy the token from response**

3. **Authorize:**
   - Click 🔓 "Authorize" button (top right)
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

4. **Test Any Endpoint:**
   - Now all endpoints will use your token
   - Try: `GET /api/auth/me` to verify login

### Option 2: Using Postman

1. **Import Collection:**
   - Open Postman
   - File → Import
   - Select: `postman_collection.json`

2. **Set Environment:**
   - Click "No Environment" → "Create Environment"
   - Add variables:
     - `base_url`: `http://localhost:5000/api`
     - `auth_token`: (leave empty for now)

3. **Run Tests:**
   - Expand "1. Authentication"
   - Run "Register Admin"
   - Token will auto-save to environment
   - Run any other endpoint

---

## 🎯 Critical Test Cases (Must Test)

### Test 1: Authentication Flow ✅
```
1. POST /api/auth/register → Get token
2. POST /api/auth/login → Verify login
3. GET /api/auth/me → Check user data
4. PUT /api/auth/update-password → Change password
5. POST /api/auth/logout → Logout
```

### Test 2: Student Lifecycle ✅
```
1. POST /api/students → Create student
2. GET /api/students → List all students
3. GET /api/students/:id → Get single student
4. PUT /api/students/:id → Update student
5. DELETE /api/students/:id → Delete student
```

### Test 3: Course & Enrollment ✅
```
1. POST /api/courses → Create course
2. POST /api/courses/:id/enroll → Enroll student
3. GET /api/courses → Verify enrollment
```

### Test 4: Grade Management ✅
```
1. POST /api/grades → Create grade
2. GET /api/grades?student=ID → Get student grades
3. PUT /api/grades/:id → Update grade
```

### Test 5: Assignment Submission ✅
```
1. POST /api/assignments → Create assignment
2. POST /api/assignments/:id/submit → Submit work
3. GET /api/assignments → Check submissions
```

---

## 🔥 Common Issues & Solutions

### Issue 1: "Not authorized to access this route"
**Solution:** 
- Token expired or missing
- Click Authorize in Swagger
- Or re-login to get new token

### Issue 2: "User already exists"
**Solution:**
- Email already registered
- Use different email
- Or login with existing credentials

### Issue 3: "Cannot connect to database"
**Solution:**
```bash
# Start MongoDB
mongod

# Or on Windows
net start MongoDB
```

### Issue 4: "Port 5000 already in use"
**Solution:**
```bash
# Change port in .env file
PORT=5001

# Or kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📊 Test Data Examples

### Valid Admin Registration:
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@school.com",
  "password": "Admin123!",
  "role": "admin"
}
```

### Valid Student Registration:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@student.com",
  "password": "Student123!",
  "role": "student"
}
```

### Create Student Profile:
```json
{
  "user": "USER_ID_HERE",
  "studentId": "STU2024001",
  "class": "10A",
  "section": "Science",
  "dateOfBirth": "2010-05-15",
  "enrollmentDate": "2024-09-01"
}
```

### Create Course:
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "description": "Basic mathematics",
  "teacher": "TEACHER_ID_HERE",
  "level": "Grade 10",
  "subject": "Mathematics",
  "academicYear": "2024-2025",
  "semester": "1",
  "maxStudents": 30
}
```

### Create Grade:
```json
{
  "student": "STUDENT_ID_HERE",
  "course": "COURSE_ID_HERE",
  "type": "midterm",
  "score": 85,
  "maxScore": 100,
  "comments": "Good performance"
}
```

---

## ✅ Testing Checklist

Print this and check off as you test:

```
AUTHENTICATION (5 endpoints)
[ ] POST /api/auth/register
[ ] POST /api/auth/login
[ ] GET /api/auth/me
[ ] PUT /api/auth/update-password
[ ] POST /api/auth/logout

USERS (5 endpoints)
[ ] GET /api/users
[ ] GET /api/users/:id
[ ] PUT /api/users/:id
[ ] PUT /api/users/:id/deactivate
[ ] DELETE /api/users/:id

STUDENTS (5 endpoints)
[ ] GET /api/students
[ ] GET /api/students/:id
[ ] POST /api/students
[ ] PUT /api/students/:id
[ ] DELETE /api/students/:id

TEACHERS (5 endpoints)
[ ] GET /api/teachers
[ ] GET /api/teachers/:id
[ ] POST /api/teachers
[ ] PUT /api/teachers/:id
[ ] DELETE /api/teachers/:id

PARENTS (5 endpoints)
[ ] GET /api/parents
[ ] GET /api/parents/:id
[ ] POST /api/parents
[ ] PUT /api/parents/:id
[ ] DELETE /api/parents/:id

COURSES (6 endpoints)
[ ] GET /api/courses
[ ] GET /api/courses/:id
[ ] POST /api/courses
[ ] PUT /api/courses/:id
[ ] DELETE /api/courses/:id
[ ] POST /api/courses/:id/enroll

GRADES (5 endpoints)
[ ] GET /api/grades
[ ] GET /api/grades/:id
[ ] POST /api/grades
[ ] PUT /api/grades/:id
[ ] DELETE /api/grades/:id

ASSIGNMENTS (6 endpoints)
[ ] GET /api/assignments
[ ] GET /api/assignments/:id
[ ] POST /api/assignments
[ ] PUT /api/assignments/:id
[ ] DELETE /api/assignments/:id
[ ] POST /api/assignments/:id/submit

ATTENDANCE (4 endpoints)
[ ] GET /api/attendance
[ ] POST /api/attendance
[ ] PUT /api/attendance/:id
[ ] DELETE /api/attendance/:id

PAYMENTS (5 endpoints)
[ ] GET /api/payments
[ ] GET /api/payments/:id
[ ] POST /api/payments
[ ] PUT /api/payments/:id
[ ] PUT /api/payments/:id/mark-paid

MESSAGES (5 endpoints)
[ ] GET /api/messages
[ ] GET /api/messages/:id
[ ] POST /api/messages
[ ] PUT /api/messages/:id/read
[ ] DELETE /api/messages/:id

EVENTS (6 endpoints)
[ ] GET /api/events
[ ] GET /api/events/:id
[ ] POST /api/events
[ ] PUT /api/events/:id
[ ] DELETE /api/events/:id
[ ] POST /api/events/:id/join

CANTINE (5 endpoints)
[ ] GET /api/cantine
[ ] GET /api/cantine/:id
[ ] POST /api/cantine
[ ] PUT /api/cantine/:id
[ ] PUT /api/cantine/:id/cancel
```

**Total: 67 endpoints**

---

## 📞 Need Help?

**Documentation:**
- Swagger: `http://localhost:5000/api-docs`
- Full Guide: `QA_TESTING_GUIDE.md`
- API Status: `API_STATUS_REPORT.md`
- Examples: `API_EXAMPLES.md`

**Quick Commands:**
```bash
# Start server
npm run dev

# Seed database with test data
node seed.js

# View logs
# Check terminal output

# Reset database (CAREFUL!)
# mongo
# use school_management
# db.dropDatabase()
```

---

**Happy Testing! 🎉**

Last Updated: November 19, 2024
