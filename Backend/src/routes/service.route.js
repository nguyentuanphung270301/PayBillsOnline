const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.get('/all', authMiddleware.authenticateToken, serviceController.getAllServices);
router.get('/:id', authMiddleware.authenticateToken, serviceController.getServiceById);
router.post('/create', authMiddleware.authenticateToken, serviceController.createService);
router.put('/update/:id', authMiddleware.authenticateToken, serviceController.updateService);
router.delete('/delete/:id', authMiddleware.authenticateToken, serviceController.deleteService);

module.exports = router;