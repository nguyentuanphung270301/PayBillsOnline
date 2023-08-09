const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, billController.getAllBill);
router.get('/allbill', authMiddleware.authenticateToken, billController.getAll);
router.get('/:id', authMiddleware.authenticateToken, billController.getById);
router.post('/create', authMiddleware.authenticateToken, billController.createBill);
router.put('/update/:id', authMiddleware.authenticateToken, billController.updateBill);
router.put('/updatestatus/:id', authMiddleware.authenticateToken, billController.updateStatusBill)
router.put('/updatestatuspayment/:id', authMiddleware.authenticateToken, billController.updateStatusBillPayment)

router.delete('/delete/:id', authMiddleware.authenticateToken, billController.deleteBill);
router.get('/get/meter', authMiddleware.authenticateToken, billController.getServiceByUserId)
router.get('/get/cable', authMiddleware.authenticateToken,billController.getCableByUserId)
router.get('/getBillMeterById/:id', authMiddleware.authenticateToken,billController.getBillMeterById)
router.get('/getBillCabById/:id', authMiddleware.authenticateToken,billController.getBillCabById)


module.exports = router;