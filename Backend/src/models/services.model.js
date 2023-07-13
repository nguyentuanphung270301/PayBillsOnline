const db = require('../configs/connect');
const Service = function (service) {
    this.id = service.id;
    this.name = service.name;
    this.price = service.price;
    this.supplier_id = service.supplier_id;
}

Service.getAll = function (callback) {
    db.query('SELECT * FROM services', (err, results) => {
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

Service.getById = function (id, callback) {
    db.query(`SELECT * FROM services WHERE id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy dịch vụ với id: ' + id)
            }
        }
    })
}

Service.createService = function (serviceData, callback) {
    const { name, price, supplier_id } = serviceData
    const query = 'INSERT INTO services (name, price, supplier_id) VALUES (?, ?, ?)'
    db.query(query, [name, price, supplier_id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newId = results.insertId
            this.getById(newId, callback)
        }
    })
}

Service.updateService = function (id, serviceData, callback) {
    const { name, price, supplier_id } = serviceData
    const query = 'UPDATE services SET name =?, price =?, supplier_id =? WHERE id =?'
    db.query(query, [name, price, supplier_id, id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            this.getById(id, callback)
        }
    })
}

Service.deleteService = function (id, callback) {
    const query = 'DELETE FROM services WHERE id =?'
    db.query(query, [id], function (err, results) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    })
}

module.exports = Service