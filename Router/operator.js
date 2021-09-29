const express = require('express');
const { Route, Store, donation, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, DB, Donation } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config;

// ------------------- TIENDAS PENDIENTES --------------------
router.get('/tiendas-pendientes', (req, res, next)=>{

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

// ------------------- REGISTRAR DONATIVO --------------------
router.post('/registrar-donativo', (req, res, next) => {
    Donation.create(req.body)
    .then((donation) => {
        Donation.create({ id: donation.id })
        .then((result) => {
            return res.status(201).json({
                data: donation
            });
        })
    })
    .catch((err) => next(err))
})

// -------------------- PRÓXIMAS ENTREGAS --------------------
router.get('/proximas-entregas', (req, res, next)=>{

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

// ------------------ PRODUCTO POR BODEGA ------------------
router.get('/producto-bodega/:idBodega', (req, res, next) => {
    const { idBodega } = req.params;
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

// ------------------- DONATIVO ESPONTÁNEO ----------------
