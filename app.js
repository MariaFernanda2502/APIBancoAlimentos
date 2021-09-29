const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config()

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

