const db = require('../configs/connect');

const Payment = function (payment) {
    this.id = payment.id;
    this.payment_date = payment.payment_date;
    this.payment_method = payment.payment_method;
    this.description = payment.description;
    this.bill_id = payment.bill_id;
    this.userbankcard_id = payment.userbankcard_id;
}

Payment.getById = function (id, callback) {
    db.query(`SELECT * FROM payment WHERE id = ${id}`, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            if (results.length > 0) {
                callback(null, results[0])
            }
            if (results.length == 0) {
                callback('Không tìm thấy role với id: ' + id)
            }
        }
    })
}

Payment.createPayment = function (paymentData, callback) {
    const { payment_date, payment_method, description, bill_id, userbankcard_id } = paymentData;
    const query = 'INSERT INTO payment (payment_date, payment_method, description, bill_id, userbankcard_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [payment_date, payment_method, description, bill_id, userbankcard_id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            const newMeter = results.insertId
            this.getById(newMeter, callback);
        }
    })
}




Payment.getReportCab = function (reportData, callback) {
    const { interval, start_date, end_date, service_id, supplier_id } = reportData;
    let intervalClause = '';
    let groupClause = '';
    let dateFilter = '';
    let queryParams = [];

    if (interval === 'day') {
        intervalClause = 'DATE(payment_date)';
        groupClause = 'DATE(payment_date)';
        dateFilter = start_date;
    } else if (interval === 'week') {
        intervalClause = 'YEAR(payment_date), WEEK(payment_date)';
        groupClause = 'YEAR(payment_date), WEEK(payment_date)';
        dateFilter = start_date;
    } else if (interval === 'month') {
        intervalClause = 'YEAR(payment_date), MONTH(payment_date), DAY(payment_date)';
        groupClause = 'YEAR(payment_date), MONTH(payment_date), DAY(payment_date)';
        dateFilter = start_date;
    } else if (interval === 'year') {
        intervalClause = 'YEAR(payment_date), MONTH(payment_date)';
        groupClause = 'YEAR(payment_date), MONTH(payment_date)';
        dateFilter = start_date;
    }

    let query = `
        SELECT
          s.name AS supplier_name,
          se.name AS service_name,
          ${intervalClause} AS date,
          SUM(b.amount) AS total_revenue
        FROM
          payment p
        JOIN
          bills b ON p.bill_id = b.id
        JOIN
          cabletv c ON b.cab_id = c.id
        JOIN
          services se ON c.service_id = se.id
        JOIN
          suppliers s ON se.supplier_id = s.id
        WHERE
          DATE(payment_date) >= ?
          AND DATE(payment_date) <= ?
          AND (se.id = ? OR ? IS NULL)
          AND (s.id = ? OR ? IS NULL)
        GROUP BY
          s.name, se.name, ${groupClause}
        ORDER BY
          s.name, se.name, ${groupClause} DESC;
    `;

    queryParams = [dateFilter, end_date || start_date, service_id, service_id, supplier_id, supplier_id];

    if (service_id === null) {
        query = `
            SELECT
              s.name AS supplier_name,
              se.name AS service_name,
              ${intervalClause} AS date,
              SUM(b.amount) AS total_revenue
            FROM
              payment p
            JOIN
              bills b ON p.bill_id = b.id
            JOIN
              cabletv c ON b.cab_id = c.id
            JOIN
              services se ON c.service_id = se.id
            JOIN
              suppliers s ON se.supplier_id = s.id
            WHERE
              DATE(payment_date) >= ?
              AND DATE(payment_date) <= ?
              AND s.id = ?
            GROUP BY
              s.name, se.name, ${groupClause}
            ORDER BY
              s.name, se.name, ${groupClause} DESC;
        `;

        queryParams = [dateFilter, end_date || start_date, supplier_id];
    }

    if (end_date !== null) {
        if (interval === 'week') {
            query = `
                SELECT
                  s.name AS supplier_name,
                  se.name AS service_name,
                  ${intervalClause} AS date,
                  SUM(b.amount) AS total_revenue
                FROM
                  payment p
                JOIN
                  bills b ON p.bill_id = b.id
                JOIN
                  cabletv c ON b.cab_id = c.id
                JOIN
                  services se ON c.service_id = se.id
                JOIN
                  suppliers s ON se.supplier_id = s.id
                WHERE
                  YEARWEEK(payment_date) >= YEARWEEK(?)
                  AND YEARWEEK(payment_date) <= YEARWEEK(?)
                  AND (se.id = ? OR ? IS NULL)
                  AND (s.id = ? OR ? IS NULL)
                GROUP BY
                  s.name, se.name, ${groupClause}
                ORDER BY
                  s.name, se.name, ${groupClause} DESC;
            `;

            queryParams = [start_date, end_date, service_id, service_id, supplier_id, supplier_id];
        } else {
            query = `
                SELECT
                  s.name AS supplier_name,
                  se.name AS service_name,
                  ${intervalClause} AS date,
                  SUM(b.amount) AS total_revenue
                FROM
                  payment p
                JOIN
                  bills b ON p.bill_id = b.id
                JOIN
                  cabletv c ON b.cab_id = c.id
                JOIN
                  services se ON c.service_id = se.id
                JOIN
                  suppliers s ON se.supplier_id = s.id
                WHERE
                  DATE(payment_date) >= ?
                  AND DATE(payment_date) <= ?
                  AND (se.id = ? OR ? IS NULL)
                  AND (s.id = ? OR ? IS NULL)
                GROUP BY
                  s.name, se.name, ${groupClause}
                ORDER BY
                  s.name, se.name, ${groupClause} DESC;
            `;

            queryParams = [start_date, end_date, service_id, service_id, supplier_id, supplier_id];
        }
    }

    db.query(query, queryParams, (err, results) => {
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
}



Payment.getReportMeter = function (reportData, callback) {
    const { interval, start_date, end_date, service_id, supplier_id } = reportData;
    let intervalClause = '';
    let groupClause = '';
    let dateFilter = '';
    let queryParams = [];

    if (interval === 'day') {
        intervalClause = 'DATE(payment_date)';
        groupClause = 'DATE(payment_date)';
        dateFilter = start_date;
    } else if (interval === 'week') {
        intervalClause = 'YEAR(payment_date), WEEK(payment_date)';
        groupClause = 'YEAR(payment_date), WEEK(payment_date)';
        dateFilter = start_date;
    } else if (interval === 'month') {
        intervalClause = 'YEAR(payment_date), MONTH(payment_date), DAY(payment_date)';
        groupClause = 'YEAR(payment_date), MONTH(payment_date), DAY(payment_date)';
        dateFilter = start_date;
    } else if (interval === 'year') {
        intervalClause = 'YEAR(payment_date), MONTH(payment_date)';
        groupClause = 'YEAR(payment_date), MONTH(payment_date)';
        dateFilter = start_date;
    }

    let query = `
        SELECT
          s.name AS supplier_name,
          se.name AS service_name,
          ${intervalClause} AS date,
          SUM(b.amount) AS total_revenue
        FROM
          payment p
        JOIN
          bills b ON p.bill_id = b.id
        JOIN
          meterindex c ON b.meter_id = c.id
        JOIN
          services se ON c.service_id = se.id
        JOIN
          suppliers s ON se.supplier_id = s.id
        WHERE
          DATE(payment_date) >= ?
          AND DATE(payment_date) <= ?
          AND (se.id = ? OR ? IS NULL)
          AND (s.id = ? OR ? IS NULL)
        GROUP BY
          s.name, se.name, ${groupClause}
        ORDER BY
          s.name, se.name, ${groupClause} DESC;
    `;

    queryParams = [dateFilter, end_date || start_date, service_id, service_id, supplier_id, supplier_id];

    if (service_id === null) {
        query = `
            SELECT
              s.name AS supplier_name,
              se.name AS service_name,
              ${intervalClause} AS date,
              SUM(b.amount) AS total_revenue
            FROM
              payment p
            JOIN
              bills b ON p.bill_id = b.id
            JOIN
              meterindex c ON b.meter_id = c.id
            JOIN
              services se ON c.service_id = se.id
            JOIN
              suppliers s ON se.supplier_id = s.id
            WHERE
              DATE(payment_date) >= ?
              AND DATE(payment_date) <= ?
              AND s.id = ?
            GROUP BY
              s.name, se.name, ${groupClause}
            ORDER BY
              s.name, se.name, ${groupClause} DESC;
        `;

        queryParams = [dateFilter, end_date || start_date, supplier_id];
    }

    if (end_date !== null) {
        if (interval === 'week') {
            query = `
                SELECT
                  s.name AS supplier_name,
                  se.name AS service_name,
                  ${intervalClause} AS date,
                  SUM(b.amount) AS total_revenue
                FROM
                  payment p
                JOIN
                  bills b ON p.bill_id = b.id
                JOIN
                  meterindex c ON b.meter_id = c.id
                JOIN
                  services se ON c.service_id = se.id
                JOIN
                  suppliers s ON se.supplier_id = s.id
                WHERE
                  YEARWEEK(payment_date) >= YEARWEEK(?)
                  AND YEARWEEK(payment_date) <= YEARWEEK(?)
                  AND (se.id = ? OR ? IS NULL)
                  AND (s.id = ? OR ? IS NULL)
                GROUP BY
                  s.name, se.name, ${groupClause}
                ORDER BY
                  s.name, se.name, ${groupClause} DESC;
            `;

            queryParams = [start_date, end_date, service_id, service_id, supplier_id, supplier_id];
        } else {
            query = `
                SELECT
                  s.name AS supplier_name,
                  se.name AS service_name,
                  ${intervalClause} AS date,
                  SUM(b.amount) AS total_revenue
                FROM
                  payment p
                JOIN
                  bills b ON p.bill_id = b.id
                JOIN
                  meterindex c ON b.meter_id = c.id
                JOIN
                  services se ON c.service_id = se.id
                JOIN
                  suppliers s ON se.supplier_id = s.id
                WHERE
                  DATE(payment_date) >= ?
                  AND DATE(payment_date) <= ?
                  AND (se.id = ? OR ? IS NULL)
                  AND (s.id = ? OR ? IS NULL)
                GROUP BY
                  s.name, se.name, ${groupClause}
                ORDER BY
                  s.name, se.name, ${groupClause} DESC;
            `;

            queryParams = [start_date, end_date, service_id, service_id, supplier_id, supplier_id];
        }
    }

    db.query(query, queryParams, (err, results) => {
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
}


module.exports = Payment;