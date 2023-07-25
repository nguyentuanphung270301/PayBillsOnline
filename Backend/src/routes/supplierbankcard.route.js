const express = require('express');
const router = express.Router();
const SupplierBankCardController = require('../controllers/supplierbankcard.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, SupplierBankCardController.getAll)
router.get('/:id', authMiddleware.authenticateToken, SupplierBankCardController.getById)
router.post('/create', authMiddleware.authenticateToken, SupplierBankCardController.createCard)
router.put('/update/:id', authMiddleware.authenticateToken, SupplierBankCardController.updateCard)
router.delete('/delete/:id', authMiddleware.authenticateToken, SupplierBankCardController.deleteCard)
router.delete('/deleteBySupplierId/:id', authMiddleware.authenticateToken, SupplierBankCardController.deleteCardBySupplierId)

module.exports = router;