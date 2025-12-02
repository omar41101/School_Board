const express = require('express');
const {
  register,
  login,
  getMe,
  updatePassword,
  logout
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validator.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const { 
  registerValidation,
  loginValidation,
  updatePasswordValidation 
} = require('../middleware/validators/auth.validators');

const router = express.Router();

/**
 * @swagger
 * /api/v0/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Register a new user. Basic registration only requires firstName, lastName, email, password, and role. For creating role-specific profiles (student/teacher/parent), include the respective required fields.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@school.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, student, teacher, parent, direction]
 *                 example: student
 *               matricule:
 *                 type: string
 *                 description: Required for student role
 *                 example: STU2025001
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Required for student/teacher role
 *                 example: 2010-05-15
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Required for student/teacher role
 *                 example: male
 *               level:
 *                 type: string
 *                 description: Required for student role
 *                 example: Grade 10
 *               className:
 *                 type: string
 *                 description: Required for student role
 *                 example: 10A
 *               employeeId:
 *                 type: string
 *                 description: Required for teacher role
 *                 example: T987654
 *               qualification:
 *                 type: string
 *                 description: Required for teacher role
 *                 example: MSc Mathematics
 *               specialization:
 *                 type: string
 *                 description: Required for teacher role
 *                 example: Algebra
 *               salary:
 *                 type: number
 *                 description: Required for teacher role
 *                 example: 3500
 *               relationship:
 *                 type: string
 *                 enum: [father, mother, guardian]
 *                 description: Required for parent role
 *                 example: father
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v0/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@school.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v0/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v0/auth/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpass123
 *               newPassword:
 *                 type: string
 *                 example: newpass123
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v0/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePasswordValidation, validate, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
