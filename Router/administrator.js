const express = require('express');
const { Route, Store, donation, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, DB, Donation, User } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// -------------- TODO EL PERSONAL ---------------
router.get('/personal', (req, res, next)=>{
	DB.query(`
        SELECT *
        FROM users
	`,{
        type: QueryTypes.SELECT
    }
    )
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

// ---------------- UN EMPLEADO -----------------
router.get('/empleado/:id', (req, res, next) => {
    const { id } = req.params;

    User.findOne({
        where: {
            id: id
        }
    })
        .then((user) => {
            if(user) {
                return res.status(200).json({
                    data: user
                })
            } else {
            return res.status(404).json({
                name: "Not found",
                message: "Sorry, el usuario que buscas no existe"
            })
        }
        })
        .catch((err) => next(err))
})

// ------------ CREAR NUEVO EMPLEADO -----------
router.post('/nuevo-empleado', (req, res, next) => {
    User.create(req.body)
    .then((user) => {
        User.create({ id: user.id })
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

module.exports = router