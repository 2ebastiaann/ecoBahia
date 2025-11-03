# Sistema Backend - EcoBahía

Sistema backend desarrollado con Node.js, Express y PostgreSQL para la gestión de rutas, barrios, horarios y posiciones de vehículos.

## 🚀 Características

- API RESTful completa con operaciones CRUD para todas las entidades
- ORM Sequelize para gestión de base de datos PostgreSQL
- Soporte para datos geoespaciales (PostGIS)
- Manejo robusto de errores
- Estructura de código modular y escalable

## 📋 Requisitos

- Node.js >= 14.x
- PostgreSQL >= 12.x
- PostGIS extension habilitada en PostgreSQL

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de base de datos:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=EcoBahiaDB
PORT=3000
NODE_ENV=development
```

3. Ejecutar el servidor:
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 📊 Estructura de la Base de Datos

### Entidades

- **rutas**: Rutas de transporte con geometría LINESTRING
- **barrios**: Barrios con geometría POLYGON/MULTIPOLYGON
- **rutas_barrios**: Relación N:N entre rutas y barrios
- **horarios**: Horarios de operación de las rutas
- **posiciones**: Posiciones GPS de vehículos

## 🔌 Endpoints de la API

### Rutas
- `POST /api/rutas` - Crear una nueva ruta
- `GET /api/rutas` - Obtener todas las rutas
- `GET /api/rutas/:id` - Obtener una ruta por ID
- `PUT /api/rutas/:id` - Actualizar una ruta
- `DELETE /api/rutas/:id` - Eliminar una ruta

### Barrios
- `POST /api/barrios` - Crear un nuevo barrio
- `GET /api/barrios` - Obtener todos los barrios
- `GET /api/barrios/:id` - Obtener un barrio por ID
- `PUT /api/barrios/:id` - Actualizar un barrio
- `DELETE /api/barrios/:id` - Eliminar un barrio

### Horarios
- `POST /api/horarios` - Crear un nuevo horario
- `GET /api/horarios` - Obtener todos los horarios
- `GET /api/horarios/:id` - Obtener un horario por ID
- `PUT /api/horarios/:id` - Actualizar un horario
- `DELETE /api/horarios/:id` - Eliminar un horario

### Posiciones
- `POST /api/posiciones` - Crear una nueva posición
- `GET /api/posiciones` - Obtener todas las posiciones
- `GET /api/posiciones/:id` - Obtener una posición por ID
- `GET /api/posiciones/vehiculo/:vehiculo_id` - Obtener posiciones por vehículo
- `PUT /api/posiciones/:id` - Actualizar una posición
- `DELETE /api/posiciones/:id` - Eliminar una posición

## 📁 Estructura del Proyecto

```
sistema-backend/
├── config/
│   └── db.config.js              # Configuración de Sequelize
├── maquetas/                      # Modelos de Sequelize
│   ├── index.js                   # Exporta todos los modelos
│   ├── ruta.maqueta.js
│   ├── barrio.maqueta.js
│   ├── ruta_barrio.maqueta.js
│   ├── horario.maqueta.js
│   └── posicion.maqueta.js
├── controlador/                   # Controladores de negocio
│   ├── ruta.controlador.js
│   ├── barrio.controlador.js
│   ├── horario.controlador.js
│   └── posicion.controlador.js
├── rutas/                         # Rutas de Express
│   ├── ruta.rutas.js
│   ├── barrio.rutas.js
│   ├── horario.rutas.js
│   └── posicion.rutas.js
├── server.js                      # Servidor principal
├── .env.example                   # Ejemplo de variables de entorno
└── package.json
```

## 🔐 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DB_HOST` | Host de PostgreSQL | localhost |
| `DB_PORT` | Puerto de PostgreSQL | 5432 |
| `DB_USER` | Usuario de PostgreSQL | user |
| `DB_PASSWORD` | Contraseña de PostgreSQL | password |
| `DB_NAME` | Nombre de la base de datos | EcoBahiaDB |
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno de ejecución | development |

## 🧪 Ejemplos de Uso

### Crear una Ruta
```bash
curl -X POST http://localhost:3000/api/rutas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ruta 1",
    "color_hex": "#FF0000",
    "shape": {
      "type": "LineString",
      "coordinates": [[-64, -31], [-64.1, -31.1]]
    },
    "longitud_m": 1500.50,
    "activo": true
  }'
```

### Obtener todas las Rutas
```bash
curl http://localhost:3000/api/rutas
```

### Crear un Barrio
```bash
curl -X POST http://localhost:3000/api/barrios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Centro",
    "geom": {
      "type": "Polygon",
      "coordinates": [[[-64.2, -31.4], [-64.1, -31.4], [-64.1, -31.3], [-64.2, -31.3], [-64.2, -31.4]]]
    }
  }'
```

## 📝 Notas

- La sincronización automática de modelos está habilitada solo en desarrollo (`NODE_ENV=development`)
- En producción, se usa `sync({ alter: true })` para no perder datos
- Todos los timestamps están desactivados en los modelos
- Las relaciones entre modelos se definen en `maquetas/index.js`

## 🐛 Troubleshooting

### Error de conexión a la base de datos
Verificar que PostgreSQL esté corriendo y las credenciales sean correctas en el archivo `.env`.

### Error de geometría
Asegurarse de que PostGIS esté instalado y habilitado en la base de datos:
```sql
CREATE EXTENSION postgis;
```

### Error de sincronización
Si hay problemas con la sincronización automática, deshabilitarla en producción y usar migraciones manuales.

## 📄 Licencia

ISC
