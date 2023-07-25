const db = require('../configs/connect');

const SupplierBankCard = function (supplierbankcard) {
    this.id = SupplierBankCard.id;
    this.balance = SupplierBankCard.balance
    this.supplier_id = SupplierBankCard.supplier_id
}

SupplierBankCard.getAll = function (callback) {
    db.query('SELECT * FROM suppliersbankcards', (err, results) => {
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

SupplierBankCard.getById = function (id, callback) {
    db.query('SELECT * FROM suppliersbankcards WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results)
            }
            if (results.length == 0) {
                callback(`Không tìm thấy cards với id: ${id}`)
            }
        }
    });
}

SupplierBankCard.createCard = function(cardData, callback) {
    const {balance, supplier_id} = cardData
    db.query('INSERT INTO suppliersbankcards (balance, supplier_id) VALUES (?,?)', [balance, supplier_id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            this.getById(results.insertId, callback);
        }
    })
}

SupplierBankCard.updateCard = function(id, cardData, callback) {
    const {balance, supplier_id} = cardData
    db.query('UPDATE suppliersbankcards SET balance =?, supplier_id =? WHERE id =?', [balance, supplier_id, id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            this.getById(id, callback);
        }
    })
}

SupplierBankCard.deleteCard = function(id, callback) {
    db.query('DELETE FROM suppliersbankcards WHERE id =?', [id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

SupplierBankCard.deleteCardBySupplierId = function(supplier_id, callback) {
    db.query('DELETE FROM suppliersbankcards WHERE supplier_id =?', [supplier_id], (err, results) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, results);
        }
    })
}

module.exports = SupplierBankCard;