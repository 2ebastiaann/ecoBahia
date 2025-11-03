// Configuración de la base de datos (Credenciales y detalles de conexión)
const { Sequelize } = require('sequelize');

// Configuración de variables de entorno
const HOST = process.env.DB_HOST || 'localhost';
const USER = process.env.DB_USER || 'user';
const PASSWORD = process.env.DB_PASSWORD || 'password';
const DB = process.env.DB_NAME || 'EcoBahiaDB';
const PORT_DB = process.env.DB_PORT || 5432;

// Crear instancia de Sequelize
const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    port: PORT_DB,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false, // Desactivar timestamps automáticos
        freezeTableName: true // No pluralizar nombres de tablas
    }
});

// Función para verificar la conexión
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
}

module.exports = { sequelize, testConnection };