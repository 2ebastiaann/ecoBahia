// Aquí definimos los parametro de conexión usando variables de entorno
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware importante para procesar JSON en las solicitudes
app.use(express.json());

//Sincronizar las maquetas con la base de datos (solo en desarrollo)
const db = require('./maquetas/usuario.maqueta');
db.sequelize.sync();

// Importar rutas de la API
require('./rutas/usuario.rutas')(app);

// Endpoint de ejemplo
app.get('/', (req, res) => {
    res.send('Bienvenido al Servidor Express EcoBahía. Conectando con la base de datos...');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀Servidor escuchando en http://localhost:${PORT}`);
});