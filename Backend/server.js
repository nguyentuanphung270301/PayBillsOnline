const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const supplierRoutes = require('./src/routes/supplier.route') 
const serviceRoutes = require('./src/routes/service.route')
const roleRoutes = require('./src/routes/role.route')
const userRoutes = require('./src/routes/user.route')
const authorizationRoutes = require('./src/routes/authorization.route')
const userBankCardRoute = require('./src/routes/userbankcard.route')

app.use('/api/supplier', supplierRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/authorization', authorizationRoutes);
app.use('/api/userbankcard',userBankCardRoute)

app.get('/', function (req, res ) {
     return res.send("Welcome to the NodeJs Express")
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });