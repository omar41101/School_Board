const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management ERP API',
      version: '1.0.0',
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
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@school.com'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['admin', 'student', 'teacher', 'parent', 'direction'],
              example: 'student'
            },
            avatar: {
              type: 'string',
              example: 'https://via.placeholder.com/150'
            },
            phone: {
              type: 'string',
              example: '+1234567890'
            }
          }
        },
        Student: {
          type: 'object',
          required: ['user', 'matricule', 'dateOfBirth', 'gender', 'level', 'className'],
          properties: {
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            matricule: {
              type: 'string',
              example: 'STU2025001'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              example: '2010-05-15'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              example: 'male'
            },
            level: {
              type: 'string',
              example: 'Grade 10'
            },
            className: {
              type: 'string',
              example: '10-A'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended', 'graduated'],
              example: 'active'
            }
          }
        },
        Course: {
          type: 'object',
          required: ['name', 'code', 'level', 'subject', 'academicYear', 'semester'],
          properties: {
            name: {
              type: 'string',
              example: 'Mathematics - Advanced'
            },
            code: {
              type: 'string',
              example: 'MATH101'
            },
            level: {
              type: 'string',
              example: 'Grade 10'
            },
            subject: {
              type: 'string',
              example: 'Mathematics'
            },
            teacher: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            academicYear: {
              type: 'string',
              example: '2024-2025'
            },
            semester: {
              type: 'string',
              enum: ['1', '2', 'Summer'],
              example: '1'
            }
          }
        },
        Grade: {
          type: 'object',
          required: ['student', 'course', 'examType', 'subject', 'marks', 'totalMarks', 'teacher', 'examDate', 'academicYear', 'semester'],
          properties: {
            student: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            course: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            examType: {
              type: 'string',
              enum: ['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'],
              example: 'midterm'
            },
            subject: {
              type: 'string',
              example: 'Mathematics'
            },
            marks: {
              type: 'number',
              example: 85
            },
            totalMarks: {
              type: 'number',
              example: 100
            },
            examDate: {
              type: 'string',
              format: 'date',
              example: '2025-01-15'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Error message here'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Users',
        description: 'User management operations'
      },
      {
        name: 'Students',
        description: 'Student management operations'
      },
      {
        name: 'Teachers',
        description: 'Teacher management operations'
      },
      {
        name: 'Parents',
        description: 'Parent management operations'
      },
      {
        name: 'Courses',
        description: 'Course management operations'
      },
      {
        name: 'Grades',
        description: 'Grade tracking and management'
      },
      {
        name: 'Assignments',
        description: 'Assignment and homework management'
      },
      {
        name: 'Attendance',
        description: 'Attendance tracking'
      },
      {
        name: 'Payments',
        description: 'Payment and fee management'
      },
      {
        name: 'Messages',
        description: 'Internal messaging system'
      },
      {
        name: 'Events',
        description: 'School events and activities'
      },
      {
        name: 'Cantine',
        description: 'Cafeteria and meal ordering'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
