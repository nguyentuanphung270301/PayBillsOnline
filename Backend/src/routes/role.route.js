const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.get('/all', roleController.getAllRole);
router.get('/:id', roleController.getRoleById);
router.post('/create', roleController.createRole);
router.put('/update/:id', roleController.updateRole);
router.delete('/delete/:id', roleController.deleteRole);

module.exports = router;