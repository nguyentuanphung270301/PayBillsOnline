const express = require('express');
const router = express.Router();
const userBankCardsTransactionController = require('../controllers/userbankcardtransaction.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.get('/all', authMiddleware.authenticateToken, userBankCardsTransactionController.getAll);
router.get('/:id', authMiddleware.authenticateToken, userBankCardsTransactionController.getById);
router.post('/create', authMiddleware.authenticateToken, userBankCardsTransactionController.createCard);

module.exports = router