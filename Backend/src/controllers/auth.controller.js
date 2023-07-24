const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');
const userAuth = require('../models/authorization.model')

exports.login = function (req, res) {
    const { username, password } = req.body;
    Auth.getByUsername(username, (err, login) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error', success: false });
        }
        if (!login) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu', success: false});
        }
        // So sánh mật khẩu
        const isPasswordValid = bcrypt.compareSync(password, login.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu', success: false });
        }

        // Tạo token truy cập
        const accessToken = jwt.sign({ userId: login.id }, 'your-secret-key', { expiresIn: '24h' });

        // Trả về token truy cập    
        res.status(200).json({ accessToken: accessToken , success: true});
    })
}

exports.register = function (req, res) {
    const { firstname, lastname, email, phone, username, password } = req.body

    if (!firstname || !lastname || !email || !phone || !username || !password) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }

    const newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        username: username,
        password: password,
        status: 1
    }

    Auth.register(newUser, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            const newAuth = {
                user_id: data.insertId,
                role_id: 1,
                status: 1
            }
            userAuth.createAuthorization(newAuth, function (error, data) {
                if (error) {
                    res.status(500).send({error: error, success: false});
                }
                else {
                    res.status(200).send({data: data, success: true});
                }
            })
        }
    })
}