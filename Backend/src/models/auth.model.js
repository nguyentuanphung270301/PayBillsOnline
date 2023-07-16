const db = require('../configs/connect');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const Auth = function(auth){
    this.id = auth.id
    this.firstname = auth.firstname
    this.lastname = auth.lastname
    this.email = auth.email
    this.phone = auth.phone
    this.dob = auth.dob
    this.gender = auth.gender
    this.address = auth.address
    this.username = auth.username
    this.password = auth.password
};

// Lấy thông tin người dùng bằng username
Auth.getByUsername = function (username, callback) {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0]);
            } else {
                callback(null, null);
            }
        }
    });
};

Auth.getById = function (id, callback) {
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

Auth.register = function (registerData, callback) {
    const { firstname, lastname, email, phone, username, password } = registerData;

    // Mã hoá password với salt cố định
    const hashedPassword = bcrypt.hashSync(password, salt);
    db.query(
        'INSERT INTO users (firstname, lastname, email, phone, username, password) VALUES (?,?,?,?,?,?)',
        [firstname, lastname, email, phone, username, hashedPassword],
        (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                const newUser = results.insertId;
                this.getById(newUser, callback);
            }
        }
    );
}

module.exports = Auth;