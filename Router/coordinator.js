const express = require('express');
const { Route, Store, donation, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, DB, Donation } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
require('dotenv').config;

// ------------------ VER DONATIVOS -------------------

// ----------------- ASIGNAR BODEGAS ------------------

// -------- PANTALLA SOLICITUDES DE ENTREGA -----------

// ------------------ VER RUTAS -----------------------

// ---------------- DETALLE DE RUTA -------------------

module.exports = router