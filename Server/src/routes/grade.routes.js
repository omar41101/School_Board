const express = require('express');
const { getAllGrades, getGradeById, createGrade, updateGrade, deleteGrade } = require('../controllers/grade.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { optionalApiKey } = require('../middleware/apiKey.middleware');
const { validate } = require('../middleware/validator.middleware');
const {
  createGradeValidation,
  updateGradeValidation,
  gradeIdValidation
} = require('../middleware/validators/grade.validators');

const router = express.Router();
router.use(optionalApiKey);
router.use(protect);

/**
 * @swagger
 * /api/v0/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: student
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: term
 *         schema:
 *           type: string
 *         description: Filter by term
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
 *         description: List of grades
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
 *                     $ref: '#/components/schemas/Grade'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       201:
 *         description: Grade created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin, Direction or Teacher only
 */

/**
 * @swagger
 * /api/v0/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Grade ID
 *     responses:
 *       200:
 *         description: Grade details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Grade ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Grade'
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Grade not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin, Direction or Teacher only
 *   delete:
 *     summary: Delete grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Grade ID
 *     responses:
 *       200:
 *         description: Grade deleted successfully
 *       404:
 *         description: Grade not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher only
 */

router.route('/').get(getAllGrades).post(authorize('admin', 'direction', 'teacher'), createGrade);
router.route('/:id').get(getGradeById).put(authorize('admin', 'direction', 'teacher'), updateGrade).delete(authorize('admin', 'teacher'), deleteGrade);

module.exports = router;
