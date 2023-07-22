const UserBankCard = require('../models/userbankcard.model')

exports.getAll = function (req, res,) {
    UserBankCard.getAll(function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.getById = function (req, res) {
    const cardId = req.params.id
    UserBankCard.getById(cardId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.getByUserId = function (req, res) {
    const userId = req.params.id
    UserBankCard.getByUserId(userId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.createCard = function (req, res) {
    const { card_number, bank_name,expiry_date, holder_name, cvv, balance, user_id } = req.body;
    const newCard = {
        card_number: card_number,
        bank_name: bank_name,
        expiry_date: expiry_date,
        holder_name: holder_name,
        cvv: cvv,
        balance: balance,
        user_id: user_id
    }
    UserBankCard.createCard(newCard, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.updateCard = function (req, res) {
    const cardId = req.params.id
    const { card_number, expiry_date, holder_name, cvv, balance, user_id } = req.body;
    if (!card_number ||!expiry_date ||!holder_name ||!cvv ||!balance ||!user_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    const newCard = {
        card_number: card_number,
        expiry_date: expiry_date,
        holder_name: holder_name,
        cvv: cvv,
        balance: balance,
        user_id: user_id
    }
    UserBankCard.updateCard(cardId, newCard, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.deleteCard = function (req, res) {
    const cardId = req.params.id
    UserBankCard.deleteCard(cardId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).json({ data: data, success: true });
        }
    })
}