const db = require('../configs/connect');
const User = function (user) {
    this.id = user.id
    this.firstname = user.firstname
    this.lastname = user.lastname
    this.email = user.email
    this.phone = user.phone
    this.dob = user.dob
    this.gender = user.gender
    this.address = user.address
    this.username = user.username
    this.password = user.password
}

User.getAll = function (callback) {
    db.query('SELECT * FROM users', (err, results) => {
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

User.getById = function (id, callback) {
    db.query('SELECT * FROM users WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy user với id: ' + id)
            }
        }
    })
}

User.createUser = function (userData, callback) {
    const { firstname, lastname, email, phone, username, password } = userData
    db.query('INSERT INTO users (firstname, lastname, email, phone, username, password) VALUES (?,?,?,?,?,?)',
        [firstname, lastname, email, phone, username, password], (err, results) => {
            if (err) {
                callback(err, null);
            }
            else {
                const newUser = results.insertId;
                this.getById(newUser, callback)
            }
        })
}

User.updateUser = function (id, userData, callback) {
    const { firstname, lastname, email, phone, dob, gender, address, username, password } = userData
    db.query('UPDATE users SET firstname =?, lastname =?, email =?, phone =?, dob =?, gender =?, address =?, username =?, password =? WHERE id =?',
        [firstname, lastname, email, phone, dob, gender, address, username, password, id], (err, results) => {
            if (err) {
                callback(err, null);
            }
            else {
                this.getById(id, callback);
            }
        })
}

User.deleteUser = function (id, callback) {
    db.query('DELETE FROM users WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

module.exports = User;