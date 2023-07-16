const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

exports.login = function (req, res) {
    const { username, password } = req.body;
    Auth.getByUsername(username, (err, login) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!login) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }
        // So sánh mật khẩu
        const isPasswordValid = bcrypt.compareSync(password, login.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }

        // Tạo token truy cập
        const accessToken = jwt.sign({ userId: login.id }, 'your-secret-key', { expiresIn: '24h' });

        // Trả về token truy cập    
        res.json({ accessToken });
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
        password: password
    }
    User.createUser(newUser, function (err, data) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
        }
    })
}