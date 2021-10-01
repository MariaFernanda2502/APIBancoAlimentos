const express = require('express');
const { Route, Operator, Store, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, Donation, DB } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ---------------- VISUALIZAR OPERARIOS -------------------
router.get('/visualizar-operarios', (req, res, next)=>{
	DB.query(`

	`,{
		type: QueryTypes.SELECT
	})
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch(()=>next(err))
})

// ----- DETALLE Y CONFIRMACIÓN DE LA ENTREGA --------------
router.get('/detalle-entrega/:id', (req, res, next) => {
    const { id } = req.params;
	
    DB.query(`

     `,
     {type: QueryTypes.SELECT}
    )
        
    .then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch(()=>next(err))
})

module.exports = router