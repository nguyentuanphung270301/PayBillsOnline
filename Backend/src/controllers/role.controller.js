const Role = require('../models/role.model')

exports.getAllRole = (req, res) => {
    Role.getAll(function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.getRoleById = (req, res) => {
    Role.getById(req.params.id, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.createRole = (req, res) => {
    const { rolecode, name, info } = req.body
    if (!rolecode || !name) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newRole = {
        rolecode: rolecode,
        name: name,
        info: info
    }
    Role.createRole(newRole, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.updateRole = (req, res) => {
    const roleId = req.params.id
    const { rolecode, name, info } = req.body
    if (!rolecode || !name) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newRole = {
        rolecode: rolecode,
        name: name,
        info: info
    }
    Role.updateRole(roleId, newRole, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.deleteRole = (req, res) => {
    const roleId = req.params.id
    Role.deleteRole(roleId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}