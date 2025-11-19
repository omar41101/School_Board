const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./src/models/User.model');
const Student = require('./src/models/Student.model');
const Teacher = require('./src/models/Teacher.model');
const Parent = require('./src/models/Parent.model');
const Course = require('./src/models/Course.model');
const Grade = require('./src/models/Grade.model');
const Assignment = require('./src/models/Assignment.model');
const Attendance = require('./src/models/Attendance.model');
const Payment = require('./src/models/Payment.model');
const Message = require('./src/models/Message.model');
const Event = require('./src/models/Event.model');
const Cantine = require('./src/models/Cantine.model');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Clear all data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Parent.deleteMany({});
    await Course.deleteMany({});
    await Grade.deleteMany({});
    await Assignment.deleteMany({});
    await Attendance.deleteMany({});
    await Payment.deleteMany({});
    await Message.deleteMany({});
    await Event.deleteMany({});
    await Cantine.deleteMany({});
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

// Seed data
const seedData = async () => {
  try {
    // 1. Create Admin User
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin',
    });

    // 2. Create Direction User
    const directionUser = await User.create({
      firstName: 'Principal',
      lastName: 'Anderson',
      email: 'principal@school.com',
      password: 'principal123',
      role: 'direction',
    });

    // 3. Create Teacher Users
    const teacher1User = await User.create({
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@school.com',
      password: 'teacher123',
      role: 'teacher',
    });

    const teacher2User = await User.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@school.com',
      password: 'teacher123',
      role: 'teacher',
    });

    const teacher3User = await User.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@school.com',
      password: 'teacher123',
      role: 'teacher',
    });

    // 4. Create Teacher Profiles
    const teacher1 = await Teacher.create({
      user: teacher1User._id,
      employeeId: 'TCH001',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      qualification: 'PhD in Mathematics',
      specialization: 'Advanced Mathematics & Algebra',
      subjects: ['Mathematics', 'Algebra', 'Geometry'],
      experience: 9,
      joiningDate: new Date('2015-09-01'),
      salary: 75000,
      address: {
        street: '123 Teacher St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        country: 'USA',
      },
      classes: [
        { level: 'Grade 10', className: '10-A', subject: 'Mathematics' },
        { level: 'Grade 10', className: '10-B', subject: 'Mathematics' },
      ],
      emergencyContact: {
        name: 'Robert Dubois',
        relationship: 'Spouse',
        phone: '555-0101',
      },
    });

    const teacher2 = await Teacher.create({
      user: teacher2User._id,
      employeeId: 'TCH002',
      dateOfBirth: new Date('1988-07-22'),
      gender: 'male',
      qualification: 'MSc in Physics',
      specialization: 'Classical & Quantum Physics',
      subjects: ['Physics', 'Chemistry'],
      experience: 8,
      joiningDate: new Date('2016-09-01'),
      salary: 72000,
      address: {
        street: '456 Science Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02102',
        country: 'USA',
      },
      classes: [
        { level: 'Grade 10', className: '10-A', subject: 'Physics' },
        { level: 'Grade 9', className: '9-B', subject: 'Physics' },
      ],
      emergencyContact: {
        name: 'Emily Smith',
        relationship: 'Spouse',
        phone: '555-0102',
      },
    });

    const teacher3 = await Teacher.create({
      user: teacher3User._id,
      employeeId: 'TCH003',
      dateOfBirth: new Date('1990-11-10'),
      gender: 'female',
      qualification: 'MA in English Literature',
      specialization: 'English Literature & Writing',
      subjects: ['English', 'Literature', 'Writing'],
      experience: 6,
      joiningDate: new Date('2018-09-01'),
      salary: 68000,
      address: {
        street: '789 Language Ln',
        city: 'Boston',
        state: 'MA',
        zipCode: '02103',
        country: 'USA',
      },
      classes: [
        { level: 'Grade 10', className: '10-A', subject: 'English' },
        { level: 'Grade 9', className: '9-B', subject: 'English' },
      ],
      emergencyContact: {
        name: 'Michael Johnson',
        relationship: 'Spouse',
        phone: '555-0103',
      },
    });

    // 5. Create Student Users
    const student1User = await User.create({
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.wilson@student.school.com',
      password: 'student123',
      role: 'student',
    });

    const student2User = await User.create({
      firstName: 'James',
      lastName: 'Brown',
      email: 'james.brown@student.school.com',
      password: 'student123',
      role: 'student',
    });

    const student3User = await User.create({
      firstName: 'Olivia',
      lastName: 'Davis',
      email: 'olivia.davis@student.school.com',
      password: 'student123',
      role: 'student',
    });

    const student4User = await User.create({
      firstName: 'Lucas',
      lastName: 'Martinez',
      email: 'lucas.martinez@student.school.com',
      password: 'student123',
      role: 'student',
    });

    // 6. Create Student Profiles
    const student1 = await Student.create({
      user: student1User._id,
      matricule: 'STU2024001',
      dateOfBirth: new Date('2008-05-15'),
      gender: 'female',
      level: 'Grade 10',
      className: '10-A',
      address: {
        street: '123 Student St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02104',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Mary Wilson',
        relationship: 'Mother',
        phone: '555-0201',
      },
    });

    const student2 = await Student.create({
      user: student2User._id,
      matricule: 'STU2024002',
      dateOfBirth: new Date('2008-08-22'),
      gender: 'male',
      level: 'Grade 10',
      className: '10-A',
      address: {
        street: '456 Learner Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02105',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Robert Brown',
        relationship: 'Father',
        phone: '555-0202',
      },
    });

    const student3 = await Student.create({
      user: student3User._id,
      matricule: 'STU2024003',
      dateOfBirth: new Date('2008-03-10'),
      gender: 'female',
      level: 'Grade 10',
      className: '10-A',
      address: {
        street: '789 Education Blvd',
        city: 'Boston',
        state: 'MA',
        zipCode: '02106',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Jennifer Davis',
        relationship: 'Mother',
        phone: '555-0203',
      },
    });

    const student4 = await Student.create({
      user: student4User._id,
      matricule: 'STU2024004',
      dateOfBirth: new Date('2009-12-05'),
      gender: 'male',
      level: 'Grade 9',
      className: '9-B',
      address: {
        street: '321 School Rd',
        city: 'Boston',
        state: 'MA',
        zipCode: '02107',
        country: 'USA',
      },
      emergencyContact: {
        name: 'Carlos Martinez',
        relationship: 'Father',
        phone: '555-0204',
      },
    });

    // 7. Create Parent Users
    const parent1User = await User.create({
      firstName: 'Mary',
      lastName: 'Wilson',
      email: 'mary.wilson@email.com',
      password: 'parent123',
      role: 'parent',
    });

    const parent1 = await Parent.create({
      user: parent1User._id,
      children: [student1._id],
      relationship: 'mother',
      occupation: 'Software Engineer',
      address: {
        street: '123 Student St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02104',
        country: 'USA',
      },
    });

    // 8. Create Courses
    const mathCourse = await Course.create({
      name: 'Mathematics - Advanced',
      code: 'MATH101',
      description: 'Advanced mathematics for grade 10',
      level: 'Grade 10',
      subject: 'Mathematics',
      teacher: teacher1._id,
      academicYear: '2024-2025',
      semester: '1',
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
        { day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
        { day: 'Friday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
      ],
      enrolledStudents: [student1._id, student2._id, student3._id],
      maxStudents: 30,
    });

    const physicsCourse = await Course.create({
      name: 'Physics - Fundamentals',
      code: 'PHY101',
      description: 'Introduction to physics',
      level: 'Grade 10',
      subject: 'Physics',
      teacher: teacher2._id,
      academicYear: '2024-2025',
      semester: '1',
      schedule: [
        { day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Lab 201' },
        { day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Lab 201' },
      ],
      enrolledStudents: [student1._id, student2._id, student3._id],
      maxStudents: 25,
    });

    const englishCourse = await Course.create({
      name: 'English Literature',
      code: 'ENG101',
      description: 'Study of classic and modern literature',
      level: 'Grade 10',
      subject: 'English',
      teacher: teacher3._id,
      academicYear: '2024-2025',
      semester: '1',
      schedule: [
        { day: 'Monday', startTime: '14:00', endTime: '15:30', room: 'Room 301' },
        { day: 'Thursday', startTime: '14:00', endTime: '15:30', room: 'Room 301' },
      ],
      enrolledStudents: [student1._id, student2._id, student3._id],
      maxStudents: 30,
    });

    // 9. Create Grades for Student 1 (Emma)
    await Grade.create({
      student: student1._id,
      course: mathCourse._id,
      teacher: teacher1._id,
      examType: 'midterm',
      subject: 'Mathematics',
      marks: 92,
      totalMarks: 100,
      academicYear: '2024-2025',
      semester: '1',
      examDate: new Date('2024-11-01'),
      remarks: 'Excellent work on algebra and geometry!',
    });

    await Grade.create({
      student: student1._id,
      course: physicsCourse._id,
      teacher: teacher2._id,
      examType: 'midterm',
      subject: 'Physics',
      marks: 88,
      totalMarks: 100,
      academicYear: '2024-2025',
      semester: '1',
      examDate: new Date('2024-11-01'),
      remarks: 'Good understanding of mechanics.',
    });

    await Grade.create({
      student: student1._id,
      course: englishCourse._id,
      teacher: teacher3._id,
      examType: 'midterm',
      subject: 'English',
      marks: 95,
      totalMarks: 100,
      academicYear: '2024-2025',
      semester: '1',
      examDate: new Date('2024-11-01'),
      remarks: 'Outstanding essay writing skills!',
    });

    // Add some quiz grades
    await Grade.create({
      student: student1._id,
      course: mathCourse._id,
      teacher: teacher1._id,
      examType: 'quiz',
      subject: 'Mathematics',
      marks: 18,
      totalMarks: 20,
      academicYear: '2024-2025',
      semester: '1',
      examDate: new Date('2024-10-15'),
      remarks: 'Great work on quadratic equations!',
    });

    await Grade.create({
      student: student1._id,
      course: physicsCourse._id,
      teacher: teacher2._id,
      examType: 'quiz',
      subject: 'Physics',
      marks: 19,
      totalMarks: 20,
      academicYear: '2024-2025',
      semester: '1',
      examDate: new Date('2024-10-20'),
      remarks: 'Perfect understanding of Newton\'s laws!',
    });

    // 10. Create Assignments
    const mathAssignment = await Assignment.create({
      title: 'Quadratic Equations Practice',
      description: 'Solve 20 quadratic equation problems from chapter 5',
      course: mathCourse._id,
      teacher: teacher1._id,
      subject: 'Mathematics',
      level: 'Grade 10',
      className: '10-A',
      dueDate: new Date('2024-12-15'),
      totalMarks: 100,
      attachments: [
        { name: 'Assignment Sheet', url: '/files/math-assignment-1.pdf' },
      ],
    });

    const physicsAssignment = await Assignment.create({
      title: 'Newton\'s Laws Lab Report',
      description: 'Write a comprehensive lab report on Newton\'s three laws of motion based on the experiments conducted in class',
      course: physicsCourse._id,
      teacher: teacher2._id,
      subject: 'Physics',
      level: 'Grade 10',
      className: '10-A',
      dueDate: new Date('2024-12-20'),
      totalMarks: 100,
      attachments: [
        { name: 'Lab Instructions', url: '/files/physics-lab-1.pdf' },
      ],
    });

    const englishAssignment = await Assignment.create({
      title: 'Shakespeare Essay',
      description: 'Write a 1000-word analytical essay on themes in Hamlet',
      course: englishCourse._id,
      teacher: teacher3._id,
      subject: 'English',
      level: 'Grade 10',
      className: '10-A',
      dueDate: new Date('2024-12-18'),
      totalMarks: 100,
    });

    // 11. Create Attendance Records
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      await Attendance.create({
        student: student1._id,
        course: mathCourse._id,
        date: date,
        academicYear: '2024-2025',
        semester: '1',
        status: i % 5 === 0 ? 'late' : 'present',
        remarks: i % 5 === 0 ? 'Arrived 10 minutes late' : '',
      });

      await Attendance.create({
        student: student1._id,
        course: physicsCourse._id,
        date: date,
        academicYear: '2024-2025',
        semester: '1',
        status: 'present',
      });
    }

    // 12. Create Payments
    const payment1 = await Payment.create({
      student: student1._id,
      type: 'tuition',
      amount: 5000,
      dueDate: new Date('2024-09-01'),
      academicYear: '2024-2025',
      status: 'paid',
      paidDate: new Date('2024-08-28'),
      description: 'Fall Semester Tuition',
    });

    // Add small delay to ensure unique receipt numbers
    await new Promise(resolve => setTimeout(resolve, 10));

    const payment2 = await Payment.create({
      student: student1._id,
      type: 'library',
      amount: 500,
      dueDate: new Date('2024-09-15'),
      academicYear: '2024-2025',
      status: 'paid',
      paidDate: new Date('2024-09-10'),
      description: 'Library and Textbook Fees',
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    const payment3 = await Payment.create({
      student: student1._id,
      type: 'tuition',
      amount: 5000,
      dueDate: new Date('2025-01-15'),
      academicYear: '2024-2025',
      status: 'pending',
      description: 'Spring Semester Tuition',
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    const payment4 = await Payment.create({
      student: student1._id,
      type: 'sports',
      amount: 300,
      dueDate: new Date('2024-10-01'),
      academicYear: '2024-2025',
      status: 'overdue',
      description: 'Sports Activities Fee',
    });

    // 13. Create Messages
    await Message.create({
      sender: teacher1User._id,
      recipient: student1User._id,
      subject: 'Great work on the midterm!',
      content: 'Emma, I wanted to congratulate you on your excellent performance in the midterm exam. Keep up the good work!',
      isRead: false,
    });

    await Message.create({
      sender: directionUser._id,
      recipient: student1User._id,
      subject: 'School Event Reminder',
      content: 'Don\'t forget about the Science Fair next Friday. We hope to see you there!',
      isRead: false,
    });

    // 14. Create Events
    await Event.create({
      title: 'Science Fair 2024',
      description: 'Annual science fair showcasing student projects',
      type: 'academic',
      startDate: new Date('2024-12-10T09:00:00'),
      endDate: new Date('2024-12-10T16:00:00'),
      location: 'School Auditorium',
      organizer: directionUser._id,
      participants: [student1._id, student2._id, student3._id],
    });

    await Event.create({
      title: 'Winter Sports Day',
      description: 'Annual winter sports competition',
      type: 'sports',
      startDate: new Date('2024-12-20T10:00:00'),
      endDate: new Date('2024-12-20T15:00:00'),
      location: 'School Stadium',
      organizer: directionUser._id,
    });

    await Event.create({
      title: 'Parent-Teacher Conference',
      description: 'Quarterly parent-teacher meeting',
      type: 'meeting',
      startDate: new Date('2025-01-05T14:00:00'),
      endDate: new Date('2025-01-05T18:00:00'),
      location: 'School Cafeteria',
      organizer: directionUser._id,
    });

    await Event.create({
      title: 'Cultural Festival',
      description: 'Celebrate diversity with performances and food from around the world',
      type: 'cultural',
      startDate: new Date('2024-12-05T13:00:00'),
      endDate: new Date('2024-12-05T18:00:00'),
      location: 'School Grounds',
      organizer: directionUser._id,
    });

    // 15. Create Cantine Orders
    await Cantine.create({
      student: student1._id,
      date: new Date(),
      mealType: 'lunch',
      items: [
        { name: 'Chicken Sandwich', category: 'main', quantity: 1, price: 5.50 },
        { name: 'Orange Juice', category: 'drink', quantity: 1, price: 2.00 },
      ],
      totalAmount: 7.50,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    await Cantine.create({
      student: student1._id,
      date: new Date(Date.now() + 86400000), // Tomorrow
      mealType: 'lunch',
      items: [
        { name: 'Pasta Bowl', category: 'main', quantity: 1, price: 6.00 },
        { name: 'Water', category: 'drink', quantity: 1, price: 1.00 },
        { name: 'Apple Pie', category: 'dessert', quantity: 1, price: 3.00 },
      ],
      totalAmount: 10.00,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await Cantine.create({
      student: student1._id,
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      mealType: 'lunch',
      items: [
        { name: 'Pizza Slice', category: 'main', quantity: 2, price: 4.50 },
        { name: 'Soda', category: 'drink', quantity: 1, price: 1.50 },
      ],
      totalAmount: 10.50,
      status: 'pending',
      paymentStatus: 'pending',
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('─────────────────────────────────────');
    console.log('👤 Admin:');
    console.log('   Email: admin@school.com');
    console.log('   Password: admin123');
    console.log('\n👤 Principal:');
    console.log('   Email: principal@school.com');
    console.log('   Password: principal123');
    console.log('\n👨‍🏫 Teachers:');
    console.log('   Email: marie.dubois@school.com');
    console.log('   Password: teacher123');
    console.log('\n🎓 Students:');
    console.log('   Email: emma.wilson@student.school.com');
    console.log('   Password: student123');
    console.log('   (Use Emma to see full data)');
    console.log('\n👪 Parents:');
    console.log('   Email: mary.wilson@email.com');
    console.log('   Password: parent123');
    console.log('─────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  await connectDB();
  await clearData();
  await seedData();
  mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
};

// Run seeder
main();
