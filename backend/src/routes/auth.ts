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
    const { user, pet }: RegisterRequest = req.body;

    // Validación básica
    if (!user.email || !user.password || !user.first_name || !user.last_name) {
      return res.status(400).json({ error: 'Datos de usuario incompletos' });
    }

    if (!pet.name || !pet.species) {
      return res.status(400).json({ error: 'Datos de mascota incompletos' });
    }

    // Verificar si el email ya existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(user.password, 10);

    // Insertar usuario
    const insertUser = db.prepare(`
      INSERT INTO users (first_name, last_name, email, password_hash, phone, address, date_of_birth)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const userResult = insertUser.run(
      user.first_name,
      user.last_name,
      user.email,
      passwordHash,
      user.phone || null,
      user.address || null,
      user.date_of_birth || null
    );

    const userId = userResult.lastInsertRowid;

    // Insertar mascota
    const insertPet = db.prepare(`
      INSERT INTO pets (user_id, name, species, breed, gender, date_of_birth, weight, color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPet.run(
      userId,
      pet.name,
      pet.species,
      pet.breed || null,
      pet.gender || null,
      pet.date_of_birth || null,
      pet.weight || null,
      pet.color || null
    );

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

    res.status(201).json(response);

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User;
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash!);
    if (!isValidPassword) {
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

    res.json(response);

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
