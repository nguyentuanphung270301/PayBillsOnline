const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, supplierController.getAllSupplier)
router.get('/:id', authMiddleware.authenticateToken, supplierController.getSupplierById)
router.post('/create', authMiddleware.authenticateToken, supplierController.createSupplier)
router.put('/update/:id', authMiddleware.authenticateToken, supplierController.updateSupplier)
router.delete('/delete/:id', authMiddleware.authenticateToken, supplierController.deleteSupplier)

module.exports = router;