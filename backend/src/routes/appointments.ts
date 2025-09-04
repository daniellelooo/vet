import express, { Request, Response } from 'express';
import db from '../database/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /api/appointments/my-appointments - Obtener citas del usuario autenticado
router.get('/my-appointments', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    const appointments = db.prepare(`
      SELECT 
        a.id,
        s.name as service_name,
        (v.first_name || ' ' || v.last_name) as veterinarian_name,
        v.specialization as veterinarian_specialization,
        (a.appointment_date || ' ' || a.appointment_time) as appointment_date,
        p.name as pet_name,
        p.species as pet_species,
        a.status,
        a.notes,
        s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all(userId);

    res.json(appointments);
  } catch (error) {
    console.error('Error obteniendo citas del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/appointments - Obtener citas del usuario autenticado (legacy)
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const appointments = db.prepare(`
      SELECT a.*, s.name as service_name, s.price, s.duration_minutes,
             v.name as vet_name,
             a.pet_name, a.pet_species
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC
    `).all(req.userId);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/appointments - Crear nueva cita
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { pet_id, veterinarian_id, service_id, appointment_date, appointment_time, address, notes } = req.body;

    console.log('📝 Datos recibidos para nueva cita:', req.body);

    // Validaciones básicas
    if (!pet_id || !veterinarian_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Datos incompletos para crear la cita' });
    }

    // Verificar que la mascota pertenece al usuario
    const pet = db.prepare('SELECT * FROM pets WHERE id = ? AND user_id = ?').get(pet_id, req.userId);
    if (!pet) {
      return res.status(403).json({ error: 'Mascota no encontrada o no autorizada' });
    }

    // Obtener precio del servicio
    const service = db.prepare('SELECT price FROM services WHERE id = ?').get(service_id) as any;
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Obtener dirección del usuario si no se proporciona
    let appointmentAddress = address;
    if (!appointmentAddress) {
      const user = db.prepare('SELECT address FROM users WHERE id = ?').get(req.userId) as any;
      appointmentAddress = user?.address || 'Dirección a definir';
    }

    // Insertar cita
    const insertAppointment = db.prepare(`
      INSERT INTO appointments (user_id, pet_id, veterinarian_id, service_id, appointment_date, appointment_time, status, notes, address, total_amount)
      VALUES (?, ?, ?, ?, ?, ?, 'programada', ?, ?, ?)
    `);

    const result = insertAppointment.run(
      req.userId,
      pet_id,
      veterinarian_id,
      service_id,
      appointment_date,
      appointment_time,
      notes || 'Cita agendada',
      appointmentAddress,
      service.price || 0
    );

    // Obtener la cita creada con información completa
    const newAppointment = db.prepare(`
      SELECT a.*, s.name as service_name, s.price, s.duration_minutes,
             (v.first_name || ' ' || v.last_name) as vet_name,
             p.name as pet_name, p.species as pet_species
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN veterinarians v ON a.veterinarian_id = v.id
      JOIN pets p ON a.pet_id = p.id
      WHERE a.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment: newAppointment
    });

  } catch (error) {
    console.error('Error creando cita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/appointments/pets - Obtener mascotas del usuario
router.get('/pets', authMiddleware, (req: AuthRequest, res) => {
  try {
    const pets = db.prepare('SELECT * FROM pets WHERE user_id = ? ORDER BY name').all(req.userId);
    res.json(pets);
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
