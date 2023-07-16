const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all',authMiddleware.authenticateToken ,userController.getAllUser);
router.get('/:id',authMiddleware.authenticateToken, userController.getUserById);
router.post('/create',authMiddleware.authenticateToken, userController.createUser); 
router.put('/update/:id',authMiddleware.authenticateToken, userController.updateUser);
router.delete('/delete/:id',authMiddleware.authenticateToken, userController.deleteUser);

module.exports = router;