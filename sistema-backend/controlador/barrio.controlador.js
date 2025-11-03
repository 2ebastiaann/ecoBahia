const { Barrio, Ruta } = require('../maquetas');

// Controlador para Barrios
const barrioControlador = {
    // Crear un nuevo barrio
    crear: async (req, res) => {
        try {
            const { nombre, geom } = req.body;

            const nuevoBarrio = await Barrio.create({
                nombre,
                geom
            });

            res.status(201).json({
                success: true,
                message: 'Barrio creado exitosamente',
                data: nuevoBarrio
            });
        } catch (error) {
            console.error('Error al crear barrio:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear barrio',
                error: error.message
            });
        }
    },

    // Obtener todos los barrios
    obtenerTodos: async (req, res) => {
        try {
            const barrios = await Barrio.findAll({
                include: [{
                    model: Ruta,
                    as: 'rutas',
                    through: { attributes: [] }
                }]
            });

            res.status(200).json({
                success: true,
                data: barrios
            });
        } catch (error) {
            console.error('Error al obtener barrios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener barrios',
                error: error.message
            });
        }
    },

    // Obtener un barrio por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const barrio = await Barrio.findByPk(id, {
                include: [{
                    model: Ruta,
                    as: 'rutas',
                    through: { attributes: [] }
                }]
            });

            if (!barrio) {
                return res.status(404).json({
                    success: false,
                    message: 'Barrio no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: barrio
            });
        } catch (error) {
            console.error('Error al obtener barrio:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener barrio',
                error: error.message
            });
        }
    },

    // Actualizar un barrio
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, geom } = req.body;

            const barrio = await Barrio.findByPk(id);

            if (!barrio) {
                return res.status(404).json({
                    success: false,
                    message: 'Barrio no encontrado'
                });
            }

            await barrio.update({
                nombre,
                geom
            });

            res.status(200).json({
                success: true,
                message: 'Barrio actualizado exitosamente',
                data: barrio
            });
        } catch (error) {
            console.error('Error al actualizar barrio:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar barrio',
                error: error.message
            });
        }
    },

    // Eliminar un barrio
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            const barrio = await Barrio.findByPk(id);

            if (!barrio) {
                return res.status(404).json({
                    success: false,
                    message: 'Barrio no encontrado'
                });
            }

            await barrio.destroy();

            res.status(200).json({
                success: true,
                message: 'Barrio eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar barrio:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar barrio',
                error: error.message
            });
        }
    }
};

module.exports = barrioControlador;

