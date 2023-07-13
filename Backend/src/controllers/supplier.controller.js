const Supplier = require('../models/supplier.model');

exports.getAllSupplier = (req, res) => {
    Supplier.getAll(function (err, data) {
        if (err) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách nhà cung cấp.' });
        }
        else {
            res.json(data)
        }
    })
}

exports.getSupplierById = (req, res) => {
    const supplierId = req.params.id;
    Supplier.getById(supplierId, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data)
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
            res.status(500).json({ error: 'Lỗi khi tạo nhà cung cấp.' });
        }
        else {
            res.status(200).json(data);
        }
    })
}