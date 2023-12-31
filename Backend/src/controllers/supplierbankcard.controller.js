const SupplierBankCard = require('../models/suppliersbankcard.model');

exports.getAll = (req, res) => {
    SupplierBankCard.getAll(function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.getById = (req, res) => {
    SupplierBankCard.getById(req.params.id, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.createCard = (req, res) => {
    const { balance, supplier_id } = req.body;

    const newCard = {
        balance: balance,
        supplier_id: supplier_id
    }
    SupplierBankCard.createCard(newCard, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.updateCard = (req, res) => {
    const { balance} = req.body;
    const newCard = {
        balance: balance
    }
    SupplierBankCard.updateCard(req.params.id, newCard, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.deleteCard = (req, res) => {
    SupplierBankCard.deleteCard(req.params.id, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send("Xoá card thành công");
        }
    })
}

exports.deleteCardBySupplierId = (req, res) => {
    const supplier_id = req.params.id
    SupplierBankCard.deleteCardBySupplierId(supplier_id, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}