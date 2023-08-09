const db = require('../configs/connect');
const { getById } = require('./services.model');

const MeterIndex = function (meterindex) {
    this.id = meterindex.id
    this.meter_reading_new = meterindex.meter_reading_new
    this.meter_date_new = meterindex.meter_date_new
    this.meter_reading_old = meterindex.meter_reading_old
    this.meter_date_old = meterindex.meter_date_old
    this.payment_period = meterindex.payment_period
    this.customer_name = meterindex.customer_name
    this.customer_address = meterindex.customer_address
    this.customer_phone = meterindex.customer_phone
    this.customer_code = meterindex.customer_code
    this.service_id = meterindex.service_id
}

MeterIndex.getAll = function (callback) {
    db.query(`SELECT meterindex.* , services.name as service_name , services.price as price, suppliers.name as supplier_name, suppliers.id as supplier_id
    FROM meterindex
    INNER JOIN services on meterindex.service_id = services.id
    INNER JOIN suppliers on services.supplier_id = suppliers.id`, function (err, results) {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback('Không tìm thấy dữ liệu')
            }
        }
    });
}

MeterIndex.getById = function (id, callback) {
    db.query(`SELECT * FROM meterindex WHERE id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback(`Không tìm thấy chỉ số với id: ${id}`)
            }
        }
    })
}

MeterIndex.getByServiceId = function (id, callback) {
    db.query(`SELECT * FROM meterindex WHERE service_id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback(`Không tìm thấy chỉ số với id: ${id}`)
            }
        }
    })
}


MeterIndex.createMeter = function (meterData, callback) {
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, payment_period, customer_name, customer_phone, customer_address, customer_code, service_id } = meterData
    const query = 'INSERT INTO meterindex (meter_reading_new, meter_date_new, meter_reading_old, meter_date_old,payment_period, customer_name, customer_phone, customer_address, customer_code, service_id) VALUES (?,?,?,?,?,?,?,?,?,?)'
    db.query(query, [meter_reading_new, meter_date_new, meter_reading_old, meter_date_old,payment_period, customer_name, customer_phone, customer_address, customer_code, service_id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newMeter = results.insertId
            this.getById(newMeter, callback);
        }
    })
}

MeterIndex.updateMeter = function (id, meterData, callback) {
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old,payment_period, customer_name, customer_phone, customer_address, customer_code, service_id } = meterData
    const query = 'UPDATE meterindex SET meter_reading_new =?, meter_date_new =?, meter_reading_old =?, meter_date_old =?, payment_period =? , customer_name = ? , customer_phone = ?, customer_address = ?, customer_code =? , service_id =? WHERE id =?'
    db.query(query, [meter_reading_new, meter_date_new, meter_reading_old, meter_date_old,payment_period, customer_name, customer_phone, customer_address, customer_code, service_id, id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            this.getById(id, callback);
        }
    })
}

MeterIndex.deleteMeter = function (id, callback) {
    const query = 'DELETE FROM meterindex WHERE id =?'
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    })
}

module.exports = MeterIndex;