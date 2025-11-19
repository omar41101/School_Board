# API Testing Examples

Use these examples with **Postman**, **Thunder Client**, or **curl** to test your API.

## 1. Register a New User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Admin",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Admin",
      "email": "admin@school.com",
      "role": "admin",
      "avatar": "https://via.placeholder.com/150"
    }
  }
}
```

## 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Save the token from response!**

## 3. Get Current User

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 4. Create a Student

```http
POST http://localhost:5000/api/students
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "user": "USER_ID_HERE",
  "matricule": "STU2025001",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "level": "Grade 10",
  "className": "10-A",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

## 5. Get All Students

```http
GET http://localhost:5000/api/students
Authorization: Bearer YOUR_TOKEN_HERE
```

**With filters:**
```http
GET http://localhost:5000/api/students?level=Grade 10&status=active&page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

## 6. Create a Course

```http
POST http://localhost:5000/api/courses
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Mathematics - Advanced",
  "code": "MATH101",
  "description": "Advanced mathematics for Grade 10",
  "level": "Grade 10",
  "subject": "Mathematics",
  "teacher": "TEACHER_ID_HERE",
  "academicYear": "2024-2025",
  "semester": "1",
  "maxStudents": 30
}
```

## 7. Enroll Student in Course

```http
POST http://localhost:5000/api/courses/COURSE_ID/enroll
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "studentId": "STUDENT_ID_HERE"
}
```

## 8. Add Grade

```http
POST http://localhost:5000/api/grades
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "student": "STUDENT_ID_HERE",
  "course": "COURSE_ID_HERE",
  "teacher": "TEACHER_ID_HERE",
  "examType": "midterm",
  "subject": "Mathematics",
  "marks": 85,
  "totalMarks": 100,
  "examDate": "2025-01-15",
  "academicYear": "2024-2025",
  "semester": "1"
}
```

## 9. Create Assignment

```http
POST http://localhost:5000/api/assignments
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Quadratic Equations Homework",
  "description": "Solve problems 1-20 from chapter 5",
  "course": "COURSE_ID_HERE",
  "teacher": "TEACHER_ID_HERE",
  "subject": "Mathematics",
  "level": "Grade 10",
  "className": "10-A",
  "dueDate": "2025-01-20",
  "totalMarks": 50
}
```

## 10. Mark Attendance

```http
POST http://localhost:5000/api/attendance
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "student": "STUDENT_ID_HERE",
  "course": "COURSE_ID_HERE",
  "teacher": "TEACHER_ID_HERE",
  "date": "2025-01-15",
  "status": "present",
  "subject": "Mathematics",
  "academicYear": "2024-2025",
  "semester": "1"
}
```

## 11. Create Payment

```http
POST http://localhost:5000/api/payments
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "student": "STUDENT_ID_HERE",
  "type": "tuition",
  "amount": 5000,
  "currency": "USD",
  "dueDate": "2025-02-01",
  "academicYear": "2024-2025",
  "semester": "1"
}
```

## 12. Mark Payment as Paid

```http
PATCH http://localhost:5000/api/payments/PAYMENT_ID/mark-paid
Authorization: Bearer YOUR_TOKEN_HERE
```

## 13. Send Message

```http
POST http://localhost:5000/api/messages
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "recipient": "USER_ID_HERE",
  "subject": "Meeting Tomorrow",
  "content": "Don't forget about our meeting tomorrow at 2 PM.",
  "priority": "high",
  "category": "academic"
}
```

## 14. Get All Messages

```http
GET http://localhost:5000/api/messages
Authorization: Bearer YOUR_TOKEN_HERE
```

## 15. Create Event

```http
POST http://localhost:5000/api/events
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Annual Sports Day",
  "description": "School-wide sports competition",
  "type": "sports",
  "startDate": "2025-03-15T08:00:00Z",
  "endDate": "2025-03-15T17:00:00Z",
  "location": "School Stadium",
  "targetAudience": "all",
  "isPublic": true
}
```

## 16. Order from Cantine

```http
POST http://localhost:5000/api/cantine
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "student": "STUDENT_ID_HERE",
  "date": "2025-01-15",
  "mealType": "lunch",
  "items": [
    {
      "name": "Chicken Burger",
      "category": "main",
      "price": 8.50,
      "quantity": 1
    },
    {
      "name": "Orange Juice",
      "category": "drink",
      "price": 2.50,
      "quantity": 1
    }
  ]
}
```

## 17. Get User by ID

```http
GET http://localhost:5000/api/users/USER_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

## 18. Update Student

```http
PUT http://localhost:5000/api/students/STUDENT_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "active",
  "className": "10-B"
}
```

## 19. Get Grades with Filters

```http
GET http://localhost:5000/api/grades?student=STUDENT_ID&academicYear=2024-2025&semester=1
Authorization: Bearer YOUR_TOKEN_HERE
```

## 20. Health Check (No Auth Required)

```http
GET http://localhost:5000/health
```

---

## Tips for Testing

1. **Save the token**: After login/register, save the token for subsequent requests
2. **Replace IDs**: Replace `STUDENT_ID_HERE`, `COURSE_ID_HERE`, etc. with actual MongoDB IDs
3. **Use VS Code Extension**: Install "Thunder Client" or "REST Client" for easier testing
4. **Check Response**: Always check the response status and data structure
5. **Test Permissions**: Try accessing routes with different user roles

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Example Error Response

```json
{
  "status": "fail",
  "message": "Validation error message here"
}
```

---

Happy Testing! 🧪
