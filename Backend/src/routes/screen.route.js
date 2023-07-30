const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screen.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, screenController.getAll);
router.get('/allscreen', authMiddleware.authenticateToken, screenController.getAllScreen)
router.get('/:id', authMiddleware.authenticateToken, screenController.getById)
router.get('/role/:id', authMiddleware.authenticateToken, screenController.getByRoleId)
router.post('/create', authMiddleware.authenticateToken, screenController.createScreen)
router.delete('/delete/:id', authMiddleware.authenticateToken, screenController.deleteScreen)
router.put('/update/:id', authMiddleware.authenticateToken, screenController.updateScreen)

module.exports = router;
