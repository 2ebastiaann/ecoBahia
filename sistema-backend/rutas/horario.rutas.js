const express = require('express');
const router = express.Router();
const horarioControlador = require('../controlador/horario.controlador');

// Rutas para gestionar horarios
// POST /api/horarios - Crear un nuevo horario
router.post('/', horarioControlador.crear);

// GET /api/horarios - Obtener todos los horarios
router.get('/', horarioControlador.obtenerTodos);

// GET /api/horarios/:id - Obtener un horario por ID
router.get('/:id', horarioControlador.obtenerPorId);

// PUT /api/horarios/:id - Actualizar un horario
router.put('/:id', horarioControlador.actualizar);

// DELETE /api/horarios/:id - Eliminar un horario
router.delete('/:id', horarioControlador.eliminar);

module.exports = router;

