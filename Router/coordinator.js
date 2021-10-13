const express = require('express');
const { Donation, Delivery_donation, Route, SpontaneousDonation, Delivery_spontaneousDonation, DB } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ------ VER SOLICITUDES DE ENTREGA -------
router.get('/donativos', (req, res, next)=>{
	DB.query( `
        SELECT
            users.id,
            users.nombre,
            users.apellidoPaterno,
            users.apellidoMaterno,
            stores.nombre
        FROM users JOIN operators ON users.id = operators.id
        JOIN donations ON operators.id = donations.idOperador
        JOIN stores ON donations.idTienda = stores.id
        WHERE puesto = "Operador" AND estatus = "Pendiente"
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result // NO MUESTRA EL NOMBRE, SE CONFUNDE CON EL NOMBRE DE TIENDA
		})
	})
	.catch((err)=>next(err))
})

// ---------- DETALLES SOLICITUDES DE ENTREGA -----------
router.get('/detalles-entrega/:id', (req, res, next) => {
    const { id } = req.params;

    Donation.findOne({
        where: {
            id: id
        }
    })
        DB.query(`
            SELECT
                users.id,
                users.nombre,
                users.apellidoPaterno,
                users.apellidoMaterno,
                donations.id,
                kg_frutas_verduras,
                kg_pan,
                kg_abarrotes,
                kg_no_comestibles
            FROM donations JOIN operators ON donations.idOperador = operators.id
            JOIN users ON operators.id = users.id
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

// --------------- ASIGNAR BODEGAS -----------------
router.post('/asignar-bodega', (req, res, next) => {
    Delivery_donation.create(req.body)
	.then((result)=>{
		return res.status(201).json({data: result});
    })
    .catch((err)=>{next(err)})
})

// -------------------- CAMBIO DE ESTATUS ---------------------
router.patch('/editar-estatus/:id', async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	
    try{
		let donacion = await Donation.findByPk(id)

		if(donacion){
			await donacion.update(
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

// ------------ VER RUTAS --------------
router.get('/rutas', (req, res, next)=>{
	DB.query( `
        SELECT
            routes.id,
            stores.direccion
        FROM routes JOIN stores ON routes.id = stores.idRuta
        WHERE routes.deletedAt IS NULL AND routes.id = stores.idRuta
        GROUP BY routes.id
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

// -------------------- ASIGNAR OPERADOR ------------------------
router.patch('/asignar-operador/:id', async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	
    try{
		let ruta = await Route.findByPk(id)

		if(ruta){
			await ruta.update(
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

// ---------------- DETALLE DE RUTA ------------------
router.get('/detalles-ruta/:id', (req, res, next) => {
    const { id } = req.params;

    Route.findOne({
        where: {
            id: id
        }
    })
        DB.query(`
            SELECT
                routes.id,
                stores.nombre
            FROM routes JOIN stores ON routes.id = stores.idRuta
            WHERE routes.id = ${id} AND routes.deletedAt IS NULL
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

/* Falta el endpoint de ubicación, pero no se bien que debe mostrar, 
¿Las donaciones espontanéas también se colocan aquí? */

// ------- PRUEBAS DE CREACIÓN DE RUTAS --------
router.post('/crear-ruta', (req, res, next) => {
    Route.create(req.body)
	.then((result)=>{
		return res.status(201).json({data: result});
    })
    .catch((err)=>{next(err)})
})

module.exports = router