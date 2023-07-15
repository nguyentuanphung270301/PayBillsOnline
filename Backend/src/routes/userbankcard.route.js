const express = require('express');
const router = express.Router();
const userBankCardController = require('../controllers/userbankcard.controller');

router.get('/all', userBankCardController.getAll);
router.get('/:id', userBankCardController.getById);
router.post('/create', userBankCardController.createCard);
router.put('/update/:id', userBankCardController.updateCard);
router.delete('/delete/:id', userBankCardController.deleteCard);
module.exports = router