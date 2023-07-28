const db = require('../configs/connect');
const Bill = function (bill) {
  this.id = bill.id
  this.due_date = bill.due_date
  this.amount = bill.amount
  this.status = bill.status
  this.user_id = bill.user_id
  this.create_id = bill.create_id
  this.approved_id = bill.approved_id
  this.meter_id = bill.meter_id
  this.cab_id = bill.cab_id
  this.info = bill.info
}

Bill.getAll = function (callback) {
  const query = `
    SELECT 
    bills.id, 
    bills.due_date, 
    bills.amount, 
    bills.status,
    users.firstname, 
    users.lastname,
    services.name as service_name, 
    suppliers.name as supplier_name
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
  WHERE 
    bills.cab_id IS NULL
  
  UNION ALL
  
  SELECT 
    bills.id, 
    bills.due_date, 
    bills.amount, 
    bills.status,
    users.firstname, 
    users.lastname,
    services.name as service_name, 
    suppliers.name as supplier_name
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
  db.query(`Select meterindex.* , services.name as service_name, services.price , suppliers.name as supplier_name
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
        callback(null, results[0])
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
  const query = "UPDATE bill SET  due_date = ?, amount = ?, status = ?, user_id = ?, create_id = ?, approved_id = ?, meter_id = ?, cab_id = ?, info = ? WHERE id = ?"
  db.query(query, [due_date, amount, status, user_id, create_id, approved_id, meter_id, cab_id, info, id], (err, results) => {
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
