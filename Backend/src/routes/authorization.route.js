const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorization.controller');
const authMiddleware = require('../middleware/auth.middleware')

router.get('/all', authMiddleware.authenticateToken, authorizationController.getAllAuthorizations)
router.get('/:id', authMiddleware.authenticateToken, authorizationController.getAuthorizationById)
router.get('/userId/:id', authMiddleware.authenticateToken, authorizationController.getAuthorizationByUserId)
router.post('/create', authMiddleware.authenticateToken, authorizationController.createAuthorization)
router.put('/update/:id', authMiddleware.authenticateToken, authorizationController.updateAuthorization)
router.delete('/delete/:id', authMiddleware.authenticateToken, authorizationController.deleteAuthorization)
router.put('/updateStatus/:user_id', authMiddleware.authenticateToken, authorizationController.updateStatus) 

module.exports = router;