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