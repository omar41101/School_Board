const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management ERP API',
      version: '0.1.0',
      description: 'Comprehensive MERN stack backend API for school management system with role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@schoolerp.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.schoolerp.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from login/register'
        }
      },
      schemas: {
        // User Schema
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'role'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', maxLength: 50, example: 'John' },
            lastName: { type: 'string', maxLength: 50, example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@school.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'password123' },
            role: { type: 'string', enum: ['admin', 'student', 'teacher', 'parent', 'direction'], example: 'student' },
            avatar: { type: 'string', example: 'https://via.placeholder.com/150' },
            phone: { type: 'string', example: '+1234567890' },
            isActive: { type: 'boolean', example: true },
            lastLogin: { type: 'string', format: 'date-time', example: '2025-01-15T10:30:00Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-01-15T10:30:00Z' }
          }
        },

        // Address Schema (Nested Object)
        Address: {
          type: 'object',
          properties: {
            street: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'Springfield' },
            state: { type: 'string', example: 'IL' },
            zipCode: { type: 'string', example: '62704' },
            country: { type: 'string', example: 'USA' }
          }
        },

        // Emergency Contact Schema
        EmergencyContact: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            relationship: { type: 'string', example: 'Mother' },
            phone: { type: 'string', example: '+1234567890' }
          }
        },

        // Medical Info Schema
        MedicalInfo: {
          type: 'object',
          properties: {
            bloodGroup: { type: 'string', example: 'A+' },
            allergies: { type: 'array', items: { type: 'string' }, example: ['Peanuts', 'Dust'] },
            medicalConditions: { type: 'array', items: { type: 'string' }, example: ['Asthma'] },
            emergencyContact: { $ref: '#/components/schemas/EmergencyContact' }
          }
        },

        // Document Schema
        Document: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Birth Certificate' },
            url: { type: 'string', example: 'https://storage.example.com/doc123.pdf' },
            uploadDate: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00Z' }
          }
        },

        // Previous School Schema
        PreviousSchool: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Central High School' },
            year: { type: 'string', example: '2024' }
          }
        },

        // Student Schema
        Student: {
          type: 'object',
          required: ['user', 'matricule', 'dateOfBirth', 'gender', 'level', 'className'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439022' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            matricule: { type: 'string', example: 'STU2025001' },
            dateOfBirth: { type: 'string', format: 'date', example: '2010-05-15' },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
            address: { $ref: '#/components/schemas/Address' },
            level: { type: 'string', example: 'Grade 10' },
            className: { type: 'string', example: '10A' },
            section: { type: 'string', example: 'A' },
            admissionDate: { type: 'string', format: 'date', example: '2022-09-01' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'graduated'], example: 'active' },
            parent: { type: 'string', example: '507f1f77bcf86cd799439033' },
            medicalInfo: { $ref: '#/components/schemas/MedicalInfo' },
            previousSchool: { $ref: '#/components/schemas/PreviousSchool' },
            documents: { type: 'array', items: { $ref: '#/components/schemas/Document' } },
            age: { type: 'number', readOnly: true, example: 14 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Time Slot Schema
        TimeSlot: {
          type: 'object',
          properties: {
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '10:00' },
            subject: { type: 'string', example: 'Mathematics' },
            class: { type: 'string', example: '10A' },
            room: { type: 'string', example: 'Room 101' }
          }
        },

        // Schedule Schema
        Schedule: {
          type: 'object',
          properties: {
            day: { type: 'string', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], example: 'Monday' },
            timeSlots: { type: 'array', items: { $ref: '#/components/schemas/TimeSlot' } }
          }
        },

        // Class Assignment Schema
        ClassAssignment: {
          type: 'object',
          properties: {
            level: { type: 'string', example: 'Grade 10' },
            className: { type: 'string', example: '10A' },
            subject: { type: 'string', example: 'Mathematics' }
          }
        },

        // Teacher Schema
        Teacher: {
          type: 'object',
          required: ['user', 'employeeId', 'dateOfBirth', 'gender', 'qualification', 'specialization', 'salary'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439044' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            employeeId: { type: 'string', example: 'T987654' },
            dateOfBirth: { type: 'string', format: 'date', example: '1980-05-20' },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'female' },
            address: { $ref: '#/components/schemas/Address' },
            qualification: { type: 'string', example: 'MSc Mathematics' },
            specialization: { type: 'string', example: 'Algebra' },
            subjects: { type: 'array', items: { type: 'string' }, example: ['Math', 'Physics'] },
            experience: { type: 'number', example: 10 },
            joiningDate: { type: 'string', format: 'date', example: '2015-09-01' },
            salary: { type: 'number', example: 3500 },
            status: { type: 'string', enum: ['active', 'inactive', 'on-leave'], example: 'active' },
            classes: { type: 'array', items: { $ref: '#/components/schemas/ClassAssignment' } },
            schedule: { type: 'array', items: { $ref: '#/components/schemas/Schedule' } },
            documents: { type: 'array', items: { $ref: '#/components/schemas/Document' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Parent Schema
        Parent: {
          type: 'object',
          required: ['user', 'relationship'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439055' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            children: { type: 'array', items: { type: 'string' }, example: ['507f1f77bcf86cd799439022'] },
            relationship: { type: 'string', enum: ['father', 'mother', 'guardian'], example: 'father' },
            occupation: { type: 'string', example: 'Engineer' },
            address: { $ref: '#/components/schemas/Address' },
            emergencyContact: { $ref: '#/components/schemas/EmergencyContact' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Course Schedule Schema
        CourseSchedule: {
          type: 'object',
          properties: {
            day: { type: 'string', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], example: 'Monday' },
            startTime: { type: 'string', example: '09:00' },
            endTime: { type: 'string', example: '10:00' },
            room: { type: 'string', example: 'Room 101' }
          }
        },

        // Syllabus Item Schema
        SyllabusItem: {
          type: 'object',
          properties: {
            topic: { type: 'string', example: 'Linear Equations' },
            description: { type: 'string', example: 'Introduction to solving linear equations' },
            duration: { type: 'string', example: '2 weeks' }
          }
        },

        // Course Schema
        Course: {
          type: 'object',
          required: ['name', 'code', 'level', 'subject', 'academicYear', 'semester'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439066' },
            name: { type: 'string', example: 'Advanced Mathematics' },
            code: { type: 'string', example: 'MATH101' },
            description: { type: 'string', example: 'Advanced topics in mathematics for Grade 10' },
            level: { type: 'string', example: 'Grade 10' },
            subject: { type: 'string', example: 'Mathematics' },
            teacher: { type: 'string', example: '507f1f77bcf86cd799439044' },
            credits: { type: 'number', example: 3 },
            maxStudents: { type: 'number', example: 30 },
            enrolledStudents: { type: 'array', items: { type: 'string' }, example: ['507f1f77bcf86cd799439022'] },
            schedule: { type: 'array', items: { $ref: '#/components/schemas/CourseSchedule' } },
            syllabus: { type: 'array', items: { $ref: '#/components/schemas/SyllabusItem' } },
            status: { type: 'string', enum: ['active', 'inactive', 'completed'], example: 'active' },
            academicYear: { type: 'string', example: '2024-2025' },
            semester: { type: 'string', enum: ['1', '2', 'Summer'], example: '1' },
            enrollmentCount: { type: 'number', readOnly: true, example: 25 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Grade Schema
        Grade: {
          type: 'object',
          required: ['student', 'course', 'examType', 'subject', 'marks', 'totalMarks', 'teacher', 'academicYear', 'semester', 'examDate'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439077' },
            student: { type: 'string', example: '507f1f77bcf86cd799439022' },
            course: { type: 'string', example: '507f1f77bcf86cd799439066' },
            examType: { type: 'string', enum: ['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'], example: 'midterm' },
            subject: { type: 'string', example: 'Mathematics' },
            marks: { type: 'number', minimum: 0, example: 85 },
            totalMarks: { type: 'number', minimum: 1, example: 100 },
            percentage: { type: 'number', minimum: 0, maximum: 100, readOnly: true, example: 85 },
            grade: { type: 'string', enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'], readOnly: true, example: 'A' },
            remarks: { type: 'string', example: 'Excellent performance' },
            teacher: { type: 'string', example: '507f1f77bcf86cd799439044' },
            academicYear: { type: 'string', example: '2024-2025' },
            semester: { type: 'string', enum: ['1', '2', 'Summer'], example: '1' },
            examDate: { type: 'string', format: 'date', example: '2025-01-15' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Assignment Submission Schema
        AssignmentSubmission: {
          type: 'object',
          properties: {
            student: { type: 'string', example: '507f1f77bcf86cd799439022' },
            submittedAt: { type: 'string', format: 'date-time', example: '2025-01-10T14:30:00Z' },
            attachments: { type: 'array', items: { $ref: '#/components/schemas/Document' } },
            marks: { type: 'number', minimum: 0, example: 45 },
            feedback: { type: 'string', example: 'Good work, but needs improvement in problem 3' },
            status: { type: 'string', enum: ['submitted', 'graded', 'late'], example: 'graded' }
          }
        },

        // Assignment Schema
        Assignment: {
          type: 'object',
          required: ['title', 'description', 'course', 'teacher', 'subject', 'level', 'className', 'dueDate', 'totalMarks'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439088' },
            title: { type: 'string', example: 'Linear Equations Worksheet' },
            description: { type: 'string', example: 'Solve the following linear equations and show your work' },
            course: { type: 'string', example: '507f1f77bcf86cd799439066' },
            teacher: { type: 'string', example: '507f1f77bcf86cd799439044' },
            subject: { type: 'string', example: 'Mathematics' },
            level: { type: 'string', example: 'Grade 10' },
            className: { type: 'string', example: '10A' },
            dueDate: { type: 'string', format: 'date-time', example: '2025-01-20T23:59:59Z' },
            totalMarks: { type: 'number', minimum: 1, example: 50 },
            attachments: { type: 'array', items: { $ref: '#/components/schemas/Document' } },
            submissions: { type: 'array', items: { $ref: '#/components/schemas/AssignmentSubmission' } },
            status: { type: 'string', enum: ['active', 'closed', 'draft'], example: 'active' },
            isOverdue: { type: 'boolean', readOnly: true, example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Attendance Schema
        Attendance: {
          type: 'object',
          required: ['student', 'date', 'status', 'academicYear', 'semester'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439099' },
            student: { type: 'string', example: '507f1f77bcf86cd799439022' },
            course: { type: 'string', example: '507f1f77bcf86cd799439066' },
            date: { type: 'string', format: 'date', example: '2025-01-15' },
            status: { type: 'string', enum: ['present', 'absent', 'late', 'excused'], example: 'present' },
            subject: { type: 'string', example: 'Mathematics' },
            teacher: { type: 'string', example: '507f1f77bcf86cd799439044' },
            remarks: { type: 'string', example: 'Arrived 10 minutes late' },
            academicYear: { type: 'string', example: '2024-2025' },
            semester: { type: 'string', enum: ['1', '2', 'Summer'], example: '1' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Payment Schema
        Payment: {
          type: 'object',
          required: ['student', 'type', 'amount', 'dueDate', 'academicYear'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd7994390AA' },
            student: { type: 'string', example: '507f1f77bcf86cd799439022' },
            type: { type: 'string', enum: ['tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'], example: 'tuition' },
            amount: { type: 'number', minimum: 0, example: 1500 },
            currency: { type: 'string', example: 'USD' },
            status: { type: 'string', enum: ['pending', 'paid', 'overdue', 'cancelled', 'refunded'], example: 'paid' },
            dueDate: { type: 'string', format: 'date', example: '2025-01-31' },
            paidDate: { type: 'string', format: 'date', example: '2025-01-15' },
            paymentMethod: { type: 'string', enum: ['cash', 'card', 'bank-transfer', 'cheque', 'online'], example: 'online' },
            transactionId: { type: 'string', example: 'TXN123456789' },
            remarks: { type: 'string', example: 'Semester 1 tuition fee' },
            academicYear: { type: 'string', example: '2024-2025' },
            semester: { type: 'string', enum: ['1', '2', 'Summer'], example: '1' },
            receiptNumber: { type: 'string', example: 'RCP-1705329600000' },
            invoiceUrl: { type: 'string', example: 'https://storage.example.com/invoice123.pdf' },
            isOverdue: { type: 'boolean', readOnly: true, example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Message Schema
        Message: {
          type: 'object',
          required: ['sender', 'recipient', 'subject', 'content'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd7994390BB' },
            sender: { type: 'string', example: '507f1f77bcf86cd799439044' },
            recipient: { type: 'string', example: '507f1f77bcf86cd799439011' },
            subject: { type: 'string', example: 'Assignment Submission' },
            content: { type: 'string', example: 'Please submit your assignment by the due date.' },
            attachments: { type: 'array', items: { $ref: '#/components/schemas/Document' } },
            isRead: { type: 'boolean', example: false },
            readAt: { type: 'string', format: 'date-time', example: '2025-01-16T09:30:00Z' },
            priority: { type: 'string', enum: ['low', 'normal', 'high'], example: 'normal' },
            category: { type: 'string', enum: ['academic', 'administrative', 'general', 'urgent'], example: 'academic' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Event Schema
        Event: {
          type: 'object',
          required: ['title', 'type', 'startDate', 'endDate'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd7994390CC' },
            title: { type: 'string', example: 'Annual Sports Day' },
            description: { type: 'string', example: 'Inter-class sports competition for all students' },
            type: { type: 'string', enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'], example: 'sports' },
            startDate: { type: 'string', format: 'date-time', example: '2025-02-15T08:00:00Z' },
            endDate: { type: 'string', format: 'date-time', example: '2025-02-15T17:00:00Z' },
            location: { type: 'string', example: 'School Sports Ground' },
            organizer: { type: 'string', example: '507f1f77bcf86cd799439044' },
            participants: { type: 'array', items: { type: 'string' }, example: ['507f1f77bcf86cd799439022'] },
            targetAudience: { type: 'string', enum: ['all', 'students', 'teachers', 'parents', 'staff'], example: 'students' },
            levels: { type: 'array', items: { type: 'string' }, example: ['Grade 9', 'Grade 10', 'Grade 11'] },
            status: { type: 'string', enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], example: 'scheduled' },
            isPublic: { type: 'boolean', example: true },
            attachments: { type: 'array', items: { $ref: '#/components/schemas/Document' } },
            maxParticipants: { type: 'number', example: 100 },
            participantCount: { type: 'number', readOnly: true, example: 75 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Cantine Item Schema
        CantineItem: {
          type: 'object',
          required: ['name', 'category', 'price'],
          properties: {
            name: { type: 'string', example: 'Chicken Sandwich' },
            category: { type: 'string', enum: ['main', 'side', 'drink', 'dessert'], example: 'main' },
            price: { type: 'number', minimum: 0, example: 5.99 },
            quantity: { type: 'number', minimum: 1, example: 2 }
          }
        },

        // Cantine Schema
        Cantine: {
          type: 'object',
          required: ['student', 'date', 'mealType', 'items', 'totalAmount'],
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd7994390DD' },
            student: { type: 'string', example: '507f1f77bcf86cd799439022' },
            date: { type: 'string', format: 'date', example: '2025-01-15' },
            mealType: { type: 'string', enum: ['breakfast', 'lunch', 'snack', 'dinner'], example: 'lunch' },
            items: { type: 'array', items: { $ref: '#/components/schemas/CantineItem' } },
            totalAmount: { type: 'number', minimum: 0, example: 12.50 },
            status: { type: 'string', enum: ['pending', 'confirmed', 'served', 'cancelled'], example: 'confirmed' },
            paymentStatus: { type: 'string', enum: ['pending', 'paid'], example: 'paid' },
            specialInstructions: { type: 'string', example: 'No onions please' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Generic Error Response
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error message here' }
          }
        },

        // Generic Success Response
        Success: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Users', description: 'User management operations' },
      { name: 'Students', description: 'Student management operations' },
      { name: 'Teachers', description: 'Teacher management operations' },
      { name: 'Parents', description: 'Parent management operations' },
      { name: 'Courses', description: 'Course management operations' },
      { name: 'Grades', description: 'Grade tracking and management' },
      { name: 'Assignments', description: 'Assignment and homework management' },
      { name: 'Attendance', description: 'Attendance tracking' },
      { name: 'Payments', description: 'Payment and fee management' },
      { name: 'Messages', description: 'Internal messaging system' },
      { name: 'Events', description: 'School events and activities' },
      { name: 'Cantine', description: 'Cafeteria and meal ordering' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
