const { Posicion } = require('../maquetas');

// Controlador para Posiciones
const posicionControlador = {
    // Crear una nueva posición
    crear: async (req, res) => {
        try {
            const { vehiculo_id, geom, capturado_ts } = req.body;

            const nuevaPosicion = await Posicion.create({
                vehiculo_id,
                geom,
                capturado_ts: capturado_ts || new Date()
            });

            res.status(201).json({
                success: true,
                message: 'Posición creada exitosamente',
                data: nuevaPosicion
            });
        } catch (error) {
            console.error('Error al crear posición:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear posición',
                error: error.message
            });
        }
    },

    // Obtener todas las posiciones
    obtenerTodos: async (req, res) => {
        try {
            const posiciones = await Posicion.findAll({
                order: [['capturado_ts', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: posiciones
            });
        } catch (error) {
            console.error('Error al obtener posiciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener posiciones',
                error: error.message
            });
        }
    },

    // Obtener una posición por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const posicion = await Posicion.findByPk(id);

            if (!posicion) {
                return res.status(404).json({
                    success: false,
                    message: 'Posición no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: posicion
            });
        } catch (error) {
            console.error('Error al obtener posición:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener posición',
                error: error.message
            });
        }
    },

    // Obtener posiciones por vehículo
    obtenerPorVehiculo: async (req, res) => {
        try {
            const { vehiculo_id } = req.params;

            const posiciones = await Posicion.findAll({
                where: { vehiculo_id },
                order: [['capturado_ts', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: posiciones
            });
        } catch (error) {
            console.error('Error al obtener posiciones por vehículo:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener posiciones por vehículo',
                error: error.message
            });
        }
    },

    // Actualizar una posición
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { vehiculo_id, geom, capturado_ts } = req.body;

            const posicion = await Posicion.findByPk(id);

            if (!posicion) {
                return res.status(404).json({
                    success: false,
                    message: 'Posición no encontrada'
                });
            }

            await posicion.update({
                vehiculo_id,
                geom,
                capturado_ts
            });

            res.status(200).json({
                success: true,
                message: 'Posición actualizada exitosamente',
                data: posicion
            });
        } catch (error) {
            console.error('Error al actualizar posición:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar posición',
                error: error.message
            });
        }
    },

    // Eliminar una posición
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            const posicion = await Posicion.findByPk(id);

            if (!posicion) {
                return res.status(404).json({
                    success: false,
                    message: 'Posición no encontrada'
                });
            }

            await posicion.destroy();

            res.status(200).json({
                success: true,
                message: 'Posición eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar posición:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar posición',
                error: error.message
            });
        }
    }
};

module.exports = posicionControlador;

