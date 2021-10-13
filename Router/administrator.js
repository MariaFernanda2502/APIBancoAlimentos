const express = require('express');
const { User, Coordinator, Operator, Warehouseman, Administrator, Store, Warehouse, DB } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const crypto = require("crypto");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config;

// ------------ TODO EL PERSONAL ------------
router.get('/personal', (req, res, next) => {
    const query_by = "nombre";
    const query = Boolean(req.query.query) ? req.query.query : '';

	DB.query(`
        SELECT 
            nombre,
            id,
            puesto
        FROM users WHERE deletedAt IS NULL AND ${query_by} LIKE '%${query}%'
    `, {type: QueryTypes.SELECT
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
        FROM users WHERE id = ${id} AND deletedAt IS NULL
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
    const secret = req.body.contrasena;
    const hash = crypto.createHmac("sha256", secret).digest("hex");

    User.create({
        nombre: req.body.nombre,
        apellidoPaterno: req.body.apellidoPaterno,
        apellidoMaterno: req.body.apellidoMaterno,
        correo: req.body.correo,
        telefonoCasa: req.body.telefonoCasa,
        telefonoCelular: req.body.telefonoCelular,
        username: req.body.username,
        contrasena: hash,
        puesto: req.body.puesto
    })
    .then((user) => {
        if(user.puesto == "Administrador") {
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
                idBodega: req.body.idBodega
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
    const query_by = "nombre";
    const query = Boolean(req.query.query) ? req.query.query : '';

    DB.query(`
        SELECT 
            nombre
        FROM warehouses WHERE deletedAt IS NULL AND ${query_by} LIKE '%${query}%'
    `, {
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
            FROM warehouses WHERE id = ${id} AND deletedAt IS NULL
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

// --------------------- ELIMINAR BODEGA ------------------------
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

// - PARTE DE LA CREACIÓN DE LA TIENDA -
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')

// ---------------------- NUEVA TIENDA ----------------------
router.post('/crear-tienda', fileUpload,(req, res, next) => {
    /*const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))
    const type = req.file.mimetype
    const name = req.file.originalname*/

    Store.create({
        determinante: req.body.determinante,
        cadena: req.body.cadena,
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        municipio: req.body.municipio,
        telefono: req.body.telefono,
        username: req.body.username,
        /*
        typeImage: type,
        nameImage: name,
        dataImage: data, */
        idAdmin: req.body.idAdmin,
        idRuta: req.body.idRuta
    })
	.then((result)=>{
		return res.status(201).json({data: result});
    })
    .catch((err)=>{next(err)})
})

// ------------------ VER TIENDAS --------------------
router.get('/ver-tiendas', async (req, res, next) => {
    const query_by = "nombre";
    const query = Boolean(req.query.query) ? req.query.query : '';

    DB.query(`
        SELECT 
            nombre,
            id
        FROM stores WHERE deletedAt IS NULL AND ${query_by} LIKE '%${query}%'
    `, {
        type: QueryTypes.SELECT
    }) 

    .then((result) => {
            return res.status(200).json ({
                data: result
            })
    })
    .catch((err) => next(err))
})

// ----------------- VER TIENDA -------------------
router.get('/ver-tienda/:id', (req, res, next) => {
    const { id } = req.params;

    Store.findOne({
        where: {
            id: id
        }
    })
        DB.query(`
            SELECT
                id,
                nombre,
                determinante,
                cadena,
                direccion
            FROM stores WHERE id = ${id} AND deletedAt IS NULL
        `, { type: QueryTypes.SELECT
            })
        .then((tienda) => {
            if(tienda) {
                return res.status(200).json({
                    data: tienda // ¿CADENA ES LO MISMO QUE SUCURSAL?
                })
            } else {
            return res.status(404).json({
                name: "Not found",
                message: "Sorry, la tienda que buscas no existe"
            })
        }
        })
        .catch((err) => next(err))
})

// ---------------------- EDITAR TIENDA ----------------------
router.patch('/editar-tienda/:id', async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	
    try{
		let tienda = await Store.findByPk(id)

		if(tienda){
			await tienda.update(
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

// ---------------------- ELIMINAR TIENDA -----------------------
router.delete('/eliminar-tienda/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        let tienda = await Store.findOne( { where: { id: id }}) 

        if(tienda){
            await tienda.destroy()
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

// ------------------- LOGIN --------------------
router.post('/login', async (req, res, next) => {
    const secret = req.body.contrasena;
    const hash = crypto.createHmac("sha256", secret).digest("hex");

    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                contrasena: hash,
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