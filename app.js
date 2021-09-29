const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

// IMPORT DE LAS RUTAS
const administratorRouter = require('./Router/administrator');
const coordinatorRouter = require('./Router/coordinator');
const operatorRouter = require('./Router/operator');
const warehousemanRouter = require('./Router/warehouseman');

app.use(bodyParser.json());
app.use(cors());

app.use('/admin', administratorRouter);
app.use('coordinator', coordinatorRouter);
app.use('/operator', operatorRouter);
app.use('/warehouseman', warehousemanRouter);

// Atrapa todos los errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({
        "name": err.name,
        "message": `${err.message}, ${err.original ? err.original : ':('}`,
    })
})

//Levantar el servidor
app.listen(port, () => {
    console.log(`The server is runnig in port ${port}`)
})

