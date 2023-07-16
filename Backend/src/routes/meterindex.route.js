const express = require('express');
const router = express.Router();
const meterindexController = require('../controllers/meterindex.controller');

router.get('/all', meterindexController.getAll);
router.get('/:id', meterindexController.getById);
router.post('/create', meterindexController.createMeter);
router.put('/update/:id', meterindexController.updateMeter);
router.delete('/delete/:id', meterindexController.deleteMeter);

module.exports = router;