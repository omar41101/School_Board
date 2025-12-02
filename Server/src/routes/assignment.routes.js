const express = require('express');
const { getAllAssignments, getAssignmentById, createAssignment, updateAssignment, deleteAssignment, submitAssignment } = require('../controllers/assignment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { optionalApiKey } = require('../middleware/apiKey.middleware');
const { validate } = require('../middleware/validator.middleware');
const {
  createAssignmentValidation,
  updateAssignmentValidation,
  assignmentIdValidation
} = require('../middleware/validators/assignment.validators');

const router = express.Router();
router.use(optionalApiKey);
router.use(protect);

/**
 * @swagger
 * /api/v0/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, submitted, graded]
 *         description: Filter by status
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
 *         description: List of assignments
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
 *                     $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher only
 */

/**
 * @swagger
 * /api/v0/assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Assignment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher only
 *   delete:
 *     summary: Delete assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Teacher only
 */

/**
 * @swagger
 * /api/v0/assignments/{id}/submit:
 *   post:
 *     summary: Submit an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Assignment submission content
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs or paths to submitted files
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Assignment submitted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Assignment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Students only
 */

router.route('/').get(getAllAssignments).post(authorize('admin', 'teacher'), createAssignmentValidation, validate, createAssignment);
router.route('/:id').get(assignmentIdValidation, validate, getAssignmentById).put(authorize('admin', 'teacher'), updateAssignmentValidation, validate, updateAssignment).delete(authorize('admin', 'teacher'), assignmentIdValidation, validate, deleteAssignment);
router.post('/:id/submit', authorize('student'), assignmentIdValidation, validate, submitAssignment);

module.exports = router;
