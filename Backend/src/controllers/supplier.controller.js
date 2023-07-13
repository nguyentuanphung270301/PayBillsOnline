const Supplier = require('../models/supplier.model');

exports.getAllSupplier = (req, res) => {
    Supplier.getAll(function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.getSupplierById = (req, res) => {
    const supplierId = req.params.id;
    Supplier.getById(supplierId, function (err, data) {
        if (err) {
            return res.status(400).json(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.createSupplier = (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }
    const newSupplier = {
        name: name,
        email: email,
        phone: phone
    };
    Supplier.createSupplier(newSupplier, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.updateSupplier = (req, res) => {
    const supplierId = req.params.id;
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }
    const newSupplier = {
        name: name,
        email: email,
        phone: phone
    };
    Supplier.updateSupplier(supplierId, newSupplier, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(data);
        }
    })
}

exports.deleteSupplier = (req, res) => {
    const supplierId = req.params.id;
    Supplier.deleteSupplier(supplierId, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json({ message: `Xoá nhà cung cấp với id ${supplierId} thành công` });
        }
    })
}