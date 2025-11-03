const { Ruta, Barrio, Horario } = require('../maquetas');

// Controlador para Rutas
const rutaControlador = {
    // Crear una nueva ruta
    crear: async (req, res) => {
        try {
            const { nombre, color_hex, shape, longitud_m, activo } = req.body;
            
            const nuevaRuta = await Ruta.create({
                nombre,
                color_hex,
                shape,
                longitud_m,
                activo: activo !== undefined ? activo : true
            });

            res.status(201).json({
                success: true,
                message: 'Ruta creada exitosamente',
                data: nuevaRuta
            });
        } catch (error) {
            console.error('Error al crear ruta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear ruta',
                error: error.message
            });
        }
    },

    // Obtener todas las rutas
    obtenerTodos: async (req, res) => {
        try {
            const rutas = await Ruta.findAll({
                include: [{
                    model: Barrio,
                    as: 'barrios',
                    through: { attributes: [] }
                }, {
                    model: Horario,
                    as: 'horarios'
                }]
            });

            res.status(200).json({
                success: true,
                data: rutas
            });
        } catch (error) {
            console.error('Error al obtener rutas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener rutas',
                error: error.message
            });
        }
    },

    // Obtener una ruta por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const ruta = await Ruta.findByPk(id, {
                include: [{
                    model: Barrio,
                    as: 'barrios',
                    through: { attributes: [] }
                }, {
                    model: Horario,
                    as: 'horarios'
                }]
            });

            if (!ruta) {
                return res.status(404).json({
                    success: false,
                    message: 'Ruta no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: ruta
            });
        } catch (error) {
            console.error('Error al obtener ruta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener ruta',
                error: error.message
            });
        }
    },

    // Actualizar una ruta
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, color_hex, shape, longitud_m, activo } = req.body;

            const ruta = await Ruta.findByPk(id);

            if (!ruta) {
                return res.status(404).json({
                    success: false,
                    message: 'Ruta no encontrada'
                });
            }

            await ruta.update({
                nombre,
                color_hex,
                shape,
                longitud_m,
                activo
            });

            res.status(200).json({
                success: true,
                message: 'Ruta actualizada exitosamente',
                data: ruta
            });
        } catch (error) {
            console.error('Error al actualizar ruta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar ruta',
                error: error.message
            });
        }
    },

    // Eliminar una ruta
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            const ruta = await Ruta.findByPk(id);

            if (!ruta) {
                return res.status(404).json({
                    success: false,
                    message: 'Ruta no encontrada'
                });
            }

            await ruta.destroy();

            res.status(200).json({
                success: true,
                message: 'Ruta eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar ruta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar ruta',
                error: error.message
            });
        }
    }
};

module.exports = rutaControlador;

