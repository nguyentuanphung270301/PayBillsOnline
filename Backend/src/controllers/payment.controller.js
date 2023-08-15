const Payment = require('../models/payment.model')

exports.createPayment = (req, res) => {
    const { payment_date, payment_method, description, bill_id, userbankcard_id } = req.body
    const data = {
        payment_date: payment_date,
        payment_method: payment_method,
        description: description,
        bill_id: bill_id,
        userbankcard_id: userbankcard_id
    }
    Payment.createPayment(data, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getById = (req, res) => {
    const paymentId = req.params.id
    Payment.getById(paymentId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}


exports.getReportCab = (req, res) => {
    const { interval, start_date, end_date, service_id, supplier_id } = req.query
    const data = {
        interval: interval,
        start_date: start_date ? start_date : null,
        end_date: end_date ? end_date : null,
        service_id: service_id ? service_id : null,
        supplier_id: supplier_id
    }
    console.log(data)
    Payment.getReportCab(data, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}


exports.getReportMeter = (req, res) => {
    const { interval, start_date, end_date, service_id, supplier_id } = req.query
    const data = {
        interval: interval,
        start_date: start_date ? start_date : null,
        end_date: end_date ? end_date : null,
        service_id: service_id ? service_id : null,
        supplier_id: supplier_id
    }
    console.log(data)
    Payment.getReportMeter(data, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getExcelMeter = (req, res) => {
    const { interval, start_date, end_date, service_id, supplier_id } = req.query
    const data = {
        interval: interval,
        start_date: start_date ? start_date : null,
        end_date: end_date ? end_date : null,
        service_id: service_id ? service_id : null,
        supplier_id: supplier_id
    }
    console.log(data)
    Payment.getExcelMeter(data, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getExcelCab = (req, res) => {
    const { interval, start_date, end_date, service_id, supplier_id } = req.query
    const data = {
        interval: interval,
        start_date: start_date ? start_date : null,
        end_date: end_date ? end_date : null,
        service_id: service_id ? service_id : null,
        supplier_id: supplier_id
    }
    console.log(data)
    Payment.getExcelCab(data, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}