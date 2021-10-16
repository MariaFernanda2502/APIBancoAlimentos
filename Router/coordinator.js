const express = require('express');
const { Donation, Delivery_donation, Route, SpontaneousDonation, User, DB, Delivery_spontaneousDonation } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const crypto = require("crypto");
require('dotenv').config;

// ------ VER SOLICITUDES DE ENTREGA -------
router.get('/donativos', (req, res, next)=>{
	DB.query( `
        SELECT
            users.id,
            users.nombre,
            users.apellidoPaterno,
            users.apellidoMaterno,
            stores.nombre,
            donations.id
        FROM users JOIN operators ON users.id = operators.id
        JOIN donations ON operators.id = donations.idOperador
        JOIN stores ON donations.idTienda = stores.id
        WHERE puesto = "Operador" AND estatus = "Pendiente"
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

// ----- DETALLE TODOS LOS DONATIVOS ESPONTANEOS -------
router.get('/donativos-espontaneos', (req, res, next)=>{
	DB.query( `
        SELECT
        users.id,
        users.nombre,
        users.apellidoPaterno,
        users.apellidoMaterno,
        stores.nombre,
        spontaneousDonations.id
    FROM users JOIN operators ON users.id = operators.id
    JOIN spontaneousDonations ON operators.id = spontaneousDonations.idOperador
    JOIN stores ON spontaneousDonations.idTienda = stores.id
    WHERE puesto = "Operador" AND estatus = "Pendiente"
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result 
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

// ------------------- DETALLES ENTREGA ESPONTANEA -----------------
router.get('/detalles-entrega-espontanea/:id', (req, res, next) => {
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
        kg_frutas_verduras,
        kg_pan,
        kg_abarrotes,
        kg_no_comestibles
    FROM spontaneousDonations JOIN operators ON spontaneousDonations.idOperador = operators.id
    JOIN users ON operators.id = users.id
    WHERE spontaneousDonations.id = ${id} AND spontaneousDonations.deletedAt IS NULL
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


// -------------- ASIGNAR BODEGAS ESPONTANEAS -----------------
router.post('/asignar-bodega-espontanea', (req, res, next) => {
    Delivery_spontaneousDonation.create(req.body)
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

// -------------------- CAMBIO DE ESTATUS ESPONTANEO ---------------------
router.patch('/editar-estatus-espontaneo/:id', async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	
    try{
		let donacion = await SpontaneousDonation.findByPk(id)

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
            stores.direccion,
            users.id as userid,
            users.nombre
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

// --------- VISUALIZAR OPERADORES ----------
router.get('/operadores', (req, res, next)=>{
	DB.query( `
        SELECT
            users.id,
            users.nombre
        FROM users
        where puesto = "Operador"
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

// --------- VISUALIZAR TIENDAS ----------
router.get('/tiendas', (req, res, next)=>{
	DB.query( `
        SELECT
            stores.id,
            stores.nombre
        FROM stores
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

// --------- VISUALIZAR BODEGAS ----------
router.get('/bodegas', (req, res, next)=>{
	DB.query( `
        SELECT
            warehouses.id,
            warehouses.nombre
        FROM warehouses
    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

//VISUALIZAR LAS RUTAS Y EL OPERADOR RESPONSABLE
router.get('/ruta-operador', (req, res, next)=>{
	DB.query( `
        SELECT
            routes.id,
            users.nombre
        FROM users JOIN operators On users.id = operators.id
        JOIN routes On operators.id = routes.idOperador
        Order by routes.id

    `, {type: QueryTypes.SELECT
    })
	.then((result)=>{
		return res.status(200).json({
			data: result
		})
	})
	.catch((err)=>next(err))
})

// ----------------- ASIGNAR OPERADOR A UNA RUTA ----------------
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

// --------------- CREAR DONATIVO ESPONTÁNEO ------------
router.post('/donacion-espontanea', (req, res, next) => {
    SpontaneousDonation.create(req.body)
	.then((result)=>{
		return res.status(201).json({data: result});
    })
    .catch((err)=>{next(err)})
})

// --------- VISUALIZACIÓN DE RUTAS ---------
router.get('/maps/:id', (req, res, next) => {
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
                operators.latitud,
                operators.longitud
            FROM operators JOIN users ON operators.id = users.id
            WHERE users.id = ${id}
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


// ----- VISUALIZACIÓN DE LAS TIENDAS POR RUTA ------
router.get('/ruta-tiendas/:id', (req, res, next) => {
    const { id } = req.params;

    Donation.findAll({
        where: {
            id: id
        }
    })
        DB.query(`
            SELECT
                stores.id,
                stores.nombre
            FROM stores JOIN routes ON routes.id = stores.idRuta
            WHERE routes.id = ${id}
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

// ------------------- LOGIN --------------------
router.post('/login', async (req, res, next) => {
    const secret = req.body.contrasena;
    const hash = crypto.createHmac("sha256", secret).digest("hex");

    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                contrasena: hash,
                puesto: req.body.puesto = "Coordinador"
            }
        })

        if(!user) {
            return res.status(401).json({
                data: 'Credenciales no válidas',
            })
        }

        return res.status(201).json({
            data: "Bienvenido",
        });

    } catch (error) {
        next(error);
    }
})

module.exports = router