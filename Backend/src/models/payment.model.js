const db = require('../configs/connect');

const Payment = function (payment) {
    this.id = payment.id;
    this.payment_date = payment.payment_date;
    this.payment_method = payment.payment_method;
    this.description = payment.description;
    this.bill_id = payment.bill_id;
    this.userbankcard_id = payment.userbankcard_id;
}

Payment.getById = function (id, callback) {
    db.query(`SELECT * FROM payment WHERE id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy role với id: ' + id)
            }
        }
    })
}

Payment.createPayment = function (paymentData, callback) {
    const { payment_date, payment_method, description, bill_id, userbankcard_id } = paymentData;
    const query = 'INSERT INTO payment (payment_date, payment_method, description, bill_id, userbankcard_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [payment_date, payment_method, description, bill_id, userbankcard_id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newMeter = results.insertId
            this.getById(newMeter, callback);
        }
    })
}




module.exports = Payment;