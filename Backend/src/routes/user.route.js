const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all',authMiddleware.authenticateToken ,userController.getAllUser);
router.get('/:id',authMiddleware.authenticateToken, userController.getUserById);
router.get('/username/:username',authMiddleware.authenticateToken, userController.getUserByUsername);
router.get('/email/:email', userController.getUserByEmail);
router.put('/updatepassword', userController.updateUserPassword);
router.put('/changepassword',authMiddleware.authenticateToken, userController.changPassword)
router.post('/create',authMiddleware.authenticateToken, userController.createUser); 
router.put('/update/:id',authMiddleware.authenticateToken, userController.updateUser);
router.delete('/delete/:id',authMiddleware.authenticateToken, userController.deleteUser);
router.put('/updateStatus/:id',authMiddleware.authenticateToken, userController.updateStatusUser);
router.get('/userauth/:username',authMiddleware.authenticateToken, userController.getUserAuthByUsername);

module.exports = router;