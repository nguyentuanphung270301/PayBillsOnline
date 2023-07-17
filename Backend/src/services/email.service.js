const nodemailer = require("nodemailer");
const path = require('path');

const sendEmail = async (subject, send_to, sent_from, message) => {
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
            name: "Internet Banking",
            address: sent_from
        },
        to: send_to,
        subject: subject,
        text: `Mật khẩu mới của bạn là: ${message}`
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

