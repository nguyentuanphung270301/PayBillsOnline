const express = require('express');
const router = express.Router();
const meterindexController = require('../controllers/meterindex.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.get('/all', authMiddleware.authenticateToken, meterindexController.getAll);
router.get('/:id', authMiddleware.authenticateToken, meterindexController.getById);
router.get('/getuserid/:id', authMiddleware.authenticateToken, meterindexController.getByUserId);
router.post('/create', authMiddleware.authenticateToken, meterindexController.createMeter);
router.put('/update/:id', authMiddleware.authenticateToken, meterindexController.updateMeter);
router.delete('/delete/:id', authMiddleware.authenticateToken, meterindexController.deleteMeter);

module.exports = router;