const Service = require('../models/services.model');

exports.getAllServices = (req, res) => {
    Service.getAll(function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.getServiceById = (req, res) => {
    const serviceId = req.params.id;
    Service.getById(serviceId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.createService = (req, res) => {
    const { name, price, supplier_id } = req.body;
    const newService = {
        name: name,
        price: price,
        supplier_id: supplier_id
    };
    Service.createService(newService, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.updateService = (req, res) => {
    const serviceId = req.params.id;
    const { name, price, supplier_id } = req.body;
    const newService = {
        name: name,
        price: price,
        supplier_id: supplier_id
    };
    Service.updateService(serviceId, newService, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.deleteService = (req, res) => {
    const serviceId = req.params.id;
    Service.deleteService(serviceId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}