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

exports.getAll = (req, res) => {
    Authorization.getAllAuth(function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false})
        } else {
            res.status(200).send({data: data, success: true})
        }
    })
}

exports.getAuthorizationById = (req, res) => {
    const authorizationId = req.params.id
    Authorization.getById(authorizationId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false})
        } else {
            res.status(200).send({data: data, success: true})
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
    const newAuth = {
        user_id: user_id,
        role_id: role_id,
        status: status
    }
    Authorization.createAuthorization(newAuth, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false})
        } else {
            res.status(200).send({data: data, success: true})
        }
    })
}

exports.updateAuthorization = (req, res) => {
    const authorizationId = req.params.id
    const { status, user_id, role_id } = req.body;
    const newAuth = {
        status: status,
        user_id: user_id,
        role_id: role_id
    }
    Authorization.updateAuthorization(authorizationId, newAuth, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false})
        } else {
            res.status(200).send({data: data, success: true})
        }
    })
}

exports.deleteAuthorization = (req, res) => {
    const authorizationId = req.params.id
    Authorization.deleteAuthorization(authorizationId, function (err, data) {
        if (err) {
            res.status(500).send({error: err, success: false});
        } else {
            res.status(200).send({data: data, success: true});
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