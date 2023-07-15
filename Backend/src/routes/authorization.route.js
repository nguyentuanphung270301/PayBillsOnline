const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorization.controller');

router.get('/all', authorizationController.getAllAuthorizations)
router.get('/:id', authorizationController.getAuthorizationById)
router.post('/create',authorizationController.createAuthorization)
router.put('/update/:id',authorizationController.updateAuthorization)
router.delete('/delete/:id',authorizationController.deleteAuthorization)

module.exports = router;