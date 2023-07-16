const MeterIndex = require('../models/meterindex.model')

exports.getAll = (req, res) => {
    MeterIndex.getAll(function (err, data) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
}

exports.getById = (req, res) => {
    const indexId = req.params.id
    MeterIndex.getById(indexId, function (err, data) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
}

exports.createMeter = (req, res) => {
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, price, service_id, user_id } = req.body
    if (!meter_reading_new || !meter_date_new || !meter_reading_old || !meter_date_old || price == null || !service_id || !user_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newMeter = {
        meter_reading_new: meter_reading_new,
        meter_date_new: meter_date_new,
        meter_reading_old: meter_reading_old,
        meter_date_old: meter_date_old,
        price: price,
        service_id: service_id,
        user_id: user_id
    }
    MeterIndex.createMeter(newMeter, function (err, data) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
}

exports.updateMeter = (req, res) => {
    const id = req.params.id
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, price, service_id, user_id } = req.body
    if (!id || !meter_reading_new || !meter_date_new || !meter_reading_old || !meter_date_old || price == null || !service_id || !user_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newMeter = {
        meter_reading_new: meter_reading_new,
        meter_date_new: meter_date_new,
        meter_reading_old: meter_reading_old,
        meter_date_old: meter_date_old,
        price: price,
        service_id: service_id,
        user_id: user_id
    }
    MeterIndex.updateMeter(id, newMeter, function (err, data) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
}

exports.deleteMeter = (req, res) => {
    const id = req.params.id
    MeterIndex.deleteMeter(id, function (err, data) {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(`Xoá chỉ số với id ${id} thành công`)
        }
    })
}