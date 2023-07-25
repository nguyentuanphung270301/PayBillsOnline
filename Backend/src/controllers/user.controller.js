const User = require('../models/user.model');

exports.getAllUser = (req, res) => {
    User.getAll(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getUserById = (req, res) => {
    const userId = req.params.id
    User.getById(userId, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateStatusUser = (req, res) => {
    const userId = req.params.id
    User.updateStatusUser(userId, function (err, data) {
        if (err) {
            res.status(500).send({ err: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getUserByUsername = (req, res) => {
    const username = req.params.username
    User.getByUsername(username, function (err, data) {
        if (err) {
            res.status(500).send({ err: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getUserByEmail = (req, res) => {
    const email = req.params.email
    User.getByEmail(email, function (err, data) {
        if (err) {
            res.status(500).send({ err: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.createUser = (req, res) => {
    const { firstname, lastname, email, phone, username, address, dob, gender, password, status} = req.body

    const newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        username: username,
        password: password,
        status: 1
    }
    User.createUser(newUser, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateUser = (req, res) => {
    const userId = req.params.id
    const { firstname, lastname, email, phone, dob, gender, address } = req.body
    if (!firstname || !lastname || !email || !phone) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
    }
    User.updateUser(userId, newUser, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}


exports.changPassword = (req, res) => {
    const { username, password, newPassword } = req.body;
    const data = {
        username: username,
        password: password,
        newPassword: newPassword
    }
    User.changPassword(data, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.updateUserPassword = (req, res) => {
    const { email, password } = req.body
    const newData = {
        email: email,
        password: password
    }
    User.updateUserByEmail(newData, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        }
        else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.deleteUser = (req, res) => {
    const userId = req.params.id
    User.deleteUser(userId, function (err, data) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).json({ message: `Xoá user với id ${userId} thành công` });
        }
    })
}