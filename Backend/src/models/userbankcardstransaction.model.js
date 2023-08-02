const db = require('../configs/connect');

const UserBankCardTransaction = function (config) {
    this.id = config.id;
    this.transaction_type = config.transaction_type;
    this.amount = config.amount;
    this.transaction_date = config.transaction_date;
    this.description = config.description;
    this.userbankcard_id = config.userbankcard_id;
}

UserBankCardTransaction.getAll = function (callback) {
    db.query('SELECT * FROM userbankcardstransaction', (err, results) => {
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
    });
}

UserBankCardTransaction.getById = function (id, callback) {
    db.query('SELECT * FROM userbankcardstransaction WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy thẻ với id: ' + id)
            }
        }
    })
}

UserBankCardTransaction.createCard = function (cardData, callback) {
    const { transaction_type, amount, transaction_date, description, usercardbank_id } = cardData;
    const query = 'INSERT INTO userbankcardstransaction (transaction_type, amount, transaction_date, description, usercardbank_id) VALUES (?,?,?,?,?)';
    db.query(query, [transaction_type, amount, transaction_date, description, usercardbank_id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            const newCard = results.insertId;
            this.getById(newCard, callback)
        }
    })
}

module.exports = UserBankCardTransaction

