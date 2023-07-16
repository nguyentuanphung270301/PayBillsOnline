const User = require('../models/user.model');

exports.getAllUser = (req, res) => {
    User.getAll(function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.getUserById = (req, res) => {
    const userId = req.params.id
    User.getById(userId, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

exports.createUser = (req, res) => {
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

exports.updateUser = (req, res) => {
    const userId = req.params.id
    const { firstname, lastname, email, phone, dob, gender, address} = req.body
    if (!firstname || !lastname || !email || !phone ) {
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
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
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