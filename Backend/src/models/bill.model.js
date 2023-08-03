const db = require('../configs/connect');
const Bill = function (bill) {
  this.id = bill.id
  this.due_date = bill.due_date
  this.amount = bill.amount
  this.status = bill.status
  this.user_id = bill.user_id
  this.create_id = bill.create_id
  this.approved_id = bill.approved_id
  this.done_id = bill.done_id
  this.meter_id = bill.meter_id
  this.cab_id = bill.cab_id
  this.info = bill.info
}

Bill.getAll = function (callback) {
  const query = `
    SELECT 
    bills.id, 
    bills.user_id,
    bills.due_date, 
    bills.amount, 
    bills.status,
    bills.cab_id,
    bills.meter_id,
    users.firstname, 
    users.lastname,
    services.name as service_name, 
    suppliers.name as supplier_name,
    payment.payment_method
  FROM 
    bills
  INNER JOIN 
    users ON bills.user_id = users.id 
  INNER JOIN 
    meterindex ON bills.meter_id = meterindex.id
  LEFT JOIN 
    cabletv ON bills.cab_id = cabletv.id
  INNER JOIN 
    services ON meterindex.service_id = services.id
  INNER JOIN 
    suppliers ON services.supplier_id = suppliers.id
  LEFT JOIN 
    payment ON bills.id = payment.bill_id
  WHERE 
    bills.cab_id IS NULL
  
  UNION ALL
  
  SELECT 
    bills.id, 
    bills.user_id,
    bills.due_date, 
    bills.amount, 
    bills.status,
    bills.cab_id,
    bills.meter_id,
    users.firstname, 
    users.lastname,
    services.name as service_name, 
    suppliers.name as supplier_name,
    payment.payment_method
  FROM 
    bills
  INNER JOIN 
    users ON bills.user_id = users.id 
  LEFT JOIN 
    meterindex ON bills.meter_id = meterindex.id
  INNER JOIN 
    cabletv ON bills.cab_id = cabletv.id
  INNER JOIN 
    services ON cabletv.service_id = services.id
  INNER JOIN 
    suppliers ON services.supplier_id = suppliers.id
   LEFT JOIN 
    payment ON bills.id = payment.bill_id
  WHERE 
    bills.meter_id IS NULL;
    `;

  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results);
      } else {
        callback('Không tìm thấy dữ liệu');
      }
    }
  });
};

Bill.getAllBill = function (callback) {
  db.query(`SELECT * FROM bills`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results);
      } else {
        callback('Không tìm thấy dữ liệu');
      }
    }
  })
}

Bill.getServiceByUserId = function (id, callback) {
  db.query(`Select meterindex.* , services.name as service_name, services.price , suppliers.name as supplier_name, suppliers.id as supplier_id
  from meterindex
  inner join 
  services on meterindex.service_id = services.id
  inner join
  suppliers on services.supplier_id = suppliers.id
  WHERE meterindex.user_id = ${id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results)
      }
      if (results.length == 0) {
        callback('Không tìm thấy cabletv với id: ' + id)
      }
    }
  })
}

Bill.getBillMeterById = function (id, callback) {
  db.query(`SELECT
  bills.id AS bill_id,
  bills.due_date,
  bills.amount,
  bills.status,
  bills.create_id,
  bills.approved_id,
  bills.done_id,
  bills.user_id,
  users.firstname,
  users.lastname,
  users.email,
  users.phone,
  users.address,
  meterindex.meter_reading_new,
  meterindex.meter_date_new,
  meterindex.meter_reading_old,
  meterindex.meter_date_old,
  services.name AS service_name,
  services.price AS service_price,
  suppliers.name AS supplier_name,
  suppliers.id AS supplier_id,
  payment.payment_date,
  payment.payment_method,
  payment.description,
  payment.userbankcard_id,
  userbankcard.bank_name,
  userbankcard.card_number,
  userbankcard.holder_name
FROM bills
LEFT JOIN users ON bills.user_id = users.id
LEFT JOIN meterindex ON bills.meter_id = meterindex.id
LEFT JOIN services ON meterindex.service_id = services.id
LEFT JOIN suppliers ON services.supplier_id = suppliers.id
LEFT JOIN payment ON payment.bill_id = bills.id
LEFT JOIN userbankcard ON userbankcard.id = payment.userbankcard_id
WHERE bills.meter_id IS NOT NULL AND bills.id = ${id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results[0])
      }
      if (results.length == 0) {
        callback('Không tìm thấy cabletv với id: ' + id)
      }
    }
  })
}

Bill.getBillCabById = function (id, callback) {
  db.query(`SELECT
  bills.id AS bill_id,
  bills.due_date,
  bills.amount,
  bills.status,
  bills.create_id,
  bills.approved_id,
  bills.done_id,
  bills.user_id,
  users.firstname,
  users.lastname,
  users.email,
  users.phone,
  users.address,
  cabletv.package_name,
  cabletv.start_date,
  cabletv.end_date,
  cabletv.price,
  services.name AS service_name,
  services.price AS service_price,
  suppliers.name AS supplier_name,
  suppliers.id AS supplier_id,
  payment.payment_date,
  payment.payment_method,
  payment.description,
  payment.userbankcard_id,
  userbankcard.bank_name,
  userbankcard.card_number,
  userbankcard.holder_name
FROM bills
LEFT JOIN users ON bills.user_id = users.id
LEFT JOIN cabletv ON bills.cab_id = cabletv.id
LEFT JOIN services ON cabletv.service_id = services.id
LEFT JOIN suppliers ON services.supplier_id = suppliers.id
LEFT JOIN payment ON payment.bill_id = bills.id
LEFT JOIN userbankcard ON userbankcard.id = payment.userbankcard_id
WHERE bills.cab_id IS NOT NULL AND bills.id = ${id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results[0])
      }
      if (results.length == 0) {
        callback('Không tìm thấy cabletv với id: ' + id)
      }
    }
  })
}

Bill.getCableByUserId = function (id, callback) {
  db.query(`Select cabletv.* , services.name as service_name , suppliers.name as supplier_name, suppliers.id as supplier_id
  from cabletv
  inner join 
  services on cabletv.service_id = services.id
  inner join
  suppliers on services.supplier_id = suppliers.id
  WHERE cabletv.user_id = ${id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results)
      }
      if (results.length == 0) {
        callback('Không tìm thấy cabletv với id: ' + id)
      }
    }
  })
}

Bill.getById = function (id, callback) {
  db.query(`SELECT * FROM bills WHERE id = ${id}`, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length > 0) {
        callback(null, results[0])
      }
      if (results.length == 0) {
        callback('Không tìm thấy cabletv với id: ' + id)
      }
    }
  })
}

Bill.createBill = function (billData, callback) {
  const { due_date, amount, status, user_id, create_id, approved_id, meter_id, cab_id, info } = billData
  const query = "INSERT INTO bills (due_date, amount, status, user_id, create_id, approved_id, meter_id, cab_id, info) VALUES(?,?,?,?,?,?,?,?,?) ";
  db.query(query, [due_date, amount, status, user_id, create_id, approved_id, meter_id, cab_id, info], (err, results) => {
    if (err) {
      callback(err, null);
    }
    else {
      const newId = results.insertId;
      this.getById(newId, callback);
    }
  })
}

Bill.updateBill = function (id, billData, callback) {
  const { due_date, amount, status, user_id, create_id, approved_id, meter_id, cab_id, info } = billData
  const query = "UPDATE bills SET  due_date = ?, amount = ?, status = ?, user_id = ?, create_id = ?, approved_id = ?, meter_id = ?, cab_id = ?, info = ? WHERE id = ?"
  db.query(query, [due_date, amount, status, user_id, create_id, approved_id, meter_id, cab_id, info, id], (err, results) => {
    if (err) {
      callback(err, null);
    }
    else {
      this.getById(id, callback);
    }
  })
}

Bill.updateStatusBill = function (id, statusData, callback) {
  const { status, approved_id } = statusData;
  db.query("UPDATE bills SET status = ?, approved_id = ? WHERE id = ?", [status, approved_id, id], (err, results) => {
    if (err) {
      callback(err, null);
    }
    else {
      this.getById(id, callback);
    }
  })
}

Bill.updateStatusBillPayment = function (id, statusData, callback) {
  const { status, done_id } = statusData;
  db.query("UPDATE bills SET status = ?, done_id = ? WHERE id = ?", [status, done_id, id], (err, results) => {
    if (err) {
      callback(err, null);
    }
    else {
      this.getById(id, callback);
    }
  })
}

Bill.deleteById = function (id, callback) {
  const query = 'DELETE FROM bills WHERE id =?';
  db.query(query, [id], (err, results) => {
    if (err) {
      callback(err, null);
    }
    else {
      callback(null, results);
    }
  })
}

module.exports = Bill
