const express = require('express');
const { getAllCantineOrders, getCantineOrderById, createCantineOrder, updateCantineOrder, deleteCantineOrder, cancelOrder, getOrderById, getAllOrders, createOrder, updateOrder } = require('../controllers/cantine.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { optionalApiKey } = require('../middleware/apiKey.middleware');
const { validate } = require('../middleware/validator.middleware');
const {
  createCantineValidation,
  updateCantineValidation,
  cantineIdValidation
} = require('../middleware/validators/cantine.validators');

const router = express.Router();
router.use(optionalApiKey);
router.use(protect);

/**
 * @swagger
 * /api/v0/cantine:
 *   get:
 *     summary: Get all cantine orders
 *     tags: [Cantine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: student
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by order date
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
 *         description: List of cantine orders
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
 *                     $ref: '#/components/schemas/Cantine'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new cantine order
 *     tags: [Cantine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cantine'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Student only
 */

/**
 * @swagger
 * /api/v0/cantine/{id}:
 *   get:
 *     summary: Get cantine order by ID
 *     tags: [Cantine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cantine'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update cantine order
 *     tags: [Cantine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cantine'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

/**
 * @swagger
 * /api/v0/cantine/{id}/cancel:
 *   patch:
 *     summary: Cancel a cantine order
 *     tags: [Cantine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel order (already in progress or completed)
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Student (own orders) only
 */

router.route('/').get(getAllOrders).post(authorize('admin', 'student'), createOrder);
router.route('/:id').get(getOrderById).put(authorize('admin'), updateOrder);
router.patch('/:id/cancel', authorize('admin', 'student'), cancelOrder);

module.exports = router;
