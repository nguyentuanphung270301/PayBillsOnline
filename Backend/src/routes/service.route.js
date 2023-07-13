const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.get('/all', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/create', serviceController.createService);
router.put('/update/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);

module.exports = router;