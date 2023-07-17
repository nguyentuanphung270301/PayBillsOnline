const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const port = 5000;
const sendMail = require('./src/services/email.service')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const supplierRoutes = require('./src/routes/supplier.route')
const serviceRoutes = require('./src/routes/service.route')
const roleRoutes = require('./src/routes/role.route')
const userRoutes = require('./src/routes/user.route')
const authorizationRoutes = require('./src/routes/authorization.route')
const userBankCardRoute = require('./src/routes/userbankcard.route')
const meterIndexRoute = require('./src/routes/meterindex.route')
const cabletvRoute = require('./src/routes/cabletv.route')
const authRoute = require('./src/routes/auth.route')
const supplierBankCardRoute = require('./src/routes/supplierbankcard.route')

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



app.post('/api/sendmail', async (req, res) => {
  const { email, message } = req.body;

  try {
    const send_to = email
    const send_from = 'nguyentuanphung270301@gmail.com'
    const subject = 'GỬI XÁC NHẬN MẬT KHẨU MỚI'
    await sendMail(subject, send_to, send_from, message)
    res.status(200).json({ success: true, message: 'Email Sent' })
  }
  catch (error) {
    res.status(500).json(error.message)
  }
})


app.get('/', function (req, res) {
  return res.send("Welcome to the NodeJs Express")
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});