const { sequelize } = require('../config/db.config');
const Ruta = require('./ruta.maqueta');
const Barrio = require('./barrio.maqueta');
const RutaBarrio = require('./ruta_barrio.maqueta');
const Horario = require('./horario.maqueta');
const Posicion = require('./posicion.maqueta');

// Definir relaciones entre modelos
// Relación Ruta - Barrio (N:N a través de RutaBarrio)
Ruta.belongsToMany(Barrio, {
    through: RutaBarrio,
    foreignKey: 'ruta_id',
    otherKey: 'barrio_id',
    as: 'barrios'
});

Barrio.belongsToMany(Ruta, {
    through: RutaBarrio,
    foreignKey: 'barrio_id',
    otherKey: 'ruta_id',
    as: 'rutas'
});

// Relación Ruta - Horario (1:N)
Ruta.hasMany(Horario, {
    foreignKey: 'ruta_id',
    as: 'horarios'
});

Horario.belongsTo(Ruta, {
    foreignKey: 'ruta_id',
    as: 'ruta'
});

// Relación Ruta - Posicion (a través de vehiculo_id, si es necesario)
// Nota: La tabla posiciones no tiene FK directo a rutas, se relaciona por vehiculo_id

// Exportar todos los modelos
const modelos = {
    Ruta,
    Barrio,
    RutaBarrio,
    Horario,
    Posicion
};

// Exportar sequelize para sincronización
const db = {
    sequelize,
    ...modelos
};

module.exports = db;

