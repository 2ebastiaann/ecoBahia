const { Horario, Ruta } = require('../maquetas');

// Controlador para Horarios
const horarioControlador = {
    // Crear un nuevo horario
    crear: async (req, res) => {
        try {
            const { ruta_id, dia_semana, hora_inicio_plan, ventana_min } = req.body;

            const nuevoHorario = await Horario.create({
                ruta_id,
                dia_semana,
                hora_inicio_plan,
                ventana_min
            });

            res.status(201).json({
                success: true,
                message: 'Horario creado exitosamente',
                data: nuevoHorario
            });
        } catch (error) {
            console.error('Error al crear horario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear horario',
                error: error.message
            });
        }
    },

    // Obtener todos los horarios
    obtenerTodos: async (req, res) => {
        try {
            const horarios = await Horario.findAll({
                include: [{
                    model: Ruta,
                    as: 'ruta'
                }]
            });

            res.status(200).json({
                success: true,
                data: horarios
            });
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener horarios',
                error: error.message
            });
        }
    },

    // Obtener un horario por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const horario = await Horario.findByPk(id, {
                include: [{
                    model: Ruta,
                    as: 'ruta'
                }]
            });

            if (!horario) {
                return res.status(404).json({
                    success: false,
                    message: 'Horario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: horario
            });
        } catch (error) {
            console.error('Error al obtener horario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener horario',
                error: error.message
            });
        }
    },

    // Actualizar un horario
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { ruta_id, dia_semana, hora_inicio_plan, ventana_min } = req.body;

            const horario = await Horario.findByPk(id);

            if (!horario) {
                return res.status(404).json({
                    success: false,
                    message: 'Horario no encontrado'
                });
            }

            await horario.update({
                ruta_id,
                dia_semana,
                hora_inicio_plan,
                ventana_min
            });

            res.status(200).json({
                success: true,
                message: 'Horario actualizado exitosamente',
                data: horario
            });
        } catch (error) {
            console.error('Error al actualizar horario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar horario',
                error: error.message
            });
        }
    },

    // Eliminar un horario
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            const horario = await Horario.findByPk(id);

            if (!horario) {
                return res.status(404).json({
                    success: false,
                    message: 'Horario no encontrado'
                });
            }

            await horario.destroy();

            res.status(200).json({
                success: true,
                message: 'Horario eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar horario',
                error: error.message
            });
        }
    }
};

module.exports = horarioControlador;

