const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, billController.getAllBill);
router.get('/allbill', authMiddleware.authenticateToken, billController.getAll);
router.get('/:id', authMiddleware.authenticateToken, billController.getById);
router.post('/create', authMiddleware.authenticateToken, billController.createBill);
router.put('/update/:id', authMiddleware.authenticateToken, billController.updateBill);
router.delete('/delete/:id', authMiddleware.authenticateToken, billController.deleteBill);
router.get('/getByUserId/:id', authMiddleware.authenticateToken, billController.getServiceByUserId)
router.get('/getCableByUserId/:id', authMiddleware.authenticateToken,billController.getCableByUserId)

module.exports = router;