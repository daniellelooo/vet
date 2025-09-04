import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  frontendUrl: string;
  dbPath: string;
  corsOrigins: string[];
  rateLimiting: {
    maxRequests: number;
    windowMs: number;
  };
  logging: {
    level: string;
    enableRequestLogging: boolean;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  dbPath: process.env.DB_PATH || './veterinaria.db',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  rateLimiting: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  }
};

// Validaciones de configuración
if (config.nodeEnv === 'production') {
  if (config.jwtSecret === 'your-super-secret-jwt-key-change-in-production') {
    console.warn('⚠️  ADVERTENCIA: Usando JWT_SECRET por defecto en producción!');
  }
}

if (config.port < 1000 || config.port > 65535) {
  throw new Error(`Puerto inválido: ${config.port}. Debe estar entre 1000 y 65535.`);
}

console.log('⚙️  Configuración cargada:', {
  nodeEnv: config.nodeEnv,
  port: config.port,
  frontendUrl: config.frontendUrl,
  corsOrigins: config.corsOrigins,
  rateLimiting: config.rateLimiting,
  jwtSecretConfigured: !!config.jwtSecret && config.jwtSecret !== 'your-super-secret-jwt-key-change-in-production'
});

export default config;
