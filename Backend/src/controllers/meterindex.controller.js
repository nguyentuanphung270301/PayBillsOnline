const MeterIndex = require('../models/meterindex.model')

exports.getAll = (req, res) => {
    MeterIndex.getAll(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getById = (req, res) => {
    const indexId = req.params.id
    MeterIndex.getById(indexId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getByServiceId = (req, res) => {
    const indexId = req.params.id
    MeterIndex.getByServiceId(indexId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.createMeter = (req, res) => {
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, payment_period, customer_name, customer_phone, customer_address, customer_code, service_id } = req.body
    const newMeter = {
        meter_reading_new: meter_reading_new,
        meter_date_new: meter_date_new,
        meter_reading_old: meter_reading_old,
        meter_date_old: meter_date_old,
        payment_period: payment_period,
        customer_name: customer_name,
        customer_phone: customer_phone,
        customer_address: customer_address,
        customer_code: customer_code,
        service_id: service_id,
    }
    MeterIndex.createMeter(newMeter, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateMeter = (req, res) => {
    const id = req.params.id
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, payment_period, customer_name, customer_phone, customer_address, customer_code, service_id } = req.body

    const newMeter = {
        meter_reading_new: meter_reading_new,
        meter_date_new: meter_date_new,
        meter_reading_old: meter_reading_old,
        meter_date_old: meter_date_old,
        payment_period: payment_period,
        customer_name: customer_name,
        customer_phone: customer_phone,
        customer_address: customer_address,
        customer_code: customer_code,
        service_id: service_id,
    }
    MeterIndex.updateMeter(id, newMeter, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.deleteMeter = (req, res) => {
    const id = req.params.id
    MeterIndex.deleteMeter(id, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}