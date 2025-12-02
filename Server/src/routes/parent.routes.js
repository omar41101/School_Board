const express = require('express');
const { getAllParents, getParentById, createParent, updateParent, deleteParent } = require('../controllers/parent.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { optionalApiKey } = require('../middleware/apiKey.middleware');
const { validate } = require('../middleware/validator.middleware');
const {
  createParentValidation,
  updateParentValidation,
  parentIdValidation
} = require('../middleware/validators/parent.validators');

const router = express.Router();
router.use(optionalApiKey);
router.use(protect);

/**
 * @swagger
 * /api/v0/parents:
 *   get:
 *     summary: Get all parents
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of parents
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
 *                     $ref: '#/components/schemas/Parent'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parent'
 *     responses:
 *       201:
 *         description: Parent created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

/**
 * @swagger
 * /api/v0/parents/{id}:
 *   get:
 *     summary: Get parent by ID
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     responses:
 *       200:
 *         description: Parent details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Parent'
 *       404:
 *         description: Parent not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parent'
 *     responses:
 *       200:
 *         description: Parent updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Parent not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     responses:
 *       200:
 *         description: Parent deleted successfully
 *       404:
 *         description: Parent not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

router.route('/').get(getAllParents).post(authorize('admin'), createParent);
router.route('/:id').get(getParentById).put(updateParent).delete(authorize('admin'), deleteParent);

module.exports = router;
