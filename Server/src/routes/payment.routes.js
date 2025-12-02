const express = require('express');
const { getAllPayments, getPaymentById, createPayment, updatePayment, deletePayment, markAsPaid } = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { optionalApiKey } = require('../middleware/apiKey.middleware');
const { validate } = require('../middleware/validator.middleware');
const {
  createPaymentValidation,
  updatePaymentValidation,
  paymentIdValidation
} = require('../middleware/validators/payment.validators');

const router = express.Router();
router.use(optionalApiKey);
router.use(protect);

/**
 * @swagger
 * /api/v0/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
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
 *           enum: [pending, paid, overdue, cancelled]
 *         description: Filter by payment status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [tuition, books, uniform, transport, meals, other]
 *         description: Filter by payment type
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
 *         description: List of payments
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
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Direction only
 */

/**
 * @swagger
 * /api/v0/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Direction only
 */

/**
 * @swagger
 * /api/v0/payments/{id}/mark-paid:
 *   patch:
 *     summary: Mark payment as paid
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paidDate:
 *                 type: string
 *                 format: date
 *                 description: Date payment was made (defaults to current date)
 *               paymentMethod:
 *                 type: string
 *                 description: Method used for payment
 *     responses:
 *       200:
 *         description: Payment marked as paid successfully
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Direction only
 */

router.route('/').get(getAllPayments).post(authorize('admin', 'direction'), createPayment);
router.route('/:id').get(getPaymentById).put(authorize('admin', 'direction'), updatePayment);
router.patch('/:id/mark-paid', authorize('admin', 'direction'), markAsPaid);

module.exports = router;
