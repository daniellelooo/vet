import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/types';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Datos recibidos en registro:', JSON.stringify(req.body, null, 2));
    
    // Mapear datos del frontend al formato esperado por el backend
    let user, pet;
    
    if (req.body.user && req.body.pet) {
      // Formato nuevo (user y pet separados)
      user = req.body.user;
      pet = req.body.pet;
    } else {
      // Formato legacy del frontend (datos planos)
      const { name, email, password, phone, address } = req.body;
      
      if (name) {
        const nameParts = name.trim().split(' ');
        user = {
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || nameParts[0] || 'Usuario',
          email,
          password,
          phone,
          address
        };
        
        // Crear mascota por defecto
        pet = {
          name: 'Mi Mascota',
          species: 'Perro' // Por defecto
        };
      } else {
        user = req.body.user;
        pet = req.body.pet;
      }
    }

    console.log('🔄 Datos mapeados:', { user: user ? Object.keys(user) : 'null', pet: pet ? Object.keys(pet) : 'null' });

    // Validación mejorada - verificar que los objetos existan
    if (!user || typeof user !== 'object') {
      console.log('❌ Error: Datos de usuario requeridos', { user, typeofUser: typeof user });
      return res.status(400).json({ error: 'Datos de usuario requeridos' });
    }

    if (!pet || typeof pet !== 'object') {
      console.log('❌ Error: Datos de mascota requeridos', { pet, typeofPet: typeof pet });
      return res.status(400).json({ error: 'Datos de mascota requeridos' });
    }

    // Validación de campos obligatorios
    if (!user.email || !user.password || !user.first_name || !user.last_name) {
      return res.status(400).json({ 
        error: 'Campos obligatorios: email, password, first_name, last_name',
        received: { 
          email: !!user.email, 
          password: !!user.password, 
          first_name: !!user.first_name, 
          last_name: !!user.last_name 
        }
      });
    }

    if (!pet.name || !pet.species) {
      return res.status(400).json({ 
        error: 'Campos obligatorios de mascota: name, species',
        received: { name: !!pet.name, species: !!pet.species }
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validación de contraseña
    if (user.password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    console.log(`🔐 Hasheando contraseña para usuario: ${user.email}`);
    const passwordHash = await bcrypt.hash(user.password, 10);

    // Usar transacción para asegurar consistencia
    const transaction = db.transaction((userData: any, petData: any) => {
      // Insertar usuario
      const insertUser = db.prepare(`
        INSERT INTO users (first_name, last_name, email, password_hash, phone, address, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const userResult = insertUser.run(
        userData.first_name,
        userData.last_name,
        userData.email,
        passwordHash,
        userData.phone || null,
        userData.address || null,
        userData.date_of_birth || null
      );

      const userId = userResult.lastInsertRowid;
      console.log(`👤 Usuario creado con ID: ${userId}`);

      // Insertar mascota
      const insertPet = db.prepare(`
        INSERT INTO pets (user_id, name, species, breed, gender, date_of_birth, weight, color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const petResult = insertPet.run(
        userId,
        petData.name,
        petData.species,
        petData.breed || null,
        petData.gender || null,
        petData.date_of_birth || null,
        petData.weight || null,
        petData.color || null
      );

      console.log(`🐕 Mascota creada con ID: ${petResult.lastInsertRowid}`);
      return userId;
    });

    // Ejecutar transacción
    const userId = transaction(user, pet);

    // Generar JWT
    const token = jwt.sign(
      { userId, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const response: AuthResponse = {
      message: 'Registro exitoso',
      token,
      user: {
        id: userId as number,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        date_of_birth: user.date_of_birth
      }
    };

    console.log(`✅ Registro exitoso para: ${user.email}`);
    res.status(201).json(response);

  } catch (error: any) {
    console.error('❌ Error en registro:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0],
      userData: { 
        email: req.body?.user?.email || 'N/A',
        hasPassword: !!req.body?.user?.password,
        petName: req.body?.pet?.name || 'N/A'
      }
    });

    // Diferentes tipos de errores
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(400).json({ error: 'Error en datos relacionados' });
    }

    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validación mejorada
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos',
        received: { email: !!email, password: !!password }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    console.log(`🔐 Intento de login para: ${email}`);

    // Buscar usuario
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User;
    if (!user) {
      console.log(`❌ Usuario no encontrado: ${email}`);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    console.log(`🔍 Verificando contraseña para: ${email}`);
    const isValidPassword = await bcrypt.compare(password, user.password_hash!);
    if (!isValidPassword) {
      console.log(`❌ Contraseña incorrecta para: ${email}`);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const response: AuthResponse = {
      message: 'Login exitoso',
      token,
      user: {
        id: user.id!,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        date_of_birth: user.date_of_birth
      }
    };

    console.log(`✅ Login exitoso para: ${email}`);
    res.json(response);

  } catch (error: any) {
    console.error('❌ Error en login:', {
      message: error.message,
      email: req.body?.email || 'N/A',
      stack: error.stack?.split('\n')[0]
    });
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/auth/me - Obtener información del usuario autenticado
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    
    const user = db.prepare(`
      SELECT id, email, first_name, last_name, phone, address, date_of_birth
      FROM users 
      WHERE id = ?
    `).get(userId) as any;

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        address: user.address,
        date_of_birth: user.date_of_birth
      }
    });

  } catch (error) {
    console.error('Error obteniendo información del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
