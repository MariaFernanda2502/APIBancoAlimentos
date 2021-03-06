const express = require('express');
const { Donation, Delivery_donation, User, Warehouse, DB, Warehouseman } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const crypto = require("crypto");
require('dotenv').config;

// ----------- VISUALIZAR OPERARIOS ------------
router.get('/datos-entrega', (req, res, next)=>{
	const normal = DB.query( `
    SELECT
	id_Donation,
    idBodega,
	nombre,
	apellidoMaterno,
	apellidoPaterno,
	folio
    FROM (SELECT
            donations.id as id_Donation,
            delivery_donations.idBodega,
			users.nombre as nombre,
			users.apellidoMaterno as apellidoMaterno,
			users.apellidoPaterno as apellidoPaterno,
			donations.folio as folio
        FROM users JOIN operators ON users.id = operators.id
        JOIN donations ON operators.id = donations.idOperador
		JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
        WHERE puesto = "Operador" AND delivery_donations.estatus = "Pendiente"
        
        UNION ALL
        
        SELECT
            spontaneousDonations.id as id_Donation,
            delivery_spontaneousDonations.idBodega,
            users.nombre as nombre,
            users.apellidoMaterno as apellidoMaterno,
            users.apellidoPaterno as apellidoPaterno,
            spontaneousDonations.folio as folio
        FROM users JOIN operators ON users.id = operators.id
        JOIN spontaneousDonations ON spontaneousDonations.idOperador = operators.id
        JOIN delivery_spontaneousDonations ON spontaneousDonations.id = delivery_spontaneousDonations.idDonativo
        WHERE puesto = "Operador" AND delivery_spontaneousDonations.estatus = "Pendiente") as operarios
    `, {type: QueryTypes.SELECT
    })

	.then((result)=>{
		if(result) {
            return res.status(200).json({
                data: result
            })
        } else {
        return res.status(404).json({
            name: "Not found",
            message: "Sorry, esta bodega no tiene entregas pendientes"
        })
    }
	})
	.catch((err)=>next(err))
})

// ---------------------- DETALLE DE ENTREGA ---------------------
router.get('/detalle-entrega/:idbodega/:id', (req, res, next) => {
    const { idbodega, id } = req.params;

    Donation.findOne({
        where: {
            idbodega: idbodega,
            id: id
        }
    })
        DB.query(`
            SELECT
                delivery_donations.idDonativo,
                donations.folio,
				delivery_donations.fecha,
				warehouses.nombre as bodega,
				users.nombre,
				users.apellidoPaterno,
				users.apellidoMaterno,
                delivery_donations.kg_frutas_verduras,
                delivery_donations.kg_pan,
                delivery_donations.kg_abarrotes,
                delivery_donations.kg_no_comestibles,
                delivery_donations.estatus
            FROM users JOIN operators ON users.id = operators.id
			JOIN donations ON donations.idOperador = operators.id
			JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
			JOIN warehouses ON delivery_donations.idBodega = warehouses.id
            WHERE donations.id = ${id} AND delivery_donations.idbodega = ${idbodega}
            AND donations.deletedAt IS NULL
        `, { type: QueryTypes.SELECT
            })
        .then((result) => {
            if(result) {
                return res.status(200).json({
                    data: result
                })
            } else {
            return res.status(404).json({
                name: "Not found",
                message: "Sorry, el donativo que buscas no existe"
            })
        }
        })
        .catch((err) => next(err))
})

// ----------------- EDITAR DETALLES DE ENTREGA ----------------
router.patch('/editar-detalles/:idBodega/:id', async (req, res, next) => {
	const { idBodega, id } = req.params;
	const { body } = req;
	
    try{
		const delivery_donation = await Delivery_donation.findOne({
            where: {
                idDonativo: id,
                idBodega: idBodega,
            }
        })

		if(delivery_donation){
			await delivery_donation.update(
				body,
			)
			return res.status(200).json({
                name: "Edicion exitosa",
                message: "Se realizo la edici??n exitosamente"
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

// ------------------- LOGIN --------------------
router.post('/login', async (req, res, next) => {
    const secret = req.body.contrasena;
    const hash = crypto.createHmac("sha256", secret).digest("hex");

    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                contrasena: hash,
                puesto: req.body.puesto = "Almacenista"
            }
        })

        if(!user) {
            return res.status(401).json({
                data: 'Credenciales no v??lidas',
            })
        }

        const almacenista = await Warehouseman.findOne({
            where: {
                id: user.id,
            }
        })

        return res.status(201).json({
            data: {
                almacenista,
            }
        });

    } catch (error) {
        next(error);
    }
})

module.exports = router