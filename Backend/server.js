const bodyParser = require('body-parser');
var express = require('express');
var app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const supplierRoutes = require('./src/routes/supplier.route') 

app.use('/api/supplier', supplierRoutes);
app.get('/', function (req, res ) {
     return res.send("Welcome to the NodeJs Express")
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });