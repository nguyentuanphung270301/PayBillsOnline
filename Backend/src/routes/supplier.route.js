const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');

router.get('/all',supplierController.getAllSupplier)
router.get('/:id',supplierController.getSupplierById)
router.post('/create',supplierController.createSupplier)
router.put('/update/:id',supplierController.updateSupplier)
router.delete('/delete/:id',supplierController.deleteSupplier)

module.exports = router;