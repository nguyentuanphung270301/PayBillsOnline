const Bill = require('../models/bill.model')

exports.getAllBill = (req, res) => {
    Bill.getAll(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getAll = (req, res) => {
    Bill.getAllBill(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getById = (req, res) => {
    const billId = req.params.id
    Bill.getById(billId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getServiceByUserId = (req, res) => {
    Bill.getServiceByUserId(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getBillMeterById = (req, res) => {
    const billId = req.params.id;
    Bill.getBillMeterById(billId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getBillCabById = (req, res) => {
    const billId = req.params.id;
    Bill.getBillCabById(billId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getCableByUserId = (req, res) => {
    Bill.getCableByUserId(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}


exports.createBill = (req, res) => {
    const { due_date, amount, status, create_id, approved_id, meter_id, cab_id, info } = req.body
    const newBill = {
        due_date: due_date,
        amount: amount,
        status: status,
        create_id: create_id,
        approved_id: approved_id,
        meter_id: meter_id,
        cab_id: cab_id,
        info: info
    }
    Bill.createBill(newBill, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateBill = (req, res) => {
    const billId = req.params.id
    const { due_date, amount, status, create_id, approved_id, meter_id, cab_id, info } = req.body
    const newBill = {
        due_date: due_date,
        amount: amount,
        status: status,
        create_id: create_id,
        approved_id: approved_id,
        meter_id: meter_id,
        cab_id: cab_id,
        info: info
    }
    Bill.updateBill(billId, newBill, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateStatusBill = (req, res) => {
    const billId = req.params.id
    const { status, approved_id } = req.body
    const statusBill = {
        status: status,
        approved_id: approved_id
    }
    Bill.updateStatusBill(billId, statusBill, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateStatusBillPayment = (req, res) => {
    const billId = req.params.id
    const { status, done_id } = req.body
    const statusBill = {
        status: status,
        done_id: done_id
    }
    Bill.updateStatusBillPayment(billId, statusBill, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.deleteBill = (req, res) => {
    const billId = req.params.id
    Bill.deleteById(billId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}