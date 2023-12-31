const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const cors = require('cors');
const port = 5000;
const sendMail = require('./src/services/email.service')
const sendEmailContacts = require('./src/services/sendEmailContact.service')
const sendBill = require('./src/services/emailBill.service')
const sendBankCard = require('./src/services/email.bankcard')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const supplierRoutes = require('./src/routes/supplier.route')
const serviceRoutes = require('./src/routes/service.route')
const roleRoutes = require('./src/routes/role.route')
const userRoutes = require('./src/routes/user.route')
const authorizationRoutes = require('./src/routes/authorization.route')
const userBankCardRoute = require('./src/routes/userbankcard.route')
const meterIndexRoute = require('./src/routes/meterindex.route')
const cabletvRoute = require('./src/routes/cabletv.route')
const authRoute = require('./src/routes/auth.route')
const supplierBankCardRoute = require('./src/routes/supplierbankcard.route');
const billRoute = require('./src/routes/bill.route');
const screenRoute = require('./src/routes/screen.route');
const paymentRoute = require('./src/routes/payment.route')
const userBankCardsTransactionRoute = require('./src/routes/userbankcardtransaction.route');

app.use('/api/supplier', supplierRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/authorization', authorizationRoutes);
app.use('/api/userbankcard', userBankCardRoute)
app.use('/api/meterindex', meterIndexRoute);
app.use('/api/cabletv', cabletvRoute)
app.use('/api/auth', authRoute);
app.use('/api/supllierbankcard', supplierBankCardRoute);
app.use('/api/bill', billRoute);
app.use('/api/screen', screenRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/userbankcardtransaction', userBankCardsTransactionRoute);


app.post('/api/sendmailpasswords', async (req, res) => {
  const { email, message } = req.body;

  try {
    const send_to = email
    const send_from = 'nguyentuanphung270301@gmail.com'
    const subject = 'GỬI XÁC NHẬN MẬT KHẨU MỚI'
    await sendMail(subject, send_to, send_from, message)
    res.status(200).json({ success: true, message: 'Mật khẩu mới đã được gửi đế mail của bạn' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error })
  }
})

app.post('/api/sendmailcontact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ thông tin' })
  }
  else {
    try {
      const send_to = 'nguyentuanphung270301@gmail.com'
      const send_from = email
      await sendEmailContacts(name, send_to, send_from, message)
      console.log(res)
      res.status(200).json({ success: true, message: 'Email Sent' })
    }
    catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
})

app.post('/api/sendbill', async (req, res) => {
  const { email, file_name } = req.body;
  try {
    const send_to = email
    const send_from = 'nguyentuanphung270301@gmail.com'
    const subject = 'GỬI HOÁ ĐƠN ĐIỆN TỬ'
    const filename = file_name
    await sendBill(subject, send_to, send_from, filename)
    console.log(res)
    res.status(200).json({ success: true, message: 'Email Sent' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
})

app.post('/api/sendbankcard', async (req, res) => {
  const {send_to, card_number, customer_name,transaction_type, amount, transaction_date,transaction_info} = req.body;
  try {
    const data = {
      sent_from: 'nguyentuanphung270301@gmail.com',
      send_to: send_to,
      subject: 'THÔNG BÁO BIẾN ĐỘNG SỐ DƯ',
      card_number: card_number,
      customer_name: customer_name,
      transaction_type: transaction_type,
      amount: amount,
      transaction_date: transaction_date,
      transaction_info: transaction_info
    }
    await sendBankCard(data)
    res.status(200).json({ success: true, message: 'Email Sent' })
  }
  catch(error) {
    res.status(500).json({ success: false, error: error.message });  
  }
})


app.get('/', function (req, res) {
  return res.send("Welcome to the NodeJs Express")
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});