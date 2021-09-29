const express = require('express');
const { Route, Store, donation, delivery_donation, spontaneousDonation, delivery_spontaneousDonation, DB, Donation } = require('../database');
const { QueryTypes, json } = require('sequelize');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config;

// ------------------ VER DONATIVOS -------------------

// ----------------- ASIGNAR BODEGAS ------------------

// -------- PANTALLA SOLICITUDES DE ENTREGA -----------

// ------------------ VER RUTAS -----------------------

// ---------------- DETALLE DE RUTA -------------------

