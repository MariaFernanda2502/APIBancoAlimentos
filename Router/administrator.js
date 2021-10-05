const express = require('express');
const { User, Coordinator, Operator, Warehouseman, Administrator, Store, Warehouse, DB } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ---------- TODO EL PERSONAL ------------
router.get('/personal', (req, res, next)=>{
	DB.query(
        'SELECT id FROM users'
    , {type: QueryTypes.SELECT
    })
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
        DB.query(`
        SELECT 
            id,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            puesto,
            telefonoCelular,
            telefonoCasa,
            correo
        FROM users WHERE id = ${id}
    ` , {type: QueryTypes.SELECT
        })
        .then((result) => {
            if(result) {
                return res.status(200).json({
                    data: result // ME FALTA MOSTRAR EN QUE ALMACEN O LAS PLACAS
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

// ---------------- CREAR NUEVO EMPLEADO ----------------
router.post('/crear-empleado', async(req, res, next) => {
    User.create(req.body)
    .then((user) => {
        if(user.puesto == "Administrator") {
            Administrator.create({ id: user.id })
            .then((result) => {
                return res.status(201).json({
                    data: result
                });
            })
        } 
        if(user.puesto == "Operador") {
            Operator.create({ 
                id: user.id,  
                placaVehiculo: req.body.placaVehiculo,
                latitud: req.body.latitud,
                longitud: req.body.longitud,
                vencimiento_licencia: req.body.vencimiento_licencia,
            })
            .then((result) => {
                return res.status(201).json({
                    data: result
                });
            })
        } 
        if(user.puesto == "Coordinador") {
            Coordinator.create({ id: user.id })
            .then((result) => {
                return res.status(201).json({
                    data: result
                });
            })
        } 
        if(user.puesto == "Almacenista") {
            Warehouseman.create({ 
                id: user.id,
                idBodega: req.body.idBodega // SE QUEDA CARGANDO SI LA BODEGA NO EXISTE
            })
            .then((result) => {
                return res.status(201).json({
                    data: result
                });
            })
        } 
    })
    .catch((err) => next(err))
})

// -------------------- ELIMINAR EMPLEADO ------------------------
router.delete('/eliminar-empleado/:id', async(req, res, next) => {
    const { id } = req.params;

    try {
        let user = await User.findByPk(id)
        let coordinator = await Coordinator.findByPk(id)
        let operator = await Operator.findByPk(id)
        let warehouseman = await Warehouseman.findByPk(id)
        let administrator = await Administrator.findByPk(id)
    
    if(user && coordinator){
        await user.destroy()
        await coordinator.destroy()
        return res.status(204).send()
    } 

    if(user && operator) {
        await user.destroy()
        await operator.destroy()
        return res.status(204).send()
    } 

    if(user && administrator) {
        await user.destroy()
        await administrator.destroy()
        return res.status(204).send()
    } 

    if(user && warehouseman) {
        await user.destroy()
        await warehouseman.destroy()
        return res.status(204).send()
    } else {
        return res.status(404).json({
            name: "Not found",
            message: "El usuario que buscas no existe"
        })}

    } catch(err) {
        next(err);
    }
})

// ---------------------- EDITAR EMPLEADO ----------------------
router.patch('/editar-empleado/:id', async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
        let user = await User.findByPk(id)
        let coordinator = await Coordinator.findByPk(id)
        let operator = await Operator.findByPk(id)
        let warehouseman = await Warehouseman.findByPk(id)
        let administrator = await Administrator.findByPk(id)
    
    if(user && coordinator){
        await user.update(
            body,
        )
        await coordinator.update(
            body,
        )
        return res.status(200).json({
            name: "Edicion exitosa",
            message: "Se realizo la edición exitosamente"
        })
    }

    if(user && operator){
        await user.update(
            body,
        )
        await operator.update(
            body,
        )
        return res.status(200).json({
            name: "Edicion exitosa",
            message: "Se realizo la edición exitosamente"
        })
    }

    if(user && warehouseman){
        await user.update(
            body,
        )
        await warehouseman.update(
            body,
        )
        return res.status(200).json({
            name: "Edicion exitosa",
            message: "Se realizo la edición exitosamente"
        })
    }

    if(user && administrator){
        await user.update(
            body,
        )
        await administrator.update(
            body,
        )
        return res.status(200).json()
    } else {
        return res.status(404).json({
            name: "Not found",
            message: "El usuario que buscas no existe"
        })
    } 
    } catch(err) {
        next(err);
    }
})

// ------------------- VER BODEGAS -------------------
router.get('/ver-bodegas', async (req, res, next) => {
    DB.query(
        'SELECT nombre FROM warehouses', {
        type: QueryTypes.SELECT
    }) 

    .then((result) => {
            return res.status(200).json ({
                data: result 
            })
    })
    .catch((err) => next(err))
})

// ----------------- VER BODEGA -------------------
router.get('/ver-bodega/:id', (req, res, next) => {
    const { id } = req.params;

    Warehouse.findOne({
        where: {
            id: id
        }
    })
        DB.query(`
            SELECT 
                id,
                nombre,
                direccion,
                municipio,
                telefono
            FROM warehouses WHERE id = ${id}
        ` , {type: QueryTypes.SELECT
            })
        .then((bodega) => {
            if(bodega) {
                return res.status(200).json({
                    data: bodega // ME FALTA MOSTRAR EL ENCARGADO DE LA BODEGA
                })
            } else {
            return res.status(404).json({
                name: "Not found",
                message: "Sorry, la bodega que buscas no existe"
            })
        }
        })
        .catch((err) => next(err))
})

// ---------------- NUEVA BODEGA -----------------
router.post('/crear-bodega', (req, res, next) => {
    Warehouse.create(req.body)
	.then((result)=>{
		return res.status(201).json({data: result});
    })
    .catch((err)=>{next(err)})
})

// -------------------- EDITAR BODEGA ------------------------
router.patch('/editar-bodega/:id', async (req, res, next) => {
	const { id } = req.params;
	const{ body } = req;
	
    try{
		let bodega = await Warehouse.findByPk(id)

		if(bodega){
			await bodega.update(
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

// --------------------- ELIMINAR BODEGAS -----------------------
router.delete('/eliminar-bodega/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        let bodega = await Warehouse.findOne( { where: { id: id }}) 

        if(bodega){
            await bodega.destroy()
            return res.status(204).send()
                
        } else {
            return res.status(404).json({
                name: "Not found",
                message: "Sorry, el usuario que buscas no existe"
            })
        }
    } catch(err){
        next(err);
    }
})

// ---------------- NUEVA TIENDA -----------------
router.post('/crear-bodega', (req, res, next) => {
    Warehouse.create(req.body)
	.then((result)=>{
		return res.status(201).json({data: result});
    })
    .catch((err)=>{next(err)})
})

// ------------- VER TIENDAS -----------------
router.get('/ver-tiendas', async (req, res, next) => {
    DB.query(
        'SELECT nombre FROM stores', {
        type: QueryTypes.SELECT
    }) 

    .then((result) => {
            return res.status(200).json ({
                data: result 
            })
    })
    .catch((err) => next(err))
})

// -------------- VER TIENDA -----------------

// ------------ EDITAR TIENDA ---------------

// ----------- ELIMINAR TIENDA --------------

module.exports = router