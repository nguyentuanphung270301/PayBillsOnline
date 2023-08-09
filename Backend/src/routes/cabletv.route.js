const express = require('express');
const router = express.Router();
const cableTVController = require('../controllers/cabletv.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, cableTVController.getAllCableTV);
router.get('/:id', authMiddleware.authenticateToken, cableTVController.getCableTVById);
router.get('/getserviceid/:id', authMiddleware.authenticateToken, cableTVController.getCableTVByServiceId);
router.post('/create', authMiddleware.authenticateToken, cableTVController.createCableTV);
router.put('/update/:id', authMiddleware.authenticateToken, cableTVController.updateCab);
router.delete('/delete/:id', authMiddleware.authenticateToken, cableTVController.deleteCab);

module.exports = router;