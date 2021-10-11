const express = require('express');
const { Operator, Donation, Route, Store, Delivery_donation, SpontaneousDonation, Delivery_spontaneousDonation, DB } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ----------------- TIENDAS PENDIENTES ------------------
router.get('/tiendas-pendientes/:id', (req, res, next)=> {
	const { id } = req.params;

    Operator.findOne({
        where: {
            id: id
        }
    })
		DB.query(`
			SELECT
				operators.id,
                stores.nombre,
				stores.direccion
			FROM users JOIN operators ON users.id = operators.id
            JOIN routes ON operators.id = idOperador
			JOIN stores ON routes.id = idRuta
			WHERE operators.id = ${id} AND operators.deletedAt IS NULL
		`, {
			type: QueryTypes.SELECT
		})
		.then((result) => {
            if(result) {
                return res.status(200).json({
                    data: result
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

// --------------- REGISTRAR DONATIVO ------------------
router.post('/registrar-donativo', (req, res, next) => {
    Donation.create(req.body)
    .then((donacion) => {
        return res.status(201).json({
            name: "Exito",
            message: "El donativo de registro exitosamente"
        });
    })
})

// -------------- PRÓXIMAS ENTREGAS ----------------
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

module.exports = router