const nodemailer = require("nodemailer");
const path = require('path');

const sendEmail = async (data) => {
    const { sent_from, send_to, subject,card_number, customer_name,transaction_type, amount, transaction_date,transaction_info } = data;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'nguyentuanphung270301@gmail.com',
            pass: 'xfrrnlthdcttzvsv'
        }
    })
    const emailContent = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thông báo giao dịch tài khoản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        }
        h1 {
            color: #333;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #666;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        ul li {
            margin-bottom: 10px;
            color: #666;
        }
        .price {
            color: ${transaction_type === "Ghi nợ (Debit)" ? 'red' : 'green'}
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thông báo giao dịch tài khoản</h1>
        <p>Xin chào <strong>${customer_name}</strong>,</p>
        <p>Tài khoản có số <strong>${card_number}</strong> của bạn đã được thực hiện.</p>
        <h2>Chi tiết giao dịch:</h2>
        <ul>
            <li>Loại giao dịch: ${transaction_type}</li>
            <li>Số tiền: <span class="price">${transaction_type === "Ghi nợ (Debit)" ? '-' : '+'} ${amount}</span></li>
            <li>Ngày thực hiện: ${transaction_date}</li>
            <li>Nội dung: ${transaction_info}</li>
        </ul>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ khách hàng</p>
    </div>
</body>
</html>`
    const options = {
        from: {
            name: "Internet Banking",
            address: sent_from
        },
        to: send_to,
        subject: subject,
        html: emailContent
    }


    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(info)
        }
    })
}

module.exports = sendEmail;

