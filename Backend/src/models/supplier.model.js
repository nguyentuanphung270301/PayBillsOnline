const db = require('../configs/connect');
const Supplier = function (supplier) {
    this.id = supplier.id
    this.name = supplier.name
    this.email = supplier.email
    this.phone = supplier.phone
}

// Lấy thông tin tất cả nhà cung cấp
Supplier.getAll = function (callback) {
    db.query('SELECT * FROM suppliers', (err, results) => {
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
    })
}

// Lấy thông tin của 1 nhà cung cấp theo id
Supplier.getById = function (id, callback) {
    db.query(`SELECT * FROM suppliers WHERE id = ${id}`, (err, results) => {
        if (err) {
            callback(err, results);
        } else {
            if (results.length > 0) {
                callback(null, results[0]);
            }
            if (results.length == 0) {
                callback('Không tìm thấy nhà cung cấp với id: ' + id)
            }
        }
    })
}

// Thêm mới 1 nhà cung cấp
Supplier.createSupplier = function (supplierData, callback) {
    const { name, email, phone } = supplierData;
    const query = 'INSERT INTO suppliers (name, email, phone) VALUES (?, ?, ?)';
    db.query(query, [name, email, phone], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newId = results.insertId;
            this.getById(newId, callback);
        }
    })
}

// Cập nhật thông tin của nhà cung cấp
Supplier.updateSupplier = function (id, supplierData, callback) {
    const { name, email, phone } = supplierData;
    const query = 'UPDATE suppliers SET name =?, email =?, phone =? WHERE id =?';
    db.query(query, [name, email, phone, id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            this.getById(id, callback);
        }
    })
}

// Xóa nhà cung cấp
Supplier.deleteSupplier = function (id, callback) {
    const query = 'DELETE FROM suppliers WHERE id =?';
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    })
}

module.exports = Supplier;