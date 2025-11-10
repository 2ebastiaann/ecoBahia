// Aquí definimos los parámetros de conexión usando variables de entorno
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware importante para procesar JSON en las solicitudes
app.use(express.json());

// Importar configuración de base de datos
const { sequelize, testConnection } = require('./config/db.config');
const db = require('./maquetas');

// Importar rutas de la API
const rutasRoutes = require('./rutas/ruta.rutas');
const barriosRoutes = require('./rutas/barrio.rutas');
const horariosRoutes = require('./rutas/horario.rutas');
const posicionesRoutes = require('./rutas/posicion.rutas');

// Registrar rutas
app.use('/api/rutas', rutasRoutes);
app.use('/api/barrios', barriosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/posiciones', posicionesRoutes);

// Endpoint de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido al Servidor Express EcoBahía',
        version: '1.0.0',
        endpoints: {
            rutas: '/api/rutas',
            barrios: '/api/barrios',
            horarios: '/api/horarios',
            posiciones: '/api/posiciones'
        }
    });
});

// Función para iniciar el servidor
async function iniciarServidor() {
    try {
        // Verificar conexión a la base de datos
        await testConnection();

        // Sincronizar modelos con la base de datos (solo en desarrollo)
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('✅ Modelos sincronizados con la base de datos');
        }

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Iniciar el servidor
iniciarServidor();