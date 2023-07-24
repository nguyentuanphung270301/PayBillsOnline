const Authorization = require('../models/authorization.model')

exports.getAllAuthorizations = (req, res) => {
    Authorization.getAll(function (err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}

exports.getAuthorizationById = (req, res) => {
    const authorizationId = req.params.id
    Authorization.getById(authorizationId, function (err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}

exports.getAuthorizationByUserId = (req, res) =>{
    const userId = req.params.id
    Authorization.getByUserId(userId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false})
        } else {
            res.status(200).send({data: data, success: true})
        }
    })
}

exports.createAuthorization = (req, res) => {
    const { user_id, role_id, status } = req.body;
    if (!user_id || !role_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newAuth = {
        user_id: user_id,
        role_id: role_id,
        status: status
    }
    Authorization.createAuthorization(newAuth, function (err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}

exports.updateAuthorization = (req, res) => {
    const authorizationId = req.params.id
    const { screen_id, user_id, role_id } = req.body;
    if (!user_id || !role_id) {
        res.status(400).send({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const newAuth = {
        screen_id: screen_id,
        user_id: user_id,
        role_id: role_id
    }
    Authorization.updateAuthorization(authorizationId, newAuth, function (err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}

exports.deleteAuthorization = (req, res) => {
    const authorizationId = req.params.id
    Authorization.deleteAuthorization(authorizationId, function (err, data) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).json({ message: `Xoá auth với id ${authorizationId} thành công` });
        }
    })
}

exports.updateStatus = (req, res) => {
    const authorizationId = req.params.id
    Authorization.updateStatus(authorizationId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
        }
    })
}