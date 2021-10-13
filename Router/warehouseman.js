const express = require('express');
const { Donation, Delivery_donation, Operator, spontaneousDonation, delivery_spontaneousDonation, DB } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ----------- VISUALIZAR OPERARIOS ------------
router.get('/datos-entrega', (req, res, next)=>{
	DB.query( `
        SELECT
            donations.id as id_Donation,
			users.nombre,
			users.apellidoMaterno,
			users.apellidoPaterno,
			donations.folio
        FROM users JOIN operators ON users.id = operators.id
        JOIN donations ON operators.id = donations.idOperador
		JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
        WHERE puesto = "Operador" AND delivery_donations.estatus = "Pendiente"
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result // NO MUESTRA EL NOMBRE, SE CONFUNDE CON EL NOMBRE DE TIENDA
		})
	})
	.catch((err)=>next(err))
})

// ----------------- DETALLE DE ENTREGA ----------------
router.get('/detalle-entrega/:id', (req, res, next) => {
    const { id } = req.params;

    Donation.findOne({
        where: {
            id: id
        }
    })
        DB.query(`
            SELECT
                delivery_donations.idDonativo,
                donations.folio,
				delivery_donations.fecha,
				warehouses.nombre as bodega,
				delivery_donations.fecha,
				warehouses.nombre,
				users.nombre,
				users.apellidoPaterno,
				users.apellidoMaterno,
                delivery_donations.kg_frutas_verduras,
                delivery_donations.kg_pan,
                delivery_donations.kg_abarrotes,
                delivery_donations.kg_no_comestibles
            FROM users JOIN operators ON users.id = operators.id
			JOIN donations ON donations.idOperador = operators.id
			JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
			JOIN warehouses ON delivery_donations.idBodega = warehouses.id
            WHERE donations.id = ${id} AND donations.deletedAt IS NULL
        `, { type: QueryTypes.SELECT
            })
        .then((tienda) => {
            if(tienda) {
                return res.status(200).json({
                    data: tienda
                })
            } else {
            return res.status(404).json({
                name: "Not found",
                message: "Sorry, la el donativo que buscas no existe"
            })
        }
        })
        .catch((err) => next(err))
})

// ----------------- EDITAR DETALLES DE ENTREGA ----------------
router.patch('/editar-detalles/:id', async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	
    try{
		let delivery_donation = await Delivery_donation.findByPk(id)

		if(delivery_donation){
			await delivery_donation.update(
				body,
			)
			return res.status(200).json({
                name: "Edicion exitosa",
                message: "Se realizo la edición exitosamente"
            })
		}
		else{
			return res.status(404).json({
				name: "Not found",
				message: "Sorry, el usuario que buscas no existe"
			})
		}
	} 
	catch(err){
		next(err);
	}
})

module.exports = router