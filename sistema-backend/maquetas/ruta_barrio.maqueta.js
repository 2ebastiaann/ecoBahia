const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

// Modelo para la tabla intermedia 'rutas_barrio' (relación N-N)
const RutaBarrio = sequelize.define('ruta_barrio', {
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
    barrio_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'ID del barrio'
    }
}, {
    tableName: 'rutas_barrio',
    timestamps: false
});

module.exports = RutaBarrio;

