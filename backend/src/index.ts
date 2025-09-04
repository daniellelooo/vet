/**
 * SERVIDOR PRINCIPAL - VETCARE
 * ==============================
 * Este archivo es el punto de entrada de nuestra aplicación backend.
 * Configura Express, middleware, rutas y conexión a la base de datos.
 * 
 * Arquitectura MVC:
 * - Este archivo actúa como el punto de coordinación central
 * - Las rutas (Controladores) se importan y montan aquí
 * - Los modelos están definidos en /models/types.ts
 * - Las vistas son el frontend React (comunicación vía API REST)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createTables, runMigrations } from './database/connection';
import { insertSampleData } from './database/setup';
import { rateLimiter, securityHeaders, requestLogger } from './middleware/validation';

// Importar rutas (Controladores en el patrón MVC)
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import veterinariansRoutes from './routes/veterinarians';
import appointmentsRoutes from './routes/appointments';
import petsRoutes from './routes/pets';

// Cargar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 3000; // Puerto 3000 para el backend

console.log('🚀 Iniciando servidor backend...');

// Inicializar base de datos
console.log('🗄️ Configurando base de datos...');
createTables();      // Crear tablas si no existen
runMigrations();     // Ejecutar migraciones de esquema
insertSampleData();  // Insertar datos de ejemplo (usuarios, servicios, etc.)

// ================================
// CONFIGURACIÓN DE MIDDLEWARE
// ================================

// Middleware de seguridad HTTP
app.use(helmet({
  contentSecurityPolicy: false,    // Deshabilitado para desarrollo
  crossOriginEmbedderPolicy: false // Permite embebido de recursos
}));
app.use(securityHeaders); // Headers de seguridad personalizados

// Rate limiting: Prevenir ataques de fuerza bruta
app.use(rateLimiter(100, 15 * 60 * 1000)); // 100 requests por 15 minutos

// CORS: Configuración para comunicación Frontend-Backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Puerto del frontend
  credentials: true,    // Permite cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging de requests HTTP
app.use(morgan('combined')); // Log detallado de todas las peticiones

// Parsing de datos JSON y URL-encoded
app.use(express.json({ limit: '10mb' }));         // Parsear JSON (máximo 10MB)
app.use(express.urlencoded({ extended: true }));  // Parsear formularios

// ================================
// ENDPOINTS DE SALUD Y MONITOREO
// ================================

// Health check endpoint - Verificar estado del servidor
app.get('/health', (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const db = require('./database/connection').db;
    const testQuery = db.prepare('SELECT 1').get();
    
    res.json({ 
      status: 'OK', 
      message: 'Servidor veterinario funcionando correctamente',
      timestamp: new Date().toISOString(),
      database: testQuery ? 'Connected' : 'Disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '2.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Problemas con la base de datos',
      timestamp: new Date().toISOString()
    });
  }
});

// ================================
// CONFIGURACIÓN DE RUTAS (MVC - CONTROLADORES)
// ================================

console.log('🔌 Configurando rutas API...');

// Montar rutas en sus respectivos endpoints
app.use('/api/auth', authRoutes);                  // Autenticación (login, register)
app.use('/api/services', servicesRoutes);          // Gestión de servicios veterinarios
app.use('/api/veterinarians', veterinariansRoutes); // Gestión de veterinarios
app.use('/api/appointments', appointmentsRoutes);   // Gestión de citas
app.use('/api/pets', petsRoutes);                  // Gestión de mascotas

// Endpoint de prueba para verificar funcionalidad de la API
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API Backend funcionando perfectamente!',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: ['Authentication', 'Rate Limiting', 'Enhanced Logging', 'Transaction Support'],
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me'
      ],
      appointments: [
        'GET /api/appointments/my-appointments',
        'POST /api/appointments',
        'GET /api/appointments/pets'
      ],
      services: ['GET /api/services'],
      veterinarians: ['GET /api/veterinarians'],
      pets: ['GET /api/pets', 'POST /api/pets']
    }
  });
});

// 404 handler mejorado
app.use((req, res) => {
  console.log(`❌ 404 - Endpoint no encontrado: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    method: req.method,
    url: req.url,
    suggestion: 'Revisa la documentación de la API en /api/test'
  });
});

// Error handler mejorado
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error no manejado:', {
    message: err.message,
    stack: err.stack?.split('\n')[0],
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log('\n🎉 ===== SERVIDOR VETERINARIO INICIADO =====');
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`🏥 API disponible en: http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log('============================================\n');
});
