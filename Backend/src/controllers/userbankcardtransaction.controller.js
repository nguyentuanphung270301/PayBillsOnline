const UserBankCardTransaction = require('../models/userbankcardstransaction.model')

exports.getAll = function (req, res,) {
    UserBankCardTransaction.getAll(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getById = function (req, res) {
    const cardId = req.params.id
    UserBankCardTransaction.getById(cardId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.createCard = function (req, res) {
    const { transaction_type, amount, transaction_date, description, usercardbank_id } = req.body;
    const newCard = {
        transaction_type: transaction_type,
        amount: amount,
        transaction_date: transaction_date,
        description: description,
        usercardbank_id: usercardbank_id
    }
    UserBankCardTransaction.createCard(newCard, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}