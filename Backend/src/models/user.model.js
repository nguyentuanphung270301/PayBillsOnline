const db = require('../configs/connect');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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
    this.status = user.status
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

User.getUserAuthByUsername = function (username, callback) {
    db.query(`SELECT 
    users.id,
    users.firstname,
    users.lastname,
    users.username,
    roles.rolecode,
    roles.name,
    screen.screencode
  FROM
    users
  INNER JOIN
    user_authorization ON users.id = user_authorization.user_id
  INNER JOIN
    roles ON user_authorization.role_id = roles.id
  INNER JOIN
    role_screen ON roles.id = role_screen.role_id
  INNER JOIN
    screen ON role_screen.screen_id = screen.id
  WHERE
    users.username = ?`, [username], (err, results) => {
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

User.getByUsername = function (username, callback) {
    db.query('SELECT * FROM users WHERE username =?', [username], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy user với username:' + username)
            }
        }
    })
}

User.getByEmail = function (email, callback) {
    db.query('SELECT * FROM users WHERE email =?', [email], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy user với email: ' + email)
            }
        }
    })
}


User.createUser = function (userData, callback) {
    const { firstname, lastname, email, phone, username, address, dob, gender, password, status } = userData;

    // Mã hoá password với salt cố định
    const hashedPassword = bcrypt.hashSync(password, salt);

    db.query(
        'INSERT INTO users (firstname, lastname, email, phone, username, address, dob, gender, password, status) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [firstname, lastname, email, phone, username, address, dob, gender, hashedPassword, status],
        (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                const newUser = results.insertId;
                this.getById(newUser, callback);
            }
        }
    );
};


User.updateUser = function (id, userData, callback) {
    const { firstname, lastname, email, phone, dob, gender, address } = userData
    db.query('UPDATE users SET firstname =?, lastname =?, email =?, phone =?, dob =?, gender =?, address =?, status = 1 WHERE id =?',
        [firstname, lastname, email, phone, dob, gender, address, id], (err, results) => {
            if (err) {
                callback(err, null);
            }
            else {
                this.getById(id, callback);
            }
        })
}

User.changPassword = function (data, callback) {
    const { username, password, newPassword } = data;

    const hasedOldPassword = bcrypt.hashSync(password, salt)
    const hasedNewPassword = bcrypt.hashSync(newPassword, salt)

    db.query('SELECT * FROM users WHERE password = ? ', [hasedOldPassword], (err, result) => {
        if (err) {
            callback(err, null);
        }
        else {
            db.query('UPDATE users SET password =? WHERE username=?', [hasedNewPassword, username], (err, result) => {
                if (err) {
                    callback(err, null);
                }
                else {
                    this.getByUsername(username, callback)
                }
            })
        }
    })


}

User.updateUserByEmail = function (data, callback) {
    const { email, password } = data;
    // Mã hoá password với salt cố định
    const hashedPassword = bcrypt.hashSync(password, salt);

    db.query('UPDATE users SET password =? WHERE email =?', [hashedPassword, email], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            this.getByEmail(email, callback)
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

User.updateStatusUser = function (id, callback) {
    db.query('UPDATE users SET status = 0 WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            this.getById(id, callback);
        }
    })
}

module.exports = User;