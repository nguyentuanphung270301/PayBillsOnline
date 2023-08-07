const UserBankCard = require('../models/userbankcard.model')

exports.getAll = function (req, res,) {
    UserBankCard.getAll(function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
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
    const { card_number, create_date, holder_name, balance, user_id } = req.body;
    const newCard = {   
        card_number: card_number,
        create_date: create_date,
        holder_name: holder_name,
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
    const {balance} = req.body;
    const newCard = {
        balance: balance,
    }
    UserBankCard.updateCard(cardId, newCard, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
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