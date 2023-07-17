const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.get('/all', authMiddleware.authenticateToken, roleController.getAllRole);
router.get('/:id', authMiddleware.authenticateToken, roleController.getRoleById);
router.post('/create', authMiddleware.authenticateToken, roleController.createRole);
router.put('/update/:id', authMiddleware.authenticateToken, roleController.updateRole);
router.delete('/delete/:id', authMiddleware.authenticateToken, roleController.deleteRole);

module.exports = router;