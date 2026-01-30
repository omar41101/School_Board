# School Management Server

A NestJS backend application for School Management ERP System using PostgreSQL and Prisma.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger** - API Documentation

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run migrations:
```bash
npm run prisma:migrate
```

5. Seed the database (optional):
```bash
npm run prisma:seed
```

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:5000/api-docs
- Health Check: http://localhost:5000/health

## Default Credentials

After seeding:
- Admin: admin@school.com / admin123
- Teacher: teacher1@school.com / teacher123
- Student: student1@school.com / student123
- Parent: parent1@school.com / parent123

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # Users module
├── students/          # Students module
├── teachers/          # Teachers module
├── parents/           # Parents module
├── courses/           # Courses module
├── grades/            # Grades module
├── assignments/       # Assignments module
├── attendance/        # Attendance module
├── payments/          # Payments module
├── events/            # Events module
├── messages/          # Messages module
├── cantine/           # Cantine module
├── prisma/            # Prisma service
└── main.ts            # Application entry point
```

## Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio
