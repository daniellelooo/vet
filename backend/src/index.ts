import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createTables } from './database/connection';
import { insertSampleData } from './database/setup';

// Importar rutas
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import veterinariansRoutes from './routes/veterinarians';
import appointmentsRoutes from './routes/appointments';
import petsRoutes from './routes/pets';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar base de datos
createTables();
insertSampleData();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor veterinario funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/veterinarians', veterinariansRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/pets', petsRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API Backend funcionando!',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/services',
      'GET /api/veterinarians',
      'GET /api/appointments',
      'POST /api/appointments'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`🏥 API disponible en: http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
