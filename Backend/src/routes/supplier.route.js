const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');

router.get('/all',supplierController.getAllSupplier)
router.get('/:id',supplierController.getSupplierById)
router.post('/create',supplierController.createSupplier)

module.exports = router;