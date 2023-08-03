const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmail = async (subject, send_to, sent_from, filename) => {
    const pdfFilePath = path.join(__dirname, `../../../Frontend/pay-bills-online/src/assets/bills/${filename}.pdf`)
    const pdfAttachment = fs.readFileSync(pdfFilePath)
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
        text: `Hoá đơn mới của bạn được gừi từ PTIT Bill Payment Online System`,
        attachments: [
            {
                filename: `${filename}.pdf`, // Tên tệp đính kèm trong email
                content: pdfAttachment, // Nội dung tệp PDF
            },
        ],
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

