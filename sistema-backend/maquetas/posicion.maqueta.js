const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

// Modelo para la tabla 'posiciones'
const Posicion = sequelize.define('posicion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    vehiculo_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'ID del vehículo'
    },
    geom: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: false,
        comment: 'Geometría de la posición (POINT, SRID 4326)'
    },
    capturado_ts: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp de captura'
    }
}, {
    tableName: 'posiciones',
    timestamps: false
});

module.exports = Posicion;

