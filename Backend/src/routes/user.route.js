const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')

router.get('/all', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.post('/create', userController.createUser); 
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;