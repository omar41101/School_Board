const express = require('express');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollStudent } = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { optionalApiKey } = require('../middleware/apiKey.middleware');
const { validate } = require('../middleware/validator.middleware');
const {
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation
} = require('../middleware/validators/course.validators');

const router = express.Router();
router.use(optionalApiKey);
router.use(protect);

/**
 * @swagger
 * /api/v0/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter by level
 *       - in: query
 *         name: teacher
 *         schema:
 *           type: string
 *         description: Filter by teacher ID
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
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin, Direction or Teacher only
 */

/**
 * @swagger
 * /api/v0/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin, Direction or Teacher only
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

/**
 * @swagger
 * /api/v0/courses/{id}/enroll:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: Student ID to enroll
 *             required:
 *               - studentId
 *     responses:
 *       200:
 *         description: Student enrolled successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course or student not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Direction only
 */

router.route('/').get(getAllCourses).post(authorize('admin', 'direction', 'teacher'), createCourseValidation, validate, createCourse);
router.route('/:id').get(courseIdValidation, validate, getCourseById).put(authorize('admin', 'direction', 'teacher'), updateCourseValidation, validate, updateCourse).delete(authorize('admin'), courseIdValidation, validate, deleteCourse);
router.post('/:id/enroll', authorize('admin', 'direction'), courseIdValidation, validate, enrollStudent);

module.exports = router;
