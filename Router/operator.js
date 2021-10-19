const express = require('express');
const { Operator, Donation, User, DB,  SpontaneousDonation} = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const crypto = require("crypto");
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
                stores.nombre,
                stores.direccion,
                stores.id,
                routes.dia
            FROM stores JOIN routes ON stores.idRuta = routes.id 
            JOIN operators ON routes.idOperador = operators.id 
            WHERE stores.id NOT IN (SELECT 
                idTienda
            FROM operators JOIN donations ON operators.id = donations.idOperador
            WHERE operators.id = ${id} AND fecha = DATE_FORMAT(CURDATE() - 1, '%Y-%m-%d')) AND operators.id = ${id}
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
        console.log(req.body)
        return res.status(201).json({
            name: "Exito",
            message: "El donativo de registro exitosamente"
        });
    })
})

// ---------------------- COMPLETAR DONATIVO ----------------------
router.patch('/completar-donativo/:id', async (req, res, next) => {
	const { id } = req.params;
	const{ body } = req;
	
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

// ------------------ PRÓXIMAS ENTREGAS ------------------
router.get('/proximas-entregas/:id', (req, res, next) => {
    const { id } = req.params;

    Operator.findOne({
        where: {
            id: id
        }
    })

	DB.query(`
        SELECT 
            stores.nombre,
            stores.direccion,
            delivery_donations.estatus,
            delivery_donations.idBodega
        FROM operators JOIN donations ON operators.id = donations.idOperador
        JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
        JOIN stores ON donations.idTienda = stores.id
        WHERE operators.id = ${id}
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

// --------------------- PRODUCTO POR BODEGA ---------------------
router.get('/producto-bodega/:idBodega/:id', (req, res, next) => {
    const { idBodega, id } = req.params;

    DB.query(`
        SELECT
            warehouses.nombre,
            delivery_donations.kg_abarrotes,
            delivery_donations.kg_frutas_verduras,
            delivery_donations.kg_pan, 
            delivery_donations.kg_no_comestibles
        FROM operators JOIN donations ON operators.id = donations.idOperador
        JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
        JOIN warehouses ON delivery_donations.idBodega = warehouses.id
        WHERE idOperador = ${id} AND idBodega = ${idBodega}
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

// ------------------- LOGIN --------------------
router.post('/login', async (req, res, next) => {
    const secret = req.body.contrasena;
    const hash = crypto.createHmac("sha256", secret).digest("hex");

    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                contrasena: hash,
                puesto: req.body.puesto = "Operador"
            }
        })

        
        const operador = await Operator.findOne({
            where: {
                id: user.id,
            }
        })

        if(!user) {
            return res.status(401).json({
                data: 'Credenciales no válidas',
            })
        }

        return res.status(201).json({
            data: operador,
        });

    } catch (error) {
        next(error);
    }
})

router.get('/tiendas-espontaneas/:id', (req, res, next)=> {
	const { id } = req.params;


    Operator.findOne({
        where: {
            id: id
        }
    })
		DB.query(`
            SELECT 
                stores.nombre,
                stores.direccion,
                stores.id

            FROM spontaneousDonations JOIN stores ON spontaneousDonations.idTienda = stores.id
            where idOperador = ${id} AND estatusOperador = 'pendiente'
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

router.get('/id-espontaneo/:idOperador/:idTienda', (req, res, next)=> {
	const { idOperador, idTienda } = req.params;
		DB.query(`
            SELECT 
                id
            FROM spontaneousDonations 
            where idOperador = ${idOperador} and idTienda = ${idTienda}
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

router.patch('/actualizar-operador/:id', async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	
    try{
		let operator = await Operator.findByPk(id)

		if(operator){
			await operator.update(
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

router.patch('/actualizar-espontaneo/:idTienda/:idOperador', async (req, res, next) => {
	const { idTienda, idOperador } = req.params;
	const { body } = req;

    try{
        const espontanea = await SpontaneousDonation.findOne({
            where: {
                idOperador:idOperador,
                idTienda:idTienda,
            }
        })
        console.log(espontanea.id)

		let spontaneousDonation = await SpontaneousDonation.findByPk(espontanea.id) 

		if(spontaneousDonation){
			await spontaneousDonation.update(
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