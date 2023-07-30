const db = require('../configs/connect');

const Screen = function (screen) {
    this.id = screen.id;
    this.screencode = screen.screencode;
    this.name = screen.name;
}

Screen.getAll = function (callback) {
    db.query(`Select  role_screen.id,
    roles.id as role_id , roles.rolecode, roles.name,
    screen.screencode, screen.name as screen_name from role_screen
    inner join roles on role_screen.role_id = roles.id
    inner join screen on role_screen.screen_id = screen.id`, function (err, results) {
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

Screen.getAllScreen = function (callback) {
    db.query('SELECT * FROM screen', function (err, results) {
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

Screen.getByRoleId = function (id, callback) {
    db.query(`SELECT * FROM role_screen WHERE role_id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback('Không tìm thấy role với id: ' + id)
            }
        }
    })
}

Screen.getById = function (id, callback) {
    db.query(`SELECT * FROM role_screen WHERE id = ${id}`, (err, results) => {
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
Screen.deleteScreen = function (id, callback) {
    const query = 'DELETE FROM role_screen WHERE id =?';
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    })
}

Screen.createScreen = function (data, callback) {
    const { role_id, screen_id } = data;
    const query = 'INSERT INTO role_screen (role_id, screen_id) VALUES (?, ?)';
    db.query(query, [role_id, screen_id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newId = results.insertId
            this.getById(newId, callback)
        }
    })
}

Screen.updateScreen = function (id, data, callback) {
    const { role_id, screen_id } = data;
    const query = 'UPDATE role_screen SET role_id = ?, screen_id =? WHERE id =?'
    db.query(query, [role_id, screen_id, id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            this.getById(id, callback)
        }
    })
}

module.exports = Screen