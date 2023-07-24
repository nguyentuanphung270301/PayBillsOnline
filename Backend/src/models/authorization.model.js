const db = require('../configs/connect');

const Authorization = function (authorization) {
    this.id = authorization.id;
    this.screen_id = authorization.screen_id;
    this.user_id = authorization.user_id;
    this.role_id = authorization.role_id;
}

Authorization.getAll = function (callback) {
    db.query('SELECT * FROM user_authorization', (err, results) => {
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

Authorization.getByUserId = function (userId, callback) {
    db.query('SELECT * FROM user_authorization WHERE user_id =?', [userId], (err, results) => {
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

Authorization.getById = function (id, callback) {
    db.query('SELECT * FROM user_authorization WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback('Không tìm thấy phân quyền với id: ' + id)
            }
        }
    });
}

Authorization.createAuthorization = function (authorizationData, callback) {
    const { user_id, role_id, status } = authorizationData;
    const query = 'INSERT INTO user_authorization (user_id,role_id,status) VALUES (?,?,?)'
    db.query(query, [user_id, role_id, status], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            const newAuth = results.insertId;
            this.getById(newAuth, callback)
        }
    })
}

Authorization.updateAuthorization = function (id, authorizationData, callback) {
    const { screen_id, user_id, role_id } = authorizationData;
    const query = 'UPDATE user_authorization SET screen_id =?, user_id =?, role_id =? WHERE id =?'
    db.query(query, [screen_id, user_id, role_id, id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            this.getById(id, callback)
        }
    })
}

Authorization.deleteAuthorization = function (id, callback) {
    const query = 'DELETE FROM user_authorization WHERE id =?'
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

Authorization.updateStatus = (userId, callback) => {
    const query = 'UPDATE user_authorization SET status = 0 WHERE user_id =?'
    db.query(query, [userId], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

module.exports = Authorization;