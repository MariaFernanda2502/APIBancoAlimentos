const express = require('express');
const { Route, Store, donation, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, DB, Donation } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ------------ VER DONATIVOS -------------
router.get('/donativos', (req, res, next)=>{
	DB.query( `
        SELECT
            users.id,
            users.nombre,
            routes.id
        FROM users JOIN operators ON users.id = operators.id 
        JOIN routes ON operators.id = routes.idOperador
        JOIN donations ON operators.id = donations.id
        WHERE puesto = "Operador"
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result // USUARIO, OPERADOR, RUTA, DONATIVO 
		})
	})
	.catch((err)=>next(err))
})

// ----------------- ASIGNAR BODEGAS ------------------

// -------- PANTALLA SOLICITUDES DE ENTREGA -----------

// ------------------ VER RUTAS -----------------------

// ---------------- DETALLE DE RUTA -------------------

module.exports = router