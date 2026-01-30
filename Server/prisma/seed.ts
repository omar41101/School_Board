import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@school.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890',
      isActive: true,
    },
  });

  // Create teacher users
  const teacher1Password = await bcrypt.hash('teacher123', 10);
  const teacher1User = await prisma.user.upsert({
    where: { email: 'teacher1@school.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'teacher1@school.com',
      password: teacher1Password,
      role: 'teacher',
      phone: '+1234567891',
      isActive: true,
    },
  });

  const teacher1 = await prisma.teacher.upsert({
    where: { userId: teacher1User.id },
    update: {},
    create: {
      userId: teacher1User.id,
      employeeId: 'EMP001',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'male',
      qualification: 'Masters in Education',
      specialization: 'Mathematics',
      salary: 50000,
      subjects: ['Mathematics', 'Physics'],
      experience: 5,
      addressCity: 'New York',
      addressState: 'NY',
      addressCountry: 'USA',
    },
  });

  // Create student users
  const student1Password = await bcrypt.hash('student123', 10);
  const student1User = await prisma.user.upsert({
    where: { email: 'student1@school.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'student1@school.com',
      password: student1Password,
      role: 'student',
      phone: '+1234567892',
      isActive: true,
    },
  });

  const student1 = await prisma.student.upsert({
    where: { userId: student1User.id },
    update: {},
    create: {
      userId: student1User.id,
      matricule: 'STU001',
      dateOfBirth: new Date('2010-03-20'),
      gender: 'female',
      level: 'Grade 10',
      className: '10-A',
      section: 'Science',
      addressCity: 'New York',
      addressState: 'NY',
      addressCountry: 'USA',
      status: 'active',
    },
  });

  // Create parent user
  const parent1Password = await bcrypt.hash('parent123', 10);
  const parent1User = await prisma.user.upsert({
    where: { email: 'parent1@school.com' },
    update: {},
    create: {
      firstName: 'Robert',
      lastName: 'Smith',
      email: 'parent1@school.com',
      password: parent1Password,
      role: 'parent',
      phone: '+1234567893',
      isActive: true,
    },
  });

  const parent1 = await prisma.parent.upsert({
    where: { userId: parent1User.id },
    update: {},
    create: {
      userId: parent1User.id,
      relationship: 'father',
      occupation: 'Engineer',
      addressCity: 'New York',
      addressState: 'NY',
      addressCountry: 'USA',
    },
  });

  // Update student with parent
  await prisma.student.update({
    where: { id: student1.id },
    data: { parentId: parent1.id },
  });

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { code: 'MATH101' },
    update: {},
    create: {
      name: 'Mathematics 101',
      code: 'MATH101',
      description: 'Introduction to Mathematics',
      level: 'Grade 10',
      subject: 'Mathematics',
      teacherId: teacher1.id,
      credits: 3,
      maxStudents: 30,
      enrolledStudents: [student1.id],
      schedule: [{ day: 'Monday', time: '09:00-10:30' }],
      academicYear: '2024-2025',
      semester: 'S1',
      status: 'active',
    },
  });

  const course2 = await prisma.course.upsert({
    where: { code: 'PHY101' },
    update: {},
    create: {
      name: 'Physics 101',
      code: 'PHY101',
      description: 'Introduction to Physics',
      level: 'Grade 10',
      subject: 'Physics',
      teacherId: teacher1.id,
      credits: 3,
      maxStudents: 30,
      enrolledStudents: [student1.id],
      schedule: [{ day: 'Wednesday', time: '09:00-10:30' }],
      academicYear: '2024-2025',
      semester: 'S1',
      status: 'active',
    },
  });

  // Create grades
  await prisma.grade.createMany({
    data: [
      {
        studentId: student1.id,
        courseId: course1.id,
        examType: 'quiz',
        subject: 'Mathematics',
        marks: 85,
        totalMarks: 100,
        percentage: 85,
        grade: 'B',
        teacherId: teacher1.id,
        academicYear: '2024-2025',
        semester: 'S1',
        examDate: new Date('2024-10-15'),
      },
      {
        studentId: student1.id,
        courseId: course1.id,
        examType: 'midterm',
        subject: 'Mathematics',
        marks: 92,
        totalMarks: 100,
        percentage: 92,
        grade: 'A',
        teacherId: teacher1.id,
        academicYear: '2024-2025',
        semester: 'S1',
        examDate: new Date('2024-11-01'),
      },
    ],
  });

  // Create assignments
  await prisma.assignment.create({
    data: {
      title: 'Algebra Homework',
      description: 'Complete exercises 1-20 from Chapter 5',
      courseId: course1.id,
      teacherId: teacher1.id,
      subject: 'Mathematics',
      level: 'Grade 10',
      className: '10-A',
      dueDate: new Date('2024-10-25'),
      totalMarks: 20,
      attachments: [],
      submissions: [],
      status: 'active',
    },
  });

  // Create attendance records
  await prisma.attendance.createMany({
    data: [
      {
        studentId: student1.id,
        courseId: course1.id,
        date: new Date('2024-10-14'),
        status: 'present',
        subject: 'Mathematics',
        teacherId: teacher1.id,
        academicYear: '2024-2025',
        semester: 'S1',
      },
      {
        studentId: student1.id,
        courseId: course1.id,
        date: new Date('2024-10-15'),
        status: 'present',
        subject: 'Mathematics',
        teacherId: teacher1.id,
        academicYear: '2024-2025',
        semester: 'S1',
      },
    ],
  });

  // Create payments
  await prisma.payment.create({
    data: {
      studentId: student1.id,
      type: 'tuition',
      amount: 1000,
      currency: 'USD',
      status: 'paid',
      dueDate: new Date('2024-09-01'),
      paidDate: new Date('2024-09-01'),
      paymentMethod: 'online',
      transactionId: 'TXN001',
      academicYear: '2024-2025',
      semester: 'S1',
      receiptNumber: 'RCP-001',
    },
  });

  // Create events
  await prisma.event.create({
    data: {
      title: 'School Annual Day',
      description: 'Annual day celebration with cultural programs',
      type: 'cultural',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-20'),
      location: 'School Auditorium',
      organizerId: adminUser.id,
      participants: [],
      targetAudience: 'all',
      levels: ['All'],
      status: 'scheduled',
      isPublic: true,
      attachments: [],
    },
  });

  // Create messages
  await prisma.message.create({
    data: {
      senderId: teacher1User.id,
      recipientId: parent1User.id,
      subject: 'Student Progress Update',
      content: 'Your child is performing well in Mathematics.',
      attachments: [],
      isRead: false,
      priority: 'normal',
      category: 'academic',
    },
  });

  // Create cantine orders
  await prisma.cantine.create({
    data: {
      studentId: student1.id,
      date: new Date('2024-10-15'),
      mealType: 'lunch',
      items: [{ name: 'Rice and Curry', price: 5, quantity: 1 }],
      totalAmount: 5,
      status: 'confirmed',
      paymentStatus: 'paid',
      specialInstructions: 'No spicy food',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📊 Created:');
  console.log(`   - 1 Admin user (admin@school.com / admin123)`);
  console.log(`   - 1 Teacher user (teacher1@school.com / teacher123)`);
  console.log(`   - 1 Student user (student1@school.com / student123)`);
  console.log(`   - 1 Parent user (parent1@school.com / parent123)`);
  console.log(`   - 2 Courses`);
  console.log(`   - 2 Grades`);
  console.log(`   - 1 Assignment`);
  console.log(`   - 2 Attendance records`);
  console.log(`   - 1 Payment`);
  console.log(`   - 1 Event`);
  console.log(`   - 1 Message`);
  console.log(`   - 1 Cantine order`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
