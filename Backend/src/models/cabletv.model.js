const db = require('../configs/connect');
const CableTV = function (cabletv) {
    this.id = cabletv.id;
    this.package_name = cabletv.package_name;
    this.start_date = cabletv.start_date;
    this.end_date = cabletv.end_date;
    this.price = cabletv.price;
    this.service_id = cabletv.service_id;
    this.user_id = cabletv.user_id;
}

CableTV.getAll = function (callback) {
    db.query("SELECT * FROM cabletv", (err, results) => {
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
    })
}

CableTV.getByUserId = function (id, callback) {
    db.query(`SELECT * FROM cabletv WHERE user_id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback('Không tìm thấy cabletv với id: ' + id)
            }
        }
    })
}


CableTV.getById = function (id, callback) {
    db.query(`SELECT * FROM cabletv WHERE id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy cabletv với id: ' + id)
            }
        }
    })
}

CableTV.createCab = function (cabData, callback) {
    const {package_name, start_date, end_date, price, service_id, user_id} = cabData;
    const query = 'INSERT INTO cabletv (package_name, start_date, end_date, price, service_id, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [package_name, start_date, end_date, price, service_id, user_id], (err, results) => {
        if(err) {
            callback(err, null);
        }
        else {
            const newId = results.insertId;
            this.getById(newId, callback);
        }
    })
}

CableTV.updateCab = function (id, cabData, callback) {
    const {package_name, start_date, end_date, price, service_id, user_id} = cabData;
    const query = 'UPDATE cabletv SET package_name =?, start_date =?, end_date =?, price =?, service_id =?, user_id =? WHERE id =?';
    db.query(query, [package_name, start_date, end_date, price, service_id, user_id, id], (err, results) => {
        if(err) {
            callback(err, null);
        }
        else {
            this.getById(id, callback);
        }
    })
}

CableTV.deleteCab = function(id, callback) {
    const query = 'DELETE FROM cabletv WHERE id =?';
    db.query(query, [id], (err, results) => {
        if(err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

module.exports = CableTV 