const express = require('express');
const router = express.Router();
const userBankCardController = require('../controllers/userbankcard.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.get('/all', authMiddleware.authenticateToken, userBankCardController.getAll);
router.get('/:id', authMiddleware.authenticateToken, userBankCardController.getById);
router.get('/userId/:id', authMiddleware.authenticateToken, userBankCardController.getByUserId);
router.post('/create', authMiddleware.authenticateToken, userBankCardController.createCard);
router.put('/update/:id', authMiddleware.authenticateToken, userBankCardController.updateCard);
router.delete('/delete/:id', authMiddleware.authenticateToken, userBankCardController.deleteCard);
module.exports = router