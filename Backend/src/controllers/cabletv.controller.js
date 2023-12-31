const CableTV = require('../models/cabletv.model')

exports.getAllCableTV = (req, res) => {
    CableTV.getAll(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getCableTVById = (req, res) => {
    const cabId = req.params.id
    CableTV.getById(cabId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getCableTVByServiceId = (req, res) => {
    const userId = req.params.id
    CableTV.getByServiceId(userId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}
exports.createCableTV = (req, res) => {
    const { package_name, start_date, end_date, price, customer_name, customer_phone, customer_address, customer_code, service_id} = req.body
    const newCab = {
        package_name: package_name,
        start_date: start_date,
        end_date: end_date,
        price: price,
        customer_name: customer_name,
        customer_phone: customer_phone,
        customer_address: customer_address,
        customer_code: customer_code,
        service_id: service_id,
    }
    CableTV.createCab(newCab, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}
exports.updateCab = (req, res) => {
    const cabId = req.params.id
    const { package_name, start_date, end_date, price,customer_name, customer_phone, customer_address, customer_code, service_id} = req.body
    const newCab = {
        package_name: package_name,
        start_date: start_date,
        end_date: end_date,
        price: price,
        customer_name: customer_name,
        customer_phone: customer_phone,
        customer_address: customer_address,
        customer_code: customer_code,
        service_id: service_id,
    }
    CableTV.updateCab(cabId, newCab, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.deleteCab = (req, res) => {
    const cabId = req.params.id
    CableTV.deleteCab(cabId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}