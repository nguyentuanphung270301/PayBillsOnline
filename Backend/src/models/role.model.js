const db = require('../configs/connect');
const { getById } = require('./services.model');
const Role = function (role) {
    this.id = role.id;
    this.rolecode = role.rolecode;
    this.name = role.name;
    this.info = role.info;
}

Role.getAll = function (callback) {
    db.query('SELECT * FROM roles', function (err, results) {
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

Role.getById = function (id, callback) {
    db.query(`SELECT * FROM roles WHERE id = ${id}`, (err, results) => {
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

Role.createRole = function (roleData, callback) {
    const { rolecode, name, info } = roleData;
    const query = 'INSERT INTO roles (rolecode, name, info) VALUES (?, ?, ?)';
    db.query(query, [rolecode, name, info],  (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newId = results.insertId
            this.getById(newId, callback)
        }
    })
}

Role.updateRole = function (id, roleData, callback) {
    const { rolecode, name, info } = roleData;
    const query = 'UPDATE roles SET rolecode =?, name =?, info =? WHERE id =?';
    db.query(query, [rolecode, name, info, id],  (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            this.getById(id, callback)
        }
    })
}

Role.deleteRole = function (id, callback) {
    const query = 'DELETE FROM roles WHERE id =?';
    db.query(query, [id],  (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    })
}

module.exports = Role;