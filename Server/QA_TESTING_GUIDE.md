# API Audit & Testing Guide - School Management ERP

## 📊 API Coverage Summary

### ✅ Implemented APIs (13 Modules)

| Module | Endpoints | Status | Notes |
|--------|-----------|--------|-------|
| **Authentication** | 5 | ✅ Complete | Login, Register, Logout, GetMe, UpdatePassword |
| **Users** | 5 | ✅ Complete | CRUD + Deactivate |
| **Students** | 5 | ✅ Complete | CRUD operations |
| **Teachers** | 5 | ✅ Complete | CRUD operations |
| **Parents** | 5 | ✅ Complete | CRUD operations |
| **Courses** | 6 | ✅ Complete | CRUD + Enroll Student |
| **Grades** | 5 | ✅ Complete | CRUD operations |
| **Assignments** | 6 | ✅ Complete | CRUD + Submit |
| **Attendance** | 4 | ✅ Complete | CRUD operations |
| **Payments** | 5 | ✅ Complete | CRUD + Mark as Paid |
| **Messages** | 5 | ✅ Complete | CRUD + Mark as Read |
| **Events** | 6 | ✅ Complete | CRUD + Join Event |
| **Cantine** | 5 | ✅ Complete | CRUD + Cancel Order |

**Total: 67 API Endpoints**

---

## 🧪 Testing Checklist

### 1. Authentication APIs

#### POST /api/auth/register
```json
// Test Case 1: Admin Registration
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@school.com",
  "password": "Admin123!",
  "role": "admin"
}

// Test Case 2: Student Registration
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@student.school.com",
  "password": "Student123!",
  "role": "student"
}

// Test Case 3: Teacher Registration
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@teacher.school.com",
  "password": "Teacher123!",
  "role": "teacher"
}

// Test Case 4: Parent Registration
{
  "firstName": "Robert",
  "lastName": "Johnson",
  "email": "robert.johnson@parent.school.com",
  "password": "Parent123!",
  "role": "parent"
}

// Expected Response (201 Created):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-11-19T10:30:00.000Z"
  }
}

// Error Cases:
// - Duplicate email: 400 "User already exists"
// - Missing required fields: 400 "Please provide all required fields"
// - Invalid email format: 400 "Invalid email"
```

#### POST /api/auth/login
```json
// Test Case 1: Valid Login
{
  "email": "admin@school.com",
  "password": "Admin123!"
}

// Expected Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com",
    "role": "admin",
    "avatar": null,
    "isActive": true
  }
}

// Error Cases:
// - Wrong password: 401 "Invalid email or password"
// - Non-existent user: 401 "Invalid email or password"
// - Deactivated account: 401 "Your account has been deactivated"
```

#### GET /api/auth/me
```
// Headers Required:
Authorization: Bearer <token>

// Expected Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com",
    "role": "admin",
    "avatar": null,
    "isActive": true,
    "lastLogin": "2024-11-19T10:30:00.000Z"
  }
}

// Error Cases:
// - No token: 401 "Not authorized to access this route"
// - Invalid token: 401 "Not authorized to access this route"
```

#### PUT /api/auth/update-password
```json
// Headers Required:
Authorization: Bearer <token>

// Request Body:
{
  "currentPassword": "Admin123!",
  "newPassword": "NewAdmin123!"
}

// Expected Response (200 OK):
{
  "success": true,
  "message": "Password updated successfully"
}

// Error Cases:
// - Wrong current password: 401 "Current password is incorrect"
// - Same password: 400 "New password must be different"
```

#### POST /api/auth/logout
```
// Headers Required:
Authorization: Bearer <token>

// Expected Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. User Management APIs

#### GET /api/users
```
// Headers Required:
Authorization: Bearer <admin-token>

// Query Parameters (optional):
?role=student&page=1&limit=10&search=john

// Expected Response (200 OK):
{
  "success": true,
  "count": 25,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@school.com",
      "role": "student",
      "isActive": true,
      "createdAt": "2024-11-19T10:30:00.000Z"
    }
  ]
}

// Access: Admin only
// Error: 403 if not admin
```

#### GET /api/users/:id
```
// Headers Required:
Authorization: Bearer <admin-token>

// Expected Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@school.com",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-11-19T10:30:00.000Z",
    "lastLogin": "2024-11-19T12:00:00.000Z"
  }
}

// Error: 404 "User not found"
```

#### PUT /api/users/:id
```json
// Headers Required:
Authorization: Bearer <admin-token>

// Request Body:
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@school.com"
}

// Expected Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@school.com",
    "role": "student",
    "isActive": true
  }
}

// Access: Admin only
```

#### DELETE /api/users/:id
```
// Headers Required:
Authorization: Bearer <admin-token>

// Expected Response (200 OK):
{
  "success": true,
  "message": "User deleted successfully"
}

// Access: Admin only
```

#### PUT /api/users/:id/deactivate
```
// Headers Required:
Authorization: Bearer <admin-token>

// Expected Response (200 OK):
{
  "success": true,
  "message": "User deactivated successfully"
}

// Access: Admin only
```

---

### 3. Student Management APIs

#### GET /api/students
```
// Query Parameters (optional):
?class=10A&page=1&limit=20&search=doe

// Expected Response (200 OK):
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "user": {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@student.school.com"
      },
      "studentId": "STU2024001",
      "class": "10A",
      "section": "Science",
      "dateOfBirth": "2010-05-15",
      "enrollmentDate": "2024-09-01",
      "status": "active"
    }
  ]
}
```

#### POST /api/students
```json
{
  "user": "60d5ec49f1b2c72b8c8e4f1b",
  "studentId": "STU2024001",
  "class": "10A",
  "section": "Science",
  "dateOfBirth": "2010-05-15",
  "enrollmentDate": "2024-09-01",
  "guardianName": "Robert Doe",
  "guardianContact": "+1234567890"
}

// Expected Response (201 Created)
```

#### GET /api/students/:id
#### PUT /api/students/:id
#### DELETE /api/students/:id

---

### 4. Teacher Management APIs

#### GET /api/teachers
```
// Query Parameters (optional):
?department=Mathematics&page=1&limit=10

// Expected Response (200 OK):
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "user": {
        "_id": "60d5ec49f1b2c72b8c8e4f1d",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@teacher.school.com"
      },
      "teacherId": "TCH2024001",
      "department": "Mathematics",
      "specialization": "Algebra",
      "qualification": "M.Sc Mathematics",
      "joinDate": "2020-08-15",
      "status": "active"
    }
  ]
}
```

#### POST /api/teachers
```json
{
  "user": "60d5ec49f1b2c72b8c8e4f1d",
  "teacherId": "TCH2024001",
  "department": "Mathematics",
  "specialization": "Algebra",
  "qualification": "M.Sc Mathematics",
  "joinDate": "2020-08-15",
  "subjects": ["Algebra", "Geometry", "Calculus"]
}
```

---

### 5. Course Management APIs

#### GET /api/courses
```
// Query Parameters:
?teacher=60d5ec49f1b2c72b8c8e4f1d&academicYear=2024-2025

// Expected Response (200 OK):
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1e",
      "name": "Advanced Mathematics",
      "code": "MATH301",
      "description": "Advanced mathematics for grade 10",
      "teacher": {
        "_id": "60d5ec49f1b2c72b8c8e4f1d",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "level": "Grade 10",
      "subject": "Mathematics",
      "academicYear": "2024-2025",
      "semester": "1",
      "maxStudents": 30,
      "enrolledStudents": 25
    }
  ]
}
```

#### POST /api/courses
```json
{
  "name": "Advanced Mathematics",
  "code": "MATH301",
  "description": "Advanced mathematics for grade 10",
  "teacher": "60d5ec49f1b2c72b8c8e4f1d",
  "level": "Grade 10",
  "subject": "Mathematics",
  "academicYear": "2024-2025",
  "semester": "1",
  "maxStudents": 30,
  "schedule": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Room 301"
    }
  ]
}
```

#### POST /api/courses/:id/enroll
```json
{
  "studentId": "60d5ec49f1b2c72b8c8e4f1a"
}

// Expected Response (200 OK):
{
  "success": true,
  "message": "Student enrolled successfully"
}
```

---

### 6. Grade Management APIs

#### GET /api/grades
```
// Query Parameters:
?student=60d5ec49f1b2c72b8c8e4f1a&course=60d5ec49f1b2c72b8c8e4f1e

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1f",
      "student": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "studentId": "STU2024001",
        "firstName": "John",
        "lastName": "Doe"
      },
      "course": {
        "_id": "60d5ec49f1b2c72b8c8e4f1e",
        "name": "Advanced Mathematics",
        "code": "MATH301"
      },
      "type": "midterm",
      "score": 85,
      "maxScore": 100,
      "percentage": 85,
      "gradeLetter": "A",
      "comments": "Excellent performance",
      "createdAt": "2024-11-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/grades
```json
{
  "student": "60d5ec49f1b2c72b8c8e4f1a",
  "course": "60d5ec49f1b2c72b8c8e4f1e",
  "type": "midterm",
  "score": 85,
  "maxScore": 100,
  "comments": "Excellent performance"
}
```

---

### 7. Assignment Management APIs

#### GET /api/assignments
```
// Query Parameters:
?course=60d5ec49f1b2c72b8c8e4f1e&status=pending

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f20",
      "title": "Algebra Problem Set 1",
      "description": "Complete problems 1-20",
      "course": {
        "_id": "60d5ec49f1b2c72b8c8e4f1e",
        "name": "Advanced Mathematics"
      },
      "dueDate": "2024-11-25T23:59:59.000Z",
      "maxScore": 100,
      "attachments": [],
      "submissions": 15,
      "totalStudents": 25
    }
  ]
}
```

#### POST /api/assignments
```json
{
  "title": "Algebra Problem Set 1",
  "description": "Complete problems 1-20",
  "course": "60d5ec49f1b2c72b8c8e4f1e",
  "dueDate": "2024-11-25T23:59:59.000Z",
  "maxScore": 100,
  "attachments": [
    {
      "name": "problem_set_1.pdf",
      "url": "https://storage.example.com/assignments/problem_set_1.pdf",
      "type": "application/pdf"
    }
  ]
}
```

#### POST /api/assignments/:id/submit
```json
{
  "student": "60d5ec49f1b2c72b8c8e4f1a",
  "attachments": [
    {
      "name": "my_solution.pdf",
      "url": "https://storage.example.com/submissions/my_solution.pdf",
      "type": "application/pdf"
    }
  ],
  "comments": "Completed all problems"
}

// Expected Response (201 Created):
{
  "success": true,
  "message": "Assignment submitted successfully",
  "data": {
    "submittedAt": "2024-11-20T14:30:00.000Z",
    "status": "submitted"
  }
}
```

---

### 8. Attendance APIs

#### GET /api/attendance
```
// Query Parameters:
?date=2024-11-19&course=60d5ec49f1b2c72b8c8e4f1e

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f21",
      "student": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "studentId": "STU2024001",
        "firstName": "John",
        "lastName": "Doe"
      },
      "course": {
        "_id": "60d5ec49f1b2c72b8c8e4f1e",
        "name": "Advanced Mathematics"
      },
      "date": "2024-11-19",
      "status": "present",
      "remarks": ""
    }
  ]
}
```

#### POST /api/attendance
```json
{
  "student": "60d5ec49f1b2c72b8c8e4f1a",
  "course": "60d5ec49f1b2c72b8c8e4f1e",
  "date": "2024-11-19",
  "status": "present"
}
```

---

### 9. Payment APIs

#### GET /api/payments
```
// Query Parameters:
?student=60d5ec49f1b2c72b8c8e4f1a&status=pending

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f22",
      "student": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "studentId": "STU2024001",
        "firstName": "John",
        "lastName": "Doe"
      },
      "amount": 5000,
      "type": "tuition",
      "status": "pending",
      "dueDate": "2024-12-01",
      "description": "Tuition fee for semester 1"
    }
  ]
}
```

#### POST /api/payments
```json
{
  "student": "60d5ec49f1b2c72b8c8e4f1a",
  "amount": 5000,
  "type": "tuition",
  "dueDate": "2024-12-01",
  "description": "Tuition fee for semester 1"
}
```

#### PUT /api/payments/:id/mark-paid
```json
{
  "paymentMethod": "credit_card",
  "transactionId": "TXN123456789"
}

// Expected Response:
{
  "success": true,
  "message": "Payment marked as paid",
  "data": {
    "status": "paid",
    "paidDate": "2024-11-19T15:00:00.000Z"
  }
}
```

---

### 10. Messaging APIs

#### GET /api/messages
```
// Query Parameters:
?userId=60d5ec49f1b2c72b8c8e4f1a&status=unread

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f23",
      "sender": {
        "_id": "60d5ec49f1b2c72b8c8e4f1d",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "recipient": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "firstName": "John",
        "lastName": "Doe"
      },
      "subject": "Regarding your assignment",
      "content": "Please submit your assignment by Friday",
      "isRead": false,
      "createdAt": "2024-11-19T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/messages
```json
{
  "recipient": "60d5ec49f1b2c72b8c8e4f1a",
  "subject": "Regarding your assignment",
  "content": "Please submit your assignment by Friday"
}
```

#### PUT /api/messages/:id/read
```
// Expected Response:
{
  "success": true,
  "message": "Message marked as read"
}
```

---

### 11. Event APIs

#### GET /api/events
```
// Query Parameters:
?startDate=2024-11-01&endDate=2024-11-30&type=academic

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f24",
      "title": "Science Fair 2024",
      "description": "Annual science fair",
      "type": "academic",
      "startDate": "2024-11-25T09:00:00.000Z",
      "endDate": "2024-11-25T17:00:00.000Z",
      "location": "Main Hall",
      "organizer": {
        "_id": "60d5ec49f1b2c72b8c8e4f1d",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "participants": 50,
      "maxParticipants": 100
    }
  ]
}
```

#### POST /api/events
```json
{
  "title": "Science Fair 2024",
  "description": "Annual science fair",
  "type": "academic",
  "startDate": "2024-11-25T09:00:00.000Z",
  "endDate": "2024-11-25T17:00:00.000Z",
  "location": "Main Hall",
  "maxParticipants": 100
}
```

#### POST /api/events/:id/join
```json
{
  "userId": "60d5ec49f1b2c72b8c8e4f1a"
}
```

---

### 12. Cantine/Cafeteria APIs

#### GET /api/cantine
```
// Query Parameters:
?student=60d5ec49f1b2c72b8c8e4f1a&date=2024-11-19

// Expected Response:
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f25",
      "student": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "studentId": "STU2024001",
        "firstName": "John",
        "lastName": "Doe"
      },
      "items": [
        {
          "name": "Chicken Sandwich",
          "quantity": 1,
          "price": 5.50
        },
        {
          "name": "Orange Juice",
          "quantity": 1,
          "price": 2.00
        }
      ],
      "totalAmount": 7.50,
      "orderDate": "2024-11-19T08:30:00.000Z",
      "status": "pending",
      "deliveryTime": "12:00"
    }
  ]
}
```

#### POST /api/cantine
```json
{
  "student": "60d5ec49f1b2c72b8c8e4f1a",
  "items": [
    {
      "name": "Chicken Sandwich",
      "quantity": 1,
      "price": 5.50
    },
    {
      "name": "Orange Juice",
      "quantity": 1,
      "price": 2.00
    }
  ],
  "deliveryTime": "12:00"
}
```

#### PUT /api/cantine/:id/cancel
```
// Expected Response:
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## 🔍 QA Testing Protocol

### Testing Environment Setup

1. **Start MongoDB**
```bash
mongod
```

2. **Start Backend Server**
```bash
cd c:\Users\omara\Desktop\school_board\Server
npm install
npm run dev
```

3. **Access Swagger UI**
```
http://localhost:5000/api-docs
```

4. **Access API Health Check**
```
http://localhost:5000/health
```

### Testing Workflow

#### Phase 1: Authentication Testing
1. ✅ Register 4 users (Admin, Teacher, Student, Parent)
2. ✅ Login with each user
3. ✅ Get current user info
4. ✅ Update password
5. ✅ Logout

#### Phase 2: User Management (Admin only)
1. ✅ Get all users
2. ✅ Get user by ID
3. ✅ Update user
4. ✅ Deactivate user
5. ✅ Delete user

#### Phase 3: Student Management
1. ✅ Create student profiles
2. ✅ Get all students with filters
3. ✅ Get student by ID
4. ✅ Update student info
5. ✅ Delete student

#### Phase 4: Teacher Management
1. ✅ Create teacher profiles
2. ✅ Get all teachers
3. ✅ Get teacher by ID
4. ✅ Update teacher info
5. ✅ Delete teacher

#### Phase 5: Course Management
1. ✅ Create courses
2. ✅ Get all courses
3. ✅ Enroll students
4. ✅ Update course
5. ✅ Delete course

#### Phase 6: Academic Operations
1. ✅ Create assignments
2. ✅ Submit assignments
3. ✅ Create grades
4. ✅ Mark attendance
5. ✅ Get student reports

#### Phase 7: Financial Operations
1. ✅ Create payment records
2. ✅ Mark payments as paid
3. ✅ Get payment history
4. ✅ Generate invoices

#### Phase 8: Communication
1. ✅ Send messages
2. ✅ Mark as read
3. ✅ Get inbox
4. ✅ Delete messages

#### Phase 9: Events & Activities
1. ✅ Create events
2. ✅ Join events
3. ✅ Get upcoming events
4. ✅ Cancel events

#### Phase 10: Cantine Management
1. ✅ Place orders
2. ✅ Get order history
3. ✅ Cancel orders
4. ✅ Update order status

---

## 📝 Error Handling Tests

### Test All Error Scenarios:

1. **401 Unauthorized**
   - No token provided
   - Invalid token
   - Expired token

2. **403 Forbidden**
   - Insufficient permissions
   - Role-based access denial

3. **404 Not Found**
   - Invalid resource ID
   - Deleted resource

4. **400 Bad Request**
   - Missing required fields
   - Invalid data format
   - Validation errors

5. **500 Server Error**
   - Database connection issues
   - Server crashes

---

## 📊 Performance Testing

### Load Testing Checklist:
- [ ] Test with 100 concurrent users
- [ ] Test pagination with large datasets
- [ ] Test file upload limits
- [ ] Test query performance with filters
- [ ] Test rate limiting

### Response Time Benchmarks:
- Simple GET requests: < 100ms
- Complex queries with joins: < 500ms
- POST/PUT operations: < 300ms
- File uploads: < 2s (for 10MB)

---

## ✅ Sign-off Checklist

### For QA Team:
- [ ] All 67 endpoints tested
- [ ] All CRUD operations verified
- [ ] Error handling validated
- [ ] Authentication & Authorization tested
- [ ] Data validation confirmed
- [ ] Performance benchmarks met
- [ ] Security tests passed
- [ ] Documentation reviewed

### Test Report Template:
```
Date: _____________
Tester: _____________
Environment: Development/Staging/Production

Module Tested: _____________
Total Endpoints: _____________
Passed: _____________
Failed: _____________

Issues Found:
1. _____________
2. _____________

Notes: _____________
```

---

## 🚀 Ready for Production?

### Pre-deployment Checklist:
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database indexes optimized
- [ ] Backup strategy implemented
- [ ] Monitoring tools configured
- [ ] Error logging active
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SSL/TLS certificates installed
- [ ] API versioning strategy decided

---

**Last Updated:** November 19, 2024
**Version:** 1.0
**Status:** Ready for QA Testing
