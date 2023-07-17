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
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.createCard = (req, res) => {
    const { balance, supplier_id } = req.body;
    if (!balance || !supplier_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const newCard = {
        balance: balance,
        supplier_id: supplier_id
    }
    SupplierBankCard.createCard(newCard, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.updateCard = (req, res) => {
    const { balance, supplier_id } = req.body;
    if (!balance ||!supplier_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
    SupplierBankCard.updateCard(req.params.id, newCard, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
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