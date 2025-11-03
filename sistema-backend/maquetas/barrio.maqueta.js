const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

// Modelo para la tabla 'barrios'
const Barrio = sequelize.define('barrio', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nombre del barrio'
    },
    geom: {
        type: DataTypes.GEOMETRY,
        allowNull: false,
        comment: 'Geometría del barrio (POLYGON/MULTIPOLYGON, SRID 4326)'
    }
}, {
    tableName: 'barrios',
    timestamps: false
});

module.exports = Barrio;

