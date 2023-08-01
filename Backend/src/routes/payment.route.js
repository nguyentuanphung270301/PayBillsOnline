const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware')

router.get('/:id', authMiddleware.authenticateToken, paymentController.getById);
router.post('/create', authMiddleware.authenticateToken, paymentController.createPayment)

module.exports = router;