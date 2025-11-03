const express = require('express');
const router = express.Router();
const posicionControlador = require('../controlador/posicion.controlador');

// Rutas para gestionar posiciones
// POST /api/posiciones - Crear una nueva posición
router.post('/', posicionControlador.crear);

// GET /api/posiciones - Obtener todas las posiciones
router.get('/', posicionControlador.obtenerTodos);

// GET /api/posiciones/vehiculo/:vehiculo_id - Obtener posiciones por vehículo
router.get('/vehiculo/:vehiculo_id', posicionControlador.obtenerPorVehiculo);

// GET /api/posiciones/:id - Obtener una posición por ID
router.get('/:id', posicionControlador.obtenerPorId);

// PUT /api/posiciones/:id - Actualizar una posición
router.put('/:id', posicionControlador.actualizar);

// DELETE /api/posiciones/:id - Eliminar una posición
router.delete('/:id', posicionControlador.eliminar);

module.exports = router;

