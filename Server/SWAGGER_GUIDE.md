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

