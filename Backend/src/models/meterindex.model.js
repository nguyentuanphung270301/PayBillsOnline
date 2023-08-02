const db = require('../configs/connect');
const { getById } = require('./services.model');

const MeterIndex = function (meterindex) {
    this.id = meterindex.id
    this.meter_reading_new = meterindex.meter_reading_new
    this.meter_date_new = meterindex.meter_date_new
    this.meter_reading_old = meterindex.meter_reading_old
    this.meter_date_old = meterindex.meter_date_old
    this.service_id = meterindex.service_id
    this.user_id = meterindex.user_id
}

MeterIndex.getAll = function (callback) {
    db.query('SELECT * FROM meterindex', function (err, results) {
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

MeterIndex.getByUserId = function (id, callback) {
    db.query(`SELECT * FROM meterindex WHERE user_id = ${id}`, (err, results) => {
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
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, service_id, user_id } = meterData
    const query = 'INSERT INTO meterindex (meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, service_id, user_id) VALUES (?,?,?,?,?,?)'
    db.query(query, [meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, service_id, user_id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newMeter = results.insertId
            this.getById(newMeter, callback);
        }
    })
}

MeterIndex.updateMeter = function (id, meterData, callback) {
    const { meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, service_id, user_id } = meterData
    const query = 'UPDATE meterindex SET meter_reading_new =?, meter_date_new =?, meter_reading_old =?, meter_date_old =?, service_id =?, user_id =? WHERE id =?'
    db.query(query, [meter_reading_new, meter_date_new, meter_reading_old, meter_date_old, service_id, user_id, id], (err, results) => {
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