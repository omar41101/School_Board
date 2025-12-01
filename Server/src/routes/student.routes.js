const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter by grade level
 *       - in: query
 *         name: className
 *         schema:
 *           type: string
 *         description: Filter by class name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended, graduated]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of students
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details
 *       404:
 *         description: Student not found
 *   put:
 *     summary: Update student and their user information
 *     description: Updates student-specific fields and can also update associated user fields (firstName, lastName, email, phone, avatar) in a single request
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Update user's first name
 *               lastName:
 *                 type: string
 *                 description: Update user's last name
 *               email:
 *                 type: string
 *                 description: Update user's email
 *               phone:
 *                 type: string
 *                 description: Update user's phone number
 *               avatar:
 *                 type: string
 *                 description: Update user's avatar URL
 *               matricule:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               level:
 *                 type: string
 *               className:
 *                 type: string
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               parent:
 *                 type: string
 *                 description: Parent ID
 *               medicalInfo:
 *                 $ref: '#/components/schemas/MedicalInfo'
 *               emergencyContact:
 *                 $ref: '#/components/schemas/EmergencyContact'
 *               previousSchool:
 *                 $ref: '#/components/schemas/PreviousSchool'
 *               documents:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Document'
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended, graduated]
 *           example:
 *             firstName: "Emma"
 *             lastName: "Wilson"
 *             email: "emma.wilson@student.school.com"
 *             level: "Grade 11"
 *             className: "11-A"
 *     responses:
 *       200:
 *         description: Student and user information updated successfully
 *       404:
 *         description: Student not found
 *   delete:
 *     summary: Delete student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted
 *       404:
 *         description: Student not found
 */

router.route('/')
  .get(getAllStudents)
  .post(authorize('admin', 'direction'), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(authorize('admin', 'direction', 'teacher'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
