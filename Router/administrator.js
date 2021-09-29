const express = require('express');
const { Route, Store, donation, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, DB, Donation } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config;

// -------------- TODO EL PERSONAL ---------------
router.get('/personal', (req, res, next)=>{
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

// ---------------- UN EMPLEADO -----------------
router.get('/empleado:id', (req, res, next) => {
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

// ------------ CREAR NUEVO EMPLEADO -----------
router.post('/nuevo-empleado', (req, res, next) => {
    User.create(req.body)
    .then((user) => {
        Donation.create({ id: user.id })
        .then((result) => {
            return res.status(201).json({
                data: user
            });
        })
    })
    .catch((err) => next(err))
})

// ------------ ELIMINAR EMPLEADO-------------

// ------------- EDITAR EMPLEADO -------------

// ------------- VER BODEGAS -----------------

// -------------- VER BODEGA -----------------

// ------------ EDITAR BODEGAS ---------------

// ----------- ELIMINAR BODEGAS --------------

// ------------- VER TIENDAS -----------------

// -------------- VER TIENDA -----------------

// ------------ EDITAR TIENDA ---------------

// ----------- ELIMINAR TIENDA --------------