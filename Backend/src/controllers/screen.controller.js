const Screen = require('../models/screen.model')

exports.getAll = (req, res) => {
    Screen.getAll(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getAllScreen = (req, res) => {
    Screen.getAllScreen(function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getById = (req, res) => {
    Screen.getById(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.getByRoleId = (req, res) => {
    Screen.getByRoleId(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}

exports.createScreen = (req, res) => {
    const { role_id, screen_id } = req.body
    const da = {
        role_id: role_id,
        screen_id: screen_id
    }
    Screen.createScreen(da, function (err, data) {
        if (err) {
            res.status(500).send({ error: err, success: false });
        } else {
            res.status(200).send({ data: data, success: true });
        }
    })
}
exports.deleteScreen = (req, res) => {
    const roleId = req.params.id
    Screen.deleteScreen(roleId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}

exports.updateScreen = (req, res) => {
    const roleId = req.params.id
    const { role_id, screen_id } = req.body
    const newRole = {
        role_id: role_id,
        screen_id: screen_id
    }
    Screen.updateScreen(roleId, newRole, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}