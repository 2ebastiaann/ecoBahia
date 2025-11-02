// Configuración de la base de datos (Credenciales y detalles de conexión)
module.exports = (app) => {
    const HOST = process.env.DB_HOST || 'localhost';
    const USER = process.env.DB_USER || 'user';
    const PASSWORD = process.env.DB_PASSWORD || 'password';
    const DB = process.env.DB_NAME || 'EcoBahiaDB';
    const dialect = 'postgres';
    const pool = {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};