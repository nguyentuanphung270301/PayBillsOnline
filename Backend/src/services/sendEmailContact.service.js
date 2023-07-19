const nodemailer = require("nodemailer");
const path = require('path');

const sendEmail = async (name, send_to, sent_from, message) => {
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
    const options = {
        from: {
            name: name,
            address: sent_from
        },
        to: send_to,
        subject: "PHẢN HỒI CỦA KHÁCH HÀNG",
        html: `
        <h1>PHẢN HỒI CỦA KHÁCH HÀNG</h1>
        <p><strong>Tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${sent_from}</p>
        <p><strong>Lời nhắn:</strong> ${message}</p>
      `
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

