'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Bulk insert Users
    await queryInterface.bulkInsert('users', [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@school.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@school.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@school.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@school.com',
        password: hashedPassword,
        role: 'teacher',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@school.com',
        password: hashedPassword,
        role: 'teacher',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Robert',
        lastName: 'Doe',
        email: 'robert.doe@school.com',
        password: hashedPassword,
        role: 'parent',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Mary',
        lastName: 'Doe',
        email: 'mary.doe@school.com',
        password: hashedPassword,
        role: 'parent',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Get user IDs by querying
    const users = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE email IN ('admin@school.com', 'john.doe@school.com', 'jane.smith@school.com', 'michael.johnson@school.com', 'sarah.williams@school.com', 'david.brown@school.com', 'robert.doe@school.com', 'mary.doe@school.com') ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Map users by email for easier access
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.id;
    });

    const adminId = userMap['admin@school.com'];
    const student1Id = userMap['john.doe@school.com'];
    const student2Id = userMap['jane.smith@school.com'];
    const student3Id = userMap['michael.johnson@school.com'];
    const teacher1Id = userMap['sarah.williams@school.com'];
    const teacher2Id = userMap['david.brown@school.com'];
    const parent1Id = userMap['robert.doe@school.com'];
    const parent2Id = userMap['mary.doe@school.com'];

    // Bulk insert Parents
    await queryInterface.bulkInsert('parents', [
      {
        user_id: parent1Id,
        relationship: 'father',
        occupation: 'Engineer',
        address_city: 'New York',
        address_country: 'USA',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: parent2Id,
        relationship: 'mother',
        occupation: 'Doctor',
        address_city: 'New York',
        address_country: 'USA',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const parents = await queryInterface.sequelize.query(
      `SELECT id FROM parents WHERE user_id IN (${parent1Id}, ${parent2Id}) ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const parent1DbId = parents[0].id;
    const parent2DbId = parents[1].id;

    // Bulk insert Students
    await queryInterface.bulkInsert('students', [
      {
        user_id: student1Id,
        matricule: 'STU001',
        date_of_birth: new Date('2010-05-15'),
        gender: 'male',
        address_city: 'New York',
        address_country: 'USA',
        level: 'Grade 5',
        class_name: '5A',
        section: 'A',
        admission_date: new Date('2020-09-01'),
        status: 'active',
        parent_id: parent1DbId,
        blood_group: 'O+',
        allergies: JSON.stringify([]),
        medical_conditions: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: student2Id,
        matricule: 'STU002',
        date_of_birth: new Date('2011-08-20'),
        gender: 'female',
        address_city: 'New York',
        address_country: 'USA',
        level: 'Grade 4',
        class_name: '4B',
        section: 'B',
        admission_date: new Date('2021-09-01'),
        status: 'active',
        parent_id: parent1DbId,
        blood_group: 'A+',
        allergies: JSON.stringify(['Peanuts']),
        medical_conditions: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: student3Id,
        matricule: 'STU003',
        date_of_birth: new Date('2010-12-10'),
        gender: 'male',
        address_city: 'New York',
        address_country: 'USA',
        level: 'Grade 5',
        class_name: '5A',
        section: 'A',
        admission_date: new Date('2020-09-01'),
        status: 'active',
        parent_id: parent2DbId,
        blood_group: 'B+',
        allergies: JSON.stringify([]),
        medical_conditions: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const student1DbId = students[0];
    const student2DbId = students[1];
    const student3DbId = students[2];

    // Bulk insert Teachers
    await queryInterface.bulkInsert('teachers', [
      {
        user_id: teacher1Id,
        employee_id: 'EMP001',
        date_of_birth: new Date('1985-03-15'),
        gender: 'female',
        address_city: 'New York',
        address_country: 'USA',
        qualification: 'Masters in Education',
        specialization: 'Mathematics',
        subjects: JSON.stringify(['Mathematics', 'Algebra']),
        experience: 10,
        joining_date: new Date('2015-09-01'),
        salary: 50000.00,
        status: 'active',
        classes: JSON.stringify([
          { level: 'Grade 5', className: '5A', subject: 'Mathematics' },
          { level: 'Grade 4', className: '4B', subject: 'Mathematics' }
        ]),
        schedule: JSON.stringify([]),
        documents: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: teacher2Id,
        employee_id: 'EMP002',
        date_of_birth: new Date('1988-07-22'),
        gender: 'male',
        address_city: 'New York',
        address_country: 'USA',
        qualification: 'Bachelors in Science',
        specialization: 'Science',
        subjects: JSON.stringify(['Science', 'Physics', 'Chemistry']),
        experience: 7,
        joining_date: new Date('2018-09-01'),
        salary: 48000.00,
        status: 'active',
        classes: JSON.stringify([
          { level: 'Grade 5', className: '5A', subject: 'Science' }
        ]),
        schedule: JSON.stringify([]),
        documents: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const teacher1DbId = teachers[0];
    const teacher2DbId = teachers[1];

    // Bulk insert Courses
    await queryInterface.bulkInsert('courses', [
      {
        name: 'Mathematics Grade 5',
        code: 'MATH-5A',
        description: 'Advanced Mathematics for Grade 5',
        level: 'Grade 5',
        subject: 'Mathematics',
        teacher_id: teacher1DbId,
        credits: 3,
        max_students: 30,
        enrolled_students: JSON.stringify([student1DbId, student3DbId]),
        schedule: JSON.stringify([
          { day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'Room 101' },
          { day: 'Wednesday', startTime: '09:00', endTime: '10:00', room: 'Room 101' }
        ]),
        syllabus: JSON.stringify([
          { topic: 'Algebra Basics', description: 'Introduction to algebra', duration: '2 weeks' },
          { topic: 'Geometry', description: 'Basic shapes and angles', duration: '3 weeks' }
        ]),
        status: 'active',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mathematics Grade 4',
        code: 'MATH-4B',
        description: 'Mathematics for Grade 4',
        level: 'Grade 4',
        subject: 'Mathematics',
        teacher_id: teacher1DbId,
        credits: 3,
        max_students: 30,
        enrolled_students: JSON.stringify([student2DbId]),
        schedule: JSON.stringify([
          { day: 'Tuesday', startTime: '10:00', endTime: '11:00', room: 'Room 102' },
          { day: 'Thursday', startTime: '10:00', endTime: '11:00', room: 'Room 102' }
        ]),
        syllabus: JSON.stringify([
          { topic: 'Basic Arithmetic', description: 'Addition and subtraction', duration: '2 weeks' }
        ]),
        status: 'active',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science Grade 5',
        code: 'SCI-5A',
        description: 'General Science for Grade 5',
        level: 'Grade 5',
        subject: 'Science',
        teacher_id: teacher2DbId,
        credits: 3,
        max_students: 30,
        enrolled_students: JSON.stringify([student1DbId, student3DbId]),
        schedule: JSON.stringify([
          { day: 'Monday', startTime: '11:00', endTime: '12:00', room: 'Lab 1' },
          { day: 'Friday', startTime: '11:00', endTime: '12:00', room: 'Lab 1' }
        ]),
        syllabus: JSON.stringify([
          { topic: 'Biology Basics', description: 'Introduction to living things', duration: '4 weeks' }
        ]),
        status: 'active',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const courses = await queryInterface.sequelize.query(
      `SELECT id FROM courses WHERE code IN ('MATH-5A', 'MATH-4B', 'SCI-5A') ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const course1DbId = courses[0].id;
    const course2DbId = courses[1].id;
    const course3DbId = courses[2].id;

    // Bulk insert Grades
    await queryInterface.bulkInsert('grades', [
      {
        student_id: student1DbId,
        course_id: course1DbId,
        exam_type: 'quiz',
        subject: 'Mathematics',
        marks: 85.00,
        total_marks: 100.00,
        percentage: 85.00,
        grade: 'B+',
        remarks: 'Good performance',
        teacher_id: teacher1DbId,
        academic_year: '2024-2025',
        semester: '1',
        exam_date: new Date('2024-10-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student1DbId,
        course_id: course3DbId,
        exam_type: 'midterm',
        subject: 'Science',
        marks: 92.00,
        total_marks: 100.00,
        percentage: 92.00,
        grade: 'A',
        remarks: 'Excellent work',
        teacher_id: teacher2DbId,
        academic_year: '2024-2025',
        semester: '1',
        exam_date: new Date('2024-11-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student2DbId,
        course_id: course2DbId,
        exam_type: 'quiz',
        subject: 'Mathematics',
        marks: 78.00,
        total_marks: 100.00,
        percentage: 78.00,
        grade: 'B',
        remarks: 'Keep improving',
        teacher_id: teacher1DbId,
        academic_year: '2024-2025',
        semester: '1',
        exam_date: new Date('2024-10-16'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student3DbId,
        course_id: course1DbId,
        exam_type: 'quiz',
        subject: 'Mathematics',
        marks: 95.00,
        total_marks: 100.00,
        percentage: 95.00,
        grade: 'A+',
        remarks: 'Outstanding',
        teacher_id: teacher1DbId,
        academic_year: '2024-2025',
        semester: '1',
        exam_date: new Date('2024-10-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Bulk insert Assignments
    await queryInterface.bulkInsert('assignments', [
      {
        title: 'Algebra Homework 1',
        description: 'Complete exercises 1-10 from chapter 3',
        course_id: course1DbId,
        teacher_id: teacher1DbId,
        subject: 'Mathematics',
        level: 'Grade 5',
        class_name: '5A',
        due_date: new Date('2024-12-20'),
        total_marks: 20.00,
        attachments: JSON.stringify([]),
        submissions: JSON.stringify([]),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Science Project',
        description: 'Create a model of the solar system',
        course_id: course3DbId,
        teacher_id: teacher2DbId,
        subject: 'Science',
        level: 'Grade 5',
        class_name: '5A',
        due_date: new Date('2024-12-25'),
        total_marks: 50.00,
        attachments: JSON.stringify([]),
        submissions: JSON.stringify([]),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Bulk insert Attendances
    await queryInterface.bulkInsert('attendances', [
      {
        student_id: student1DbId,
        course_id: course1DbId,
        date: new Date('2024-12-01'),
        status: 'present',
        subject: 'Mathematics',
        teacher_id: teacher1DbId,
        remarks: '',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student1DbId,
        course_id: course3DbId,
        date: new Date('2024-12-01'),
        status: 'present',
        subject: 'Science',
        teacher_id: teacher2DbId,
        remarks: '',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student2DbId,
        course_id: course2DbId,
        date: new Date('2024-12-02'),
        status: 'late',
        subject: 'Mathematics',
        teacher_id: teacher1DbId,
        remarks: 'Arrived 10 minutes late',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student3DbId,
        course_id: course1DbId,
        date: new Date('2024-12-01'),
        status: 'present',
        subject: 'Mathematics',
        teacher_id: teacher1DbId,
        remarks: '',
        academic_year: '2024-2025',
        semester: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Bulk insert Payments
    await queryInterface.bulkInsert('payments', [
      {
        student_id: student1DbId,
        type: 'tuition',
        amount: 5000.00,
        currency: 'USD',
        status: 'paid',
        due_date: new Date('2024-09-01'),
        paid_date: new Date('2024-08-25'),
        payment_method: 'bank-transfer',
        transaction_id: 'TXN001',
        remarks: 'Tuition fee for semester 1',
        academic_year: '2024-2025',
        semester: '1',
        receipt_number: 'RCP-20240825001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student2DbId,
        type: 'tuition',
        amount: 5000.00,
        currency: 'USD',
        status: 'paid',
        due_date: new Date('2024-09-01'),
        paid_date: new Date('2024-08-28'),
        payment_method: 'card',
        transaction_id: 'TXN002',
        remarks: 'Tuition fee for semester 1',
        academic_year: '2024-2025',
        semester: '1',
        receipt_number: 'RCP-20240828001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student3DbId,
        type: 'tuition',
        amount: 5000.00,
        currency: 'USD',
        status: 'pending',
        due_date: new Date('2024-09-01'),
        paid_date: null,
        payment_method: null,
        transaction_id: null,
        remarks: 'Tuition fee for semester 1',
        academic_year: '2024-2025',
        semester: '1',
        receipt_number: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Bulk insert Events
    await queryInterface.bulkInsert('events', [
      {
        title: 'Annual Sports Day',
        description: 'School-wide sports competition',
        type: 'sports',
        start_date: new Date('2025-03-15'),
        end_date: new Date('2025-03-15'),
        location: 'School Ground',
        organizer_id: adminId,
        participants: JSON.stringify([student1DbId, student2DbId, student3DbId]),
        target_audience: 'all',
        levels: JSON.stringify(['Grade 4', 'Grade 5']),
        status: 'scheduled',
        is_public: true,
        attachments: JSON.stringify([]),
        max_participants: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Parent-Teacher Meeting',
        description: 'Quarterly parent-teacher conference',
        type: 'meeting',
        start_date: new Date('2024-12-20'),
        end_date: new Date('2024-12-20'),
        location: 'School Auditorium',
        organizer_id: adminId,
        participants: JSON.stringify([parent1DbId, parent2DbId]),
        target_audience: 'parents',
        levels: JSON.stringify(['Grade 4', 'Grade 5']),
        status: 'scheduled',
        is_public: true,
        attachments: JSON.stringify([]),
        max_participants: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Bulk insert Messages
    await queryInterface.bulkInsert('messages', [
      {
        sender_id: teacher1Id,
        recipient_id: parent1Id,
        subject: 'Student Progress Update',
        content: 'Your child is doing well in Mathematics. Keep up the good work!',
        attachments: JSON.stringify([]),
        is_read: false,
        read_at: null,
        priority: 'normal',
        category: 'academic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        sender_id: adminId,
        recipient_id: teacher1Id,
        subject: 'Meeting Reminder',
        content: 'Please remember the staff meeting tomorrow at 3 PM.',
        attachments: JSON.stringify([]),
        is_read: false,
        read_at: null,
        priority: 'high',
        category: 'administrative',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Bulk insert Cantine records
    await queryInterface.bulkInsert('cantines', [
      {
        student_id: student1DbId,
        date: new Date('2024-12-01'),
        meal_type: 'lunch',
        items: JSON.stringify([
          { name: 'Chicken Rice', category: 'main', price: 5.00, quantity: 1 },
          { name: 'Salad', category: 'side', price: 2.00, quantity: 1 },
          { name: 'Juice', category: 'drink', price: 1.50, quantity: 1 }
        ]),
        total_amount: 8.50,
        status: 'served',
        payment_status: 'paid',
        special_instructions: 'No spicy food',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        student_id: student2DbId,
        date: new Date('2024-12-01'),
        meal_type: 'lunch',
        items: JSON.stringify([
          { name: 'Vegetable Pasta', category: 'main', price: 4.50, quantity: 1 },
          { name: 'Fruit', category: 'dessert', price: 1.00, quantity: 1 }
        ]),
        total_amount: 5.50,
        status: 'confirmed',
        payment_status: 'pending',
        special_instructions: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cantines', null, {});
    await queryInterface.bulkDelete('messages', null, {});
    await queryInterface.bulkDelete('events', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    await queryInterface.bulkDelete('attendances', null, {});
    await queryInterface.bulkDelete('assignments', null, {});
    await queryInterface.bulkDelete('grades', null, {});
    await queryInterface.bulkDelete('courses', null, {});
    await queryInterface.bulkDelete('teachers', null, {});
    await queryInterface.bulkDelete('students', null, {});
    await queryInterface.bulkDelete('parents', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
