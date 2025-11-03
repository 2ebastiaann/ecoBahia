const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

// Modelo para la tabla 'horarios'
const Horario = sequelize.define('horario', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    ruta_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'ID de la ruta'
    },
    dia_semana: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Día de la semana (0=domingo, 1=lunes, ..., 6=sábado)',
        validate: {
            min: 0,
            max: 6
        }
    },
    hora_inicio_plan: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'Hora de inicio planificada'
    },
    ventana_min: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        comment: 'Duración estimada en minutos'
    }
}, {
    tableName: 'horarios',
    timestamps: false
});

module.exports = Horario;

