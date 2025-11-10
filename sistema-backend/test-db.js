/**
 * Script de prueba de conexión a la base de datos
 * 
 * Ejecutar: node test-db.js
 */

// Cargar variables de entorno
require('dotenv').config();

const { sequelize, testConnection } = require('./config/db.config');

async function probarConexion() {
    console.log('\n🔍 Iniciando prueba de conexión a la base de datos...\n');
    
    // Mostrar configuración actual
    console.log('📋 Configuración actual:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Puerto: ${process.env.DB_PORT || 5432}`);
    console.log(`   Base de datos: ${process.env.DB_NAME || 'db_app_EcoBahia'}`);
    console.log(`   Usuario: ${process.env.DB_USER || 'postgres'}`);
    console.log('');
    
    try {
        // Intentar autenticar
        await testConnection();
        
        // Si llegamos aquí, la conexión fue exitosa
        console.log('\n✅ PRUEBA EXITOSA: La conexión a la base de datos funciona correctamente.\n');
        
        // Verificar si las tablas existen
        console.log('🔍 Verificando existencia de tablas...\n');
        const [results] = await sequelize.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        if (results.length > 0) {
            console.log(`   ✅ Se encontraron ${results.length} tablas:`);
            results.forEach(table => {
                console.log(`      - ${table.table_name}`);
            });
        } else {
            console.log('   ⚠️  No se encontraron tablas en la base de datos.');
        }
        
        console.log('\n🎉 Todo está listo para usar la API!\n');
        
    } catch (error) {
        console.error('\n❌ PRUEBA FALLIDA: Error al conectar con la base de datos.\n');
        console.error('Detalles del error:');
        console.error(error.message);
        console.error('\n💡 Soluciones comunes:');
        console.error('   1. Verifica que PostgreSQL esté corriendo');
        console.error('   2. Verifica las credenciales en el archivo .env');
        console.error('   3. Verifica que la base de datos exista');
        console.error('   4. Verifica que el puerto sea correcto (default: 5432)\n');
        process.exit(1);
    }
    
    await sequelize.close();
}

// Ejecutar prueba
probarConexion();

