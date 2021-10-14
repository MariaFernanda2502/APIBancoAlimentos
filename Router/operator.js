const express = require('express');
const { Operator, Donation, User, DB } = require('../database');
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
                routes.dia
            FROM stores JOIN routes ON stores.idRuta = routes.id 
            JOIN operators ON routes.idOperador = operators.id 
            WHERE stores.id NOT IN (SELECT 
                idTienda
            FROM operators JOIN donations ON operators.id = donations.idOperador
            WHERE operators.id = ${id} AND fecha = CURDATE()) AND operators.id = ${id}
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

// -------------------- VER DONATIVO ---------------------

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
            delivery_donations.estatus
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
        FROM donations JOIN delivery_donations ON donations.id = delivery_donations.idDonativo
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