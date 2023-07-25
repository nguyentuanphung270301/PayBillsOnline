const Supplier = require('../models/supplier.model');

exports.getAllSupplier = (req, res) => {
    Supplier.getAll(function (err, data) {
        if (err) {
            res.status(500).json({error: err, success: false});
        }
        else {
            res.status(200).json({data: data,success: true});
        }
    })
}

exports.getSupplierById = (req, res) => {
    const supplierId = req.params.id;
    Supplier.getById(supplierId, function (err, data) {
        if (err) {
            res.status(500).json({error: err, success: false});
        }
        else {
            res.status(200).json({data: data,success: true});
        }
    })
}

exports.createSupplier = (req, res) => {
    const { name, email, phone } = req.body;
    const newSupplier = {
        name: name,
        email: email,
        phone: phone
    };
    Supplier.createSupplier(newSupplier, function (err, data) {
        if (err) {
            res.status(500).json({error: err, success: false});
        }
        else {
            res.status(200).json({data: data, success: true});
        }
    })
}

exports.updateSupplier = (req, res) => {
    const supplierId = req.params.id;
    const { name, email, phone } = req.body;
    const newSupplier = {
        name: name,
        email: email,
        phone: phone
    };
    Supplier.updateSupplier(supplierId, newSupplier, function (err, data) {
        if (err) {
            res.status(500).json({error: err, success: false});
        }
        else {
            res.status(200).json({data: data, success: true});
        }
    })
}

exports.deleteSupplier = (req, res) => {
    const supplierId = req.params.id;
    Supplier.deleteSupplier(supplierId, function (err, data) {
        if (err) {
            res.status(500).json({error: err, success: false});
        }
        else {
            res.status(200).json({data:data, success: true});
        }
    })
}