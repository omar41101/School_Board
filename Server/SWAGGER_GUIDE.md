# Swagger API Documentation

## 🎉 Swagger UI Successfully Integrated!

Your School Management ERP API now has **interactive API documentation** powered by Swagger/OpenAPI.

## 📍 Access Swagger UI

Once your server is running, access the interactive documentation at:

```
http://localhost:5000/api-docs
```

 

## 🔐 How to Use Authentication

### Step 1: Register or Login

1. Navigate to the **Authentication** section
2. Click on `POST /api/auth/login` or `POST /api/auth/register`
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "email": "admin@school.com",
     "password": "admin123"
   }
   ```
5. Click "Execute"
6. Copy the `token` from the response

### Step 2: Authorize

1. Click the **"Authorize"** button at the top of the page (🔓 icon)
2. Paste your token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"
4. All subsequent requests will include this token automatically

### Step 3: Test Endpoints

Now you can test any protected endpoint:
- Navigate to any endpoint
- Click "Try it out"
- Modify the request parameters/body as needed
- Click "Execute"
- View the response

## 📖 Endpoint Examples

# 

### Create a Course

**Endpoint**: `POST /api/courses`

**Request Body**:
```json
{
  "name": "Mathematics - Advanced",
  "code": "MATH101",
  "description": "Advanced mathematics course",
  "level": "Grade 10",
  "subject": "Mathematics",
  "teacher": "507f1f77bcf86cd799439011",
  "academicYear": "2024-2025",
  "semester": "1",
  "maxStudents": 30
}
```

### Submit an Assignment

**Endpoint**: `POST /api/assignments/{id}/submit`

**Request Body**:
```json
{
  "student": "507f1f77bcf86cd799439011",
  "attachments": [
    {
      "name": "homework.pdf",
      "url": "https://example.com/files/homework.pdf"
    }
  ]
}
```

## 🛠️ Customization

### Adding Documentation to New Endpoints

When you add new routes, document them using JSDoc comments:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Brief description
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *       401:
 *         description: Unauthorized
 */
router.get('/your-endpoint', protect, yourController);
```

### Adding New Schemas

Edit `src/config/swagger.js` to add new data models:

```javascript
components: {
  schemas: {
    YourModel: {
      type: 'object',
      required: ['field1', 'field2'],
      properties: {
        field1: {
          type: 'string',
          example: 'example value'
        }
      }
    }
  }
}
```

## 📥 Export Documentation

### JSON Format

Access the raw OpenAPI specification:
```
http://localhost:5000/api-docs.json
```

### Import to Postman

1. In Postman, click "Import"
2. Select "Link"
3. Enter: `http://localhost:5000/api-docs.json`
4. Click "Continue" → "Import"

All your API endpoints will be imported with examples!

## 🎨 Customization Options

The Swagger UI is configured with:
- Custom site title: "School ERP API Docs"
- Hidden top bar for cleaner interface
- Automatic token management
- Request/response examples

To modify the appearance, edit `src/server.js`:

```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Your Custom Title',
  customfavIcon: '/path/to/icon.png'
}));
```

 