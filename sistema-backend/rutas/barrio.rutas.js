const express = require('express');
const router = express.Router();
const barrioControlador = require('../controlador/barrio.controlador');

// Rutas para gestionar barrios
// POST /api/barrios - Crear un nuevo barrio
router.post('/', barrioControlador.crear);

// GET /api/barrios - Obtener todos los barrios
router.get('/', barrioControlador.obtenerTodos);

// GET /api/barrios/:id - Obtener un barrio por ID
router.get('/:id', barrioControlador.obtenerPorId);

// PUT /api/barrios/:id - Actualizar un barrio
router.put('/:id', barrioControlador.actualizar);

// DELETE /api/barrios/:id - Eliminar un barrio
router.delete('/:id', barrioControlador.eliminar);

module.exports = router;

