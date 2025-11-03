const express = require('express');
const router = express.Router();
const rutaControlador = require('../controlador/ruta.controlador');

// Rutas para gestionar rutas
// POST /api/rutas - Crear una nueva ruta
router.post('/', rutaControlador.crear);

// GET /api/rutas - Obtener todas las rutas
router.get('/', rutaControlador.obtenerTodos);

// GET /api/rutas/:id - Obtener una ruta por ID
router.get('/:id', rutaControlador.obtenerPorId);

// PUT /api/rutas/:id - Actualizar una ruta
router.put('/:id', rutaControlador.actualizar);

// DELETE /api/rutas/:id - Eliminar una ruta
router.delete('/:id', rutaControlador.eliminar);

module.exports = router;

