const db = require('../configs/connect');

const UserBankCard = function (userbankcard) {
    this.id = userbankcard.id;
    this.card_number = userbankcard.card_number;
    this.create_date = userbankcard.expiry_date;
    this.holder_name = userbankcard.holder_name;
    this.balance = userbankcard.balance;
    this.user_id = userbankcard.user_id;
}

UserBankCard.getAll = function (callback) {
    db.query(`Select userbankcard.* , users.firstname, users.lastname 
    from userbankcard
    inner join users on users.id = userbankcard.user_id`, (err, results) => {
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

UserBankCard.getById = function (id, callback) {
    db.query('SELECT * FROM userbankcard WHERE id =?', [id], (err, results) => {
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

UserBankCard.getByUserId = function (id, callback) {
    db.query('SELECT * FROM userbankcard WHERE user_id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback('Không tìm thấy thẻ với id:' + id)
            }
        }
    })
}

UserBankCard.createCard = function (cardData, callback) {
    const { card_number, create_date, holder_name, balance, user_id } = cardData;
    const query = 'INSERT INTO userbankcard (card_number ,create_date, holder_name, balance, user_id) VALUES (?,?,?,?,?)';
    db.query(query, [card_number, create_date, holder_name, balance, user_id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            const newCard = results.insertId;
            this.getById(newCard, callback)
        }
    })
}

UserBankCard.updateCard = function (id, cardData, callback) {
    const { balance } = cardData;
    const query = 'UPDATE userbankcard SET balance =? WHERE id =?';
    db.query(query, [balance, id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            this.getById(id, callback)
        }
    })
}

UserBankCard.deleteCard = function (id, callback) {
    const query = 'DELETE FROM userbankcard WHERE id =?';
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

module.exports = UserBankCard;